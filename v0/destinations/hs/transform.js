const get = require("get-value");
const set = require("set-value");
const axios = require("axios");
const { EventType, MappedToDestinationKey } = require("../../../constants");
const {
  defaultGetRequestConfig,
  defaultPostRequestConfig,
  defaultRequestConfig,
  removeUndefinedValues,
  getFieldValueFromMessage,
  getSuccessRespEvents,
  getErrorRespEvents,
  CustomError,
  addExternalIdToTraits,
  defaultBatchRequestConfig
} = require("../../util");
const {
  ConfigCategory,
  mappingConfig,
  BATCH_CONTACT_ENDPOINT,
  MAX_BATCH_SIZE
} = require("./config");
const { getEmailAndUpdatedProps } = require("./util");

const hSIdentifyConfigJson = mappingConfig[ConfigCategory.IDENTIFY.name];

let hubSpotPropertyMap = {};

function getKey(key) {
  let modifiedKey = key.toLowerCase();
  modifiedKey = modifiedKey.replace(/\s/g, "_");
  modifiedKey = modifiedKey.replace(/\./g, "_");
  return modifiedKey;
}

async function getProperties(destination) {
  if (!hubSpotPropertyMap.length) {
    let response;
    const { apiKey } = destination.Config;
    const url = `https://api.hubapi.com/properties/v1/contacts/properties?hapikey=${apiKey}`;
    try {
      response = await axios.get(url);
    } catch (err) {
      // check if exists err.response && err.response.status else 500

      if (err.response) {
        throw new CustomError(
          JSON.stringify(err.response.data) ||
            JSON.stringify(err.response.statusText) ||
            "Failed to get hubspot properties",
          err.response.status || 500
        );
      }
      throw new CustomError(
        "Failed to get hubspot properties : indvalid response",
        500
      );
    }

    const propertyMap = {};
    response.data.forEach(element => {
      propertyMap[element.name] = element.type;
    });
    hubSpotPropertyMap = propertyMap;
  }
  return hubSpotPropertyMap;
}

async function getTransformedJSON(message, mappingJson, destination) {
  const rawPayload = {};
  const sourceKeys = Object.keys(mappingJson);
  let traits = getFieldValueFromMessage(message, "traits");
  if (!traits || !Object.keys(traits).length) {
    traits = message.properties
  }

  if (traits) {
    const traitsKeys = Object.keys(traits);
    const propertyMap = await getProperties(destination);
    sourceKeys.forEach(sourceKey => {
      if (get(traits, sourceKey)) {
        set(rawPayload, mappingJson[sourceKey], get(traits, sourceKey));
      }
    });
    traitsKeys.forEach(traitsKey => {
      const hsSupportedKey = getKey(traitsKey);
      if (!rawPayload[traitsKey] && propertyMap[hsSupportedKey]) {
        let propValue = traits[traitsKey];
        if (propertyMap[hsSupportedKey] === "date") {
          const time = propValue;
          const date = new Date(time);
          date.setUTCHours(0, 0, 0, 0);
          propValue = date.getTime();
        }
        rawPayload[hsSupportedKey] = propValue;
      }
    });
  }
  return { ...rawPayload };
}

function getPropertyValueForIdentify(propMap) {
  return Object.keys(propMap).map(key => {
    return { property: key, value: propMap[key] };
  });
}

function responseBuilderSimple(payload, message, eventType, destination) {
  let endpoint = "https://track.hubspot.com/v1/event";
  let params = {};

  const response = defaultRequestConfig();
  response.method = defaultGetRequestConfig.requestMethod;

  if (eventType !== EventType.TRACK) {
    const traits = getFieldValueFromMessage(message, "traits");
    const { email } = traits;
    const { apiKey } = destination.Config;
    params = { hapikey: apiKey };
    if (email) {
      endpoint = `https://api.hubapi.com/contacts/v1/contact/createOrUpdate/email/${email}`;
    } else {
      endpoint = "https://api.hubapi.com/contacts/v1/contact";
    }
    response.method = defaultPostRequestConfig.requestMethod;
    response.body.JSON = removeUndefinedValues(payload);
  } else {
    params = removeUndefinedValues(payload);
  }
  response.headers = {
    "Content-Type": "application/json"
  };
  response.endpoint = endpoint;
  response.userId = message.anonymousId;
  response.params = params;
  response.statusCode = 200;

  return response;
}

async function processTrack(message, destination) {
  const parameters = {
    _a: destination.Config.hubID,
    _n: message.event
  };

  if (
    message.properties &&
    (message.properties.revenue || message.properties.value)
  ) {
    // eslint-disable-next-line dot-notation
    parameters["_m"] = message.properties.revenue || message.properties.value;
  }
  const userProperties = await getTransformedJSON(
    message,
    hSIdentifyConfigJson,
    destination
  );

  return responseBuilderSimple(
    { ...parameters, ...userProperties },
    message,
    EventType.TRACK,
    destination
  );
}

// function handleError(message) {
//   throw new Error(message);
// }

