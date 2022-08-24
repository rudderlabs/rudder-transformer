const get = require("get-value");
const set = require("set-value");
const btoa = require("btoa");
const truncate = require("truncate-utf8-bytes");
const {
  EventType,
  SpecedTraits,
  TraitsMapping,
  MappedToDestinationKey
} = require("../../../constants");
const {
  adduserIdFromExternalId,
  removeUndefinedValues,
  defaultPostRequestConfig,
  defaultPutRequestConfig,
  defaultRequestConfig,
  getFieldValueFromMessage,
  getSuccessRespEvents,
  getErrorRespEvents,
  CustomError,
  addExternalIdToTraits
} = require("../../util");

const {
  IDENTITY_ENDPOINT,
  USER_EVENT_ENDPOINT,
  ANON_EVENT_ENDPOINT,
  DEVICE_REGISTER_ENDPOINT,
  DEVICE_DELETE_ENDPOINT,
  MERGE_USER_ENDPOINT
} = require("./config");
const logger = require("../../../logger");
const { isAppleFamily } = require("rudder-transformer-cdk/build/utils");

const deviceRelatedEventNames = [
  "Application Installed",
  "Application Opened",
  "Application Uninstalled"
];

const isdeviceRelatedEventName = (eventName, destination) => {
  return (
    deviceRelatedEventNames.includes(eventName) ||
    (destination.Config &&
      destination.Config.deviceTokenEventName &&
      destination.Config.deviceTokenEventName === eventName)
  );
};

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

function responseBuilder(message, evType, evName, destination, messageType) {
  const rawPayload = {};
  let endpoint;
  let trimmedEvName;
  let requestConfig = defaultPostRequestConfig;
  // override userId with externalId in context(if present) and event is mapped to destination
  const mappedToDestination = get(message, MappedToDestinationKey);
  if (mappedToDestination) {
    addExternalIdToTraits(message);
    adduserIdFromExternalId(message);
  }

  const userId = getFieldValueFromMessage(message, "userIdOnly");
  const response = defaultRequestConfig();
  response.userId = userId || message.anonymousId;
  response.headers = {
    Authorization: `Basic ${btoa(
      `${destination.Config.siteID}:${destination.Config.apiKey}`
    )}`
  };

  if (evType === EventType.IDENTIFY) {
    // if userId is not there simply drop the payload
    if (!userId) {
      throw new CustomError("userId not present", 400);
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
          const dotEscapedTrait = trait.replace(".", "\\.");
          set(
            rawPayload,
            dotEscapedTrait,
            get(message, `${pathToTraits}.${trait}`)
          );
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
    const createAt = getFieldValueFromMessage(message, "createdAtOnly");
    // set the created_at field if traits.createAt or context.traits.createAt is passed
    if (createAt) {
      set(
        rawPayload,
        "created_at",
        Math.floor(new Date(createAt).getTime() / 1000)
      );
    }

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
    // anonymous_id needs to be sent for identify calls to merge with any previous anon track calls
    if (message && message.anonymousId) {
      set(rawPayload, "anonymous_id", message.anonymousId);
    }
    endpoint = IDENTITY_ENDPOINT.replace(":id", userId);
    requestConfig = defaultPutRequestConfig;
  } else if (evType === EventType.ALIAS) {
    // ref : https://customer.io/docs/api/#operation/merge
    if (!userId && !message.previousId) {
      throw new CustomError(
        "Both userId and previousId is mandatory for merge operation",
        400
      );
    }
    endpoint = MERGE_USER_ENDPOINT;
    requestConfig = defaultPostRequestConfig;
    rawPayload.primary = {};
    rawPayload.primary.id = userId;
    rawPayload.secondary = {};
    rawPayload.secondary.id = message.previousId;
  } else {
    // any other event type except identify
    const token = get(message, "context.device.token");

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
      throw new CustomError("userId or device_token not present", 400);
    }

    // DEVICE registration
    if (isdeviceRelatedEventName(evName, destination) && userId && token) {
      const devProps = message.properties || {};
      set(devProps, "id", get(message, "context.device.token"));
      const deviceType = get(message, "context.device.type");
      if (deviceType) {
        // Ref - https://www.customer.io/docs/api/#operation/add_device
        // supported platform are "ios", "android"
        if (isAppleFamily(deviceType)) {
          set(devProps, "platform", "ios");
        } else {
          set(devProps, "platform", deviceType.toLowerCase());
        }
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
      if (isdeviceRelatedEventName(evName, destination) && token) {
        endpoint = DEVICE_REGISTER_ENDPOINT.replace(":id", userId);
      } else {
        endpoint = USER_EVENT_ENDPOINT.replace(":id", userId);
      }
    } else {
      endpoint = ANON_EVENT_ENDPOINT;
      // CustomerIO supports 100byte of event name for anonymous users
      if (messageType === EventType.SCREEN) {
        // 100 - len(`Viewed  Screen`) = 86
        trimmedEvName = `Viewed ${truncate(
          message.event || message.properties.name,
          86
        )} Screen`;
      } else {
        trimmedEvName = truncate(evName, 100);
      }
      // anonymous_id needs to be sent for anon track calls to provide information on which anon user is being tracked
      // This will help in merging for subsequent calls
      const anonymousId = message.anonymousId ? message.anonymousId : undefined;
      if (!anonymousId) {
        throw new Error("Anonymous id/ user id is required");
      } else {
        rawPayload.anonymous_id = anonymousId;
      }
      set(rawPayload, "name", trimmedEvName);
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
    case EventType.ALIAS:
      evType = "alias";
      break;
    default:
      logger.error(`could not determine type ${messageType}`);
      throw new CustomError(`could not determine type ${messageType}`, 400);
  }
  const response = responseBuilder(
    message,
    evType,
    evName,
    destination,
    messageType
  );

  // replace default domain with EU data center domainc for EU based account
  if (destination.Config.datacenterEU) {
    response.endpoint = response.endpoint.replace(
      "track.customer.io",
      "track-eu.customer.io"
    );
  }

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
          // eslint-disable-next-line no-nested-ternary
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
