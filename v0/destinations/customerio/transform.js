const get = require("get-value");
const set = require("set-value");
const btoa = require("btoa");

const {
  EventType,
  SpecedTraits,
  TraitsMapping
} = require("../../../constants");
const {
  removeUndefinedValues,
  defaultPostRequestConfig,
  defaultPutRequestConfig,
  defaultRequestConfig
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
  // console.log(message);
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
  // console.log(message);
  const userId =
    message.userId && message.userId != "" ? message.userId : undefined;

  const response = defaultRequestConfig();
  response.userId = message.userId || message.anonymousId;
  response.headers = {
    Authorization:
      "Basic " +
      btoa(destination.Config.siteID + ":" + destination.Config.apiKey)
  };

  if (evType === EventType.IDENTIFY) {
    if (!userId) {
      return { statusCode: 400, error: "userId not present" };
    }

    // populate speced traits
    populateSpecedTraits(rawPayload, message);
    if (message.context.traits) {
      const traits = Object.keys(message.context.traits);
      traits.forEach(trait => {
        // populate keys other than speced traits
        if (!SpecedTraits.includes(trait)) {
          set(rawPayload, trait, get(message, "context.traits." + trait));
        }
      });
    }

    if (message.user_properties) {
      const userProps = Object.keys(message.user_properties);
      userProps.forEach(prop => {
        const val = get(message, "user_properties." + prop);
        set(rawPayload, prop, val);
      });
    }

    if (message.context.traits.createdAt) {
      set(
        rawPayload,
        "created_at",
        Math.floor(new Date(message.context.traits.createdAt).getTime() / 1000)
      );
    } else {
      set(
        rawPayload,
        "created_at",
        Math.floor(new Date(message.originalTimestamp).getTime() / 1000)
      );
    }

    // console.log(rawPayload);

    endpoint = IDENTITY_ENDPOINT.replace(":id", userId);
    requestConfig = defaultPutRequestConfig;
  } else {
    const token = get(message, "context.device.token");

    if (message.properties) {
      // use this if only top level keys are to be sent

      if (deviceDeleteRelatedEventName == evName) {
        if (userId && token) {
          endpoint = DEVICE_DELETE_ENDPOINT.replace(":id", userId).replace(
            ":device_id",
            token
          );

          response.endpoint = endpoint;
          response.method = "DELETE";

          return response;
        }
        return {
          statusCode: 400,
          error: "userId or device_token not present"
        };
      }

      if (userId && deviceRelatedEventNames.includes(evName) && token) {
        const devProps = message.properties;
        set(devProps, "id", get(message, "context.device.token"));
        set(devProps, "platform", get(message, "context.device.type"));
        set(
          devProps,
          "last_used",
          Math.floor(new Date(message.originalTimestamp).getTime() / 1000)
        );
        set(rawPayload, "device", devProps);
        requestConfig = defaultPutRequestConfig;
      } else {
        rawPayload.data = {};
        set(rawPayload, "data", message.properties);
      }
    }

    if (!(deviceRelatedEventNames.includes(evName) && userId && token)) {
      set(rawPayload, "name", evName);
      set(rawPayload, "type", evType);
    }

    if (userId) {
      if (deviceRelatedEventNames.includes(evName) && token) {
        endpoint = DEVICE_REGISTER_ENDPOINT.replace(":id", userId);
      } else {
        endpoint = USER_EVENT_ENDPOINT.replace(":id", userId);
      }
    } else {
      endpoint = ANON_EVENT_ENDPOINT;
    }
  }
  const payload = removeUndefinedValues(rawPayload);
  // console.log(payload);
  response.endpoint = endpoint;
  response.method = requestConfig.requestMethod;
  response.body.JSON = payload;

  // console.log(response);
  return response;
}

function processSingleMessage(message, destination) {
  const messageType = message.type.toLowerCase();
  let evType;
  let evName;
  // console.log("messageType", messageType);
  switch (messageType) {
    case EventType.IDENTIFY:
      evType = "identify";
      break;
    case EventType.PAGE:
      evType = "page"; // customerio mandates sending 'page' for pageview events
      evName = message.name || message.properties.url;
      break;
    case EventType.SCREEN:
      evType = "event";
      evName =
        "Viewed " + (message.event || message.properties.name) + " Screen";
      break;
    case EventType.TRACK:
      evType = "event";
      evName = message.event;
      break;
    default:
      console.log("could not determine type " + messageType);
      return { statusCode: 400, error: "userId not present" };
  }
  // console.log(message);
  const response = responseBuilder(message, evType, evName, destination);
  return response;
}

function process(event) {
  const respList = [];
  const { message, destination } = event;
  // console.log("processSingleMessage");
  const result = processSingleMessage(message, destination);
  if (!result.statusCode) {
    result.statusCode = 200;
  }
  respList.push(result);

  return respList;
}

exports.process = process;