async function processIdentify(message, destination) {
  const traits = getFieldValueFromMessage(message, "traits");
  const mappedToDestination = get(message, MappedToDestinationKey)
  //If mapped to destination, Add externalId to traits
  if(mappedToDestination) {
    addExternalIdToTraits(message);
  }

  if (!traits || !traits.email) {
    throw new CustomError("Identify without email is not supported.", 400);
  }
  const userProperties = await getTransformedJSON(
    message,
    hSIdentifyConfigJson,
    destination
  );
  const properties = getPropertyValueForIdentify(userProperties);
  return responseBuilderSimple(
    { properties },
    message,
    EventType.IDENTIFY,
    destination
  );
}

async function processSingleMessage(message, destination) {
  let response;

  if (!message.type) {
    throw new CustomError("message type not present", 400);
  }

  switch (message.type) {
    case EventType.TRACK:
      response = await processTrack(message, destination);
      break;
    case EventType.IDENTIFY:
      response = await processIdentify(message, destination);
      break;
    default:
      throw new CustomError(
        `message type ${message.type} is not supported`,
        400
      );
  }

  return response;
}

function process(event) {
  return processSingleMessage(event.message, event.destination);
}

function batchEvents(destEvents) {
  const batchedResponseList = [];
  const trackResponseList = [];
  let eventsChunk = [];
  const arrayChunksIdentify = [];
  destEvents.forEach((event, index) => {
    // handler for track call
    if (event.message.method === "GET") {
      const { message, metadata, destination } = event;
      const endpoint = get(message, "endpoint");

      const batchedResponse = defaultBatchRequestConfig();
      batchedResponse.batchedRequest.headers = message.headers;
      batchedResponse.batchedRequest.endpoint = endpoint;
      batchedResponse.batchedRequest.body = message.body;
      batchedResponse.batchedRequest.params = message.params;
      batchedResponse.batchedRequest.method =
        defaultGetRequestConfig.requestMethod;
      batchedResponse.metadata = [metadata];
      batchedResponse.destination = destination;

      trackResponseList.push(
        getSuccessRespEvents(
          batchedResponse.batchedRequest,
          batchedResponse.metadata,
          batchedResponse.destination
        )
      );
    } else {
      eventsChunk.push(event);
    }
    if (
      eventsChunk.length &&
      (eventsChunk.length === MAX_BATCH_SIZE || index === destEvents.length - 1)
    ) {
      arrayChunksIdentify.push(eventsChunk);
      eventsChunk = [];
    }
  });

  // list of chunks [ [..], [..] ]
  arrayChunksIdentify.forEach(chunk => {
    const identifyResponseList = [];
    const metadata = [];

    // extracting destination, apiKey value
    // from the first event in a batch
    const { destination } = chunk[0];
    const { apiKey } = destination.Config;
    const params = { hapikey: apiKey };

    let batchEventResponse = defaultBatchRequestConfig();

    chunk.forEach(ev => {
      const { email, updatedProperties } = getEmailAndUpdatedProps(
        ev.message.body.JSON.properties
      );
      ev.message.body.JSON.properties = updatedProperties;
      identifyResponseList.push({
        email,
        properties: ev.message.body.JSON.properties
      });
      metadata.push(ev.metadata);
    });

    batchEventResponse.batchedRequest.body.JSON_ARRAY = {
      batch: JSON.stringify(identifyResponseList)
    };

    batchEventResponse.batchedRequest.endpoint = BATCH_CONTACT_ENDPOINT;
    batchEventResponse.batchedRequest.headers = {
      "Content-Type": "application/json"
    };
    batchEventResponse.batchedRequest.params = params;
    batchEventResponse = {
      ...batchEventResponse,
      metadata,
      destination
    };
    batchedResponseList.push(
      getSuccessRespEvents(
        batchEventResponse.batchedRequest,
        batchEventResponse.metadata,
        batchEventResponse.destination,
        true
      )
    );
  });

  return batchedResponseList.concat(trackResponseList);
}

const processRouterDest = async inputs => {
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }

  const successRespList = [];
  const errorRespList = [];
  // using the first destination config for transforming the batch
  const { destination } = inputs[0];
  await Promise.all(
    inputs.map(async input => {
      try {
        if (input.message.statusCode) {
          // already transformed event
          successRespList.push({
            message: input.message,
            metadata: input.metadata,
            destination
          });
        } else {
          // event is not transformed
          successRespList.push({
            message: await processSingleMessage(input.message, destination),
            metadata: input.metadata,
            destination
          });
        }

        // event is not transformed
        return getSuccessRespEvents(
          await processSingleMessage(input.message, input.destination),
          [input.metadata],
          input.destination
        );
      } catch (error) {
        errorRespList.push(
          getErrorRespEvents(
            [input.metadata],
            error.response ? error.response.status : 400,
            error.message || "Error occurred while processing payload."
          )
        );
      }
    })
  );

  let batchedResponseList = [];
  if (successRespList.length) {
    batchedResponseList = await batchEvents(successRespList);
  }
  return [...batchedResponseList, ...errorRespList];
};

module.exports = { process, processRouterDest };
