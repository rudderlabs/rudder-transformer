const { EventType } = require("../../../constants");
const { CONFIG_CATEGORIES, MAPPING_CONFIG, baseEndpoint } = require("./config");
const {
  constructPayload,
  getHashFromArray,
  defaultPostRequestConfig,
  defaultRequestConfig,
  removeUndefinedAndNullValues,
  flattenJson,
  getSuccessRespEvents,
  getErrorRespEvents,
  CustomError
} = require("../../util");

const rejectParams = ["revenue", "currency"];

function responseBuilderSimple(message, category, destination) {
  const payload = constructPayload(message, MAPPING_CONFIG[category.name]);
  const { appToken, customMappings, environment } = destination.Config;
  if (
    !message.context.device ||
    !message.context.device.type ||
    !message.context.device.id
  ) {
    throw new CustomError("Device type/id  not present", 400);
  }
  if (message.context.device.type.toLowerCase() === "android") {
    delete payload.idfv;
    delete payload.idfa;
  } else if (message.context.device.type.toLowerCase() === "ios") {
    delete payload.android_id;
    delete payload.gps_adid;
  } else {
    throw new CustomError("Device type not valid", 400);
  }
  if (payload.revenue) {
    payload.currency = message.properties.currency || "USD";
  }
  const hashMap = getHashFromArray(customMappings, "from", "to", false);
  if (payload && message.event && hashMap[message.event]) {
    const response = defaultRequestConfig();
    response.headers = {
      Accept: "*/*"
    };
    if (payload.callback_params) {
      rejectParams.forEach(rejectParam => {
        delete payload.callback_params[rejectParam];
      });
      payload.callback_params = JSON.stringify(
        flattenJson(payload.callback_params)
      );
    } else {
      payload.callback_params = null;
    }

    response.endpoint = baseEndpoint;
    response.method = defaultPostRequestConfig.requestMethod;
    response.userId = message.anonymousId;
    payload.s2s = 1;
    payload.app_token = appToken;
    payload.event_token = hashMap[message.event];
    payload.environment = environment ? "production" : "sandbox";
    response.params = removeUndefinedAndNullValues(payload);
    return response;
  }
  // fail-safety for developer error
  if (!message.event || !hashMap[message.event]) {
    throw new CustomError("No event token mapped for this event", 400);
  } else {
    throw new CustomError("Payload could not be constructed", 400);
  }
}

const processEvent = (message, destination) => {
  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Aborting message.",
      400
    );
  }
  const messageType = message.type.toLowerCase();
  let category;
  switch (messageType) {
    case EventType.TRACK:
      category = CONFIG_CATEGORIES.TRACK;
      break;
    default:
      throw new CustomError("Message type not supported", 400);
  }

  // build the response
  return responseBuilderSimple(message, category, destination);
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

module.exports = { process, processRouterDest };
