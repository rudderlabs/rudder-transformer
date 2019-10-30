const _ = require("lodash");
const get = require("get-value");
const set = require("set-value");
const btoa = require("btoa");

const { EventType, SpecedTraits, TraitsMapping } = require("../../constants");
const {
  removeUndefinedValues,
  defaultPostRequestConfig,
  defaultPutRequestConfig,
  isPrimitive
} = require("../util");

const {
  IDENTITY_ENDPOINT,
  USER_EVENT_ENDPOINT,
  ANON_EVENT_ENDPOINT
} = require("./config");

// Get the spec'd traits, for now only address needs treatment as 2 layers.
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
  let userId = message.userId ? message.userId : message.anonymousId;

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
      rawPayload.data = {};

      // use this if only top level keys are to be sent

      /* const eventProps = Object.keys(message.properties);
      eventProps.forEach(prop => {
        let val = get(message, "properties." + prop);
        if (isPrimitive(val)) {
          set(rawPayload.data, prop, val);
        }
      }); */

      set(rawPayload, "data", message.properties);
    }

    set(rawPayload, "name", evName);
    set(rawPayload, "type", evType);

    if (userId) {
      endpoint = USER_EVENT_ENDPOINT.replace(":id", userId);
    } else {
      return { statusCode: 400, error: "userId not present" };
    }
  }
  const payload = removeUndefinedValues(rawPayload);
  //console.log(payload);
  const response = {
    endpoint: endpoint,
    requestConfig: requestConfig,
    header: {
      "Content-Type": "application/json",
      Authorization:
        "Basic " +
        btoa(destination.Config.siteID + ":" + destination.Config.apiKey)
    },
    payload: payload
  };
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
