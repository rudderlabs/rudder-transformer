const {
  getSuccessRespEvents,
  getErrorRespEvents,
  CustomError,
  constructPayload,
  defaultRequestConfig,
  getValueFromMessage
} = require("../../util");

const { trackMapping, BASE_ENDPOINT } = require("./config");

const responseBuilder = async (metadata, message, { Config }, payload) => {
  const response = defaultRequestConfig();
  const { event } = message;
  let flag = 0;
  const { listOfConversions } = Config;
  for (let i = 0; i < listOfConversions.length; i += 1) {
    if (listOfConversions[i].conversions === event) {
      flag = 1;
      break;
    }
  }
  if (event === undefined || event === "" || flag === 0) {
    throw new CustomError(
      `[Google_adwords_enhanced_conversions]:: Conversion named ${event} is not exist in rudderstack dashboard`,
      400
    );
  }

  response.endpoint = `${BASE_ENDPOINT}/${Config.customerId}:uploadConversionAdjustments`;
  response.body.JSON = payload;
  const accessToken = metadata.secret.access_token;
  response.headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
    "developer-token": getValueFromMessage(metadata, "secret.developer_token")
  };
  response.params = { event, customerId: Config.customerId };
  if (Config.subAccount)
    if (Config.loginCustomerId)
      response.headers["login-customer-id"] = Config.loginCustomerId;
    else
      throw new CustomError(
        `[Google_adwords_enhanced_conversions]:: loginCustomerId is required as subAccount is true.`,
        400
      );
  return response;
};

const processTrackEvent = async (metadata, message, destination) => {
  const payload = constructPayload(message, trackMapping);
  payload.partialFailure = true;
  if (!payload.conversionAdjustments[0].userIdentifiers) {
    throw new CustomError(
      `[Google_adwords_enhanced_conversions]:: Any of email, phone, firstName, lastName, city, street, countryCode, postalCode or streetAddress is required in traits.`,
      400
    );
  }
  payload.conversionAdjustments[0].adjustmentType = "ENHANCEMENT";
  // Removing the null values from userIdentifier
  const arr = payload.conversionAdjustments[0].userIdentifiers;
  payload.conversionAdjustments[0].userIdentifiers = arr.filter(() => {
    return true;
  });
  return responseBuilder(metadata, message, destination, payload);
};

const processEvent = async (metadata, message, destination) => {
  const { type } = message;
  if (!type) {
    throw new CustomError("Invalid payload. Property Type is not present", 400);
  }
  if (type.toLowerCase() !== "track") {
    throw new CustomError(
      `[Google_adwords_enhanced_conversions]::Message Type ${type} is not present. Aborting message.`,
      400
    );
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
            : 400,
          error.message || "Error occurred while processing payload."
        );
      }
    })
  );
  return respList;
};

module.exports = { process, processRouterDest };
