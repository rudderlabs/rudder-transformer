const _ = require('lodash');
const sha256 = require('sha256');
const get = require('get-value');
const jsonSize = require('json-size');

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
                "shrouti@abc.com",
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
    const revisedDataArray = _.chunk(payload.data, revisedRecordsPerPayload);
    // const { schema } = payload;
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

// Function responsible for making the data field without payload object
// Based on the "isHashRequired" value hashing is explicitly enabled or disabled
const prepareDataField = (userSchema, userUpdateList, isHashRequired, disableFormat) => {
  const data = [];
  let updatedProperty;
  let dataElement;
  userUpdateList.forEach((eachUser) => {
    dataElement = [];
    userSchema.forEach((eachProperty) => {
      const userProperty = eachUser[eachProperty];
      if (isHashRequired) {
        if (!disableFormat) {
          // when user requires formatting
          updatedProperty = ensureApplicableFormat(eachProperty, userProperty);
        } else {
          // when user requires hashing but does not require formatting
          updatedProperty = userProperty;
        }
      } else {
        // when hashing is not required
        updatedProperty = userProperty;
      }
      if (isHashRequired && eachProperty !== 'MADID' && eachProperty !== 'EXTERN_ID') {
        // for MOBILE_ADVERTISER_ID, MADID,EXTERN_ID hashing is not required ref: https://developers.facebook.com/docs/marketing-api/audiences/guides/custom-audiences#hash
        if (updatedProperty) {
          updatedProperty = `${updatedProperty}`;
          dataElement.push(sha256(updatedProperty));
        } else {
          dataElement.push(null);
        }
      } else {
        dataElement.push(updatedProperty);
      }
    });
    data.push(dataElement);
  });

  return data;
};
module.exports = { prepareDataField, getSchemaForEventMappedToDest, batchingWithPayloadSize };
