import lodash from 'lodash';
import sha256 from 'sha256';
import crypto from 'crypto';
import jsonSize from 'json-size';
import validator from 'validator';
import {
  InstrumentationError,
  ConfigurationError,
  isDefinedAndNotNull,
  convertToString,
  TransformationError,
} from '@rudderstack/integrations-lib';
import type {
  DataSource,
  FbCustomAudiencePayload,
  FbRecordMessage,
  WrappedResponse,
} from './types';
import {
  typeFields,
  subTypeFields,
  getEndPoint,
  isRejectInvalidFieldsEnabled,
  DESTINATION,
} from './config';
import {
  defaultRequestConfig,
  defaultPostRequestConfig,
  defaultDeleteRequestConfig,
} from '../../util';
import stats from '../../../util/stats';
import * as config from './config';
import { validateHashingConsistency } from '../../util/audienceUtils';

// ISO 3166-1 alpha-2: exactly two lowercase letters
const COUNTRY_CODE_REGEX = /^[a-z]{2}$/;

/**
 * Example payload ={
            "is_raw": true,
            "data_source": {
              "sub_type": "ANYTHING"
            },
            "schema": [
              "EMAIL",
              "COUNTRY"
            ],
            "data": [
              [
                "test@abc.com",
                "IN"
              ]
            ]
} */
const batchingWithPayloadSize = (
  payload: FbCustomAudiencePayload,
  workspaceId: string,
): FbCustomAudiencePayload[] => {
  const maxPayloadSize = config.getMaxPayloadSize(workspaceId);
  const payloadSize = jsonSize(payload);
  if (payloadSize > maxPayloadSize) {
    const revisedPayloadArray: FbCustomAudiencePayload[] = [];
    const noOfBatches = Math.ceil(payloadSize / maxPayloadSize);
    const data = payload.data!;
    const revisedRecordsPerPayload = Math.floor(data.length / noOfBatches);
    const revisedDataArray = lodash.chunk(data, revisedRecordsPerPayload);
    revisedDataArray.forEach((chunk) => {
      revisedPayloadArray.push({ ...payload, data: chunk });
    });
    return revisedPayloadArray;
  }
  return [payload];
};

const getSchemaForEventMappedToDest = (message: FbRecordMessage): string[] => {
  const mappedSchema = message?.context?.destinationFields;
  if (!mappedSchema) {
    throw new InstrumentationError(
      'context.destinationFields is required property for events mapped to destination ',
    );
  }
  // context.destinationFields has 2 possible values. An Array of fields or Comma seperated string with field names
  let userSchema = Array.isArray(mappedSchema)
    ? mappedSchema
    : (mappedSchema as unknown as string).split(',');
  userSchema = userSchema.map((field) => field.trim());
  return userSchema;
};

/**
 * Ensures user inputs are in the format required by Facebook Custom Audiences.
 * Returns empty string for invalid field values.
 */
