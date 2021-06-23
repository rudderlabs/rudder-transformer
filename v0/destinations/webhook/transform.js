const get = require("get-value");
const set = require("set-value");
const {
  defaultPostRequestConfig,
  defaultGetRequestConfig,
  defaultRequestConfig,
  getHashFromArray,
  getFieldValueFromMessage,
  flattenJson,
  isDefinedAndNotNull,
  CustomError,
  getErrorRespEvents,
  getSuccessRespEvents
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

      // Similar hack as above to adding dynamic path to base url, probably needs a regex eventually
      // Sample user transformation for this:
      //
      // export function transformEvent(event, metadata) {
      //   event.appendPath = `/path/${var}/search?param=${var2}`
      //
      //   return event;
      // }
      if (message.appendPath && typeof message.appendPath === "string" ) {
        response.endpoint += message.appendPath;
        delete message.appendPath
      }

      return response;
    }
    throw new CustomError("Invalid URL in destination config", 400);
  } catch (err) {
    throw new CustomError(
      err.message || "[webhook] Failed to process request",
      err.status || 400
    );
  }
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
