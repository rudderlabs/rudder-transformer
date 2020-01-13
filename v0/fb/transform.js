const get = require("get-value");
const set = require("set-value");
const sha256 = require("sha256");
const { EventType } = require("../../constants");
const {
  removeUndefinedValues,
  getDateInFormat,
  defaultRequestConfig,
  defaultPostRequestConfig
} = require("../util");
const {
  baseMapping,
  eventNameMapping,
  eventPropsMapping,
  eventPropsToPathMapping
} = require("./config");

const funcMap = {
  integer: parseInt,
  float: parseFloat
};

const extInfoArray = ["", "", 0, 0, "", "", "", "", "", 0, 0, 0.0, 0, 0, 0];
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

function sanityCheckPayloadForTypesAndModifications(updatedEvent) {
  // Conversion required fields
  const dateTime = new Date(get(updatedEvent.custom_events[0], "_logTime"));
  set(updatedEvent.custom_events[0], "_logTime", dateTime.getTime());

  var num = Number(updatedEvent.advertiser_tracking_enabled);
  updatedEvent.advertiser_tracking_enabled = isNaN(num) ? "0" : "" + num;
  num = Number(updatedEvent.application_tracking_enabled);
  updatedEvent.application_tracking_enabled = isNaN(num) ? "0" : "" + num;

  userProps.forEach(prop => {
    switch (prop) {
      case "ud[em]":
      case "ud[fn]":
      case "ud[ln]":
      case "ud[st]":
      case "ud[zp]":
        if (updatedEvent[prop] && updatedEvent[prop] !== "") {
          updatedEvent[prop] = sha256(updatedEvent[prop].toLowerCase());
        }
        break;
      case "ud[ph]":
        if (updatedEvent[prop] && updatedEvent[prop] !== "") {
          updatedEvent[prop] = sha256(updatedEvent[prop]);
        }
        break;
      case "ud[ge]":
        if (updatedEvent[prop] && updatedEvent[prop] !== "") {
          updatedEvent[prop] = sha256(
            updatedEvent[prop] === "Female" ? "f" : "m"
          );
        }
        break;
      case "ud[db]":
        if (updatedEvent[prop] && updatedEvent[prop] !== "") {
          updatedEvent[prop] = sha256(getDateInFormat(updatedEvent[prop]));
        }
        break;
      case "ud[ct]":
        if (updatedEvent[prop] && updatedEvent[prop] !== "") {
          updatedEvent[prop] = sha256(
            updatedEvent[prop].toLowerCase().replace(/ /g, "")
          );
        }
        break;
      default:
        break;
    }
  });

  if (updatedEvent.custom_events) {
    updatedEvent.custom_events = JSON.stringify(updatedEvent.custom_events);
  }

  if (updatedEvent.extinfo) {
    updatedEvent.extinfo = JSON.stringify(updatedEvent.extinfo);
  }

  // Event type required by fb
  updatedEvent.event = "CUSTOM_APP_EVENTS";
}

function processEventTypeGeneric(message, baseEvent, fbEventName) {
  const updatedEvent = {
    ...baseEvent
  };
  set(updatedEvent.custom_events[0], "_eventName", fbEventName);

  Object.keys(message.properties).forEach(k => {
    if (eventPropsToPathMapping[k]) {
      var rudderEventPath = eventPropsToPathMapping[k];
      var fbEventPath = eventPropsMapping[rudderEventPath];

      if (rudderEventPath.indexOf("sub") > -1) {
        const [prefixSlice, suffixSlice] = rudderEventPath.split(".sub.");
        const parentArray = get(message, prefixSlice);
        updatedEvent.custom_events[0][fbEventPath] = [];

        var length = 0;
        var count = parentArray.length;
        while (count > 0) {
          const intendValue = get(parentArray[length], suffixSlice);
          updatedEvent.custom_events[0][fbEventPath][length] =
            intendValue || "";

          length++;
          count--;
        }
      } else {
        rudderEventPath = eventPropsToPathMapping[k];
        fbEventPath = eventPropsMapping[rudderEventPath];
        const intendValue = get(message, rudderEventPath);
        set(updatedEvent.custom_events[0], fbEventPath, intendValue || "");
      }
    } else {
      set(updatedEvent.custom_events[0], k, message.properties[k]);
    }
  });

  return updatedEvent;
}

function responseBuilderSimple(message, payload, destination) {
  const requestConfig = {
    requestFormat: "FORM",
    requestMethod: "POST"
  };

  const { appID } = destination.Config;

  // "https://graph.facebook.com/v3.3/644758479345539/activities?access_token=644758479345539|748924e2713a7f04e0e72c37e336c2bd"

  const endpoint = "https://graph.facebook.com/v3.3/" + appID + "/activities";

  const response = defaultRequestConfig();
  response.endpoint = endpoint;
  response.method = defaultPostRequestConfig.requestMethod;
  response.userId = message.userId ? message.userId : message.anonymousId;
  response.body.FORM = removeUndefinedValues(payload);
  response.statusCode = 200;

  return response;
}

function buildBaseEvent(message) {
  const baseEvent = {};
  baseEvent.extinfo = extInfoArray;
  baseEvent.custom_events = [{}];

  baseEvent.extinfo[0] = "a2"; // keeping it fixed to android for now
  var extInfoIdx;
  Object.keys(baseMapping).forEach(k => {
    const inputVal = get(message, k);
    var splits = baseMapping[k].split(".");
    if (splits.length > 1 && splits[0] === "extinfo") {
      extInfoIdx = splits[1];
      var outputVal;
      switch (typeof extInfoArray[extInfoIdx]) {
        case "number":
          if (extInfoIdx === 11) {
            // density
            outputVal = parseFloat(inputVal);
            outputVal = isNaN(outputVal) ? undefined : outputVal.toFixed(2);
          } else {
            outputVal = parseInt(inputVal, 10);
            outputVal = isNaN(outputVal) ? undefined : outputVal;
          }
          break;

        default:
          outputVal = inputVal;
          break;
      }
      baseEvent.extinfo[extInfoIdx] =
        outputVal || baseEvent.extinfo[extInfoIdx];
    } else if (splits.length === 3) {
      // custom event key
      set(baseEvent.custom_events[0], splits[2], inputVal || "");
    } else {
      set(baseEvent, baseMapping[k], inputVal || "");
    }
  });
  return baseEvent;
}

function processSingleMessage(message, destination) {
  let fbEventName;
  const baseEvent = buildBaseEvent(message);
  var eventName = message.event;
  let updatedEvent = {};

  switch (message.type) {
    case EventType.TRACK:
      fbEventName = eventNameMapping[eventName] || eventName;
      updatedEvent = processEventTypeGeneric(message, baseEvent, fbEventName);
      break;
    case EventType.SCREEN: {
      const { name } = message.properties;
      if (!name) {
        fbEventName = "Viewed Screen";
      } else {
        fbEventName = "Viewed " + name + " Screen";
      }
      updatedEvent = processEventTypeGeneric(message, baseEvent, fbEventName);
      break;
    }
    case EventType.PAGE:
      fbEventName = "Viewed Page";
      updatedEvent = processEventTypeGeneric(message, baseEvent, fbEventName);
      break;
    default:
      console.log("could not determine type");
      return {
        statusCode: 400,
        error: "message type not supported"
      };
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

exports.process = process;
