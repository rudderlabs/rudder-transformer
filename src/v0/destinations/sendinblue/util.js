const { EMAIL_SUFFIX, getContactDetailsEndpoint } = require('./config');
const {
  getHashFromArray,
  getIntegrationsObj,
  isNotEmpty,
  validateEmail,
  validatePhoneWithCountryCode,
  getDestinationExternalID,
} = require('../../util');
const { httpGET } = require('../../../adapters/network');
const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const { NetworkError, InstrumentationError } = require('../../util/errorTypes');
const tags = require('../../util/tags');
const { JSON_MIME_TYPE } = require('../../util/constant');

const prepareHeader = (apiKey, clientKey = null, trackerApi = false) => {
  if (trackerApi) {
    return {
      'Content-Type': JSON_MIME_TYPE,
      'ma-key': clientKey,
    };
  }
  return {
    'Content-Type': JSON_MIME_TYPE,
    'api-key': apiKey,
  };
};

const checkIfEmailOrPhoneExists = (email, phone) => {
  if (!email && !phone) {
    throw new InstrumentationError('At least one of `email` or `phone` is required');
  }
};

const validateEmailAndPhone = (email, phone = null) => {
  if (email && !validateEmail(email)) {
    throw new InstrumentationError('The provided email is invalid');
  }

  if (phone && !validatePhoneWithCountryCode(phone)) {
    throw new InstrumentationError('The provided phone number is invalid');
  }
};

/**
 * Sendinblue is appending `@mailin-sms.com` to phone number and setting it in a email field if, only phone is passed while creating a contact
 * @param {*} phone +919315446189
 * @returns 919315446189@mailin-sms.com
 */
const prepareEmailFromPhone = (phone) => `${phone.replace('+', '')}${EMAIL_SUFFIX}`;

const checkIfContactExists = async (identifier, apiKey) => {
  const endpoint = getContactDetailsEndpoint(identifier);
  const requestOptions = {
    headers: prepareHeader(apiKey),
  };
  const contactDetailsResponse = await httpGET(endpoint, requestOptions);

  const processedContactDetailsResponse = processAxiosResponse(contactDetailsResponse);
  if (
    processedContactDetailsResponse.status === 200 &&
    processedContactDetailsResponse?.response?.id
  ) {
    return true;
  }

  if (processedContactDetailsResponse.status !== 404) {
    throw new NetworkError(
      `Failed to fetch contact details due to "${JSON.stringify(
        processedContactDetailsResponse.response,
      )}"`,
      processedContactDetailsResponse.status,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(processedContactDetailsResponse.status),
      },
      processedContactDetailsResponse.response,
    );
  }

  // for status code 404 (contact not found)
  return false;
};

/**
 * Function to remove empty key ("") from payload
 * @param {*} payload {"key1":"a","":{"id":1}}
 * @returns // {"key1":"a"}
 */
const removeEmptyKey = (payload) => {
  const rawPayload = payload;
  const key = '';
  if (Object.prototype.hasOwnProperty.call(rawPayload, key)) {
    delete rawPayload[''];
  }
  return rawPayload;
};

/**
 * Function to remove duplicate traits from user traits
 * @param {*} userTraits {"location":"San Francisco","LOCATION":"San Francisco"}
 * @param {*} attributeMap {"area_code":"AREA","location":"LOCATION"}
 * @returns // {"LOCATION":"San Francisco"}
 */
const refineUserTraits = (userTraits, attributeMap) => {
  const refinedTraits = userTraits;
  Object.keys(userTraits).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(attributeMap, key)) {
      delete refinedTraits[key];
    }
  });
  return refinedTraits;
};

/**
 * Function to transform user traits for identify and track call with the help of contact attribute mapping defined in webapp
 * Contact attribute mapping -> [{"from":"area_code","to":"AREA"},{"from":"location","to":"LOCATION"}]
 * @param {*} traits
 * @param {*} contactAttributeMapping traits to Sendinblue contact attribute mapping defined in webapp
 * @returns
 */
const transformUserTraits = (traits, contactAttributeMapping) => {
  // convert destination.Config.contactAttributeMapping to hashMap
  const attributeMap = getHashFromArray(contactAttributeMapping, 'from', 'to', false);

  const userTraits = traits;
  Object.keys(attributeMap).forEach((key) => {
    const traitValue = traits[key];
    if (traitValue) {
      userTraits[attributeMap[key]] = traitValue;
    }
  });

  return refineUserTraits(userTraits, attributeMap);
};

// Prepare track event data. Event data consists `id` and `data`.
// id -> from integration object or messageId
// data -> properties
const prepareTrackEventData = (message, payload) => {
  const { messageId, data } = payload;
  if (isNotEmpty(data)) {
    const integrationsObj = getIntegrationsObj(message, 'sendinblue');
    const idKey = integrationsObj?.propertiesIdKey;
    const id = data[idKey] || messageId;
    return { id, data };
  }
  return {};
};

const getListIds = (message, key) => {
  const listIds = [];
  const externalId = getDestinationExternalID(message, key);
  if (externalId && Array.isArray(externalId)) {
    listIds.push(...externalId);
  }
  return listIds;
};

module.exports = {
  checkIfEmailOrPhoneExists,
  prepareEmailFromPhone,
  validateEmailAndPhone,
  checkIfContactExists,
  prepareHeader,
  removeEmptyKey,
  transformUserTraits,
  prepareTrackEventData,
  getListIds,
};
