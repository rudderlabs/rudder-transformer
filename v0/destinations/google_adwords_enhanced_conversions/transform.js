/* eslint-disable no-param-reassign */

const get = require("get-value");
const { cloneDeep } = require("lodash");
const {
  INVALID_OR_EMPTY_TOKEN
} = require("../../../adapters/networkhandler/authConstants");
const { getDynamicMeta } = require("../../../adapters/utils/networkUtils");
const {
  constructPayload,
  defaultRequestConfig,
  getValueFromMessage,
  removeHyphens,
  simpleProcessRouterDest,
  TransformationError
} = require("../../util");
const { ApiError } = require("../../util/errors");

const { trackMapping, BASE_ENDPOINT, DEST_TYPE } = require("./config");

/**
 * This function is helping to update the mappingJson.
 * It is removing the metadata field with type "hashToSha256"
 * @param {} mapping -> it is the configMapping.json
 * @returns
 */
const updateMappingJson = mapping => {
  const newMapping = [];
  mapping.forEach(element => {
    if (get(element, "metadata.type")) {
      if (element.metadata.type === "hashToSha256") {
        element.metadata.type = "toString";
      }
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
const getAccessToken = metadata => {
  // OAuth for this destination
  const { secret } = metadata;
  // we would need to verify if secret is present and also if the access token field is present in secret
  if (!secret || !secret.access_token) {
    throw new ApiError(
      "Empty/Invalid access token",
      500,
      {
        meta: getDynamicMeta(500)
      },
      undefined,
      INVALID_OR_EMPTY_TOKEN,
      DEST_TYPE
    );
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
    "Content-Type": "application/json",
    "developer-token": getValueFromMessage(metadata, "secret.developer_token")
  };
  response.params = { event, customerId: filteredCustomerId };
  if (Config.subAccount)
    if (Config.loginCustomerId) {
      const filteredLoginCustomerId = removeHyphens(Config.loginCustomerId);
      response.headers["login-customer-id"] = filteredLoginCustomerId;
    } else
      throw new TransformationError(
        `[Google_adwords_enhanced_conversions]:: loginCustomerId is required as subAccount is true.`,
        400,
        undefined,
        DEST_TYPE
      );
  return response;
};

const processTrackEvent = async (metadata, message, destination) => {
  let flag = 0;
  const { Config } = destination;
  const { event } = message;
  const { listOfConversions } = Config;
  if (listOfConversions.some(i => i.conversions === event)) {
    flag = 1;
  }
  if (event === undefined || event === "" || flag === 0) {
    throw new TransformationError(
      `[Google_adwords_enhanced_conversions]:: Conversion named ${event} is not exist in rudderstack dashboard`,
      400,
      undefined,
      DEST_TYPE
    );
  }
  const { requireHash } = destination.Config;
  let updatedMapping = cloneDeep(trackMapping);

  if (requireHash === false) {
    updatedMapping = updateMappingJson(updatedMapping);
  }

  let payload;
  try {
    payload = constructPayload(message, updatedMapping);
  } catch (e) {
    throw new TransformationError(
      `[Google_adwords_enhanced_conversions]::${e.message} for ${event} event.`,
      400,
      undefined,
      DEST_TYPE
    );
  }

  payload.partialFailure = true;
  if (!payload.conversionAdjustments[0].userIdentifiers) {
    throw new TransformationError(
      `[Google_adwords_enhanced_conversions]:: Any of email, phone, firstName, lastName, city, street, countryCode, postalCode or streetAddress is required in traits.`,
      400,
      undefined,
      DEST_TYPE
    );
  }
  payload.conversionAdjustments[0].adjustmentType = "ENHANCEMENT";
  // Removing the null values from userIdentifier
  const arr = payload.conversionAdjustments[0].userIdentifiers;
  payload.conversionAdjustments[0].userIdentifiers = arr.filter(item => {
    if (item) return true;
    return false;
  });
  return responseBuilder(metadata, message, destination, payload);
};

const processEvent = async (metadata, message, destination) => {
  const { type } = message;
  if (!type) {
    throw new TransformationError(
      "[Google_adwords_enhanced_conversions]::Invalid payload. Message Type is not present",
      400,
      undefined,
      DEST_TYPE
    );
  }
  if (type.toLowerCase() !== "track") {
    throw new TransformationError(
      `[Google_adwords_enhanced_conversions]::Message Type ${type} is not supported. Aborting message.`,
      400,
      undefined,
      DEST_TYPE
    );
  } else {
    return processTrackEvent(metadata, message, destination);
  }
};

const process = async event => {
  return processEvent(event.metadata, event.message, event.destination);
};
const processRouterDest = async inputs => {
  const respList = await simpleProcessRouterDest(
    inputs,
    "Google_adwords_enhanced_conversions",
    process
  );
  return respList;
};

module.exports = { process, processRouterDest };
