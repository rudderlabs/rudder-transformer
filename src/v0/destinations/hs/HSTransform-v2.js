const get = require('get-value');
const _ = require('lodash');
const { MappedToDestinationKey, GENERIC_TRUE_VALUES } = require('../../../constants');
const {
  defaultPostRequestConfig,
  defaultRequestConfig,
  defaultPatchRequestConfig,
  getFieldValueFromMessage,
  getSuccessRespEvents,
  addExternalIdToTraits,
  defaultBatchRequestConfig,
  removeUndefinedAndNullValues,
  getDestinationExternalID,
  constructPayload,
  isDefinedAndNotNullAndNotEmpty,
  getDestinationExternalIDInfoForRetl,
  getDestinationExternalIDObjectForRetl,
} = require('../../util');
const {
  TransformationError,
  ConfigurationError,
  InstrumentationError,
} = require('../../util/errorTypes');
const {
  IDENTIFY_CRM_UPDATE_CONTACT,
  IDENTIFY_CRM_CREATE_NEW_CONTACT,
  MAX_BATCH_SIZE_CRM_CONTACT,
  BATCH_IDENTIFY_CRM_CREATE_NEW_CONTACT,
  BATCH_IDENTIFY_CRM_UPDATE_CONTACT,
  mappingConfig,
  ConfigCategory,
  TRACK_CRM_ENDPOINT,
  CRM_CREATE_UPDATE_ALL_OBJECTS,
  MAX_BATCH_SIZE_CRM_OBJECT,
  CRM_ASSOCIATION_V3,
  RETL_CREATE_ASSOCIATION_OPERATION,
  RETL_SOURCE,
} = require('./config');
const {
  getTransformedJSON,
  searchContacts,
  getEventAndPropertiesFromConfig,
  getHsSearchId,
} = require('./util');
const { JSON_MIME_TYPE } = require('../../util/constant');

