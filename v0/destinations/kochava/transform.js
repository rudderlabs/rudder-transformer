const get = require("get-value");
const { EventType } = require("../../../constants");
const {
  KOCHAVA_ENDPOINT,
  //   mappingConfig,
  eventNameMapping
} = require("./config");
const {
  defaultRequestConfig,
  getSuccessRespEvents,
  getErrorRespEvents,
  CustomError,
  formatTimeStamp,
  isAppleFamily
} = require("../../util");

// build final response
// --------------------
// Params:
// 1. data.event_data (pass as it is to kochava payload)
// 2. raw message from rudder
// 3. mapping json for context properties
// 4. destination object for keys
//
// Ref: https://support.kochava.com/server-to-server-integration/post-install-event-setup/
function responseBuilder(eventName, eventData, message, destination) {
  // build the event json
  const eventJson = {
    action: "event",
    kochava_app_id: destination.Config.apiKey,
    kochava_device_id: get(message, "context.device.id") || message.anonymousId
  };

  // build the data json
  const data = {
    app_tracking_transparency: {
      att: get(message, "context.device.attTrackingStatus") === 3 || false
    },
    usertime: formatTimeStamp(message.originalTimestamp || message.timestamp),
    app_version: get(message, "context.app.build"),
    device_ver:
      message.context &&
      message.context.device &&
      message.context.device.model &&
      message.context.os &&
      message.context.os.name &&
      message.context.os.version
        ? `${message.context.device.model}-${message.context.os.name}-${message.context.os.version}`
        : "",
    device_ids: {
      idfa:
        message.context &&
        message.context.os &&
        message.context.os.name &&
        isAppleFamily(message.context.os.name)
          ? message.context.device.advertisingId || ""
          : "",
      idfv:
        message.context &&
        message.context.os &&
        message.context.os.name &&
        isAppleFamily(message.context.os.name)
          ? message.context.device.id || message.anonymousId || ""
          : "",
      adid:
        message.context &&
        message.context.os &&
        message.context.os.name &&
        message.context.os.name.toLowerCase() === "android"
          ? message.context.device.advertisingId || ""
          : "",
      android_id:
        message.context &&
        message.context.os &&
        message.context.os.name &&
        message.context.os.name.toLowerCase() === "android"
          ? message.context.device.id || message.anonymousId || ""
          : ""
    },
    device_ua: (message.context && message.context.userAgent) || "",
    event_name: eventName,
    origination_ip: get(message, "context.ip") || message.request_ip,
    currency: (eventData && eventData.currency) || "USD",
    event_data: eventData,
    // ---------------------
    // here we add the extra properties we got by debugging the SDK
    // ---------------------
    app_name:
      message.context && message.context.app && message.context.app.name,
    app_short_string:
      message.context && message.context.app && message.context.app.version,
    locale: message.context && message.context.locale,
    os_version:
      message.context && message.context.os && message.context.os.version,
    screen_dpi:
      message.context &&
      message.context.screen &&
      message.context.screen.density
  };

  // set the mandatory fields for kochava
  // const rawPayload = {
  //   kochava_app_id: destination.Config.apiKey,
  //   action: "event",
  //   // Kochava mentioned to send it as empty string
  //   device_ver: "",
  //   // there is no reference of this in kochava documentation.
  //   // Probably it has been deprecated
  //   send_date: message.originalTimestamp || message.timestamp
  // };

  // // map values from message.context to payload.data for kochava
  // const data = constructPayload(message, mappingJson);

  // if (eventName) {
  //   data.event_name = eventName;
  // }

  // // remove undefined values
  // const finalData = removeUndefinedValues(data);
  // const eventPayload = removeUndefinedValues(eventData);
  // // final data object to be passed to the payload
  // const dataPayload = { ...finalData, event_data: eventPayload };
  // dataPayload.origination_ip = getParsedIP(message);
  // // final payload to be sent to kochava
  // const payload = { ...rawPayload, data: dataPayload };

  // construct the response and return
  const response = defaultRequestConfig();
  response.endpoint = KOCHAVA_ENDPOINT;
  response.userId = message.anonymousId;
  response.body.JSON = { ...eventJson, data };
  return response;
}

// convert the specific keys, and pass other properties as it is under data.event_data
function processTrackEvents(message) {
  return message.properties || {};
}

// process only `track` and `screen` events
function processMessage(message, destination) {
  const messageType = message.type.toLowerCase();
  let customParams = {};
  let eventName = message.event;

  switch (messageType) {
    case EventType.SCREEN:
      eventName = "screen view";
      if (message.properties && message.properties.name) {
        eventName += ` ${message.properties.name}`;
      }
      customParams = processTrackEvents(message);
      break;
    case EventType.TRACK:
      // process `track` event
      if (eventName) {
        const evName = eventName.toLowerCase();
        if (eventNameMapping[evName] !== undefined) {
          eventName = eventNameMapping[evName];
        }
      }
      customParams = processTrackEvents(message);
      break;
    default:
      throw new CustomError("message type not supported", 400);
  }

  return responseBuilder(eventName, customParams, message, destination);
}

// process message
function process(event) {
  return processMessage(event.message, event.destination);
}

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
