const _ = require('lodash');
const get = require('get-value');
const jsonSize = require('json-size');
const {
  isAppleFamily,
  constructPayload,
  getSuccessRespEvents,
  addExternalIdToTraits,
  defaultBatchRequestConfig,
  getDestinationExternalIDInfoForRetl,
} = require('../../util');
const {
  ConfigCategory,
  mappingConfig,
  TRACK_MAX_BATCH_SIZE,
  TRACK_BATCH_ENDPOINT,
  IDENTIFY_MAX_BATCH_SIZE,
  IDENTIFY_BATCH_ENDPOINT,
  IDENTIFY_MAX_BODY_SIZE_IN_BYTES
} = require('./config');
const { JSON_MIME_TYPE } = require('../../util/constant');
const { InstrumentationError, ConfigurationError } = require('../../util/errorTypes');
const { MappedToDestinationKey } = require('../../../constants');

const getCatalogEndpoint = (category, message) => {
  const externalIdInfo = getDestinationExternalIDInfoForRetl(message, 'ITERABLE');
  return `${category.endpoint}/${externalIdInfo.objectType}/items/${externalIdInfo.destinationExternalId}`;
};

function validateMandatoryField(payload) {
  if (payload.email === undefined && payload.userId === undefined) {
    throw new InstrumentationError('userId or email is mandatory for this request');
  }
}

const identifyDeviceAction = (message) => {
  let rawPayload = {};
  rawPayload = constructPayload(message, mappingConfig[ConfigCategory.IDENTIFY_DEVICE.name]);
  rawPayload.device = constructPayload(message, mappingConfig[ConfigCategory.DEVICE.name]);
  rawPayload.preferUserId = true;
  if (isAppleFamily(message.context.device.type)) {
    rawPayload.device.platform = 'APNS';
  } else {
    rawPayload.device.platform = 'GCM';
  }
  return rawPayload;
};

const identifyBrowserAction = (message) => {
  const rawPayload = constructPayload(message, mappingConfig[ConfigCategory.IDENTIFY_BROWSER.name]);
  validateMandatoryField(rawPayload);
  return rawPayload;
};

const identifyAction = (message, category) => {
  // If mapped to destination, Add externalId to traits
  if (get(message, MappedToDestinationKey)) {
    addExternalIdToTraits(message);
  }
  const rawPayload = constructPayload(message, mappingConfig[category.name]);
  rawPayload.preferUserId = true;
  rawPayload.mergeNestedObjects = true;
  validateMandatoryField(rawPayload);
  return rawPayload;
};

const pageAction = (message, destination, category) => {
  let rawPayload = {};
  if (destination.Config.trackAllPages) {
    rawPayload = constructPayload(message, mappingConfig[category.name]);
  } else if (
    destination.Config.trackCategorisedPages &&
    (message.properties?.category || message.category)
  ) {
    rawPayload = constructPayload(message, mappingConfig[category.name]);
  } else if (destination.Config.trackNamedPages && (message.properties?.name || message.name)) {
    rawPayload = constructPayload(message, mappingConfig[category.name]);
  } else {
    throw new ConfigurationError('Invalid page call');
  }
  validateMandatoryField(rawPayload);
  if (destination.Config.mapToSingleEvent) {
    rawPayload.eventName = 'Loaded a Page';
  } else {
    rawPayload.eventName += ' page';
  }
  rawPayload.createdAt = new Date(rawPayload.createdAt).getTime();
  if (rawPayload.campaignId) {
    rawPayload.campaignId = parseInt(rawPayload.campaignId, 10);
  }
  if (rawPayload.templateId) {
    rawPayload.templateId = parseInt(rawPayload.templateId, 10);
  }

  return rawPayload;
};

const screenAction = (message, destination, category) => {
  let rawPayload = {};
  if (destination.Config.trackAllPages) {
    rawPayload = constructPayload(message, mappingConfig[category.name]);
  } else if (
    destination.Config.trackCategorisedPages &&
    (message.properties?.category || message.category)
  ) {
    rawPayload = constructPayload(message, mappingConfig[category.name]);
  } else if (destination.Config.trackNamedPages && (message.properties?.name || message.name)) {
    rawPayload = constructPayload(message, mappingConfig[category.name]);
  } else {
    throw new ConfigurationError('Invalid screen call');
  }
  validateMandatoryField(rawPayload);
  if (destination.Config.mapToSingleEvent) {
    rawPayload.eventName = 'Loaded a Screen';
  } else {
    rawPayload.eventName += ' screen';
  }
  rawPayload.createdAt = new Date(rawPayload.createdAt).getTime();
  if (rawPayload.campaignId) {
    rawPayload.campaignId = parseInt(rawPayload.campaignId, 10);
  }
  if (rawPayload.templateId) {
    rawPayload.templateId = parseInt(rawPayload.templateId, 10);
  }

  return rawPayload;
};

