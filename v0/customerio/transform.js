const _ = require("lodash");
const get = require("get-value");
const set = require("set-value");
const btoa = require("btoa");

const { EventType, SpecedTraits, TraitsMapping } = require("../../constants");
const {
  removeUndefinedValues,
  defaultPostRequestConfig,
  defaultPutRequestConfig,
  defaultRequestConfig,
  isPrimitive
} = require("../util");

const {
  IDENTITY_ENDPOINT,
  USER_EVENT_ENDPOINT,
  ANON_EVENT_ENDPOINT,
  DEVICE_REGISTER_ENDPOINT,
  DEVICE_DELETE_ENDPOINT
} = require("./config");

const deviceRelatedEventNames = [
  "Application Installed",
  "Application Opened",
  "Application Uninstalled"
];
const deviceDeleteRelatedEventName = "Application Uninstalled";

// Get the spec'd traits, for now only address needs treatment as 2 layers.
// populate the list of spec'd traits in constants.js
const populateSpecedTraits = (payload, message) => {
  //console.log(message);
  SpecedTraits.forEach(trait => {
    const mapping = TraitsMapping[trait];
    const keys = Object.keys(mapping);
    keys.forEach(key => {
      set(payload, key, get(message, mapping[key]));
    });
  });
};

function responseBuilder(message, evType, evName, destination) {
  const rawPayload = {};
  let endpoint;
  let requestConfig = defaultPostRequestConfig;
  //console.log(message);
  let userId =
    message.userId && message.userId != "" ? message.userId : undefined;

  const response = defaultRequestConfig();
  if (evType === EventType.IDENTIFY) {
    // populate speced traits
    populateSpecedTraits(rawPayload, message);
    if (message.context.traits) {
      const traits = Object.keys(message.context.traits);
      traits.forEach(trait => {
        //populate keys other than speced traits
        if (!SpecedTraits.includes(trait)) {
          set(rawPayload, trait, get(message, "context.traits." + trait));
        }
      });
    }

    if (message.user_properties) {
      const userProps = Object.keys(message.user_properties);
      userProps.forEach(prop => {
        let val = get(message, "user_properties." + prop);
        // send only top level keys
        if (isPrimitive(val)) {
          set(rawPayload, prop, val);
        }
      });

      set(
        rawPayload,
        "created_at",
        new Date(message.originalTimestamp).getTime()
      );
    }

    //console.log(rawPayload);

    if (userId) {
      endpoint = IDENTITY_ENDPOINT.replace(":id", userId);
    } else {
      return { statusCode: 400, error: "userId not present" };
    }
    requestConfig = defaultPutRequestConfig;
  } else {
    if (message.properties) {
      // use this if only top level keys are to be sent

      /* const eventProps = Object.keys(message.properties);
      eventProps.forEach(prop => {
        let val = get(message, "properties." + prop);
        if (isPrimitive(val)) {
          set(rawPayload.data, prop, val);
        }
      }); */

      if (deviceDeleteRelatedEventName == evName) {
        const token = get(message, "context.device.token");
        if (userId && token) {
          endpoint = DEVICE_DELETE_ENDPOINT.replace(":id", userId).replace(
            ":device_id",
            token
          );

          response.endpoint = endpoint;
          response.method = "DELETE";
          response.headers = {
            Authorization:
              "Basic " +
              btoa(destination.Config.siteID + ":" + destination.Config.apiKey)
          };

          return response;
        } else {
          return {
            statusCode: 400,
            error: "userId or device_token not present"
          };
        }
      }

      if (deviceRelatedEventNames.includes(evName)) {
        let devProps = message.properties;
        set(devProps, "device_id", get(message, "context.device.token"));
        set(devProps, "platform", get(message, "context.device.type"));
        set(
          devProps,
          "last_used",
          new Date(message.originalTimestamp).getTime()
        );
        set(rawPayload, "device", devProps);
        requestConfig = defaultPutRequestConfig;
      } else {
        rawPayload.data = {};
        set(rawPayload, "data", message.properties);
      }
    }

    if (!deviceRelatedEventNames.includes(evName)) {
      set(rawPayload, "name", evName);
      set(rawPayload, "type", evType);
    }

    if (userId) {
      if (deviceRelatedEventNames.includes(evName)) {
        endpoint = DEVICE_REGISTER_ENDPOINT.replace(":id", userId);
      } else {
        endpoint = USER_EVENT_ENDPOINT.replace(":id", userId);
      }
    } else {
      endpoint = ANON_EVENT_ENDPOINT;
    }
  }
  const payload = removeUndefinedValues(rawPayload);
  //console.log(payload);
  response.endpoint = endpoint;
  response.method = requestConfig.requestMethod;
  response.headers = {
    "Content-Type": "application/json",
    Authorization:
      "Basic " +
      btoa(destination.Config.siteID + ":" + destination.Config.apiKey)
  };
  response.body.JSON = payload;

  //console.log(response);
  return response;
}

function processSingleMessage(message, destination) {
  let messageType = message.type.toLowerCase();
  let evType;
  let evName;
  //console.log("messageType", messageType);
  switch (messageType) {
    case EventType.IDENTIFY:
      evType = "identify";
      break;
    case EventType.PAGE:
      evType = "page"; // customerio mandates sending 'page' for pageview events
      evName = "page";
      break;
    case EventType.SCREEN:
      evType = "screenview";
      evName = "Viewed " + message.properties.name + " Screen";
      break;
    case EventType.TRACK:
      evType = "event";
      evName = message.event;
      break;
    default:
      console.log("could not determine type");
      throw new Error("message type not supported");
  }
  //console.log(message);
  const response = responseBuilder(message, evType, evName, destination);
  return response;
}

function process(events) {
  const respList = [];
  events.forEach(event => {
    try {
      const { message, destination } = event;
      //console.log("processSingleMessage");
      const result = processSingleMessage(message, destination);
      if (!result.statusCode) {
        result.statusCode = 200;
      }
      respList.push(result);
    } catch (error) {
      respList.push({ statusCode: 400, error: error.message });
    }
  });

  return respList;
}

exports.process = process;
