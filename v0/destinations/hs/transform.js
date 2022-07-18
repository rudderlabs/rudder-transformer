const get = require("get-value");
const { EventType, MappedToDestinationKey } = require("../../../constants");
const {
  defaultGetRequestConfig,
  defaultPostRequestConfig,
  defaultRequestConfig,
  getFieldValueFromMessage,
  getSuccessRespEvents,
  getErrorRespEvents,
  CustomError,
  addExternalIdToTraits,
  defaultBatchRequestConfig,
  removeUndefinedAndNullValues,
  getDestinationExternalID
} = require("../../util");
const {
  BATCH_CONTACT_ENDPOINT,
  MAX_BATCH_SIZE,
  TRACK_ENDPOINT,
  IDENTIFY_CREATE_UPDATE_CONTACT,
  IDENTIFY_CREATE_NEW_CONTACT,
  hsCommonConfigJson
} = require("./config");
const {
  getTraits,
  getProperties,
  getTransformedJSON,
  getEmailAndUpdatedProps,
  formatPropertyValueForIdentify
} = require("./util");

/**
 * Using New API
 * Ref - https://developers.hubspot.com/docs/api/crm/contacts
 * @param {*} message
 * @param {*} destination
 * @param {*} propertyMap
 * @returns
 */
const processIdentify = async (message, destination, propertyMap) => {
  const { Config } = destination;
  const traits = getFieldValueFromMessage(message, "traits");
  const mappedToDestination = get(message, MappedToDestinationKey);
  // if mappedToDestination is set true, then add externalId to traits
  if (mappedToDestination) {
    addExternalIdToTraits(message);
  }

  if (!traits || !traits.email) {
    throw new CustomError(
      "[HS]:: Identify without email is not supported.",
      400
    );
  }

  const userProperties = await getTransformedJSON(
    message,
    hsCommonConfigJson,
    destination,
    propertyMap
  );

  const payload = {
    properties: formatPropertyValueForIdentify(userProperties)
  };

  const { email } = traits;
  let endpoint;
  if (email) {
    endpoint = IDENTIFY_CREATE_UPDATE_CONTACT.replace(":contact_email", email);
  } else {
    endpoint = IDENTIFY_CREATE_NEW_CONTACT;
  }

  const response = defaultRequestConfig();
  response.endpoint = endpoint;
  response.method = defaultPostRequestConfig.requestMethod;
  response.headers = {
    "Content-Type": "application/json"
  };
  response.body.JSON = removeUndefinedAndNullValues(payload);

  // choosing API Type
  if (Config.authorizationType === "newPrivateAppApi") {
    // Private Apps
    response.headers = {
      ...response.headers,
      Authorization: `Bearer ${Config.accessToken}`
    };
  } else {
    // API Key
    response.params = { hapikey: Config.apiKey };
  }

  return response;
};

/**
 * using legacy API
 * Reference:
 * https://legacydocs.hubspot.com/docs/methods/contacts/create_contact
 * https://legacydocs.hubspot.com/docs/methods/contacts/create_or_update
 * @param {*} message
 * @param {*} destination
 * @param {*} propertyMap
 * @returns
 */
const processLegacyIdentify = async (message, destination, propertyMap) => {
  const { Config } = destination;
  const traits = getFieldValueFromMessage(message, "traits");
  const mappedToDestination = get(message, MappedToDestinationKey);
  // if mappedToDestination is set true, then add externalId to traits
  if (mappedToDestination) {
    addExternalIdToTraits(message);
  }

  if (!traits || !traits.email) {
    throw new CustomError(
      "[HS]:: Identify without email is not supported.",
      400
    );
  }

  const userProperties = await getTransformedJSON(
    message,
    hsCommonConfigJson,
    destination,
    propertyMap
  );

  const payload = {
    properties: formatPropertyValueForIdentify(userProperties)
  };

  const { email } = traits;
  let endpoint;
  if (email) {
    endpoint = IDENTIFY_CREATE_UPDATE_CONTACT.replace(":contact_email", email);
  } else {
    endpoint = IDENTIFY_CREATE_NEW_CONTACT;
  }

  const response = defaultRequestConfig();
  response.endpoint = endpoint;
  response.method = defaultPostRequestConfig.requestMethod;
  response.headers = {
    "Content-Type": "application/json"
  };
  response.body.JSON = removeUndefinedAndNullValues(payload);

  // choosing API Type
  if (Config.authorizationType === "newPrivateAppApi") {
    // Private Apps
    response.headers = {
      ...response.headers,
      Authorization: `Bearer ${Config.accessToken}`
    };
  } else {
    // API Key
    response.params = { hapikey: Config.apiKey };
  }

  return response;
};

