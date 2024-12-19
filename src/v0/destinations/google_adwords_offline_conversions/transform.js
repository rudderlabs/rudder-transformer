const { set, get } = require('lodash');
const { InstrumentationError, ConfigurationError } = require('@rudderstack/integrations-lib');
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
const { CALL_CONVERSION, STORE_CONVERSION_CONFIG } = require('./config');
const {
  validateDestinationConfig,
  getStoreConversionPayload,
  requestBuilder,
  getClickConversionPayloadAndEndpoint,
  getConsentsDataFromIntegrationObj,
  getCallConversionPayload,
  updateConversion,
} = require('./utils');
const helper = require('./helper');

/**
 * get conversions depending on the type set from dashboard
 * i.e click conversions or call conversions
 * @param {*} message
 * @param {*} metadata
 * @param {*} param2
 * @param {*} event
 * @param {*} conversionType
 * @returns
 */
const getConversions = (message, metadata, { Config }, event, conversionType) => {
  let payload = {};
  let endpoint;
  const { customerId } = Config;
  const { properties, timestamp, originalTimestamp } = message;

  const filteredCustomerId = removeHyphens(customerId);
  const eventLevelConsentsData = getConsentsDataFromIntegrationObj(message);

  if (conversionType === 'click') {
    // click conversion
    const convertedPayload = getClickConversionPayloadAndEndpoint(
      message,
      Config,
      filteredCustomerId,
      eventLevelConsentsData,
    );
    convertedPayload.payload.conversions[0] = updateConversion(
      convertedPayload.payload.conversions[0],
    );
    payload = convertedPayload.payload;
    endpoint = convertedPayload.endpoint;
  } else if (conversionType === 'store') {
    payload = getStoreConversionPayload(message, Config, filteredCustomerId);
    endpoint = STORE_CONVERSION_CONFIG.replace(':customerId', filteredCustomerId);
  } else {
    // call conversions
    payload = getCallConversionPayload(message, Config, eventLevelConsentsData);
    endpoint = CALL_CONVERSION.replace(':customerId', filteredCustomerId);
  }

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
  return requestBuilder(payload, endpoint, Config, metadata, event, filteredCustomerId, properties);
};

/**
 * response builder for track
 * @param {*} message
 * @param {*} metadata
 * @param {*} destination
 * @returns
 */
const trackResponseBuilder = (message, metadata, destination) => {
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
  const conversionTypes = Array.from(eventsToOfflineConversionsTypeMapping[event]);
  conversionTypes.forEach((conversionType) => {
    responseList.push(
      getConversions(
        message,
        metadata,
        destination,
        eventsToConversionsNamesMapping[event],
        conversionType,
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
    response = trackResponseBuilder(message, metadata, destination);
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
      clickCallEvents.push(getSuccessRespEvents(message, [metadata], destination));
    }
  });
  return { storeSalesEvents, clickCallEvents };
};

const batchEvents = (storeSalesEvents) => {
  const batchEventResponse = defaultBatchRequestConfig();
  batchEventResponse.metadatas = [];
  set(batchEventResponse, 'batchedRequest.body.JSON', storeSalesEvents[0].message.body.JSON);
  set(batchEventResponse, 'batchedRequest.body.JSON.addConversionPayload.operations', [
    get(storeSalesEvents[0], 'message.body.JSON.addConversionPayload.operations'),
  ]);
  batchEventResponse.metadatas.push(storeSalesEvents[0].metadata);
  const { params, headers, endpoint } = storeSalesEvents[0].message;
  batchEventResponse.batchedRequest.params = params;
  batchEventResponse.batchedRequest.headers = headers;
  batchEventResponse.batchedRequest.endpoint = endpoint;
  storeSalesEvents.forEach((storeSalesEvent, index) => {
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

const processRouterDest = async (inputs, reqMetadata) => {
  const storeSalesEvents = []; // list containing store sales events in batched format
  const clickCallEvents = []; // list containing click and call events in batched format
  const errorRespList = [];
  await Promise.all(
    inputs.map(async (event) => {
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
    }),
  );
  let storeSalesEventsBatchedResponseList = [];

  if (storeSalesEvents.length > 0) {
    storeSalesEventsBatchedResponseList = batchEvents(storeSalesEvents);
  }

  let batchedResponseList = [];
  // appending all kinds of batches
  batchedResponseList = batchedResponseList
    .concat(storeSalesEventsBatchedResponseList)
    .concat(clickCallEvents)
    .concat(errorRespList);
  return combineBatchRequestsWithSameJobIds(batchedResponseList);
};

module.exports = { process, processRouterDest };