const ensureApplicableFormat = (
  userProperty: string,
  userInformation: unknown,
  workspaceId: string,
  destinationId: string,
): unknown => {
  let updatedProperty: unknown;
  let userInformationTrimmed: string;
  if (isDefinedAndNotNull(userInformation)) {
    const stringifiedUserInformation = convertToString(userInformation).trim();
    // https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/customer-information-parameters
    switch (userProperty) {
      case 'EMAIL': {
        const emailValue = stringifiedUserInformation.toLowerCase();
        if (validator.isEmail(emailValue)) {
          updatedProperty = emailValue;
        } else {
          stats.increment('fb_custom_audience_invalid_email', { workspaceId, destinationId });
          updatedProperty = isRejectInvalidFieldsEnabled() ? '' : emailValue;
        }
        break;
      }
      case 'PHONE': {
        // remove all non-numerical characters, then remove all leading zeros
        updatedProperty = stringifiedUserInformation.replace(/\D/g, '').replace(/^0+/g, '');
        // Note: libphonenumber-js is not used here as it requires a country code to validate, which may not always be present.
        break;
      }
      case 'GEN':
        updatedProperty =
          stringifiedUserInformation.toLowerCase() === 'f' ||
          stringifiedUserInformation.toLowerCase() === 'female'
            ? 'f'
            : 'm';
        break;
      case 'DOBY':
        updatedProperty = stringifiedUserInformation.replace(/\./g, '');
        break;
      case 'DOBM':
      case 'DOBD':
        userInformationTrimmed = stringifiedUserInformation.replace(/\./g, '');
        if (userInformationTrimmed.length < 2) {
          updatedProperty = `0${userInformationTrimmed}`;
        } else {
          updatedProperty = userInformationTrimmed;
        }
        break;
      case 'LN':
      case 'FN':
        // Remove ASCII punctuation (0x21-0x2F, 0x3A-0x40, 0x5B-0x60, 0x7B-0x7E).
        // Preserves spaces, digits, accented letters, and all non-ASCII (UTF-8) characters.
        updatedProperty = stringifiedUserInformation
          .toLowerCase()
          .replace(/[\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]/g, '');
        break;
      case 'FI':
        updatedProperty = stringifiedUserInformation
          .toLowerCase()
          .replace(/[^!"#$%&'()*+,-./a-z]/g, '');
        break;
      case 'MADID':
        updatedProperty = stringifiedUserInformation.toLowerCase();
        break;
      case 'COUNTRY': {
        const countryCode = stringifiedUserInformation.toLowerCase();
        if (COUNTRY_CODE_REGEX.test(countryCode)) {
          updatedProperty = countryCode;
        } else {
          stats.increment('fb_custom_audience_invalid_country_code', {
            workspaceId,
            destinationId,
          });
          updatedProperty = isRejectInvalidFieldsEnabled() ? '' : countryCode;
        }
        break;
      }
      case 'ZIP':
        updatedProperty = stringifiedUserInformation.replace(/[\s-]/g, '').toLowerCase();
        break;
      case 'ST':
      case 'CT':
        updatedProperty = stringifiedUserInformation
          .replace(/[^ A-Za-z]/g, '')
          .replace(/\s/g, '')
          .toLowerCase();
        break;
      case 'EXTERN_ID':
        updatedProperty = stringifiedUserInformation;
        break;
      case 'LOOKALIKE_VALUE':
        updatedProperty = userInformation;
        break;
      default:
        throw new ConfigurationError(`The property ${userProperty} is not supported`);
    }
  }
  return updatedProperty;
};

const getUpdatedDataElement = (
  dataElement: unknown[],
  isHashRequired: boolean,
  propertyName: string,
  propertyValue: unknown,
  workspaceId: string,
  destinationId: string,
): unknown[] => {
  const destination = {
    workspaceId,
    id: destinationId,
    type: DESTINATION,
    config: { isHashRequired },
  };
  // Normalize undefined/null to empty string
  const normalizedValue = propertyValue ?? '';

  /**
   * Special case for LOOKALIKE_VALUE, for value-based audience
   * Ensure it's a finite number and greater than or equal to 0, if not, default to 0.
   */
  if (propertyName === 'LOOKALIKE_VALUE') {
    const lookalikeValue = Number(normalizedValue);
    const validLookalikeValue =
      Number.isFinite(lookalikeValue) && lookalikeValue >= 0 ? lookalikeValue : 0;
    dataElement.push(validLookalikeValue);
    return dataElement;
  }

  /**
   * Hash the original value for the properties apart from 'MADID' and 'EXTERN_ID',
   * as hashing is not required for them.
   * Reference: https://developers.facebook.com/docs/marketing-api/audiences/guides/custom-audiences#hash
   * Send an empty string for the properties for which the user hasn't provided any value.
   */
  const isHashableField = propertyName !== 'MADID' && propertyName !== 'EXTERN_ID';
  const shouldHash = isHashRequired && isHashableField;

  if (isHashableField) {
    validateHashingConsistency(propertyName, String(normalizedValue), destination);
  }

  if (shouldHash) {
    dataElement.push(normalizedValue ? sha256(String(normalizedValue)) : '');
  } else {
    dataElement.push(normalizedValue);
  }

  return dataElement;
};

// Function responsible for making the data field without payload object
// Based on the "isHashRequired" value hashing is explicitly enabled or disabled
const prepareDataField = (
  userSchema: string[],
  userUpdateList: Record<string, unknown>[],
  isHashRequired: boolean,
  disableFormat: boolean,
  destinationId: string,
  workspaceId: string,
): unknown[][] => {
  const data: unknown[][] = [];
  let nullEvent = true; // flag to check for bad events (all user properties are null)

  userUpdateList.forEach((eachUser) => {
    let dataElement: unknown[] = [];
    let nullUserData = true; // flag to check for bad event (all properties are null for a user)

    userSchema.forEach((eachProperty) => {
      const userProperty = eachUser[eachProperty];
      let updatedProperty: unknown = userProperty;

      if (isHashRequired && !disableFormat) {
        updatedProperty = ensureApplicableFormat(
          eachProperty,
          userProperty,
          workspaceId,
          destinationId,
        );
      }

      dataElement = getUpdatedDataElement(
        dataElement,
        isHashRequired,
        eachProperty,
        updatedProperty,
        workspaceId,
        destinationId,
      );

      if (dataElement[dataElement.length - 1]) {
        nullUserData = false;
        nullEvent = false;
      }
    });

    if (nullUserData) {
      throw new InstrumentationError(
        `All user properties [${userSchema.join(', ')}] are invalid or null. At least one valid field is required.`,
      );
    }

    data.push(dataElement);
  });

  if (nullEvent) {
    stats.increment('fb_custom_audience_event_having_all_null_field_values_for_all_users', {
      destinationId,
    });
  }

  return data;
};

// ref: https://developers.facebook.com/docs/facebook-login/security/#generate-the-proof
const generateAppSecretProof = (
  accessToken: string,
  appSecret: string,
  dateNow: number,
): string => {
  const currentTime = Math.floor(dateNow / 1000); // Get current Unix time in seconds
  const data = `${accessToken}|${currentTime}`;

  // Creating a HMAC SHA-256 hash with the app_secret as the key
  const hmac = crypto.createHmac('sha256', appSecret);
  hmac.update(data);
  const appsecretProof = hmac.digest('hex');

  return appsecretProof;
};

const getDataSource = (type: string | undefined, subType: string | undefined): DataSource => {
  const dataSource: DataSource = {};
  if (type && type !== 'NA' && typeFields.includes(type)) {
    dataSource.type = type;
  }
  if (subType && subType !== 'NA' && subTypeFields.includes(subType)) {
    dataSource.sub_type = subType;
  }
  return dataSource;
};

const responseBuilderSimple = (payload: WrappedResponse | undefined, audienceId: string) => {
  if (payload) {
    const responseParams = payload.responseField;
    const response = defaultRequestConfig();
    response.endpoint = getEndPoint(audienceId);
    response.endpointPath = config.ENDPOINT_PATH;

    if (payload.operationCategory === 'add') {
      response.method = defaultPostRequestConfig.requestMethod;
    }
    if (payload.operationCategory === 'remove') {
      response.method = defaultDeleteRequestConfig.requestMethod;
    }

    response.params = responseParams;
    return response;
  }
  // fail-safety for developer error
  throw new TransformationError(`Payload could not be constructed`);
};

export {
  prepareDataField,
  getSchemaForEventMappedToDest,
  batchingWithPayloadSize,
  ensureApplicableFormat,
  getUpdatedDataElement,
  generateAppSecretProof,
  responseBuilderSimple,
  getDataSource,
};
