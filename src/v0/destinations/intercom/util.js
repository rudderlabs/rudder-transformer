const get = require('get-value');
const {
  BASE_ENDPOINT,
  MappingConfig,
  BASE_EU_ENDPOINT,
  BASE_AU_ENDPOINT,
  SEARCH_CONTACT_ENDPOINT,
  CREATE_OR_UPDATE_COMPANY_ENDPOINT,
} = require('./config');
const {
  flattenJson,
  constructPayload,
  getIntegrationsObj,
  isDefinedAndNotNull,
  isHttpStatusSuccess,
  addExternalIdToTraits,
  getFieldValueFromMessage,
  removeUndefinedAndNullValues,
} = require('../../util');
const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const tags = require('../../util/tags');
const { MetadataTypes } = require('./config');
const { JSON_MIME_TYPE } = require('../../util/constant');
const { httpPOST } = require('../../../adapters/network');
const { MappedToDestinationKey } = require('../../../constants');
const { InstrumentationError, NetworkError } = require('../../util/errorTypes');

/**
 * Validated identify call payload
 * @param {*} payload 
 */
const validateIdentify = (payload) => {
  if (!payload.email && !payload.external_id) {
    throw new InstrumentationError('Either of `email` or `userId` is required for Identify call');
  }
};

/**
 * Validates track call payload
 * @param {*} payload 
 */
const validateTrack = (payload) => {
  if (!payload.user_id && !payload.email) {
    throw new InstrumentationError('Either of `email` or `userId` is required for Track call');
  }
};

/**
 * Returns headers
 * @param {*} destination 
 * @returns 
 */
const getHeaders = (destination) => ({
  'Content-Type': JSON_MIME_TYPE,
  Authorization: `Bearer ${destination.Config.apiKey}`,
  Accept: JSON_MIME_TYPE,
  'Intercom-Version': '2.9',
});

/**
 * Returns base endpoint
 * @param {*} destination 
 * @returns 
 */
const getBaseEndpoint = (destination) => {
  const { apiServer } = destination.Config;
  if (apiServer === 'eu') {
    return BASE_EU_ENDPOINT;
  }
  if (apiServer === 'au') {
    return BASE_AU_ENDPOINT;
  }
  return BASE_ENDPOINT;
};

/**
 * Returns custom attributes for identify and group calls
 * @param {*} payload 
 * @param {*} ReservedAttributes 
 * @returns 
 */
const getCustomAttributes = (payload, ReservedAttributes) => {
  let customAttributes = payload.custom_attributes || {};
  if (customAttributes) {
    ReservedAttributes.forEach((trait) => {
      delete customAttributes[trait];
    });
  }
  if (isDefinedAndNotNull(customAttributes) && Object.keys(customAttributes).length > 0) {
    customAttributes = flattenJson(customAttributes);
  }
  return customAttributes;
};

/**
 * Returns transformed payload
 * @param {*} message 
 * @param {*} category 
 * @returns 
 */
const getPayload = (message, category) => {
  let payload;
  if (get(message, MappedToDestinationKey)) {
    addExternalIdToTraits(message);
    payload = getFieldValueFromMessage(message, 'traits');
  } else {
    payload = constructPayload(message, MappingConfig[category.name]);
  }
  return payload;
};

/**
 * Returns contact id based on lookup
 * @param {*} message 
 * @param {*} destination 
 * @returns 
 */
const fetchContactId = async (message, destination) => {
  const integrationsObj = getIntegrationsObj(message, 'INTERCOM');
  let lookupField = 'email';
  if (integrationsObj && integrationsObj.lookup && isDefinedAndNotNull(integrationsObj.lookup)) {
    lookupField = integrationsObj.lookup;
  }
  const lookupFieldValue = getFieldValueFromMessage(message, lookupField);
  const data = JSON.stringify({
    query: {
      operator: 'AND',
      value: [
        {
          field: lookupField,
          operator: '=',
          value: lookupFieldValue,
        },
      ],
    },
  });

  const headers = getHeaders(destination);
  const baseEndPoint = getBaseEndpoint(destination);
  const endpoint = `${baseEndPoint}/${SEARCH_CONTACT_ENDPOINT}`
  const response = await httpPOST(endpoint, data, {
    headers,
    destType: 'intercom',
    feature: 'transformation',
  });

  const processedUserResponse = processAxiosResponse(response);
  if (isHttpStatusSuccess(processedUserResponse.status)) {
    return processedUserResponse.response?.data[0]?.id;
  }

  return null;
};

/**
 * Function to create or update company
 * @param {*} payload 
 * @param {*} destination 
 * @returns 
 */
const createOrUpdateCompany = async (payload, destination) => {
  const headers = getHeaders(destination);
  const finalPayload = removeUndefinedAndNullValues(payload);

  const baseEndPoint = getBaseEndpoint(destination);
  const endpoint = `${baseEndPoint}/${CREATE_OR_UPDATE_COMPANY_ENDPOINT}`
  const response = await httpPOST(endpoint, finalPayload, {
    headers,
    destType: 'intercom',
    feature: 'transformation',
  });

  const processedResponse = processAxiosResponse(response);
  if (isHttpStatusSuccess(processedResponse.status)) {
    return processedResponse.response?.id;
  }

  throw new NetworkError(
    `Unable to Create Company : ${processedResponse?.response?.errors[0]}`,
    processedResponse?.status,
    {
      [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(processedResponse?.status),
    },
    processedResponse,
  );
};

/**
 * Separates reserved metadata from rest of the metadata based on the metadata types
 * @param {*} metadata
 * @returns
 */
const separateReservedAndRestMetadata = (metadata) => {
  const reservedMetadata = {};
  const restMetadata = {};
  if (metadata) {
    Object.entries(metadata).forEach(([key, value]) => {
      if (value && typeof value === 'object') {
        const hasMonetaryAmountKeys = MetadataTypes.monetaryAmount.every((type) => type in value);
        const hasRichLinkKeys = MetadataTypes.richLink.every((type) => type in value);
        if (hasMonetaryAmountKeys || hasRichLinkKeys) {
          reservedMetadata[key] = value;
        } else {
          restMetadata[key] = value;
        }
      } else {
        restMetadata[key] = value;
      }
    });
  }

  // Return the separated metadata objects
  return { reservedMetadata, restMetadata };
};

module.exports = {
  getHeaders,
  getPayload,
  validateTrack,
  fetchContactId,
  getBaseEndpoint,
  validateIdentify,
  getCustomAttributes,
  createOrUpdateCompany,
  separateReservedAndRestMetadata,
};
