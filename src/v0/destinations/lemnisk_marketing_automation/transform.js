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
  defaultRequestConfig
} = require("../../util");
const {
  ConfigurationError,
  TransformationError,
  InstrumentationError
} = require("../../util/errorTypes");
function responseBuilder(message, category, destination, platform) {
  let payload, response;
  const { plWriteKey, pl, diapi, apiKey, passkey, wk, srcId } = destination.Config;
  response = defaultRequestConfig();
  response.method = defaultPostRequestConfig.requestMethod;
  if (platform === 'pl') {
    payload = constructPayload(message, MAPPING_CONFIG[category.name]);
    payload.writeKey = plWriteKey;
    payload.context.userAgent = {
      ua: payload.context.userAgent
    }
    response.endpoint = pl;
    response.headers = {
      "Content-Type": "application/json"
    };
  } else { // diapi
    payload = constructPayload(message, DIAPI_MAPPING_CONFIG[category.name]);
    if (wk !== '') {
      payload.WriteKey = wk; //optional
    }
    if (srcId !== '') {
      payload.srcid = srcId; //optional
    }
    response.endpoint = diapi;
    response.headers = {
      "Content-Type": "application/json",
      "x-api-passkey": passkey,
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
}

const process = event => {
  const { message, destination } = event;
  if (!message.type) {
    throw new InstrumentationError("Event type is required");
  }

  const messageType = message.type.toLowerCase();
  let category, response, platform;
  platform = fetchPlatform(destination);
  if (platform === 'pl') {
    switch (messageType) {
      case EventType.PAGE:
        category = CONFIG_CATEGORIES.PAGE;
        response = responseBuilder(message, category, destination);
        break;
      case EventType.IDENTIFY:
        category = CONFIG_CATEGORIES.IDENTIFY;
        response = responseBuilder(message, category, destination);
        break;
      case EventType.TRACK:
        category = CONFIG_CATEGORIES.TRACK;
        response = responseBuilder(message, category, destination);
        break;
      default:
        throw new InstrumentationError(
          `Event type ${messageType} is not supported`
        );
    }
  }
  if (platform === 'diapi') {
    switch (messageType) {
      case EventType.TRACK:
        category = DIAPI_CONFIG_CATEGORIES.TRACK;
        response = responseBuilder(message, category, destination);
        break;
      default:
        throw new InstrumentationError(
          `Event type ${messageType} is not supported`
        );
    }
  }
  return response;
};

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

function fetchPlatform(destination) {
  let platform = '';
  const { writeKey, pl, diapi, apiKey, passkey } = destination.Config;
  if (
    diapi !== "" &&
    apiKey !== "" &&
    passkey !== "" &&
    pl === "" &&
    writeKey === ""
  ) {
    platform = 'diapi'
  } else if (pl !== '' && plWriteKey !== '' && diapi === '' && apiKey === '' && passkey === '') {
    platform = 'pl';
  } else {
    throw new TransformationError("Payload contains invalid configuration");
  }
  return platform;
}

module.exports = { process, processRouterDest };
