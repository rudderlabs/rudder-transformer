const lodash = require('lodash');
const sha256 = require('sha256');
const get = require('get-value');
const jsonSize = require('json-size');
const stats = require('../../../util/stats');

const { isDefinedAndNotNull } = require('../../util');
const { maxPayloadSize } = require('./config');
const { InstrumentationError, ConfigurationError } = require('../../util/errorTypes');

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
  if (payloadSize > maxPayloadSize) {
    const revisedPayloadArray = [];
    const noOfBatches = Math.ceil(payloadSize / maxPayloadSize);
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
  const mappedSchema = get(message, 'context.destinationFields');
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
    const stringifiedUserInformation = userInformation.toString();
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
          updatedProperty = stringifiedUserInformation.toLowerCase().replace(/[!#$%&@A-Za-z]/g, '');
        } else {
          updatedProperty = stringifiedUserInformation
            .toLowerCase()
            .replace(/[^!#$%&,.?@A-Za-z]/g, '');
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
      default:
        throw new ConfigurationError(`The property ${userProperty} is not supported`);
    }
  }
  return updatedProperty;
};

const getUpdatedDataElement = (dataElement, isHashRequired, eachProperty, updatedProperty) => {
  let tmpUpdatedProperty = updatedProperty;
  /**
   * hash the original value for the properties apart from 'MADID' && 'EXTERN_ID as hashing is not required for them
   * ref: https://developers.facebook.com/docs/marketing-api/audiences/guides/custom-audiences#hash
   * sending null values for the properties for which user hasn't provided any value
   */
  if (isHashRequired && eachProperty !== 'MADID' && eachProperty !== 'EXTERN_ID') {
    if (tmpUpdatedProperty) {
      tmpUpdatedProperty = `${tmpUpdatedProperty}`;
      dataElement.push(sha256(tmpUpdatedProperty));
    } else {
      dataElement.push(null);
    }
  }
  // if property name is MADID or EXTERN_ID if the value is undefined send null
  else if (!tmpUpdatedProperty && (eachProperty === 'MADID' || eachProperty === 'EXTERN_ID')) {
    dataElement.push(null);
  } else {
    dataElement.push(tmpUpdatedProperty);
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

module.exports = { prepareDataField, getSchemaForEventMappedToDest, batchingWithPayloadSize };
