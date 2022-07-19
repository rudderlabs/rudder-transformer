const get = require("get-value");
const { isEmpty } = require("lodash");
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
  getDestinationExternalID,
  constructPayload
} = require("../../util");
const {
  BATCH_CONTACT_ENDPOINT,
  MAX_BATCH_SIZE,
  TRACK_ENDPOINT,
  IDENTIFY_CREATE_UPDATE_CONTACT,
  IDENTIFY_CREATE_NEW_CONTACT,
  hsCommonConfigJson,
  IDENTIFY_CRM_UPDATE_NEW_CONTACT,
  IDENTIFY_CRM_CREATE_NEW_CONTACT,
  MAX_BATCH_SIZE_CRM_CONTACT,
  BATCH_IDENTIFY_CRM_CREATE_NEW_CONTACT,
  BATCH_IDENTIFY_CRM_UPDATE_NEW_CONTACT,
  mappingConfig,
  ConfigCategory,
  TRACK_CRM_ENDPOINT
} = require("./config");
const {
  getTraits,
  getProperties,
  getTransformedJSON,
  getEmailAndUpdatedProps,
  formatPropertyValueForIdentify,
  searchContacts,
  getCRMUpdatedProps,
  getEventAndPropertiesFromConfig
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

  // if (!traits || !traits.email) {
  //   throw new CustomError(
  //     "[HS]:: Identify without email is not supported.",
  //     400
  //   );
  // }

  let contactId = getDestinationExternalID(message, "hsContactId");

  if (!contactId) {
    contactId = await searchContacts(message, destination);
    if (!contactId && traits.email) {
      contactId = await searchContacts(message, destination, "email");
    }
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

  let endpoint;
  if (contactId) {
    // update
    endpoint = IDENTIFY_CRM_UPDATE_NEW_CONTACT.replace(":contactId", contactId);
  } else {
    // create
    endpoint = IDENTIFY_CRM_CREATE_NEW_CONTACT;
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
const processTrack = async (message, destination) => {
  const { Config } = destination;

  let payload = constructPayload(
    message,
    mappingConfig[ConfigCategory.TRACK.name]
  );

  payload = getEventAndPropertiesFromConfig(message, destination, payload);

  payload.properties = {
    ...payload.properties,
    ...constructPayload(
      message,
      mappingConfig[ConfigCategory.TRACK_PROPERTIES.name]
    )
  };

  if (!payload.email && !payload.utk && !payload.contactId) {
    throw new CustomError(
      "[HS]:: either of email, utk or contactId is required for custom behavioral events",
      400
    );
  }

  const response = defaultRequestConfig();
  response.endpoint = TRACK_CRM_ENDPOINT;
  response.method = defaultPostRequestConfig.requestMethod;
  response.headers = {
    "Content-Type": "application/json"
  };
  response.body.JSON = removeUndefinedAndNullValues(payload);

  // choosing API Type
  if (Config.authorizationType === "newPrivateAppApi") {
    // remove hubId
    // eslint-disable-next-line no-underscore-dangle
    response.headers = {
      ...response.headers,
      Authorization: `Bearer ${Config.accessToken}`
    };
  } else {
    // using legacyApiKey
    response.endpoint = `${TRACK_CRM_ENDPOINT}?hapikey=${Config.hapikey}`;
  }

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

const batchIdentify = (
  arrayChunksIdentify,
  batchedResponseList,
  batchOperation
) => {
  // list of chunks [ [..], [..] ]
  arrayChunksIdentify.forEach(chunk => {
    const identifyResponseList = [];
    const metadata = [];

    // extracting message, destination value
    // from the first event in a batch
    const { message, destination } = chunk[0];

    let batchEventResponse = defaultBatchRequestConfig();

    if (batchOperation === "create") {
      // create operation
      chunk.forEach(ev => {
        // format properties into batch structure
        // eslint-disable-next-line no-param-reassign
        ev.message.body.JSON.properties = getCRMUpdatedProps(
          ev.message.body.JSON.properties
        );

        // duplicate email can cause issue with create in batch
        // updating the existing one to avoid duplicate
        // as same event can fire in batch one of the reason
        // can be due to network lag or processor being busy
        const isDuplicate = identifyResponseList.find(data => {
          return (
            data.properties.email === ev.message.body.JSON.properties.email
          );
        });
        if (!isEmpty(isDuplicate)) {
          // array is being shallow copied hence changes are affecting the original reference
          isDuplicate.properties = ev.message.body.JSON.properties;
        } else {
          // appending unique events
          identifyResponseList.push({
            properties: ev.message.body.JSON.properties
          });
        }
        metadata.push(ev.metadata);
      });
    } else {
      // update operation
      chunk.forEach(ev => {
        // eslint-disable-next-line no-param-reassign
        ev.message.body.JSON.properties = getCRMUpdatedProps(
          ev.message.body.JSON.properties
        );
        // update has id and properties
        const id = ev.message.endpoint.split("/").pop();

        // duplicate contactId is not allowed in batch
        // updating the existing one to avoid duplicate
        // as same event can fire in batch one of the reason
        // can be due to network lag or processor being busy
        const isDuplicate = identifyResponseList.find(data => {
          return data.id === id;
        });
        if (!isEmpty(isDuplicate)) {
          isDuplicate.properties = ev.message.body.JSON.properties;
        } else {
          // appending unique events
          identifyResponseList.push({
            id,
            properties: ev.message.body.JSON.properties
          });
        }
        metadata.push(ev.metadata);
      });
    }

    batchEventResponse.batchedRequest.body.JSON = {
      inputs: identifyResponseList
    };

    if (batchOperation === "create") {
      batchEventResponse.batchedRequest.endpoint = BATCH_IDENTIFY_CRM_CREATE_NEW_CONTACT;
    } else {
      batchEventResponse.batchedRequest.endpoint = BATCH_IDENTIFY_CRM_UPDATE_NEW_CONTACT;
    }
    batchEventResponse.batchedRequest.headers = message.headers;
    batchEventResponse.batchedRequest.params = message.params;

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

  return batchedResponseList;
};

const batchEvents = destEvents => {
  let batchedResponseList = [];
  const trackResponseList = [];
  let createContactEventsChunk = [];
  let updateContactEventsChunk = [];
  const arrayChunksIdentifyCreateContact = [];
  const arrayChunksIdentifyUpdateContact = [];
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
    } else if (
      event.message.endpoint ===
      "https://api.hubapi.com/crm/v3/objects/contacts"
    ) {
      // Identify: making chunks for CRM create contact endpoint
      createContactEventsChunk.push(event);
    } else {
      // Identify: making chunks for CRM update contact endpoint
      updateContactEventsChunk.push(event);
    }

    // CRM create contact endpoint chunks
    if (
      createContactEventsChunk.length &&
      (createContactEventsChunk.length === MAX_BATCH_SIZE_CRM_CONTACT ||
        index === destEvents.length - 1)
    ) {
      arrayChunksIdentifyCreateContact.push(createContactEventsChunk);
      createContactEventsChunk = [];
    }

    // CRM update contact endpoint chunks
    if (
      updateContactEventsChunk.length &&
      (updateContactEventsChunk.length === MAX_BATCH_SIZE_CRM_CONTACT ||
        index === destEvents.length - 1)
    ) {
      arrayChunksIdentifyUpdateContact.push(updateContactEventsChunk);
      updateContactEventsChunk = [];
    }
  });

  // batching up 'create' contact endpoint chunks
  if (arrayChunksIdentifyCreateContact.length) {
    batchedResponseList = batchIdentify(
      arrayChunksIdentifyCreateContact,
      batchedResponseList,
      "create"
    );
  }

  // batching up 'update' contact endpoint chunks
  if (arrayChunksIdentifyUpdateContact.length) {
    batchedResponseList = batchedResponseList.concat(
      batchIdentify(
        arrayChunksIdentifyUpdateContact,
        batchedResponseList,
        "update"
      )
    );
  }

  return batchedResponseList.concat(trackResponseList);
};

const legacyBatchEvents = destEvents => {
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
    if (destination.Config.apiVersion === "newApi") {
      batchedResponseList = await batchEvents(successRespList);
    } else {
      batchedResponseList = await legacyBatchEvents(successRespList);
    }
  }
  return [...batchedResponseList, ...errorRespList];
};

module.exports = { process, processRouterDest };
