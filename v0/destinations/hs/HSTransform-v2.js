const get = require("get-value");
const _ = require("lodash");
const { MappedToDestinationKey } = require("../../../constants");
const {
  defaultGetRequestConfig,
  defaultPostRequestConfig,
  defaultRequestConfig,
  getFieldValueFromMessage,
  getSuccessRespEvents,
  CustomError,
  addExternalIdToTraits,
  defaultBatchRequestConfig,
  removeUndefinedAndNullValues,
  getDestinationExternalID,
  constructPayload,
  isDefinedAndNotNullAndNotEmpty,
  getDestinationExternalIDInfoForRetl
} = require("../../util");
const {
  hsCommonConfigJson,
  IDENTIFY_CRM_UPDATE_NEW_CONTACT,
  IDENTIFY_CRM_CREATE_NEW_CONTACT,
  MAX_BATCH_SIZE_CRM_CONTACT,
  BATCH_IDENTIFY_CRM_CREATE_NEW_CONTACT,
  BATCH_IDENTIFY_CRM_UPDATE_NEW_CONTACT,
  mappingConfig,
  ConfigCategory,
  TRACK_CRM_ENDPOINT,
  CRM_CREATE_UPDATE_ALL_OBJECTS,
  MAX_BATCH_SIZE_CRM_OBJECT,
  BATCH_CREATE_CUSTOM_OBJECTS
} = require("./config");
const {
  getTransformedJSON,
  formatPropertyValueForIdentify,
  searchContacts,
  getCRMUpdatedProps,
  getEventAndPropertiesFromConfig,
  getHsSearchId
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
  const checkLookup = get(message, "context.hubspotOperation");
  // build response
  let endpoint;
  const response = defaultRequestConfig();
  // if mappedToDestination is set true, then add externalId to traits
  if (mappedToDestination && checkLookup) {
    addExternalIdToTraits(message);
    const { objectType } = getDestinationExternalIDInfoForRetl(message, "HS");
    if (checkLookup === "create") {
      endpoint = CRM_CREATE_UPDATE_ALL_OBJECTS.replace(
        ":objectType",
        objectType
      );
    } else if (checkLookup === "update" && getHsSearchId(message)) {
      const { hsSearchId } = getHsSearchId(message);
      endpoint = `${CRM_CREATE_UPDATE_ALL_OBJECTS.replace(
        ":objectType",
        objectType
      )}/${hsSearchId}`;
    }
    response.body.JSON = removeUndefinedAndNullValues({ properties: traits });
    response.source = "rETL";
  } else {
    if (!traits || !traits.email) {
      throw new CustomError(
        "[HS]:: Identify without email is not supported.",
        400
      );
    }

    if (!Config.lookupField) {
      throw new CustomError(
        "lookupField is a required field in webapp config",
        400
      );
    }

    let contactId = getDestinationExternalID(message, "hsContactId");

    if (!contactId) {
      contactId = await searchContacts(message, destination);
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

    // for rETL source support for custom objects
    // Ref - https://developers.hubspot.com/docs/api/crm/crm-custom-objects

    if (contactId) {
      // update
      endpoint = IDENTIFY_CRM_UPDATE_NEW_CONTACT.replace(
        ":contactId",
        contactId
      );
    } else {
      // create
      endpoint = IDENTIFY_CRM_CREATE_NEW_CONTACT;
    }
    response.body.JSON = removeUndefinedAndNullValues(payload);
  }

  response.endpoint = endpoint;
  response.method = defaultPostRequestConfig.requestMethod;
  response.headers = {
    "Content-Type": "application/json"
  };

  // choosing API Type
  if (Config.authorizationType === "newPrivateAppApi") {
    // Private Apps
    response.headers = {
      ...response.headers,
      Authorization: `Bearer ${Config.accessToken}`
    };
  } else {
    // use legacy API Key
    response.params = { hapikey: Config.apiKey };
  }
  return response;
};

/**
 * CRM API
 * Associations v3
 * here we are associating objectType to contact only
 * Ref - https://developers.hubspot.com/docs/api/crm/associations/v3
 * @param {*} message
 * @param {*} destination
 * @param {*} propertyMap
 */
// const processCRMCustomObjects = async (message, destination, traits) => {
//   const { Config } = destination;
//   let response = {};

//   const { contactId, qualifiedName, objects } = traits.hubspot;
//   if (!contactId) {
//     throw new Error(
//       "HubSpot contactId is not provided. Aborting custom-object association",
//       400
//     );
//   }

//   if (!qualifiedName) {
//     throw new Error(
//       "HubSpot qualifiedName is not provided. Aborting custom-object association",
//       400
//     );
//   }

//   if (!objects || !Array.isArray(objects) || objects.length === 0) {
//     throw new Error(
//       "HubSpot objects are not provided.  Aborting custom-object association",
//       400
//     );
//   }

//   const endpoint = CRM_ASSOCIATION_V3.replace(
//     ":fromObjectType",
//     qualifiedName
//   ).replace(":toObjectType", "contact");

//   const inputs = [];
//   objects.forEach(item => {
//     inputs.push({
//       from: { id: item.objectId },
//       to: { id: contactId },
//       type: `${item.objectType}_to_contact`
//     });
//   });

//   // creating response
//   response = defaultRequestConfig();
//   response.endpoint = endpoint;
//   response.headers = {
//     "Content-Type": "application/json"
//   };
//   response.body.JSON = { inputs };

//   // choosing API Type
//   if (Config.authorizationType === "newPrivateAppApi") {
//     // Private Apps
//     response.headers = {
//       ...response.headers,
//       Authorization: `Bearer ${Config.accessToken}`
//     };
//   } else {
//     // use legacy API Key
//     response.params = { hapikey: Config.apiKey };
//   }

//   return response;
// };

/**
 * using New API
 * Ref - https://developers.hubspot.com/docs/api/analytics/events
 * @param {*} message
 * @param {*} destination
 * @returns
 */
const processTrack = async (message, destination) => {
  const { Config } = destination;

  let payload = constructPayload(
    message,
    mappingConfig[ConfigCategory.TRACK.name]
  );

  // fetch event name and its properties from config (webapp) and put it in final payload
  payload = getEventAndPropertiesFromConfig(message, destination, payload);

  // append track mapping.json along with properties fetched from webapp
  payload.properties = {
    ...payload.properties,
    ...constructPayload(
      message,
      mappingConfig[ConfigCategory.TRACK_PROPERTIES.name]
    )
  };

  // either of email or utk or contactId should be present
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
        if (isDefinedAndNotNullAndNotEmpty(isDuplicate)) {
          // array is being shallow copied hence changes are affecting the original reference
          // basically rewriting the same value to avoid duplicate entry
          isDuplicate.properties = ev.message.body.JSON.properties;
        } else {
          // appending unique events
          identifyResponseList.push({
            properties: ev.message.body.JSON.properties
          });
        }
        metadata.push(ev.metadata);
      });
    } else if (batchOperation === "update") {
      // update operation
      chunk.forEach(ev => {
        // eslint-disable-next-line no-param-reassign
        ev.message.body.JSON.properties = getCRMUpdatedProps(
          ev.message.body.JSON.properties
        );
        // update has contactId and properties
        // extract contactId from the end of the endpoint
        const id = ev.message.endpoint.split("/").pop();

        // duplicate contactId is not allowed in batch
        // updating the existing one to avoid duplicate
        // as same event can fire in batch one of the reason
        // can be due to network lag or processor being busy
        const isDuplicate = identifyResponseList.find(data => {
          return data.id === id;
        });
        if (isDefinedAndNotNullAndNotEmpty(isDuplicate)) {
          // rewriting the same value to avoid duplicate entry
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
    } else if (batchOperation === "general") {
      // general identify event

      /* Note: */
      // for now it is just HS CRM custom objects however later it can be
      // refactored to accomodate upcoming endpoint and make necessary changes

      chunk.forEach(ev => {
        // if source is of rETL
        if (ev.message.source === "rETL") {
          identifyResponseList.push({ ...ev.message.body.JSON });
          metadata.push(ev.metadata);
        }
      });

      // CRM_CREATE_CUSTOM_OBJECTS has objectType value
      // extract objectType from the end of the endpoint
      const objectType = chunk[0].message.endpoint.split("/").pop();

      batchEventResponse.batchedRequest.endpoint = BATCH_CREATE_CUSTOM_OBJECTS.replace(
        ":objectType",
        objectType
      );
    }

    batchEventResponse.batchedRequest.body.JSON = {
      inputs: identifyResponseList
    };

    if (batchOperation === "create") {
      batchEventResponse.batchedRequest.endpoint = BATCH_IDENTIFY_CRM_CREATE_NEW_CONTACT;
    } else if (batchOperation === "update") {
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
  // create contact chunck
  const createContactEventsChunk = [];
  // update contact chunk
  const updateContactEventsChunk = [];
  // general indentify event chunk
  const eventsChunk = [];
  destEvents.forEach(event => {
    // handler for track call
    // track call does not have batch endpoint
    if (event.message.endpoint.includes("/events/v3/send")) {
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
    } else if (
      event.message.endpoint ===
      "https://api.hubapi.com/crm/v3/objects/contacts/"
    ) {
      // Identify: making chunks for CRM update contact endpoint
      updateContactEventsChunk.push(event);
    } else {
      eventsChunk.push(event);
    }
  });

  // eventChunks = [[e1,e2,e3,..batchSize],[e1,e2,e3,..batchSize]..]
  // CRM create contact endpoint chunks
  const arrayChunksIdentifyCreateContact = _.chunk(
    createContactEventsChunk,
    MAX_BATCH_SIZE_CRM_CONTACT
  );
  // CRM update contact endpoint chunks
  const arrayChunksIdentifyUpdateContact = _.chunk(
    updateContactEventsChunk,
    MAX_BATCH_SIZE_CRM_CONTACT
  );
  // general identify chunks
  const arrayChunksIdentify = _.chunk(eventsChunk, MAX_BATCH_SIZE_CRM_OBJECT);

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

  // batching up 'general' identify endpoint chunks
  if (arrayChunksIdentify.length) {
    batchedResponseList = batchedResponseList.concat(
      batchIdentify(arrayChunksIdentify, batchedResponseList, "general")
    );
  }

  return batchedResponseList.concat(trackResponseList);
};

module.exports = { processIdentify, processTrack, batchEvents };
