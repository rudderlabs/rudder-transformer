/* eslint-disable no-param-reassign */

const get = require("get-value");
const { cloneDeep } = require("lodash");
const {
  getSuccessRespEvents,
  getErrorRespEvents,
  constructPayload,
  defaultRequestConfig,
  getValueFromMessage,
  removeHyphens
} = require("../../util");
const ErrorBuilder = require("../../util/error");

const { trackMapping, BASE_ENDPOINT } = require("./config");

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
  if (!secret) {
    throw new ErrorBuilder()
      .setMessage("Empty/Invalid access token")
      .setStatus(500)
      .build();
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
      throw new ErrorBuilder()
        .setMessage(
          `[Google_adwords_enhanced_conversions]:: loginCustomerId is required as subAccount is true.`
        )
        .setStatus(400)
        .build();
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
    throw new ErrorBuilder()
      .setMessage(
        `[Google_adwords_enhanced_conversions]:: Conversion named ${event} is not exist in rudderstack dashboard`
      )
      .setStatus(400)
      .build();
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
    throw new ErrorBuilder()
      .setMessage(
        `[Google_adwords_enhanced_conversions]::${e.message} for ${event} event.`
      )
      .setStatus(400)
      .build();
  }

  payload.partialFailure = true;
  if (!payload.conversionAdjustments[0].userIdentifiers) {
    throw new ErrorBuilder()
      .setMessage(
        `[Google_adwords_enhanced_conversions]:: Any of email, phone, firstName, lastName, city, street, countryCode, postalCode or streetAddress is required in traits.`
      )
      .setStatus(400)
      .build();
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
    throw new ErrorBuilder()
      .setMessage(
        "[Google_adwords_enhanced_conversions]::Invalid payload. Message Type is not present"
      )
      .setStatus(400)
      .build();
  }
  if (type.toLowerCase() !== "track") {
    throw new ErrorBuilder()
      .setMessage(
        `[Google_adwords_enhanced_conversions]::Message Type ${type} is not supported. Aborting message.`
      )
      .setStatus(400)
      .build();
  } else {
    return processTrackEvent(metadata, message, destination);
  }
};

const process = async event => {
  return processEvent(event.metadata, event.message, event.destination);
};
const processRouterDest = async inputs => {
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }

  const respList = await Promise.all(
    inputs.map(async input => {
      try {
        return getSuccessRespEvents(
          await process(input),
          [input.metadata],
          input.destination
        );
      } catch (error) {
        return getErrorRespEvents(
          [input.metadata],
          // eslint-disable-next-line no-nested-ternary
          error.response
            ? error.response.status
            : error.code
            ? error.code
            : error.status || 400,
          error.message || "Error occurred while processing payload."
        );
      }
    })
  );
  return respList;
};

module.exports = { process, processRouterDest };
