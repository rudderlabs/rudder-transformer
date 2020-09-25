const { EventType } = require("../../../constants");
const { CONFIG_CATEGORIES, MAPPING_CONFIG, baseEndpoint } = require("./config");
const {
  constructPayload,
  getHashFromArray,
  defaultPostRequestConfig,
  defaultRequestConfig,
  removeUndefinedAndNullValues
} = require("../../util");

const rejectParams = ["revenue", "currency"];

function responseBuilderSimple(message, category, destination) {
  const payload = constructPayload(message, MAPPING_CONFIG[category.name]);
  const { appToken, customMappings } = destination.Config;
  rejectParams.forEach(rejectParam => {
    delete payload.callback_params[rejectParam];
  });
  if (
    !message.context.device ||
    !message.context.device.type ||
    !message.context.device.id
  ) {
    throw new Error("Device type/id  not present");
  }
  if (message.context.device.type.toLowerCase() === "android") {
    delete payload.idfv;
  } else if (message.context.device.type.toLowerCase() === "ios") {
    delete payload.android_id;
  } else {
    throw new Error("Device type not not valid");
  }
  const hashMap = getHashFromArray(customMappings, "from", "to");
  if (payload && message.event && hashMap[message.event]) {
    const response = defaultRequestConfig();
    response.headers = {
      Accept: "*/*"
    };
    response.endpoint = baseEndpoint;
    response.method = defaultPostRequestConfig.requestMethod;
    response.userId = message.anonymousId;
    payload.s2s = 1;
    payload.app_token = appToken;
    payload.event_token = hashMap[message.event];
    response.params = removeUndefinedAndNullValues(payload);
    return response;
  }
  // fail-safety for developer error
  if (!payload) {
    throw new Error("Payload could not be constructed");
  } else if (!message.event || !hashMap[message.event]) {
    throw new Error("No event token mapped for this event");
  } else {
    throw new Error("Payload could not be constructed");
  }
}

const processEvent = (message, destination) => {
  if (!message.type) {
    throw Error("Message Type is not present. Aborting message.");
  }
  const messageType = message.type.toLowerCase();
  let category;
  switch (messageType) {
    case EventType.TRACK:
      category = CONFIG_CATEGORIES.TRACK;
      break;
    default:
      throw new Error("Message type not supported");
  }

  // build the response
  return responseBuilderSimple(message, category, destination);
};

const process = event => {
  return processEvent(event.message, event.destination);
};
exports.process = process;
