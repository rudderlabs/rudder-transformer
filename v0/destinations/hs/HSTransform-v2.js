const get = require("get-value");
const _ = require("lodash");
const {
  MappedToDestinationKey,
  GENERIC_TRUE_VALUES
} = require("../../../constants");
const {
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
  IDENTIFY_CRM_UPDATE_CONTACT,
  IDENTIFY_CRM_CREATE_NEW_CONTACT,
  MAX_BATCH_SIZE_CRM_CONTACT,
  BATCH_IDENTIFY_CRM_CREATE_NEW_CONTACT,
  BATCH_IDENTIFY_CRM_UPDATE_CONTACT,
  mappingConfig,
  ConfigCategory,
  TRACK_CRM_ENDPOINT,
  CRM_CREATE_CUSTOM_OBJECTS,
  MAX_BATCH_SIZE_CRM_OBJECT,
  BATCH_CREATE_CUSTOM_OBJECTS
} = require("./config");
const {
  getTransformedJSON,
  searchContacts,
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
  if (
    mappedToDestination &&
    GENERIC_TRUE_VALUES.includes(mappedToDestination.toString())
  ) {
    addExternalIdToTraits(message);
  }

  if (!Config.lookupField) {
    throw new CustomError(
      "lookupField is a required field in webapp config",
      400
    );
  }

  // build response
  let endpoint;
  const response = defaultRequestConfig();

  // for rETL source support for custom objects
  // Ref - https://developers.hubspot.com/docs/api/crm/crm-custom-objects
  if (
    mappedToDestination &&
    GENERIC_TRUE_VALUES.includes(mappedToDestination.toString())
  ) {
    // rETL
    const { objectType } = getDestinationExternalIDInfoForRetl(message, "HS");
    if (!objectType) {
      throw new CustomError("objectType not found", 400);
    }
    endpoint = CRM_CREATE_CUSTOM_OBJECTS.replace(":objectType", objectType);
    response.body.JSON = removeUndefinedAndNullValues({ properties: traits });
    response.source = "rETL";
  } else {
    let contactId = getDestinationExternalID(message, "hsContactId");

    // if contactId is not provided then search
    if (!contactId) {
      contactId = await searchContacts(message, destination);
    }

    const properties = await getTransformedJSON(
      message,
      destination,
      propertyMap
    );

    const payload = {
      properties
    };

    if (contactId) {
      // contact exists
      // update
      endpoint = IDENTIFY_CRM_UPDATE_CONTACT.replace(":contactId", contactId);
      response.operation = "updateContacts";
    } else {
      // contact do not exist
      // create
      endpoint = IDENTIFY_CRM_CREATE_NEW_CONTACT;
      response.operation = "createContacts";
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

  // either of email or utk or objectId (Could be a 'contact id' or a 'visitor id') should be present
  if (!payload.email && !payload.utk && !payload.objectId) {
    throw new CustomError(
      "[HS]:: either of email, utk or objectId is required for custom behavioral events",
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
  response.messageType = "track";

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
    response.endpoint = `${TRACK_CRM_ENDPOINT}?hapikey=${Config.apiKey}`;
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

    if (batchOperation === "createContacts") {
      // create operation
      chunk.forEach(ev => {
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
    } else if (batchOperation === "updateContacts") {
      // update operation
      chunk.forEach(ev => {
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
      // 1. for now it is just HS CRM custom objects however later it can be
      // refactored to accomodate upcoming endpoint and make necessary changes
      // 2. this operation for now is just being used by rETL.

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

    if (batchOperation === "createContacts") {
      batchEventResponse.batchedRequest.endpoint = BATCH_IDENTIFY_CRM_CREATE_NEW_CONTACT;
    } else if (batchOperation === "updateContacts") {
      batchEventResponse.batchedRequest.endpoint = BATCH_IDENTIFY_CRM_UPDATE_CONTACT;
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
    if (event.message.messageType === "track") {
      const { message, metadata, destination } = event;
      const endpoint = get(message, "endpoint");

      const batchedResponse = defaultBatchRequestConfig();
      batchedResponse.batchedRequest.headers = message.headers;
      batchedResponse.batchedRequest.endpoint = endpoint;
      batchedResponse.batchedRequest.body = message.body;
      batchedResponse.batchedRequest.params = message.params;
      batchedResponse.batchedRequest.method =
        defaultPostRequestConfig.requestMethod;
      batchedResponse.metadata = [metadata];
      batchedResponse.destination = destination;

      trackResponseList.push(
        getSuccessRespEvents(
          batchedResponse.batchedRequest,
          batchedResponse.metadata,
          batchedResponse.destination
        )
      );
    } else if (event.message.operation === "createContacts") {
      // Identify: making chunks for CRM create contact endpoint
      createContactEventsChunk.push(event);
    } else if (event.message.operation === "updateContacts") {
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
      "createContacts"
    );
  }

  // batching up 'update' contact endpoint chunks
  if (arrayChunksIdentifyUpdateContact.length) {
    batchedResponseList = batchedResponseList.concat(
      batchIdentify(
        arrayChunksIdentifyUpdateContact,
        batchedResponseList,
        "updateContacts"
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
