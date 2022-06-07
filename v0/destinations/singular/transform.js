const get = require("get-value");
const {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  BASE_URL,
  sessionEvents,
  SINGULAR_SESSION_EXCLUSION,
  SINGULAR_EVENT_EXCLUSION
} = require("./config");
const {
  defaultRequestConfig,
  constructPayload,
  CustomError,
  defaultGetRequestConfig,
  removeUndefinedAndNullAndEmptyValues,
  isAppleFamily,
  getSuccessRespEvents,
  getErrorRespEvents,
  extractCustomFields
} = require("../../util");

const responseBuilderSimple = (message, { Config }) => {
  // trim and replace spaces with "_"
  message.event = message.event.trim().replace(/\s+/g, " ");
  const eventType = message.event;
  const response = defaultRequestConfig();

  const setDevice = payload => {
    if (isAppleFamily(payload.p)) {
      payload.idfa = get(message, "context.device.advertisingId");
      payload.idfv = get(message, "context.device.id");
      /*
        Android - Captured from SDK. No need to pass it explicitly
        iOS - No need to capture from SDK. Need to pass it explicitly under properties.ua.
      */
      payload.ua = get(message, "properties.ua");
    } else if (payload.p.toLowerCase() === "android") {
      payload.aifa = get(message, "context.device.advertisingId");
      payload.andi = get(message, "context.device.id");
    }
    return payload;
  };

  if (sessionEvents.includes(eventType)) {
    let sessionPayload = constructPayload(
      message,
      MAPPING_CONFIG[CONFIG_CATEGORIES.SESSION.name]
    );
    if (!sessionPayload) {
      // fail-safety for developer error
      throw new CustomError("Failed to Create Session Payload", 400);
    }
    // const eventAttributes = {};
    // extractCustomFields(
    //   message,
    //   eventAttributes,
    //   ["properties"],
    //   SINGULAR_SESSION_EXCLUSION
    // );
    sessionPayload = {
      ...sessionPayload,
      ...setDevice(sessionPayload)
      // e: eventAttributes
    };
    // Singular maps Connection Type to either wifi or carrier
    sessionPayload.c = message.context?.network?.wifi ? "wifi" : "carrier";
    /*
        if att_authorization_status is true then dnt will be false,
        else by default dnt value is true
    */
    sessionPayload.dnt = !sessionPayload.att_authorization_status;
    sessionPayload = { ...sessionPayload, a: Config.apiKey };
    sessionPayload = removeUndefinedAndNullAndEmptyValues(sessionPayload);
    let queryString = Object.keys(sessionPayload)
      .map(key => key + "=" + sessionPayload[key])
      .join("&");
    response.endpoint = `${BASE_URL}/launch?${queryString}`;
  } else {
    let eventPayload = constructPayload(
      message,
      MAPPING_CONFIG[CONFIG_CATEGORIES.EVENT.name]
    );
    if (!eventPayload) {
      // fail-safety for developer error
      throw new CustomError("Failed to Create Event Payload", 400);
    }
    response.endpoint = `${BASE_URL}/evt`;
    const eventAttributes = {};
    extractCustomFields(
      message,
      eventAttributes,
      ["properties"],
      SINGULAR_EVENT_EXCLUSION
    );
    eventPayload = {
      ...eventPayload,
      ...setDevice(eventPayload),
      e: eventAttributes
    };
    response.params = removeUndefinedAndNullAndEmptyValues(eventPayload);
  }
  response.method = defaultGetRequestConfig.requestMethod;
  return response;
};

const processEvent = (message, destination) => {
  if (!message.type) {
    throw Error("Message Type is not present. Aborting message.");
  }
  const messageType = message.type.toLowerCase();

  if (messageType === "track")
    return responseBuilderSimple(message, destination);

  throw new Error("[Singular]: Message type not supported");
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
