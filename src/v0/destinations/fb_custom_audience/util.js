const lodash = require('lodash');
const sha256 = require('sha256');
const crypto = require('crypto');
const jsonSize = require('json-size');
const {
  InstrumentationError,
  ConfigurationError,
  isDefinedAndNotNull,
  convertToString,
} = require('@rudderstack/integrations-lib');
const { TransformationError } = require('@rudderstack/integrations-lib');
const { typeFields, subTypeFields, getEndPoint } = require('./config');
const {
  defaultRequestConfig,
  defaultPostRequestConfig,
  defaultDeleteRequestConfig,
} = require('../../util');
const stats = require('../../../util/stats');

const config = require('./config');

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
const batchingWithPayloadSize = (payload) => {
  const payloadSize = jsonSize(payload);
  if (payloadSize > config.maxPayloadSize) {
    const revisedPayloadArray = [];
    const noOfBatches = Math.ceil(payloadSize / config.maxPayloadSize);
    const revisedRecordsPerPayload = Math.floor(payload.data.length / noOfBatches);
    const revisedDataArray = lodash.chunk(payload.data, revisedRecordsPerPayload);
    revisedDataArray.forEach((data) => {
      revisedPayloadArray.push({ ...payload, data });
    });
    return revisedPayloadArray;
  }
  return [payload];
};

const getSchemaForEventMappedToDest = (message) => {
  const mappedSchema = message?.context?.destinationFields;
  if (!mappedSchema) {
    throw new InstrumentationError(
      'context.destinationFields is required property for events mapped to destination ',
    );
  }
  // context.destinationFields has 2 possible values. An Array of fields or Comma seperated string with field names
  let userSchema = Array.isArray(mappedSchema) ? mappedSchema : mappedSchema.split(',');
  userSchema = userSchema.map((field) => field.trim());
  return userSchema;
};

// function responsible to ensure the user inputs are passed according to the allowed format
const ensureApplicableFormat = (userProperty, userInformation) => {
  let updatedProperty;
  let userInformationTrimmed;
  if (isDefinedAndNotNull(userInformation)) {
    const stringifiedUserInformation = convertToString(userInformation);
    switch (userProperty) {
      case 'EMAIL':
        updatedProperty = stringifiedUserInformation.trim().toLowerCase();
        break;
      case 'PHONE':
        // remove all non-numerical characters
        updatedProperty = stringifiedUserInformation.replace(/\D/g, '');
        // remove all leading zeros
        updatedProperty = updatedProperty.replace(/^0+/g, '');
        break;
      case 'GEN':
        updatedProperty =
          stringifiedUserInformation.toLowerCase() === 'f' ||
          stringifiedUserInformation.toLowerCase() === 'female'
            ? 'f'
            : 'm';
        break;
      case 'DOBY':
        updatedProperty = stringifiedUserInformation.trim().replace(/\./g, '');
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
      case 'FI':
        if (userProperty !== 'FI') {
          updatedProperty = stringifiedUserInformation.toLowerCase().replace(/[^#$%&'*+/a-z]/g, '');
        } else {
          updatedProperty = stringifiedUserInformation
            .toLowerCase()
            .replace(/[^!"#$%&'()*+,-./a-z]/g, '');
        }
        break;
      case 'MADID':
        updatedProperty = stringifiedUserInformation.toLowerCase();
        break;
      case 'COUNTRY':
        updatedProperty = stringifiedUserInformation.toLowerCase();
        break;
      case 'ZIP':
        userInformationTrimmed = stringifiedUserInformation.replace(/\s/g, '');
        updatedProperty = userInformationTrimmed.toLowerCase();
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

const getUpdatedDataElement = (dataElement, isHashRequired, propertyName, propertyValue) => {
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
  const isHashable = isHashRequired && propertyName !== 'MADID' && propertyName !== 'EXTERN_ID';

  if (isHashable) {
    dataElement.push(normalizedValue ? sha256(String(normalizedValue)) : '');
  } else {
    dataElement.push(normalizedValue);
  }

  return dataElement;
};

// Function responsible for making the data field without payload object
// Based on the "isHashRequired" value hashing is explicitly enabled or disabled
const prepareDataField = (
  userSchema,
  userUpdateList,
  isHashRequired,
  disableFormat,
  destinationId,
) => {
  const data = [];
  let nullEvent = true; // flag to check for bad events (all user properties are null)

  userUpdateList.forEach((eachUser) => {
    let dataElement = [];
    let nullUserData = true; // flag to check for bad event (all properties are null for a user)

    userSchema.forEach((eachProperty) => {
      const userProperty = eachUser[eachProperty];
      let updatedProperty = userProperty;

      if (isHashRequired && !disableFormat) {
        updatedProperty = ensureApplicableFormat(eachProperty, userProperty);
      }

      dataElement = getUpdatedDataElement(
        dataElement,
        isHashRequired,
        eachProperty,
        updatedProperty,
      );

      if (dataElement[dataElement.length - 1]) {
        nullUserData = false;
        nullEvent = false;
      }
    });

    if (nullUserData) {
      stats.increment('fb_custom_audience_event_having_all_null_field_values_for_a_user', {
        destinationId,
        nullFields: userSchema,
      });
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
const generateAppSecretProof = (accessToken, appSecret, dateNow) => {
  const currentTime = Math.floor(dateNow / 1000); // Get current Unix time in seconds
  const data = `${accessToken}|${currentTime}`;

  // Creating a HMAC SHA-256 hash with the app_secret as the key
  const hmac = crypto.createHmac('sha256', appSecret);
  hmac.update(data);
  const appsecretProof = hmac.digest('hex');

  return appsecretProof;
};

const getDataSource = (type, subType) => {
  const dataSource = {};
  if (type && type !== 'NA' && typeFields.includes(type)) {
    dataSource.type = type;
  }
  if (subType && subType !== 'NA' && subTypeFields.includes(subType)) {
    dataSource.sub_type = subType;
  }
  return dataSource;
};

const responseBuilderSimple = (payload, audienceId) => {
  if (payload) {
    const responseParams = payload.responseField;
    const response = defaultRequestConfig();
    response.endpoint = getEndPoint(audienceId);

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

module.exports = {
  prepareDataField,
  getSchemaForEventMappedToDest,
  batchingWithPayloadSize,
  ensureApplicableFormat,
  getUpdatedDataElement,
  generateAppSecretProof,
  responseBuilderSimple,
  getDataSource,
};