const trackAction = (message, category) => {
  let rawPayload = {};
  rawPayload = constructPayload(message, mappingConfig[category.name]);
  validateMandatoryField(rawPayload);
  rawPayload.createdAt = new Date(rawPayload.createdAt).getTime();
  if (rawPayload.campaignId) {
    rawPayload.campaignId = parseInt(rawPayload.campaignId, 10);
  }
  if (rawPayload.templateId) {
    rawPayload.templateId = parseInt(rawPayload.templateId, 10);
  }

  return rawPayload;
};

const trackPurchaseAction = (message, category) => {
  let rawPayload = {};
  const rawPayloadItemArr = [];
  rawPayload = constructPayload(message, mappingConfig[category.name]);
  rawPayload.user = constructPayload(message, mappingConfig[ConfigCategory.IDENTIFY.name]);
  validateMandatoryField(rawPayload.user);
  rawPayload.user.preferUserId = true;
  rawPayload.user.mergeNestedObjects = true;
  rawPayload.items = message.properties.products;
  if (rawPayload.items && Array.isArray(rawPayload.items)) {
    rawPayload.items.forEach((el) => {
      const element = constructPayload(el, mappingConfig[ConfigCategory.PRODUCT.name]);
      if (element.categories && typeof element.categories === 'string') {
        element.categories = element.categories.split(',');
      }
      element.price = parseFloat(element.price);
      element.quantity = parseInt(element.quantity, 10);
      const clone = { ...element };
      rawPayloadItemArr.push(clone);
    });
  } else {
    const element = constructPayload(
      message.properties,
      mappingConfig[ConfigCategory.PRODUCT.name],
    );
    if (element.categories && typeof element.categories === 'string') {
      element.categories = element.categories.split(',');
    }
    element.price = parseFloat(element.price);
    element.quantity = parseInt(element.quantity, 10);
    const clone = { ...element };
    rawPayloadItemArr.push(clone);
  }

  rawPayload.items = rawPayloadItemArr;
  rawPayload.createdAt = new Date(rawPayload.createdAt).getTime();
  rawPayload.total = parseFloat(rawPayload.total);
  if (rawPayload.id) {
    rawPayload.id = rawPayload.id.toString();
  }
  if (rawPayload.campaignId) {
    rawPayload.campaignId = parseInt(rawPayload.campaignId, 10);
  }
  if (rawPayload.templateId) {
    rawPayload.templateId = parseInt(rawPayload.templateId, 10);
  }

  return rawPayload;
};

const updateCartAction = (message) => {
  const rawPayload = {
    items: message.properties.products,
  };
  const rawPayloadItemArr = [];
  rawPayload.user = constructPayload(message, mappingConfig[ConfigCategory.IDENTIFY.name]);
  validateMandatoryField(rawPayload.user);
  rawPayload.user.preferUserId = true;
  rawPayload.user.mergeNestedObjects = true;
  if (rawPayload.items && Array.isArray(rawPayload.items)) {
    rawPayload.items.forEach((el) => {
      const element = constructPayload(el, mappingConfig[ConfigCategory.PRODUCT.name]);
      if (element.categories && typeof element.categories === 'string') {
        element.categories = element.categories.split(',');
      }
      element.price = parseFloat(element.price);
      element.quantity = parseInt(element.quantity, 10);
      const clone = { ...element };
      rawPayloadItemArr.push(clone);
    });
  } else {
    const element = constructPayload(
      message.properties,
      mappingConfig[ConfigCategory.PRODUCT.name],
    );
    if (element.categories && typeof element.categories === 'string') {
      element.categories = element.categories.split(',');
    }
    element.price = parseFloat(element.price);
    element.quantity = parseInt(element.quantity, 10);
    const clone = { ...element };
    rawPayloadItemArr.push(clone);
  }

  rawPayload.items = rawPayloadItemArr;
  return rawPayload;
};

