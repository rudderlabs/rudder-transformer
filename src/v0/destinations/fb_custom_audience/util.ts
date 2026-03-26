import lodash from 'lodash';
import crypto from 'crypto';
import jsonSize from 'json-size';
import validator from 'validator';
import {
  InstrumentationError,
  ConfigurationError,
  TransformationError,
} from '@rudderstack/integrations-lib';
import type {
  DataSource,
  FbCustomAudiencePayload,
  FbRecordMessage,
  WrappedResponse,
} from './types';
import { typeFields, subTypeFields, getEndPoint, DESTINATION } from './config';
import {
  defaultRequestConfig,
  defaultPostRequestConfig,
  defaultDeleteRequestConfig,
} from '../../util';
import stats from '../../../util/stats';
import * as config from './config';
import {
  processAudienceRecord,
  isValidPhoneNumber,
  type AudienceField,
} from '../../util/audienceUtils';

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

// Shared normalizers for fields with identical processing logic.
// Remove ASCII punctuation (0x21-0x2F, 0x3A-0x40, 0x5B-0x60, 0x7B-0x7E).
// Preserves spaces, digits, accented letters, and all non-ASCII (UTF-8) characters.
const normalizeNameField = (v: string) =>
  v
    .trim()
    .toLowerCase()
    .replace(/[\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]/g, '');

// Remove non-alpha/space chars, collapse spaces, lowercase — used by ST and CT.
const normalizeLocationTextField = (v: string) =>
  v
    .trim()
    .replace(/[^ A-Za-z]/g, '')
    .replace(/\s/g, '')
    .toLowerCase();

// Strip dots and zero-pad to 2 digits — used by DOBM and DOBD.
const normalizeDobPart = (v: string) => {
  const trimmed = v.trim().replace(/\./g, '');
  return trimmed.length < 2 ? `0${trimmed}` : trimmed;
};

/**
 * Per-field normalization and validation rules for Facebook Custom Audiences.
 * https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/customer-information-parameters
 */
const FB_FIELD_CONFIG: Record<string, AudienceField> = {
  EMAIL: {
    normalize: (v) => v.trim().toLowerCase(),
    validate: (v) => validator.isEmail(v),
    hashable: true,
  },
  PHONE: {
    // Remove all non-numerical characters, then remove all leading zeros.
    // Note: libphonenumber-js is not used here as it requires a country code to validate.
    normalize: (v) => v.trim().replace(/\D/g, '').replace(/^0+/g, ''),
    validate: isValidPhoneNumber,
    hashable: true,
  },
  GEN: {
    normalize: (v) => {
      const lower = v.trim().toLowerCase();
      return lower === 'f' || lower === 'female' ? 'f' : 'm';
    },
    hashable: true,
  },
  DOBY: { normalize: (v) => v.trim().replace(/\./g, ''), hashable: true },
  DOBM: { normalize: normalizeDobPart, hashable: true },
  DOBD: { normalize: normalizeDobPart, hashable: true },
  LN: { normalize: normalizeNameField, hashable: true },
  FN: { normalize: normalizeNameField, hashable: true },
  FI: {
    normalize: (v) =>
      v
        .trim()
        .toLowerCase()
        .replace(/[^!"#$%&'()*+,-./a-z]/g, ''),
    hashable: true,
  },
  MADID: { normalize: (v) => v.trim().toLowerCase(), hashable: false },
  COUNTRY: {
    normalize: (v) => v.trim().toLowerCase(),
    validate: (v) => COUNTRY_CODE_REGEX.test(v),
    hashable: true,
  },
  ZIP: { normalize: (v) => v.trim().replace(/[\s-]/g, '').toLowerCase(), hashable: true },
  ST: { normalize: normalizeLocationTextField, hashable: true },
  CT: { normalize: normalizeLocationTextField, hashable: true },
  EXTERN_ID: { normalize: (v) => v, hashable: false },
  LOOKALIKE_VALUE: { normalize: (v) => v, hashable: false },
};

/**
 * Normalizes, validates, and optionally hashes a single user property value,
 * then appends the result to dataElement.
 *
 * Reference: https://developers.facebook.com/docs/marketing-api/audiences/guides/custom-audiences#hash
 */
const processAndAppendDataElement = (
  dataElement: unknown[],
  isHashRequired: boolean,
  disableFormat: boolean,
  propertyName: string,
  propertyValue: unknown,
  workspaceId: string,
  destinationId: string,
): unknown[] => {
  const value = propertyValue ?? '';

  /**
   * Special case for LOOKALIKE_VALUE, for value-based audience.
   * Ensure it's a finite number >= 0, otherwise default to 0.
   */
  if (propertyName === 'LOOKALIKE_VALUE') {
    const lookalikeValue = Number(value);
    const validLookalikeValue =
      Number.isFinite(lookalikeValue) && lookalikeValue >= 0 ? lookalikeValue : 0;
    dataElement.push(validLookalikeValue);
    return dataElement;
  }

  const fieldConfig = FB_FIELD_CONFIG[propertyName];
  if (!fieldConfig) {
    throw new ConfigurationError(`The property ${propertyName} is not supported`);
  }

  // When disableFormat=true, skip normalization by omitting the normalize function.
  const effectiveFieldConfig = disableFormat
    ? { ...fieldConfig, normalize: undefined }
    : fieldConfig;
  const destination = {
    workspaceId,
    id: destinationId,
    type: DESTINATION,
    config: { isHashRequired },
  };

  const processed = processAudienceRecord(
    { [propertyName]: String(value) },
    { fieldConfigs: { [propertyName]: effectiveFieldConfig }, destination },
  );
  dataElement.push(processed[propertyName] ?? '');
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

      dataElement = processAndAppendDataElement(
        dataElement,
        isHashRequired,
        disableFormat,
        eachProperty,
        userProperty,
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
  processAndAppendDataElement,
  generateAppSecretProof,
  responseBuilderSimple,
  getDataSource,
};
