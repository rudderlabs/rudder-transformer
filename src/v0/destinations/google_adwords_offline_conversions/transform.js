const { set, get } = require('lodash');
const {
  InstrumentationError,
  ConfigurationError,
  forEachInBatches,
} = require('@rudderstack/integrations-lib');
const { EventType } = require('../../../constants');
const {
  getHashFromArrayWithDuplicate,
  removeHyphens,
  getHashFromArray,
  handleRtTfSingleEventError,
  defaultBatchRequestConfig,
  getSuccessRespEvents,
  combineBatchRequestsWithSameJobIds,
} = require('../../util');
const {
  validateDestinationConfig,
  getStoreConversionPayload,
  requestBuilder,
  getClickConversionPayloadAndEndpoint,
  getConsentsDataFromIntegrationObj,
  getCallConversionPayload,
  getConversionActionIds,
  getConversionCustomVariables,
  getListCustomVariable,
} = require('./utils');
const { MAX_CONVERSIONS_PER_BATCH } = require('./config');
const helper = require('./helper');

/**
 * get conversions depending on the type set from dashboard
 * i.e click conversions or call conversions
 * @param {*} message
 * @param {*} metadata
 * @param {*} param2
 * @param {*} event
 * @param {*} conversionType
 * @param {*} conversionActionId
 * @param {*} customVariableList
 * @returns
 */
const getConversions = (
  message,
  metadata,
  { Config },
  event,
  conversionType,
  conversionActionId,
  customVariableList,
) => {
  let convertedPayload = {};
  const { customerId } = Config;
  const { properties, timestamp, originalTimestamp } = message;

  const filteredCustomerId = removeHyphens(customerId);
  const eventLevelConsentsData = getConsentsDataFromIntegrationObj(message);

  if (conversionType === 'click') {
    // click conversion
    convertedPayload = getClickConversionPayloadAndEndpoint(
      message,
      Config,
      filteredCustomerId,
      eventLevelConsentsData,
      conversionActionId,
      customVariableList,
    );
  } else if (conversionType === 'store') {
    convertedPayload = getStoreConversionPayload(
      message,
      Config,
      filteredCustomerId,
      eventLevelConsentsData,
      conversionActionId,
    );
  } else {
    // call conversions
    convertedPayload = getCallConversionPayload(
      message,
      filteredCustomerId,
      eventLevelConsentsData,
      conversionActionId,
      customVariableList,
    );
  }
  const { payload, endpointDetails } = convertedPayload;

  if (conversionType !== 'store') {
    // transform originalTimestamp to conversionDateTime format (yyyy-mm-dd hh:mm:ss+|-hh:mm)
    // e.g 2019-10-14T11:15:18.299Z -> 2019-10-14 16:10:29+0530
    // eslint-disable-next-line unicorn/consistent-destructuring
    if (!properties.conversionDateTime && (timestamp || originalTimestamp)) {
      const conversionTimestamp = timestamp || originalTimestamp;
      const conversionDateTime = helper.formatTimestamp(conversionTimestamp);
      set(payload, 'conversions[0].conversionDateTime', conversionDateTime);
    }
    payload.partialFailure = true;
  }
  return requestBuilder(
    payload,
    endpointDetails,
    Config,
    metadata,
    event,
    filteredCustomerId,
    properties,
  );
};

/**
 * response builder for track
 * @param {*} message
 * @param {*} metadata
 * @param {*} destination
 * @returns
 */
