const { NetworkError } = require('@rudderstack/integrations-lib');
const tags = require('../../../../v0/util/tags');
const { httpPOST } = require('../../../../adapters/network');
const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../../adapters/utils/networkUtils');
const {
  flattenJson,
  getIntegrationsObj,
  isDefinedAndNotNull,
  isHttpStatusSuccess,
  getFieldValueFromMessage,
  removeUndefinedAndNullValues,
} = require('../../../../v0/util');
const { JSON_MIME_TYPE } = require('../../../../v0/util/constant');
const {
  BASE_ENDPOINT,
  MetadataTypes,
  BASE_EU_ENDPOINT,
  BASE_AU_ENDPOINT,
  ReservedUserAttributes,
  SEARCH_CONTACT_ENDPOINT,
  ReservedCompanyAttributes,
  CREATE_OR_UPDATE_COMPANY_ENDPOINT,
} = require('./config');

/**
 * Returns destination request headers
 * @param {*} destination
 * @returns
 */
const getHeaders = (destination) => ({
  'Content-Type': JSON_MIME_TYPE,
  Authorization: `Bearer ${destination.Config.apiKey}`,
  Accept: JSON_MIME_TYPE,
  'Intercom-Version': '2.10',
});

/**
 * Returns destination request base endpoint
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
 * Returns contact lookup field
 * @param {*} message
 * @returns
 */
const getLookUpField = (message) => {
  let lookupField = 'email';
  const integrationsObj = getIntegrationsObj(message, 'INTERCOM');
  if (integrationsObj && isDefinedAndNotNull(integrationsObj.lookup)) {
    lookupField = integrationsObj.lookup;
  }
  return lookupField;
};

/**
 * Returns the value of name field
 * @param {*} message
 * @returns
 */
const getName = (message) => {
  const name = message?.traits?.name || message?.context?.traits?.name;
  if (name) return name;
  const firstName = getFieldValueFromMessage(message, 'firstName');
  const lastName = getFieldValueFromMessage(message, 'lastName');
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }

  if (firstName || lastName) {
    return firstName || lastName;
  }
  return undefined;
};

/**
 * Returns custom attributes for identify and group calls (for contact and company in intercom)
 * @param {*} payload
 * @param {*} type
 * @returns
 */
const filterCustomAttributes = (payload, type) => {
  const ReservedAttributes = type === 'user' ? ReservedUserAttributes : ReservedCompanyAttributes;
  let { custom_attributes: customAttributes } = payload;
  if (customAttributes) {
    ReservedAttributes.forEach((trait) => {
      if (customAttributes[trait]) delete customAttributes[trait];
    });

    if (isDefinedAndNotNull(customAttributes) && Object.keys(customAttributes).length > 0) {
      customAttributes = flattenJson(customAttributes);
    }
  }
  return customAttributes;
};

/**
 * Api call to search contact in intercom to returns id of contact
 * Ref doc : https://developers.intercom.com/docs/references/rest-api/api.intercom.io/Contacts/SearchContacts/
 * @param {*} message
 * @param {*} destination
 * @returns
 */
const searchContact = async (message, destination) => {
  const lookupField = getLookUpField(message);
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
  const endpoint = `${baseEndPoint}/${SEARCH_CONTACT_ENDPOINT}`;
  const response = await httpPOST(endpoint, data, {
    headers,
    destType: 'intercom',
    feature: 'transformation',
  });
  const processedUserResponse = processAxiosResponse(response);
  if (isHttpStatusSuccess(processedUserResponse.status)) {
    return processedUserResponse.response?.data.length > 0
      ? processedUserResponse.response?.data[0]?.id
      : null;
  }

  throw new NetworkError(
    `Unable to search contact due to : ${JSON.stringify(processedUserResponse?.response?.errors)}`,
    processedUserResponse?.status,
    {
      [tags]: getDynamicErrorType(processedUserResponse?.status),
    },
    processedUserResponse,
  );
};

/**
 * Api call to create or update companies in intercom
 * Ref doc : https://developers.intercom.com/docs/references/rest-api/api.intercom.io/Companies/createOrUpdateCompany/
 * @param {*} payload
 * @param {*} destination
 * @returns
 */
const createOrUpdateCompany = async (payload, destination) => {
    const headers = getHeaders(destination);
  const finalPayload = JSON.stringify(removeUndefinedAndNullValues(payload));
  const baseEndPoint = getBaseEndpoint(destination);
  const endpoint = `${baseEndPoint}/${CREATE_OR_UPDATE_COMPANY_ENDPOINT}`;
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
    `Unable to Create or Update Company due to : ${JSON.stringify(
      processedResponse?.response?.errors,
    )}`,
    processedResponse?.status,
    {
      [tags]: getDynamicErrorType(processedResponse?.status),
    },
    processedResponse,
  );
};

/**
 * Returns metadata object
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

/**
 * Returns final payload with metadata
 * @param {*} payload
 * @returns
 */
const addMetadataToPayload = (payload) => {
  let finalPayload = payload;
  if (finalPayload.metadata) {
    // reserved metadata contains JSON objects that does not requires flattening
    const { reservedMetadata, restMetadata } = separateReservedAndRestMetadata(
      finalPayload.metadata,
    );
    finalPayload = {
      ...finalPayload,
      metadata: { ...reservedMetadata, ...flattenJson(restMetadata) },
    };
  }
  return finalPayload;
};

module.exports = {
  getName,
  getHeaders,
  searchContact,
  getLookUpField,
  getBaseEndpoint,
  addMetadataToPayload,
  createOrUpdateCompany,
  filterCustomAttributes,
  separateReservedAndRestMetadata,
};
