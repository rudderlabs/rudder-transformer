const { EventType } = require("../../../constants");
const {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  DIAPI_CONFIG_CATEGORIES,
  DIAPI_MAPPING_CONFIG
} = require("./config");
const {
  constructPayload,
  defaultPostRequestConfig,
  removeUndefinedAndNullValues,
  defaultRequestConfig,
  simpleProcessRouterDest,
  isDefinedAndNotNullAndNotEmpty
} = require("../../util");
const { fetchPlatform } = require("./utils");
const {
  ConfigurationError,
  TransformationError,
  InstrumentationError
} = require("../../util/errorTypes");

const responseBuilder = (message, category, destination, platform) => {
  let payload;
  const { Config } = destination;
  const response = defaultRequestConfig();
  response.method = defaultPostRequestConfig.requestMethod;
  if (platform === "pl") {
    const { plWriteKey, pl } = Config;
    if (!isDefinedAndNotNullAndNotEmpty(plWriteKey) || !isDefinedAndNotNullAndNotEmpty(pl)) {
      throw new ConfigurationError(
        "Configuration for Web Mode requires write key and region url"
      );
    }
    payload = constructPayload(message, MAPPING_CONFIG[category.name]);
    payload.writeKey = plWriteKey;
    payload.context.userAgent = {
      ua: payload.context.userAgent
    };
    response.endpoint = pl;
    response.headers = {
      "Content-Type": "application/json"
    };
  } else {
    // diapi
    const { diapi, apiKey, passKey, diapiWriteKey, srcId } = Config;
    if (
      !isDefinedAndNotNullAndNotEmpty(diapi) ||
      !isDefinedAndNotNullAndNotEmpty(apiKey) ||
      !isDefinedAndNotNullAndNotEmpty(passKey)
    ) {
      throw new ConfigurationError(
        "Configuration for Server Mode requires Api key, Pass Key and region url"
      );
    }
    payload = constructPayload(message, DIAPI_MAPPING_CONFIG[category.name]);
    if (diapiWriteKey !== "") {
      payload.WriteKey = diapiWriteKey;
    }
    if (srcId !== "") {
      payload.srcid = srcId;
    }
    response.endpoint = diapi;
    response.headers = {
      "Content-Type": "application/json",
      "x-api-passKey": passKey,
      "x-api-key": apiKey
    };
  }
  response.userId = message.anonymousId || message.userId;
  if (payload) {
    payload.type = category.type;
    response.body.JSON = removeUndefinedAndNullValues(payload);
  } else {
    // fail-safety for developer error
    throw new TransformationError("Payload could not be constructed");
  }
  return response;
};

const process = event => {
  const { message, destination } = event;
  if (!message.type) {
    throw new InstrumentationError("Event type is required");
  }

  const messageType = message.type.toLowerCase();
  let response;
  let category;
  const platform = fetchPlatform(destination);
  if (platform === "pl") {
    switch (messageType) {
      case EventType.PAGE:
        category = CONFIG_CATEGORIES.PAGE;
        response = responseBuilder(message, category, destination, platform);
        break;
      case EventType.IDENTIFY:
        category = CONFIG_CATEGORIES.IDENTIFY;
        response = responseBuilder(message, category, destination, platform);
        break;
      case EventType.TRACK:
        category = CONFIG_CATEGORIES.TRACK;
        response = responseBuilder(message, category, destination, platform);
        break;
      default:
        throw new InstrumentationError(
          `Event type ${messageType} is not supported in Web Cloud Mode`
        );
    }
  }
  if (platform === "diapi") {
    switch (messageType) {
      case EventType.TRACK:
        category = DIAPI_CONFIG_CATEGORIES.TRACK;
        response = responseBuilder(message, category, destination, platform);
        break;
      default:
        throw new InstrumentationError(
          `Event type ${messageType} is not supported in Server Cloud Mode`
        );
    }
  }
  return response;
};

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