const addHsAuthentication = (response, Config) => {
  // choosing API Type
  if (Config.authorizationType === 'newPrivateAppApi') {
    // Private Apps
    response.headers = {
      ...response.headers,
      Authorization: `Bearer ${Config.accessToken}`,
    };
  } else {
    // use legacy API Key
    response.params = { hapikey: Config.apiKey };
  }
  return response;
};

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
  const traits = getFieldValueFromMessage(message, 'traits');
  const mappedToDestination = get(message, MappedToDestinationKey);
  const operation = get(message, 'context.hubspotOperation');
  const externalIdObj = getDestinationExternalIDObjectForRetl(message, 'HS');
  const { objectType } = getDestinationExternalIDInfoForRetl(message, 'HS');
  // build response
  let endpoint;
  const response = defaultRequestConfig();
  response.method = defaultPostRequestConfig.requestMethod;

  // Handle hubspot association events sent from retl source
  if (
    objectType &&
    objectType.toLowerCase() === 'association' &&
    mappedToDestination &&
    GENERIC_TRUE_VALUES.includes(mappedToDestination.toString())
  ) {
    const { associationTypeId, fromObjectType, toObjectType } = externalIdObj;
    response.endpoint = CRM_ASSOCIATION_V3.replace(':fromObjectType', fromObjectType).replace(
      ':toObjectType',
      toObjectType,
    );
    response.body.JSON = {
      ...traits,
      type: associationTypeId,
    };
    response.headers = {
      'Content-Type': JSON_MIME_TYPE,
    };
    response.operation = RETL_CREATE_ASSOCIATION_OPERATION;
    response.source = RETL_SOURCE;
    return addHsAuthentication(response, Config);
  }

  // if mappedToDestination is set true, then add externalId to traits
  if (
    mappedToDestination &&
    GENERIC_TRUE_VALUES.includes(mappedToDestination.toString()) &&
    operation
  ) {
    addExternalIdToTraits(message);
    if (!objectType) {
      throw new InstrumentationError('objectType not found');
    }
    if (operation === 'createObject') {
      endpoint = CRM_CREATE_UPDATE_ALL_OBJECTS.replace(':objectType', objectType);
    } else if (operation === 'updateObject' && getHsSearchId(message)) {
      const { hsSearchId } = getHsSearchId(message);
      endpoint = `${CRM_CREATE_UPDATE_ALL_OBJECTS.replace(
        ':objectType',
        objectType,
      )}/${hsSearchId}`;
      response.method = defaultPatchRequestConfig.requestMethod;
    }

    response.body.JSON = removeUndefinedAndNullValues({ properties: traits });
    response.source = 'rETL';
    response.operation = operation;
  } else {
    if (!Config.lookupField) {
      throw new ConfigurationError('lookupField is a required field in webapp config');
    }

    let contactId = getDestinationExternalID(message, 'hsContactId');

    // if contactId is not provided then search
    if (!contactId) {
      contactId = await searchContacts(message, destination);
    }

    const properties = await getTransformedJSON(message, destination, propertyMap);

    const payload = {
      properties,
    };

    if (contactId) {
      // contact exists
      // update
      endpoint = IDENTIFY_CRM_UPDATE_CONTACT.replace(':contactId', contactId);
      response.operation = 'updateContacts';
    } else {
      // contact do not exist
      // create
      endpoint = IDENTIFY_CRM_CREATE_NEW_CONTACT;
      response.operation = 'createContacts';
    }
    response.body.JSON = removeUndefinedAndNullValues(payload);
  }

  response.endpoint = endpoint;
  response.headers = {
    'Content-Type': JSON_MIME_TYPE,
  };

  // choosing API Type
  if (Config.authorizationType === 'newPrivateAppApi') {
    // Private Apps
    response.headers = {
      ...response.headers,
      Authorization: `Bearer ${Config.accessToken}`,
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

  let payload = constructPayload(message, mappingConfig[ConfigCategory.TRACK.name]);

  // fetch event name and its properties from config (webapp) and put it in final payload
  payload = getEventAndPropertiesFromConfig(message, destination, payload);

  // append track mapping.json along with properties fetched from webapp
  payload.properties = {
    ...payload.properties,
    ...constructPayload(message, mappingConfig[ConfigCategory.TRACK_PROPERTIES.name]),
  };

  // either of email or utk or objectId (Could be a 'contact id' or a 'visitor id') should be present
  if (!payload.email && !payload.utk && !payload.objectId) {
    throw new InstrumentationError(
      'Either of email, utk or objectId is required for custom behavioral events',
    );
  }

  const response = defaultRequestConfig();
  response.endpoint = TRACK_CRM_ENDPOINT;
  response.method = defaultPostRequestConfig.requestMethod;
  response.headers = {
    'Content-Type': JSON_MIME_TYPE,
  };
  response.body.JSON = removeUndefinedAndNullValues(payload);
  response.messageType = 'track';

  // choosing API Type
  if (Config.authorizationType === 'newPrivateAppApi') {
    // remove hubId
    // eslint-disable-next-line no-underscore-dangle
    response.headers = {
      ...response.headers,
      Authorization: `Bearer ${Config.accessToken}`,
    };
  } else {
    // using legacyApiKey
    response.endpoint = `${TRACK_CRM_ENDPOINT}?hapikey=${Config.apiKey}`;
  }

  return response;
};

const batchIdentify = (arrayChunksIdentify, batchedResponseList, batchOperation) => {
  // list of chunks [ [..], [..] ]
  arrayChunksIdentify.forEach((chunk) => {
    const identifyResponseList = [];
    const metadata = [];

    // extracting message, destination value
    // from the first event in a batch
    const { message, destination } = chunk[0];

    let batchEventResponse = defaultBatchRequestConfig();

    if (batchOperation === 'createObject') {
      batchEventResponse.batchedRequest.endpoint = `${message.endpoint}/batch/create`;

      // create operation
      chunk.forEach((ev) => {
        identifyResponseList.push({ ...ev.message.body.JSON });
        metadata.push(ev.metadata);
      });
    } else if (batchOperation === 'updateObject') {
      batchEventResponse.batchedRequest.endpoint = `${message.endpoint.substr(
        0,
        message.endpoint.lastIndexOf('/'),
      )}/batch/update`;
      // update operation
      chunk.forEach((ev) => {
        const updateEndpoint = ev.message.endpoint;
        identifyResponseList.push({
          ...ev.message.body.JSON,
          id: updateEndpoint.split('/').pop(),
        });

        metadata.push(ev.metadata);
      });
    } else if (batchOperation === 'createContacts') {
      // create operation
      chunk.forEach((ev) => {
        // duplicate email can cause issue with create in batch
        // updating the existing one to avoid duplicate
        // as same event can fire in batch one of the reason
        // can be due to network lag or processor being busy
        const isDuplicate = identifyResponseList.find(
          (data) => data.properties.email === ev.message.body.JSON.properties.email,
        );
        if (isDefinedAndNotNullAndNotEmpty(isDuplicate)) {
          // array is being shallow copied hence changes are affecting the original reference
          // basically rewriting the same value to avoid duplicate entry
          isDuplicate.properties = ev.message.body.JSON.properties;
        } else {
          // appending unique events
          identifyResponseList.push({
            properties: ev.message.body.JSON.properties,
          });
        }
        metadata.push(ev.metadata);
      });
    } else if (batchOperation === 'updateContacts') {
      // update operation
      chunk.forEach((ev) => {
        // update has contactId and properties
        // extract contactId from the end of the endpoint
        const id = ev.message.endpoint.split('/').pop();

        // duplicate contactId is not allowed in batch
        // updating the existing one to avoid duplicate
        // as same event can fire in batch one of the reason
        // can be due to network lag or processor being busy
        const isDuplicate = identifyResponseList.find((data) => data.id === id);
        if (isDefinedAndNotNullAndNotEmpty(isDuplicate)) {
          // rewriting the same value to avoid duplicate entry
          isDuplicate.properties = ev.message.body.JSON.properties;
        } else {
          // appending unique events
          identifyResponseList.push({
            id,
            properties: ev.message.body.JSON.properties,
          });
        }
        metadata.push(ev.metadata);
      });
    } else if (batchOperation === 'createAssociations') {
      chunk.forEach((ev) => {
        batchEventResponse.batchedRequest.endpoint = ev.message.endpoint;
        identifyResponseList.push(ev.message.body.JSON);
        metadata.push(ev.metadata);
      });
    } else {
      throw new TransformationError('Unknown hubspot operation', 400);
    }

    batchEventResponse.batchedRequest.body.JSON = {
      inputs: identifyResponseList,
    };

    if (batchOperation === 'createContacts') {
      batchEventResponse.batchedRequest.endpoint = BATCH_IDENTIFY_CRM_CREATE_NEW_CONTACT;
    } else if (batchOperation === 'updateContacts') {
      batchEventResponse.batchedRequest.endpoint = BATCH_IDENTIFY_CRM_UPDATE_CONTACT;
    }

    batchEventResponse.batchedRequest.headers = message.headers;
    batchEventResponse.batchedRequest.params = message.params;

    batchEventResponse = {
      ...batchEventResponse,
      metadata,
      destination,
    };
    batchedResponseList.push(
      getSuccessRespEvents(
        batchEventResponse.batchedRequest,
        batchEventResponse.metadata,
        batchEventResponse.destination,
        true,
      ),
    );
  });
  return batchedResponseList;
};

const batchEvents = (destEvents) => {
  let batchedResponseList = [];
  const trackResponseList = [];
  // create contact chunck
  const createContactEventsChunk = [];
  // update contact chunk
  const updateContactEventsChunk = [];
  // rETL specific chunk
  const createAllObjectsEventChunk = [];
  const updateAllObjectsEventChunk = [];
  const associationObjectsEventChunk = [];
  let maxBatchSize;

  destEvents.forEach((event) => {
    // handler for track call
    // track call does not have batch endpoint
    const { operation, messageType, source } = event.message;
    if (messageType === 'track') {
      const { message, metadata, destination } = event;
      const endpoint = get(message, 'endpoint');

      const batchedResponse = defaultBatchRequestConfig();
      batchedResponse.batchedRequest.headers = message.headers;
      batchedResponse.batchedRequest.endpoint = endpoint;
      batchedResponse.batchedRequest.body = message.body;
      batchedResponse.batchedRequest.params = message.params;
      batchedResponse.batchedRequest.method = defaultPostRequestConfig.requestMethod;
      batchedResponse.metadata = [metadata];
      batchedResponse.destination = destination;

      trackResponseList.push(
        getSuccessRespEvents(
          batchedResponse.batchedRequest,
          batchedResponse.metadata,
          batchedResponse.destination,
        ),
      );
    } else if (source && source === 'rETL') {
      const { endpoint } = event.message;
      maxBatchSize = endpoint.includes('contact')
        ? MAX_BATCH_SIZE_CRM_CONTACT
        : MAX_BATCH_SIZE_CRM_OBJECT;
      if (operation) {
        if (operation === 'createObject') {
          createAllObjectsEventChunk.push(event);
        } else if (operation === 'updateObject') {
          updateAllObjectsEventChunk.push(event);
        } else if (operation === RETL_CREATE_ASSOCIATION_OPERATION) {
          // Identify: chunks for handling association events
          associationObjectsEventChunk.push(event);
        }
      } else {
        throw new TransformationError('rETL -  Error in getting operation');
      }
    } else if (operation === 'createContacts') {
      // Identify: making chunks for CRM create contact endpoint
      createContactEventsChunk.push(event);
    } else if (operation === 'updateContacts') {
      // Identify: making chunks for CRM update contact endpoint
      updateContactEventsChunk.push(event);
    } else {
      throw new TransformationError('rETL - Not a valid operation');
    }
  });

  const arrayChunksIdentifyCreateObjects = _.chunk(createAllObjectsEventChunk, maxBatchSize);

  const arrayChunksIdentifyUpdateObjects = _.chunk(updateAllObjectsEventChunk, maxBatchSize);

  // eventChunks = [[e1,e2,e3,..batchSize],[e1,e2,e3,..batchSize]..]
  // CRM create contact endpoint chunks
  const arrayChunksIdentifyCreateContact = _.chunk(
    createContactEventsChunk,
    MAX_BATCH_SIZE_CRM_CONTACT,
  );
  // CRM update contact endpoint chunks
  const arrayChunksIdentifyUpdateContact = _.chunk(
    updateContactEventsChunk,
    MAX_BATCH_SIZE_CRM_CONTACT,
  );

  const arrayChunksIdentifyCreateAssociations = _.chunk(
    associationObjectsEventChunk,
    MAX_BATCH_SIZE_CRM_OBJECT,
  );

  // batching up 'create' all objects endpoint chunks
  if (arrayChunksIdentifyCreateObjects.length > 0) {
    batchedResponseList = batchIdentify(
      arrayChunksIdentifyCreateObjects,
      batchedResponseList,
      'createObject',
    );
  }

  // batching up 'update' all objects endpoint chunks
  if (arrayChunksIdentifyUpdateObjects.length > 0) {
    batchedResponseList = batchIdentify(
      arrayChunksIdentifyUpdateObjects,
      batchedResponseList,
      'updateObject',
    );
  }

  // batching up 'create' contact endpoint chunks
  if (arrayChunksIdentifyCreateContact.length > 0) {
    batchedResponseList = batchIdentify(
      arrayChunksIdentifyCreateContact,
      batchedResponseList,
      'createContacts',
    );
  }

  // batching up 'update' contact endpoint chunks
  if (arrayChunksIdentifyUpdateContact.length > 0) {
    batchedResponseList = batchIdentify(
      arrayChunksIdentifyUpdateContact,
      batchedResponseList,
      'updateContacts',
    );
  }

  // batching association events
  if (arrayChunksIdentifyCreateAssociations.length > 0) {
    batchedResponseList = batchIdentify(
      arrayChunksIdentifyCreateAssociations,
      batchedResponseList,
      'createAssociations',
    );
  }

  return batchedResponseList.concat(trackResponseList);
};

module.exports = { processIdentify, processTrack, batchEvents };
