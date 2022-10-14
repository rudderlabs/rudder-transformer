const get = require("get-value");
const set = require("set-value");
const sha256 = require("sha256");
const { EventType } = require("../../../constants");
const {
  removeUndefinedValues,
  getDateInFormat,
  defaultRequestConfig,
  defaultPostRequestConfig,
  getValueFromMessage,
  getSuccessRespEvents,
  getErrorRespEvents,
  CustomError,
  isAppleFamily
} = require("../../util");

const {
  baseMapping,
  eventNameMapping,
  eventPropsMapping,
  eventPropsToPathMapping,
  eventPropToTypeMapping
} = require("./config");
const logger = require("../../../logger");

// const funcMap = {
//   integer: parseInt,
//   float: parseFloat
// };

// The order and type of `extinfo` parameters is defined here:
// https://developers.facebook.com/docs/graph-api/reference/application/activities/#parameters
const extInfoArray = [
  "", // extinfo version ("a2" = Android, "i2" = iOS)
  "", // app package name
  "", // app version build
  "", // app version name
  "", // OS version
  "", // device model
  "", // locale
  "", // abbreviated time zone
  "", // carrier
  0, //  screen width
  0, //  screen height
  "", // screen density
  0, //  CPU cores
  0, //  storage size in GB
  0, //  free space in GB
  "" //  time zone
];

// User data (`ud`) parameters are also defined there, but not properly documented; instead see here:
// https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/customer-information-parameters/
const userProps = [
  "ud[em]",
  "ud[fn]",
  "ud[ln]",
  "ud[ph]",
  "ud[ge]",
  "ud[db]",
  "ud[ct]",
  "ud[st]",
  "ud[zp]"
];
const eventAndPropRegexPattern = "^[0-9a-zA-Z_][0-9a-zA-Z _-]{0,39}$";
const eventAndPropRegex = new RegExp(eventAndPropRegexPattern);

function sanityCheckPayloadForTypesAndModifications(updatedEvent) {
  // Conversion required fields
  const dateTime = new Date(get(updatedEvent.custom_events[0], "_logTime"));
  set(updatedEvent.custom_events[0], "_logTime", dateTime.getTime());

  let num = Number(updatedEvent.advertiser_tracking_enabled);
  updatedEvent.advertiser_tracking_enabled = isNaN(num) ? "0" : `${num}`;
  num = Number(updatedEvent.application_tracking_enabled);
  updatedEvent.application_tracking_enabled = isNaN(num) ? "0" : `${num}`;

  let isUDSet = false;
  userProps.forEach(prop => {
    switch (prop) {
      case "ud[em]":
      case "ud[fn]":
      case "ud[ln]":
      case "ud[st]":
      case "ud[cn]":
        if (updatedEvent[prop] && updatedEvent[prop] !== "") {
          isUDSet = true;
          updatedEvent[prop] = sha256(updatedEvent[prop].toLowerCase());
        }
        break;
      case "ud[zp]":
      case "ud[ph]":
        if (updatedEvent[prop] && updatedEvent[prop] !== "") {
          isUDSet = true;
          // remove all non-numerical characters
          let processedVal = updatedEvent[prop].replace(/[^0-9]/g, "");
          // remove all leading zeros
          processedVal = processedVal.replace(/^0+/g, "");
          if (processedVal.length) {
            updatedEvent[prop] = sha256(processedVal);
          }
        }
        break;
      case "ud[ge]":
        if (updatedEvent[prop] && updatedEvent[prop] !== "") {
          isUDSet = true;
          updatedEvent[prop] = sha256(
            updatedEvent[prop].toLowerCase() === "female" ? "f" : "m"
          );
        }
        break;
      case "ud[db]":
        if (updatedEvent[prop] && updatedEvent[prop] !== "") {
          isUDSet = true;
          updatedEvent[prop] = sha256(getDateInFormat(updatedEvent[prop]));
        }
        break;
      case "ud[ct]":
        if (updatedEvent[prop] && updatedEvent[prop] !== "") {
          isUDSet = true;
          updatedEvent[prop] = sha256(
            updatedEvent[prop].toLowerCase().replace(/ /g, "")
          );
        }
        break;
      default:
        break;
    }
  });

  // remove anon_id if user data or advertiser_id present
  if (isUDSet || updatedEvent.advertiser_id) {
    delete updatedEvent.anon_id;
  }

  if (!isUDSet && !updatedEvent.advertiser_id && !updatedEvent.anon_id) {
    throw new CustomError(
      "Either context.device.advertisingId or traits or anonymousId must be present for all events",
      400
    );
  }

  if (updatedEvent.custom_events) {
    updatedEvent.custom_events = JSON.stringify(updatedEvent.custom_events);
  }

  if (updatedEvent.extinfo) {
    updatedEvent.extinfo = JSON.stringify(updatedEvent.extinfo);
  }

  // Event type required by fb
  updatedEvent.event = "CUSTOM_APP_EVENTS";
}