const trackResponseBuilder = async (message, metadata, destination) => {
  let { eventsToConversionsNamesMapping, eventsToOfflineConversionsTypeMapping } =
    destination.Config;
  let { event } = message;
  if (!event) {
    throw new InstrumentationError('Event name is not present');
  }

  event = event.toLowerCase().trim();

  eventsToConversionsNamesMapping = getHashFromArray(eventsToConversionsNamesMapping);

  eventsToOfflineConversionsTypeMapping = getHashFromArrayWithDuplicate(
    eventsToOfflineConversionsTypeMapping,
  );

  const responseList = [];
  if (!eventsToConversionsNamesMapping[event] || !eventsToOfflineConversionsTypeMapping[event]) {
    throw new ConfigurationError(
      `Event name '${event}' is not present in the mapping provided in the dashboard.`,
    );
  }

  const conversionName = eventsToConversionsNamesMapping[event];
  const { customerId } = destination.Config;
  const filteredCustomerId = removeHyphens(customerId);

  const uniqueConversionNames = [...new Set(Object.values(eventsToConversionsNamesMapping))];
  const conversionActionIdsMap = await getConversionActionIds({
    Config: destination.Config,
    metadata,
    customerId: filteredCustomerId,
    conversionNames: uniqueConversionNames,
  });
  const conversionActionId = conversionActionIdsMap[conversionName];
  if (!conversionActionId) {
    throw new ConfigurationError(
      `Unable to find conversionActionId for conversion:${conversionName}. Most probably the conversion name in Google dashboard and Rudderstack dashboard are not same.`,
    );
  }

  const { customVariables: customVariablesConfig } = destination.Config;
  const customVariablesMap = getHashFromArray(customVariablesConfig, 'from', 'to', false);
  const listOfVariableToFetch = [
    ...new Set(
      Object.values(customVariablesMap).filter(
        (variableName) => variableName && variableName !== '',
      ),
    ),
  ];
  const conversionCustomVariableMap = await getConversionCustomVariables({
    Config: destination.Config,
    metadata,
    customerId: filteredCustomerId,
    variableNames: listOfVariableToFetch,
  });
  const { properties } = message;
  const customVariableList = getListCustomVariable({
    properties,
    conversionCustomVariableMap,
    customVariables: customVariablesMap,
  });

  const conversionTypes = Array.from(eventsToOfflineConversionsTypeMapping[event]);
  conversionTypes.forEach((conversionType) => {
    responseList.push(
      getConversions(
        message,
        metadata,
        destination,
        conversionName,
        conversionType,
        conversionActionId,
        customVariableList,
      ),
    );
  });
  return responseList;
};

const process = async (event) => {
  const { message, metadata, destination } = event;
  if (!message.type) {
    throw new InstrumentationError('Message type is not present. Aborting message.');
  }

  validateDestinationConfig(destination);

  const messageType = message.type.toLowerCase();
  let response;
  if (messageType === EventType.TRACK) {
    response = await trackResponseBuilder(message, metadata, destination);
  } else {
    throw new InstrumentationError(`Message type ${messageType} not supported`);
  }

  return response;
};

const getEventChunks = (event, storeSalesEvents, clickCallEvents) => {
  const { message, metadata, destination } = event;
  // eslint-disable-next-line @typescript-eslint/no-shadow
  message.forEach((message) => {
    if (message.body.JSON?.isStoreConversion) {
      storeSalesEvents.push({ message, metadata, destination });
    } else {
      clickCallEvents.push({ message, metadata, destination });
    }
  });
  return { storeSalesEvents, clickCallEvents };
};

const batchEvents = async (storeSalesEvents) => {
  const batchEventResponse = defaultBatchRequestConfig();
  batchEventResponse.metadatas = [];
  set(batchEventResponse, 'batchedRequest.body.JSON', storeSalesEvents[0].message.body.JSON);
  set(batchEventResponse, 'batchedRequest.body.JSON.addConversionPayload.operations', [
    get(storeSalesEvents[0], 'message.body.JSON.addConversionPayload.operations'),
  ]);
  batchEventResponse.metadatas.push(storeSalesEvents[0].metadata);
  const { params, headers, endpoint, endpointPath } = storeSalesEvents[0].message;
  batchEventResponse.batchedRequest.params = params;
  batchEventResponse.batchedRequest.headers = headers;
  batchEventResponse.batchedRequest.endpoint = endpoint;
  batchEventResponse.batchedRequest.endpointPath = endpointPath;

  await forEachInBatches(storeSalesEvents, async (storeSalesEvent, index) => {
    // we are discarding the first event as it is already added
    if (index === 0) {
      return;
    }
    batchEventResponse.batchedRequest?.body?.JSON.addConversionPayload?.operations?.push(
      storeSalesEvent.message?.body?.JSON?.addConversionPayload?.operations,
    );
    batchEventResponse.metadatas.push(storeSalesEvent.metadata);
  });
  batchEventResponse.destination = storeSalesEvents[0].destination;
  return [
    getSuccessRespEvents(
      batchEventResponse.batchedRequest,
      batchEventResponse.metadatas,
      batchEventResponse.destination,
      true,
    ),
  ];
};

/**
 * Create a batched response from a list of events
 * @param {Array} events - Array of events to batch
 * @returns {Object} Batched response object
 */
