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
  IDENTIFY_MAX_BODY_SIZE_IN_BYTES,
} = require('./config');
const { JSON_MIME_TYPE } = require('../../util/constant');
const { InstrumentationError, ConfigurationError } = require('../../util/errorTypes');
const { MappedToDestinationKey } = require('../../../constants');

const getCatalogEndpoint = (category, message) => {
  const externalIdInfo = getDestinationExternalIDInfoForRetl(message, 'ITERABLE');
  return `${category.endpoint}/${externalIdInfo.objectType}/items`;
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
 * Combines batched and non batched requests
 * @param {*} apiKey
 * @param {*} metadata
 * @param {*} endPoint
 * @param {*} destination
 * @param {*} eventResponse
 * @param {*} transformedEvents
 * @returns
 */
const combineBatchedAndNonBatchedEvents = (
  apiKey,
  metadata,
  endPoint,
  destination,
  eventResponse,
  nonBatchedRequests,
) => {
  const { batchedRequest } = eventResponse;
  batchedRequest.endpoint = endPoint;
  batchedRequest.headers = {
    'Content-Type': JSON_MIME_TYPE,
    api_key: apiKey,
  };

  const batchedEvents =
    nonBatchedRequests.length > 0 ? [batchedRequest, ...nonBatchedRequests] : batchedRequest;

  const batchEventResponse = {
    events: batchedEvents,
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
 * This function prepares and splits update user batches based on payload size
 * @param {*} chunk 
 * @param {*} registerDeviceOrBrowserEvents 
 * @returns 
 */
const prepareAndSplitUpdateUserBatchesBasedOnPayloadSize = (chunk, registerDeviceOrBrowserEvents) => {
  const batches = [];
  let size = 0;
  let usersChunk = [];
  let metadataChunk = [];
  let nonBatchedRequests = [];

  chunk.forEach((event) => {
    size += jsonSize(get(event, 'message.body.JSON'));

    if (size > IDENTIFY_MAX_BODY_SIZE_IN_BYTES) {
      batches.push({
        users: usersChunk,
        metadata: metadataChunk,
        nonBatchedRequests,
        destination: event.destination,
      });

      usersChunk = [];
      metadataChunk = [];
      nonBatchedRequests = [];
      size = jsonSize(get(event, 'message.body.JSON'));
    }

    if (registerDeviceOrBrowserEvents[event?.metadata?.jobId]) {
      const response = registerDeviceOrBrowserEvents[event.metadata.jobId];
      nonBatchedRequests.push(response);
    }

    metadataChunk.push(event.metadata);
    usersChunk.push(get(event, 'message.body.JSON'));
  });

  if (usersChunk.length > 0) {
    batches.push({
      users: usersChunk,
      metadata: metadataChunk,
      nonBatchedRequests,
      destination: chunk[0].destination,
    });
  }

  return batches;
};

/**
 * Takes updateUser event chunks, divides them into smaller batches based on payload size
 * extracts user data and metadata from each event
 * and prepares batched responses for further processing
 * @param {*} updateUserEventsChunks
 * @param {*} registerDeviceOrBrowserEvents
 * @returns
 */
const processUpdateUserBatch = (chunk, registerDeviceOrBrowserEvents) => {
  const batchedResponseList = [];

  const batches = prepareAndSplitUpdateUserBatchesBasedOnPayloadSize(
    chunk,
    registerDeviceOrBrowserEvents,
  );

  batches.forEach((batch) => {
    const batchEventResponse = defaultBatchRequestConfig();
    batchEventResponse.batchedRequest.body.JSON = { users: batch.users };

    const { destination, metadata, nonBatchedRequests } = batch;
    const { apiKey } = destination.Config;

    const batchedResponse = combineBatchedAndNonBatchedEvents(
      apiKey,
      metadata,
      IDENTIFY_BATCH_ENDPOINT,
      destination,
      batchEventResponse,
      nonBatchedRequests,
    );

    batchedResponseList.push(batchedResponse);
  });

  return batchedResponseList;
};

/**
 * Takes a list of update user events and batches them into chunks, preparing them for batch processing
 * @param {*} updateUserEvents
 * @param {*} registerDeviceOrBrowserEvents
 * @returns
 */
const batchUpdateUserEvents = (updateUserEvents, registerDeviceOrBrowserEvents) => {
  // Batching update user events
  const updateUserEventsChunks = _.chunk(updateUserEvents, IDENTIFY_MAX_BATCH_SIZE);
  return updateUserEventsChunks.reduce((batchedResponseList, chunk) => {
    const batchedResponse = processUpdateUserBatch(chunk, registerDeviceOrBrowserEvents);
    return batchedResponseList.concat(batchedResponse);
  }, []);
};

/**
 * Processes chunks of catalog events, extracts the necessary data, and prepares batched requests for further processing
 * @param {*} catalogEventsChunks
 * @returns
 */
const processCatalogBatch = (chunk) => {
  const metadata = [];
  const batchCatalogResponseList = {
    documents: {},
    replaceUploadedFieldsOnly: true,
  };

  const { destination } = chunk[0];
  const { apiKey } = destination.Config;

  chunk.forEach((event) => {
    metadata.push(event.metadata);
    const catalogId = get(event, 'message.body.JSON.catalogId');
    const update = get(event, 'message.body.JSON.update');
    batchCatalogResponseList.documents[catalogId] = update;
  });

  const batchEventResponse = defaultBatchRequestConfig();
  batchEventResponse.batchedRequest.body.JSON = batchCatalogResponseList;
  const endPoint = chunk[0].message.endpoint;

  return combineBatchedAndNonBatchedEvents(
    apiKey,
    metadata,
    endPoint,
    destination,
    batchEventResponse,
    [],
  );
};

/**
 * Takes a list of catalog events and batches them into chunks, preparing them for batch processing
 * @param {*} catalogEvents
 * @returns
 */
const batchCatalogEvents = (catalogEvents) => {
  // Batching catalog events
  const catalogEventsChunks = _.chunk(catalogEvents, IDENTIFY_MAX_BATCH_SIZE);
  return catalogEventsChunks.reduce((batchedResponseList, chunk) => {
    const batchedResponse = processCatalogBatch(chunk);
    return batchedResponseList.concat(batchedResponse);
  }, []);
};

/**
 * Processes chunks of track events, extracts the necessary data, and prepares batched requests for further processing
 * @param {*} trackEventsChunks
 * @returns
 */
const processTrackBatch = (chunk) => {
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

  return combineBatchedAndNonBatchedEvents(
    apiKey,
    metadata,
    TRACK_BATCH_ENDPOINT,
    destination,
    batchEventResponse,
    [],
  );
};

/**
 * Takes a list of track events and batches them into chunks, preparing them for batch processing
 * @param {*} trackEvents
 * @returns
 */
const batchTrackEvents = (trackEvents) => {
  // Batching track events
  const trackEventsChunks = _.chunk(trackEvents, TRACK_MAX_BATCH_SIZE);
  return trackEventsChunks.reduce((batchedResponseList, chunk) => {
    const batchedResponse = processTrackBatch(chunk);
    return batchedResponseList.concat(batchedResponse);
  }, []);
};

/**
 * Batch and prepare various types of events (track, catalog, updateUser) for processing in a modular and organized manner
 * @param {*} filteredEvents
 * @returns
 */
const prepareBatchRequests = (filteredEvents) => {
  const {
    trackEvents,
    catalogEvents,
    errorRespList,
    updateUserEvents,
    eventResponseList,
    registerDeviceOrBrowserEvents,
  } = filteredEvents;

  const updateUserBatchedResponseList =
    updateUserEvents.length > 0
      ? batchUpdateUserEvents(updateUserEvents, registerDeviceOrBrowserEvents)
      : [];

  const catalogBatchedResponseList =
    catalogEvents.length > 0 ? batchCatalogEvents(catalogEvents) : [];

  // Batching track events
  const trackBatchedResponseList = trackEvents.length > 0 ? batchTrackEvents(trackEvents) : [];

  // appending all kinds of batches
  const batchedResponseList = [
    ...updateUserBatchedResponseList,
    ...catalogBatchedResponseList,
    ...trackBatchedResponseList,
    ...eventResponseList,
  ];

  return [...batchedResponseList, ...errorRespList];
};

/**
 * This function creates an object by mapping events to their corresponding jobId
 * @param {*} events
 * @returns
 */
const mapRegisterDeviceOrBrowserEventsWithJobId = (events) => {
  const registerDeviceOrBrowserEvents = {};
  events.forEach((event) => {
    const { data } = event;
    registerDeviceOrBrowserEvents[data?.metadata?.jobId] = data?.message;
  });
  return registerDeviceOrBrowserEvents;
};

/**
 * Function to categorizes events.
 * @param {*} event
 * @returns
 */
const categorizeEvent = (event) => {
  const { message, metadata, destination } = event;

  if (event?.error) {
    return { type: 'error', data: event };
  }

  if (message.endpoint === ConfigCategory.IDENTIFY.endpoint) {
    return { type: 'updateUser', data: { message, metadata, destination } };
  }

  if (message?.operation === 'catalogs') {
    return { type: 'catalog', data: { message, metadata, destination } };
  }

  if (
    message.endpoint === ConfigCategory.IDENTIFY.endpointBrowser ||
    message.endpoint === ConfigCategory.IDENTIFY.endpointDevice
  ) {
    return { type: 'registerDeviceOrBrowser', data: { message, metadata, destination } };
  }

  if (message.endpoint.includes('api/events/track')) {
    return { type: 'track', data: { message, metadata, destination } };
  }

  return { type: 'eventResponse', data: getSuccessRespEvents(message, [metadata], destination) };
};

/**
 * Function to categorizes and filters events, organizing them into different arrays based on their properties
 * @param {*} transformedEvents
 */
const filterEvents = (transformedEvents) => {
  const categorizeEventList = transformedEvents.map(categorizeEvent);

  // Identify events
  const catalogEvents = categorizeEventList
    .filter((event) => event.type === 'catalog')
    .map((event) => event.data);
  const updateUserEvents = categorizeEventList
    .filter((event) => event.type === 'updateUser')
    .map((event) => event.data);
  const registerDeviceOrBrowserEventsArray = categorizeEventList.filter(
    (event) => event.type === 'registerDeviceOrBrowser',
  );
  const registerDeviceOrBrowserEvents = mapRegisterDeviceOrBrowserEventsWithJobId(
    registerDeviceOrBrowserEventsArray,
  );

  // Track events
  const trackEvents = categorizeEventList
    .filter((event) => event.type === 'track')
    .map((event) => event.data);

  // Rest of the events
  const eventResponseList = categorizeEventList
    .filter((event) => event.type === 'eventResponse')
    .map((event) => event.data);

  // Failed events
  const errorRespList = categorizeEventList
    .filter((event) => event.type === 'error')
    .map((event) => event.data);

  return {
    trackEvents,
    catalogEvents,
    errorRespList,
    updateUserEvents,
    eventResponseList,
    registerDeviceOrBrowserEvents,
  };
};

/**
 * Function to prepare batch events and add it to final payload
 * @param {*} trackEvents
 * @returns
 */
const filterEventsAndPrepareBatchRequests = (transformedEvents) => {
  // Part 1 : filter events
  const filteredEvents = filterEvents(transformedEvents);

  // Part 2 : prepare batch requests
  return prepareBatchRequests(filteredEvents);
};

module.exports = {
  pageAction,
  trackAction,
  screenAction,
  identifyAction,
  updateCartAction,
  getCatalogEndpoint,
  trackPurchaseAction,
  identifyDeviceAction,
  identifyBrowserAction,
  filterEventsAndPrepareBatchRequests,
};
