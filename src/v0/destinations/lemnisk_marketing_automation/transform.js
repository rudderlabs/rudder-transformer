
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
  getSuccessRespEvents,
  getErrorRespEvents,
  CustomError
} = require("../../util");

function responseBuilder(message, category, destination) {
  let platform, payload, response;
  const {writeKey, pl, diapi, apiKey, passkey, wk, srcId } = destination.Config;
  platform = fetchPlatform(destination);
  response = defaultRequestConfig();
  response.method = defaultPostRequestConfig.requestMethod;
  switch(platform){
    case 'pl':
      payload= constructPayload(message, MAPPING_CONFIG[category.name]);
      payload.writeKey = writeKey;
      payload.context.userAgent = {    
        ua: payload.context.userAgent
      }
      response.endpoint = pl;
      response.headers = {
        "Content-Type": "application/json"
      };
      response.userId = message.anonymousId || message.userId;
      break;
    case 'diapi':
      payload= constructPayload(message, DIAPI_MAPPING_CONFIG[category.name]);
      if(wk !== ''){
        payload.WriteKey = wk;
      }
      if(srcId !== ''){
        payload.srcid = srcId;
      }
      response.endpoint = diapi;
      response.headers = {
        "Content-Type": "application/json",
        "x-api-passkey": passkey,
        "x-api-key": apiKey
      };
      response.userId = message.anonymousId || message.userId;
      break;
    default:
      throw new CustomError("Platform type not supported", 400);
  }
  if (payload) {
    switch (category.type) {
      case "identify":
        payload.type = "identify";
        break;
      case "page":
        payload.type = "page";
        break;
      case "track":
        payload.type = "track";
        break;
      default:
        throw new CustomError("Call type is not valid", 400);
    }
    response.body.JSON = removeUndefinedAndNullValues(payload);
  } else {
    // fail-safety for developer error
    throw new CustomError("Payload could not be constructed", 400);
  }
  return response;
}

const processEvent = (message, destination) => {
  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Aborting message.",
      400
    );
  }

  const messageType = message.type.toLowerCase();
  let category, response, platform;
  platform = fetchPlatform(destination);
  if(platform === 'pl'){
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
        throw new CustomError("Message type not supported", 400);
    }
  }
  if(platform === 'diapi'){
    switch (messageType) {
      case EventType.TRACK:
        category = DIAPI_CONFIG_CATEGORIES.TRACK;
        response = responseBuilder(message, category, destination);
        break;
      default:
        throw new CustomError("Message type not supported", 400);
    }
  }
  return response;
};

const process = event => {
  return processEvent(event.message, event.destination);
};

const processRouterDest = async inputs => {
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }

  const respList = await Promise.all(
    inputs.map(async input => {
      try {
        if (input.message.statusCode) {
          // already transformed event
          return getSuccessRespEvents(
            input.message,
            [input.metadata],
            input.destination
          );
        }
        // if not transformed
        return getSuccessRespEvents(
          await process(input),
          [input.metadata],
          input.destination
        );
      } catch (error) {
        return getErrorRespEvents(
          [input.metadata],
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

function fetchPlatform(destination){
  let platform = '';
  const {writeKey, pl, diapi, apiKey, passkey } = destination.Config;
  if(diapi!=='' && apiKey!=='' && passkey!=='' && pl === '' && writeKey ===''){
    platform = 'diapi'
  }else if(pl!== '' && writeKey !== '' && diapi === '' && apiKey === '' && passkey === ''){
    platform = 'pl';
  }else{
    throw new CustomError("Payload contains invalid configuration", 400);
  }
  return platform
}

module.exports = { process, processRouterDest };