/**
 * Function to prepare batch request and returns it
 * @param {*} apiKey 
 * @param {*} metadata 
 * @param {*} endPoint 
 * @param {*} destination 
 * @param {*} eventResponse 
 * @param {*} addTransformedEventsWithBatch 
 * @returns 
 */
const prepareFinalBatchRequest = (
  apiKey,
  metadata,
  endPoint,
  destination,
  eventResponse,
  addTransformedEventsWithBatch,
) => {
  let batchEventResponse = eventResponse;

  batchEventResponse.batchedRequest.endpoint = endPoint;

  batchEventResponse.batchedRequest.headers = {
    'Content-Type': JSON_MIME_TYPE,
    api_key: apiKey,
  };

  /**
   [
    {
      batchedRequest: [{e1_batched,e2_batched,e3_batched},{e6_not_batched}]
      batched: true,
      metadata: [m1,m2,m3,m6],
      destination,
    }
   ]
  */
  batchEventResponse = {
    events:
      addTransformedEventsWithBatch.length > 0
        ? [batchEventResponse.batchedRequest, ...addTransformedEventsWithBatch]
        : batchEventResponse.batchedRequest,
    metadata,
    destination,
  };

  return getSuccessRespEvents(
    batchEventResponse.events,
    batchEventResponse.metadata,
    batchEventResponse.destination,
    true,
  );
};

/**
 * Function to batch updateUser events
 * @param {*} updateUserEventsChunks 
 * @param {*} registerDeviceOrBrowserEvents 
 * @returns 
 */
const batchUpdateUserEvents = (updateUserEventsChunks, registerDeviceOrBrowserEvents) => {
  const batchedResponseList = [];
  updateUserEventsChunks.forEach((chunk) => {
    // Variable to keep a track of payload size
    let size = 0;
    
    let usersChunk = [];
    const batchUsers = [];

    let metadataChunk = [];

    const { destination } = chunk[0];
    const { apiKey } = destination.Config;
    // All the registerDeviceOrBrowserEvents will get stored in this variable
    let addTransformedEventsWithBatch = [];

    chunk.forEach((event) => {
      size += jsonSize(get(event, 'message.body.JSON'));
      // Checks if payload size is more then 4MB then it will device the payload and prepare separate batch request for each 
      if (size > IDENTIFY_MAX_BODY_SIZE_IN_BYTES) {
        batchUsers.push({
          users: usersChunk,
          metadata: metadataChunk,
          transformedEvents: addTransformedEventsWithBatch,
        });
        usersChunk = [];
        metadataChunk = [];
        addTransformedEventsWithBatch = [];
        size = jsonSize(get(event, 'message.body.JSON'));
      }
      if (registerDeviceOrBrowserEvents[event.metadata.jobId]) {
        const response = registerDeviceOrBrowserEvents[event.metadata.jobId];
        addTransformedEventsWithBatch.push(response.message);
      }
      metadataChunk.push(event.metadata);
      usersChunk.push(get(event, 'message.body.JSON'));
    });

    if (usersChunk.length > 0) {
      batchUsers.push({
        users: usersChunk,
        metadata: metadataChunk,
        transformedEvents: addTransformedEventsWithBatch,
      });
    }
  
    batchUsers.forEach((batch) => {
      const batchEventResponse = defaultBatchRequestConfig();
      batchEventResponse.batchedRequest.body.JSON = {
        users: batch.users,
      };

      batchedResponseList.push(
        prepareFinalBatchRequest(
          apiKey,
          batch.metadata,
          IDENTIFY_BATCH_ENDPOINT,
          destination,
          batchEventResponse,
          batch.transformedEvents,
        ),
      );
    });
  });

  return batchedResponseList;
};

/**
 * Function to batch catalog events
 * @param {*} catalogEventsChunks
 * @returns
 */
