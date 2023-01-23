/* eslint-disable no-param-reassign */

const get = require('get-value');
const { cloneDeep } = require('lodash');
const {
  constructPayload,
  defaultRequestConfig,
  getValueFromMessage,
  removeHyphens,
  simpleProcessRouterDest,
} = require('../../util');

const {
  InstrumentationError,
  ConfigurationError,
  OAuthSecretError,
} = require('../../util/errorTypes');

const { trackMapping, BASE_ENDPOINT } = require('./config');

/**
 * This function is helping to update the mappingJson.
 * It is removing the metadata field with type "hashToSha256"
 * @param {} mapping -> it is the configMapping.json
 * @returns
 */
const updateMappingJson = (mapping) => {
  const newMapping = [];
  mapping.forEach((element) => {
    if (get(element, 'metadata.type') && element.metadata.type === 'hashToSha256') {
      element.metadata.type = 'toString';
    }
    newMapping.push(element);
  });
  return newMapping;
};

/**
 * Get access token to be bound to the event req headers
 *
 * Note:
 * This method needs to be implemented particular to the destination
 * As the schema that we'd get in `metadata.secret` can be different
 * for different destinations
 *
 * @param {Object} metadata
 * @returns
 */
const getAccessToken = (metadata) => {
  // OAuth for this destination
  const { secret } = metadata;
  // we would need to verify if secret is present and also if the access token field is present in secret
  if (!secret || !secret.access_token) {
    throw new OAuthSecretError('Empty/Invalid access token');
  }
  return secret.access_token;
};

const responseBuilder = async (metadata, message, { Config }, payload) => {
  const response = defaultRequestConfig();
  const { event } = message;
  const filteredCustomerId = removeHyphens(Config.customerId);
  response.endpoint = `${BASE_ENDPOINT}/${filteredCustomerId}:uploadConversionAdjustments`;
  response.body.JSON = payload;
  const accessToken = getAccessToken(metadata);
  response.headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    'developer-token': getValueFromMessage(metadata, 'secret.developer_token'),
  };
  response.params = { event, customerId: filteredCustomerId };
  if (Config.subAccount)
    if (Config.loginCustomerId) {
      const filteredLoginCustomerId = removeHyphens(Config.loginCustomerId);
      response.headers['login-customer-id'] = filteredLoginCustomerId;
    } else throw new ConfigurationError(`LoginCustomerId is required as subAccount is true.`);

  return response;
};

const processTrackEvent = async (metadata, message, destination) => {
  let flag = 0;
  const { Config } = destination;
  const { event } = message;
  const { listOfConversions } = Config;
  if (listOfConversions.some((i) => i.conversions === event)) {
    flag = 1;
  }
  if (event === undefined || event === '' || flag === 0) {
    throw new ConfigurationError(
      `Conversion named "${event}" was not specified in the RudderStack destination configuration`,
    );
  }
  const { requireHash } = Config;
  let updatedMapping = cloneDeep(trackMapping);

  if (requireHash === false) {
    updatedMapping = updateMappingJson(updatedMapping);
  }

  const payload = constructPayload(message, updatedMapping);

  payload.partialFailure = true;
  if (!payload.conversionAdjustments[0]?.userIdentifiers) {
    throw new InstrumentationError(
      `Any of email, phone, firstName, lastName, city, street, countryCode, postalCode or streetAddress is required in traits.`,
    );
  }
  payload.conversionAdjustments[0].adjustmentType = 'ENHANCEMENT';
  // Removing the null values from userIdentifier
  const arr = payload.conversionAdjustments[0].userIdentifiers;
  payload.conversionAdjustments[0].userIdentifiers = arr.filter((item) => {
    if (item) return true;
    return false;
  });
  return responseBuilder(metadata, message, destination, payload);
};

const processEvent = async (metadata, message, destination) => {
  const { type } = message;
  if (!type) {
    throw new InstrumentationError('Invalid payload. Message Type is not present');
  }
  if (type.toLowerCase() !== 'track') {
    throw new InstrumentationError(`Message Type ${type} is not supported. Aborting message.`);
  } else {
    return processTrackEvent(metadata, message, destination);
  }
};

const process = async (event) => processEvent(event.metadata, event.message, event.destination);

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
