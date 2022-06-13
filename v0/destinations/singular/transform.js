const { BASE_URL, sessionEvents } = require("./config");
const {
  defaultRequestConfig,
  defaultGetRequestConfig,
  removeUndefinedAndNullValues,
  getSuccessRespEvents,
  getErrorRespEvents
} = require("../../util");

const {
  generateRevenuePayload,
  platformWisePayloadGenerator
} = require("./util");

const responseBuilderSimple = (message, { Config }) => {
  let endPoint;
  const eventType = message.event;
  const response = defaultRequestConfig();
  /*
    Use the session notification endpoint to report a session to Singular
    https://support.singular.net/hc/en-us/articles/360048588672-Server-to-Server-S2S-API-Endpoint-Reference#Session_Notification_Endpoint
  */
  const sessionName = Config.sessionEventList.findIndex(
    o => o.sessionEventName === eventType
  );
  if (sessionName != -1 || sessionEvents.includes(eventType)) {
    let { payload, eventAttributes } = platformWisePayloadGenerator(
      message,
      true
    );

    // Singular maps Connection Type to either wifi or carrier
    if (message.context?.network?.wifi) {
      payload.c = "wifi";
    } else {
      payload.c = "carrier";
    }

    payload = removeUndefinedAndNullValues(payload);
    endPoint = `${BASE_URL}/launch`;
    response.endpoint = `${endPoint}`;
    response.params = { ...payload, a: Config.apiKey, e: eventAttributes };
    response.method = defaultGetRequestConfig.requestMethod;
    return response;
  } else {
    /*
      Use this endpoint to report any event occurring in your application other than the session
      https://support.singular.net/hc/en-us/articles/360048588672-Server-to-Server-S2S-API-Endpoint-Reference#Event_Notification_Endpoint
    // */
    let { payload, eventAttributes } = platformWisePayloadGenerator(
      message,
      false
    );
    const { products } = message.properties;
    if (products && Array.isArray(products)) {
      return generateRevenuePayload(products, payload, Config, eventAttributes);
    }
    endPoint = `${BASE_URL}/evt`;
    payload = removeUndefinedAndNullValues(payload);
    response.endpoint = `${endPoint}`;
    response.params = { ...payload, a: Config.apiKey, e: eventAttributes };
    response.method = defaultGetRequestConfig.requestMethod;
    return response;
  }
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