function getCorrectedTypedValue(pathToKey, value, originalPath) {
  const type = eventPropToTypeMapping[pathToKey];
  // TODO: we should remove this eslint rule or comeup with a better way
  if (typeof value === type) {
    return value;
  }

  throw new CustomError(
    `${
      typeof originalPath === "object"
        ? JSON.stringify(originalPath)
        : originalPath
    } is not of valid type`,
    400
  );
}

function processEventTypeGeneric(message, baseEvent, fbEventName) {
  const updatedEvent = {
    ...baseEvent
  };
  set(updatedEvent.custom_events[0], "_eventName", fbEventName);

  const { properties } = message;
  if (properties) {
    if (properties.revenue && !properties.currency) {
      throw new Error(
        "If properties.revenue is present, properties.currency is required."
      );
    }
    let processedKey;
    Object.keys(properties).forEach(k => {
      processedKey = k;
      if (!eventAndPropRegex.test(k)) {
        // replace all non alphanumeric characters with ''
        processedKey = processedKey.replace(/[^0-9a-z _-]/gi, "");
        if (k.length > 40) {
          // trim key if length is greater than 40
          processedKey = k.substring(0, 40);
        }
        if (processedKey.length === 0) {
          throw new CustomError(
            `The property key ${k} has only non-alphanumeric characters.A property key must be an alphanumeric string and have atmost 40 characters.`,
            400
          );
        }
      }
      if (eventPropsToPathMapping[k]) {
        let rudderEventPath = eventPropsToPathMapping[k];
        let fbEventPath = eventPropsMapping[rudderEventPath];

        if (rudderEventPath.indexOf("sub") > -1) {
          const [prefixSlice, suffixSlice] = rudderEventPath.split(".sub.");
          const parentArray = get(message, prefixSlice);
          updatedEvent.custom_events[0][fbEventPath] = [];

          let length = 0;
          let count = parentArray.length;
          while (count > 0) {
            const intendValue = get(parentArray[length], suffixSlice);
            updatedEvent.custom_events[0][fbEventPath][
              length
            ] = getCorrectedTypedValue(
              fbEventPath,
              intendValue,
              parentArray[length]
            );
            length += 1;
            count -= 1;
          }
        } else {
          rudderEventPath = eventPropsToPathMapping[k];
          fbEventPath = eventPropsMapping[rudderEventPath];
          const intendValue = get(message, rudderEventPath);
          set(
            updatedEvent.custom_events[0],
            fbEventPath,
            getCorrectedTypedValue(fbEventPath, intendValue, rudderEventPath)
          );
        }
      } else {
        set(updatedEvent.custom_events[0], processedKey, properties[k]);
      }
    });
  }
  return updatedEvent;
}