// using new API
const processTrack = async (message, destination, propertyMap) => {
  const { Config } = destination;
  let parameters = {
    _a: destination.Config.hubID,
    _n: message.event,
    _m: get(message, "properties.revenue") || get(message, "properties.value"),
    id: getDestinationExternalID(message, "hubspotId")
  };

  parameters = removeUndefinedAndNullValues(parameters);
  const userProperties = await getTransformedJSON(
    message,
    hsCommonConfigJson,
    destination,
    propertyMap
  );

  const payload = { ...parameters, ...userProperties };
  const params = removeUndefinedAndNullValues(payload);

  const response = defaultRequestConfig();
  response.endpoint = TRACK_ENDPOINT;
  response.method = defaultGetRequestConfig.requestMethod;
  response.headers = {
    "Content-Type": "application/json"
  };

  // choosing API Type
  if (Config.authorizationType === "newPrivateAppApi") {
    // remove hubId
    // eslint-disable-next-line no-underscore-dangle
    delete params._a;
    response.headers = {
      ...response.headers,
      Authorization: `Bearer ${Config.accessToken}`
    };
  }
  response.params = params;

  return response;
};

/**
 * using legacy API
 * Ref - https://legacydocs.hubspot.com/docs/methods/enterprise_events/http_api
 * @param {*} message
 * @param {*} destination
 * @param {*} propertyMap
 * @returns
 */
const processLegacyTrack = async (message, destination, propertyMap) => {
  const { Config } = destination;
  let parameters = {
    _a: Config.hubID,
    _n: message.event,
    _m: get(message, "properties.revenue") || get(message, "properties.value"),
    id: getDestinationExternalID(message, "hubspotId")
  };

  parameters = removeUndefinedAndNullValues(parameters);
  const userProperties = await getTransformedJSON(
    message,
    hsCommonConfigJson,
    destination,
    propertyMap
  );

  const payload = { ...parameters, ...userProperties };
  const params = removeUndefinedAndNullValues(payload);

  const response = defaultRequestConfig();
  response.endpoint = TRACK_ENDPOINT;
  response.method = defaultGetRequestConfig.requestMethod;
  response.headers = {
    "Content-Type": "application/json"
  };

  // choosing API Type
  if (Config.authorizationType === "newPrivateAppApi") {
    // eslint-disable-next-line no-underscore-dangle
    delete params._a;
    response.headers = {
      ...response.headers,
      Authorization: `Bearer ${Config.accessToken}`
    };
  }
  response.params = params;

  return response;
};

const processSingleMessage = async (message, destination, propertyMap) => {
  if (!message.type) {
    throw new CustomError(
      "Message type is not present. Aborting message.",
      400
    );
  }

  let response;
  switch (message.type) {
    case EventType.IDENTIFY:
      if (destination.Config.apiVersion === "newApi") {
        response = await processIdentify(message, destination, propertyMap);
      } else {
        response = await processLegacyIdentify(
          message,
          destination,
          propertyMap
        );
      }
      break;
    case EventType.TRACK:
      if (destination.Config.apiVersion === "newApi") {
        response = await processTrack(message, destination, propertyMap);
      } else {
        response = await processLegacyTrack(message, destination, propertyMap);
      }
      break;
    default:
      throw new CustomError(
        `Message type ${message.type} is not supported`,
        400
      );
  }

  return response;
};

// has been deprecated - using routerTransform for both the versions
const process = event => {
  return processSingleMessage(event.message, event.destination);
};

const batchEvents = destEvents => {
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
      // making chunks for identify
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
    const { Config } = destination;

    let batchEventResponse = defaultBatchRequestConfig();

    chunk.forEach(ev => {
      const { email, updatedProperties } = getEmailAndUpdatedProps(
        ev.message.body.JSON.properties
      );
      // eslint-disable-next-line no-param-reassign
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

    // choosing API Type
    if (Config.authorizationType === "newPrivateAppApi") {
      // Private Apps
      batchEventResponse.batchedRequest.headers = {
        ...batchEventResponse.batchedRequest.headers,
        Authorization: `Bearer ${Config.accessToken}`
      };
    } else {
      // API Key
      batchEventResponse.batchedRequest.params = { hapikey: Config.apiKey };
    }

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
};

// we are batching by default at routerTransform
const processRouterDest = async inputs => {
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }

  const successRespList = [];
  const errorRespList = [];
  // using the first destination config for transforming the batch
  const { destination } = inputs[0];
  // reduce the no. of calls for properties endpoint
  let propertyMap;
  const traitsFound = inputs.some(input => {
    return getTraits(input.message) !== undefined;
  });
  if (traitsFound) {
    propertyMap = await getProperties(destination);
  }
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
            message: await processSingleMessage(
              input.message,
              destination,
              propertyMap
            ),
            metadata: input.metadata,
            destination
          });
        }
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