const createBatchedResponseForClickCall = async (events) => {
  const batchEventResponse = defaultBatchRequestConfig();
  batchEventResponse.metadatas = [];

  // Set base payload from first event
  const conversionPath = 'message.body.JSON.conversions[0]';
  set(batchEventResponse, 'batchedRequest.body.JSON', events[0].message.body.JSON);
  set(batchEventResponse, 'batchedRequest.body.JSON.conversions', [get(events[0], conversionPath)]);
  set(batchEventResponse, 'batchedRequest.body.JSON.partialFailure', true);
  batchEventResponse.metadatas.push(events[0].metadata);

  // Copy common properties
  const { params, headers, endpoint, endpointPath } = events[0].message;
  batchEventResponse.batchedRequest.params = params;
  batchEventResponse.batchedRequest.headers = headers;
  batchEventResponse.batchedRequest.endpoint = endpoint;
  batchEventResponse.batchedRequest.endpointPath = endpointPath;

  // Add remaining events in this batch
  await forEachInBatches(events.slice(1), (event) => {
    batchEventResponse.batchedRequest?.body?.JSON.conversions?.push(
      event.message?.body?.JSON?.conversions[0],
    );
    batchEventResponse.metadatas.push(event.metadata);
  });

  batchEventResponse.destination = events[0].destination;
  return getSuccessRespEvents(
    batchEventResponse.batchedRequest,
    batchEventResponse.metadatas,
    batchEventResponse.destination,
    true,
  );
};

const getClickCallBatchGroupKey = (event) => {
  const { message, destination } = event;
  const { endpointPath, endpoint, params = {}, headers = {} } = message;
  const destinationKey =
    destination?.ID || destination?.id || JSON.stringify(destination?.Config || {});

  return JSON.stringify({
    endpointPath,
    endpoint,
    customerId: params.customerId,
    authorization: headers.Authorization || headers.authorization,
    loginCustomerId: headers['login-customer-id'],
    destinationKey,
  });
};

/**
 * Batch click/call conversion events
 * Batches up to MAX_CONVERSIONS_PER_BATCH (2000) conversions per request
 * Groups by request/account/auth boundary
 * @param {Array} clickCallEvents - Array of click/call conversion events
 * @returns {Array} Array of batched events
 */
const batchClickCallEvents = async (clickCallEvents) => {
  const batchedResponses = [];

  // Group events that can share the same Google Ads request safely.
  const eventGroups = {};

  for (const event of clickCallEvents) {
    const groupKey = getClickCallBatchGroupKey(event);
    if (!eventGroups[groupKey]) {
      eventGroups[groupKey] = [];
    }
    eventGroups[groupKey].push(event);
  }

  // Process each group (each group has same request/account/auth boundary)
  // eslint-disable-next-line no-restricted-syntax
  for (const groupKey of Object.keys(eventGroups)) {
    const events = eventGroups[groupKey];

    // Split large groups into batches of MAX_CONVERSIONS_PER_BATCH
    for (let i = 0; i < events.length; i += MAX_CONVERSIONS_PER_BATCH) {
      const eventsChunk = events.slice(i, i + MAX_CONVERSIONS_PER_BATCH);
      // eslint-disable-next-line no-await-in-loop
      const batchedResponse = await createBatchedResponseForClickCall(eventsChunk);
      batchedResponses.push(batchedResponse);
    }
  }

  return batchedResponses;
};

const processRouterDest = async (inputs, reqMetadata) => {
  const storeSalesEvents = []; // list containing store sales events in batched format
  const clickCallEvents = []; // list containing click and call events in batched format
  const errorRespList = [];

  await forEachInBatches(inputs, async (event) => {
    try {
      if (event.message.statusCode) {
        // already transformed event
        getEventChunks(event, storeSalesEvents, clickCallEvents);
      } else {
        // if not transformed
        getEventChunks(
          {
            message: await process(event),
            metadata: event.metadata,
            destination: event.destination,
          },
          storeSalesEvents,
          clickCallEvents,
        );
      }
    } catch (error) {
      const errRespEvent = handleRtTfSingleEventError(event, error, reqMetadata);
      errorRespList.push(errRespEvent);
    }
  });

  let storeSalesEventsBatchedResponseList = [];
  let clickCallEventsBatchedResponseList = [];

  if (storeSalesEvents.length > 0) {
    storeSalesEventsBatchedResponseList = await batchEvents(storeSalesEvents);
  }

  if (clickCallEvents.length > 0) {
    clickCallEventsBatchedResponseList = await batchClickCallEvents(clickCallEvents);
  }

  let batchedResponseList = [];
  // appending all kinds of batches
  batchedResponseList = batchedResponseList
    .concat(storeSalesEventsBatchedResponseList)
    .concat(clickCallEventsBatchedResponseList)
    .concat(errorRespList);
  return combineBatchRequestsWithSameJobIds(batchedResponseList);
};

module.exports = { process, processRouterDest };