const batchCatalogEvents = (catalogEventsChunks) => {
  const batchedResponseList = [];
  catalogEventsChunks.forEach((chunk) => {
    const metadata = [];
    // DOC: https://api.iterable.com/api/docs#catalogs_bulkUpdateCatalogItems
    const batchCatalogResponseList = {
      documents: {},
      replaceUploadedFieldsOnly: true,
    };

    const { destination } = chunk[0];
    const { apiKey } = destination.Config;
    /** body will be in below format:
      {
        "documents": {
            "test-1-item": {
                "abc": "TestValue"
            },
            "test-2-item": {
                "abc": "TestValue1"
            }
        },
        "replaceUploadedFieldsOnly": true
      } 
    */
    chunk.forEach((event) => {
      metadata.push(event.metadata);
      batchCatalogResponseList.documents[event.message.endpoint.split('/').pop()] = get(
        event,
        'message.body.JSON.update',
      );
    });

    const batchEventResponse = defaultBatchRequestConfig();
    batchEventResponse.batchedRequest.body.JSON = batchCatalogResponseList;
    const endPoint = chunk[0].message.endpoint.substr(
      0,
      chunk[0].message.endpoint.lastIndexOf('/'),
    );

    batchedResponseList.push(
      prepareFinalBatchRequest(apiKey, metadata, endPoint, destination, batchEventResponse, []),
    );
  });
  return batchedResponseList;
};

/**
 * Function to batch track events
 * @param {*} trackEventsChunks
 * @returns
 */
const batchTrackEvents = (trackEventsChunks) => {
  const batchedResponseList = [];
  trackEventsChunks.forEach((chunk) => {
    const events = [];
    const metadata = [];

    const { destination } = chunk[0];
    const { apiKey } = destination.Config;

    chunk.forEach((event) => {
      metadata.push(event.metadata);
      events.push(get(event, 'message.body.JSON'));
    });

    const batchEventResponse = defaultBatchRequestConfig();

    batchEventResponse.batchedRequest.body.JSON = {
      events,
    };

    batchedResponseList.push(
      prepareFinalBatchRequest(
        apiKey,
        metadata,
        TRACK_BATCH_ENDPOINT,
        destination,
        batchEventResponse,
        [],
      ),
    );
  });

  return batchedResponseList;
};

/**
 * Function to prepare batch events and add it to final payload
 * @param {*} trackEvents
 * @param {*} catalogEvents
 * @param {*} errorRespList
 * @param {*} updateUserEvents
 * @param {*} eventResponseList
 * @param {*} registerDeviceOrBrowserEvents
 * @returns
 */
const prepareBatchEvents = (
  trackEvents,
  catalogEvents,
  errorRespList,
  updateUserEvents,
  eventResponseList,
  registerDeviceOrBrowserEvents,
) => {
  // Batching update user events
  let updateUserBatchedResponseList = [];
  if (updateUserEvents.length > 0) {
    // updateUserEventsChunks = [[e1,e2,e3,..batchSize],[e1,e2,e3,..batchSize]..]
    const updateUserEventsChunks = _.chunk(updateUserEvents, IDENTIFY_MAX_BATCH_SIZE);
    updateUserBatchedResponseList = batchUpdateUserEvents(
      updateUserEventsChunks,
      registerDeviceOrBrowserEvents,
    );
  }

  // Batching catalog events
  let catalogBatchedResponseList = [];
  if (catalogEvents.length > 0) {
    // catalogEventsChunks = [[e1,e2,e3,..batchSize],[e1,e2,e3,..batchSize]..]
    const catalogEventsChunks = _.chunk(catalogEvents, IDENTIFY_MAX_BATCH_SIZE);
    catalogBatchedResponseList = batchCatalogEvents(catalogEventsChunks);
  }

  // Batching track events
  let trackBatchedResponseList = [];
  if (trackEvents.length > 0) {
    // trackEventsChunks = [[e1,e2,e3,..batchSize],[e1,e2,e3,..batchSize]..]
    const trackEventsChunks = _.chunk(trackEvents, TRACK_MAX_BATCH_SIZE);
    trackBatchedResponseList = batchTrackEvents(trackEventsChunks);
  }

  let batchedResponseList = [];
  // appending all kinds of batches
  batchedResponseList = batchedResponseList
    .concat(updateUserBatchedResponseList)
    .concat(catalogBatchedResponseList)
    .concat(trackBatchedResponseList)
    .concat(eventResponseList);

  return [...batchedResponseList, ...errorRespList];
};

module.exports = {
  pageAction,
  trackAction,
  screenAction,
  identifyAction,
  updateCartAction,
  getCatalogEndpoint,
  prepareBatchEvents,
  trackPurchaseAction,
  identifyDeviceAction,
  identifyBrowserAction,
};
