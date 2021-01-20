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
  defaultRequestConfig,
  getFieldValueFromMessage
} = require("../../util");
const {
  IDENTITY_ENDPOINT,
  USER_EVENT_ENDPOINT,
  ANON_EVENT_ENDPOINT,
  DEVICE_REGISTER_ENDPOINT,
  DEVICE_DELETE_ENDPOINT
} = require("./config");
const logger = require("../../../logger");

const deviceRelatedEventNames = [
  "Application Installed",
  "Application Opened",
  "Application Uninstalled"
];
const deviceDeleteRelatedEventName = "Application Uninstalled";

// Get the spec'd traits, for now only address needs treatment as 2 layers.
// populate the list of spec'd traits in constants.js
const populateSpecedTraits = (payload, message) => {
  const pathToTraits = message.traits ? "traits" : "context.traits";
  SpecedTraits.forEach(trait => {
    const mapping = TraitsMapping[trait];
    const keys = Object.keys(mapping);
    keys.forEach(key => {
      set(payload, key, get(message, `${pathToTraits}.${mapping[`${key}`]}`));
    });
  });
};

function responseBuilder(message, evType, evName, destination) {
  const rawPayload = {};
  let endpoint;
  let requestConfig = defaultPostRequestConfig;
  const userId =
    message.userId && message.userId !== "" ? message.userId : undefined;

  const response = defaultRequestConfig();
  response.userId = message.userId || message.anonymousId;
  response.headers = {
    Authorization: `Basic ${btoa(
      `${destination.Config.siteID}:${destination.Config.apiKey}`
    )}`
  };

  if (evType === EventType.IDENTIFY) {
    // if userId is not there simply drop the payload
    if (!userId) {
      throw new Error("userId not present");
    }

    // populate speced traits
    const identityTrailts = getFieldValueFromMessage(message, "traits") || {};
    populateSpecedTraits(rawPayload, message);

    if (Object.keys(identityTrailts).length > 0) {
      const traits = Object.keys(identityTrailts);
      const pathToTraits = message.traits ? "traits" : "context.traits";
      traits.forEach(trait => {
        // populate keys other than speced traits
        // also don't send anonymousId, userId as we are setting those form the SDK and it's not actually an user property for the customer
        // discard createdAt as well as we are setting the values at created_at separately
        if (
          !SpecedTraits.includes(trait) &&
          trait !== "createdAt" &&
          trait !== "userId" &&
          trait !== "anonymousId"
        ) {
          set(rawPayload, trait, get(message, `${pathToTraits}.${trait}`));
        }
      });
    }

    // populate user_properties (DEPRECATED)
    if (message.user_properties) {
      const userProps = Object.keys(message.user_properties);
      userProps.forEach(prop => {
        const val = get(message, `user_properties.${prop}`);
        set(rawPayload, prop, val);
      });
    }

    // make user creation time
    set(
      rawPayload,
      "created_at",
      Math.floor(
        new Date(getFieldValueFromMessage(message, "createdAt")).getTime() /
          1000
      )
    );

    // Impportant for historical import
    if (getFieldValueFromMessage(message, "historicalTimestamp")) {
      set(
        rawPayload,
        "_timestamp",
        Math.floor(
          new Date(
            getFieldValueFromMessage(message, "historicalTimestamp")
          ).getTime() / 1000
        )
      );
    }
    endpoint = IDENTITY_ENDPOINT.replace(":id", userId);
    requestConfig = defaultPutRequestConfig;
  } else {
    // any other event type except identify
    const token = get(message, "context.device.token");

    if (message.properties) {
      // use this if only top level keys are to be sent
      // DEVICE DELETE from CustomerIO
      if (deviceDeleteRelatedEventName === evName) {
        if (userId && token) {
          endpoint = DEVICE_DELETE_ENDPOINT.replace(":id", userId).replace(
            ":device_id",
            token
          );

          response.endpoint = endpoint;
          response.method = "DELETE";

          return response;
        }
        throw new Error("userId or device_token not present");
      }

      // DEVICE registration
      if (userId && deviceRelatedEventNames.includes(evName) && token) {
        const devProps = message.properties;
        set(devProps, "id", get(message, "context.device.token"));
        const deviceType = get(message, "context.device.type");
        if (deviceType) {
          set(devProps, "platform", deviceType.toLowerCase());
        }
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
      if (getFieldValueFromMessage(message, "historicalTimestamp")) {
        set(
          rawPayload,
          "timestamp",
          Math.floor(
            new Date(
              getFieldValueFromMessage(message, "historicalTimestamp")
            ).getTime() / 1000
          )
        );
      }
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
  response.endpoint = endpoint;
  response.method = requestConfig.requestMethod;
  response.body.JSON = payload;

  return response;
}

function processSingleMessage(message, destination) {
  const messageType = message.type.toLowerCase();
  let evType;
  let evName;
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
      evName = `Viewed ${message.event || message.properties.name} Screen`;
      break;
    case EventType.TRACK:
      evType = "event";
      evName = message.event;
      break;
    default:
      logger.error(`could not determine type ${messageType}`);
      throw new Error(`could not determine type ${messageType}`);
  }
  const response = responseBuilder(message, evType, evName, destination);
  return response;
}

function process(event) {
  const respList = [];
  const { message, destination } = event;
  const result = processSingleMessage(message, destination);
  if (!result.statusCode) {
    result.statusCode = 200;
  }
  respList.push(result);

  return respList;
}

exports.process = process;
