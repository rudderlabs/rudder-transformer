const get = require("get-value");
const set = require("set-value");
const {
  defaultPostRequestConfig,
  defaultGetRequestConfig,
  defaultRequestConfig,
  getHashFromArray,
  getFieldValueFromMessage,
  flattenJson,
  isDefinedAndNotNull
} = require("../../util");
const { EventType } = require("../../../constants");

const getPropertyParams = message => {
  if (message.type === EventType.IDENTIFY) {
    return flattenJson(getFieldValueFromMessage(message, "traits"));
  }
  return flattenJson(message.properties);
};

function process(event) {
  try {
    const { message, destination } = event;
    // set context.ip from request_ip if it is missing
    if (
      !get(message, "context.ip") &&
      isDefinedAndNotNull(message.request_ip)
    ) {
      set(message, "context.ip", message.request_ip);
    }
    const response = defaultRequestConfig();
    const url = destination.Config.webhookUrl;
    const method = destination.Config.webhookMethod;
    const { headers } = destination.Config;

    if (url) {
      if (method === defaultGetRequestConfig.requestMethod) {
        response.method = defaultGetRequestConfig.requestMethod;
        // send properties as query params for GET
        response.params = getPropertyParams(message);
      } else {
        response.method = defaultPostRequestConfig.requestMethod;
        response.body.JSON = message;
        response.headers = {
          "content-type": "application/json"
        };
      }

      Object.assign(response.headers, getHashFromArray(headers));
      // ------------------------------------------------
      // This is temporary and just to support dynamic header through user transformation
      // Final goal is to support updating destinaiton config using user transformation
      //
      // We'll deprecate this feature as soon as we release the final feature
      // Sample user transformation for this:
      //
      // export function transformEvent(event, metadata) {
      //   event.header = {
      //     dynamic_header_1: "dynamic_header_value"
      //   };
      //
      //   return event;
      // }
      //
      // ------------------------------------------------
      const { header } = message;
      if (header) {
        if (typeof header === "object") {
          Object.keys(header).forEach(key => {
            const val = header[key];
            if (val && typeof val === "string") {
              response.headers[key] = val;
            }
          });
        }

        if (response.body.JSON) {
          delete response.body.JSON.header;
        }
      }

      response.userId = message.anonymousId;
      response.endpoint = url;

      return response;
    }
    throw new Error("Invalid URL in destination config");
  } catch (err) {
    throw new Error(err.message || "[webhook] Failed to process request");
  }
}

const getRouterTransformResponse = (message, metadata, destination) => {
  const returnResponse = {};
  returnResponse.batchedRequest = message;
  returnResponse.metadata = metadata;
  returnResponse.batched = false;
  returnResponse.statusCode = 200;
  returnResponse.destination = destination;
  return returnResponse;
};

function processRouterDest(events) {
  return events.map(ev => {
    const resp = process(ev);
    return getRouterTransformResponse(resp, [ev.metadata], ev.destination);
  });
}

module.exports = { process, processRouterDest };