function responseBuilderSimple(message, payload, destination) {
  const { appID } = destination.Config;

  // "https://graph.facebook.com/v13.0/644748472345539/activities"

  const endpoint = `https://graph.facebook.com/v13.0/${appID}/activities`;

  const response = defaultRequestConfig();
  response.endpoint = endpoint;
  response.method = defaultPostRequestConfig.requestMethod;
  response.headers = {
    // Forward the client IP: https://developers.facebook.com/docs/marketing-api/app-event-api#http
    "x-forwarded-for": message?.context.ip || message.request_ip
  };
  response.userId = message.userId ? message.userId : message.anonymousId;
  response.body.FORM = removeUndefinedValues(payload);
  response.statusCode = 200;

  return response;
}

function buildBaseEvent(message) {
  const baseEvent = {};
  baseEvent.extinfo = Array.from(extInfoArray);
  baseEvent.custom_events = [{}];

  let sourceSDK = get(message, "context.device.type") || "";
  sourceSDK = sourceSDK.toLowerCase();
  if (sourceSDK === "android") {
    sourceSDK = "a2";
  } else if (isAppleFamily(sourceSDK)) {
    sourceSDK = "i2";
  } else {
    // if the sourceSDK is not android or ios
    throw new CustomError(
      'Extended device information i.e, "context.device.type" is required',
      400
    );
  }

  baseEvent.extinfo[0] = sourceSDK;
  let extInfoIdx;
  baseMapping.forEach(bm => {
    const { sourceKeys, destKey } = bm;
    const inputVal = getValueFromMessage(message, sourceKeys);
    if (inputVal) {
      const splits = destKey.split(".");
      if (splits.length > 1 && splits[0] === "extinfo") {
        extInfoIdx = Number(splits[1]);
        let outputVal = inputVal;
        if (typeof extInfoArray[extInfoIdx] === "number") {
          outputVal = parseInt(inputVal, 10);
          outputVal = isNaN(outputVal) ? undefined : outputVal;
        }
        if (extInfoIdx === 11) {
          // density
          outputVal = parseFloat(inputVal);
          outputVal = isNaN(outputVal) ? undefined : `${outputVal.toFixed(2)}`;
        }
        baseEvent.extinfo[extInfoIdx] =
          outputVal || baseEvent.extinfo[extInfoIdx];
      } else if (splits.length === 3) {
        // custom event key
        set(baseEvent.custom_events[0], splits[2], inputVal || "");
      } else {
        set(baseEvent, destKey, inputVal || "");
      }
    }
  });
  return baseEvent;
}

function processSingleMessage(message, destination) {
  let fbEventName;
  const baseEvent = buildBaseEvent(message);
  const eventName = message.event;
  let updatedEvent = {};

  switch (message.type) {
    case EventType.TRACK:
      fbEventName = eventNameMapping[eventName] || eventName;
      if (!eventAndPropRegex.test(fbEventName)) {
        throw new CustomError(
          `Event name ${fbEventName} is not a valid FB APP event name.It must match the regex ${eventAndPropRegexPattern}.`,
          400
        );
      }
      updatedEvent = processEventTypeGeneric(message, baseEvent, fbEventName);
      break;
    case EventType.SCREEN: {
      const { name } = message.properties;
      if (!name || !eventAndPropRegex.test(name)) {
        // TODO : log if name does not match regex
        fbEventName = "Viewed Screen";
      } else {
        fbEventName = `Viewed ${name} Screen`;
        if (!eventAndPropRegex.test(fbEventName)) {
          throw new CustomError(
            `Event name ${fbEventName} is not a valid FB APP event name.It must match the regex ${eventAndPropRegexPattern}.`,
            400
          );
        }
      }
      updatedEvent = processEventTypeGeneric(message, baseEvent, fbEventName);
      break;
    }
    case EventType.PAGE:
      fbEventName = "Viewed Page";
      updatedEvent = processEventTypeGeneric(message, baseEvent, fbEventName);
      break;
    default:
      logger.error("could not determine type");
      throw new CustomError("message type not supported", 400);
  }

  sanityCheckPayloadForTypesAndModifications(updatedEvent);
  return responseBuilderSimple(message, updatedEvent, destination);
}

function process(event) {
  const resp = processSingleMessage(event.message, event.destination);
  if (!resp.statusCode) {
    resp.statusCode = 200;
  }
  return resp;
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
