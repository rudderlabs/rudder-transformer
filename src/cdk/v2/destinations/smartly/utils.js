const { BatchUtils } = require('@rudderstack/workflow-engine');
const { InstrumentationError } = require('@rudderstack/integrations-lib');
const moment = require('moment');
const config = require('./config');
const {
  getHashFromArrayWithDuplicate,
  defaultRequestConfig,
  isDefinedAndNotNull,
} = require('../../../../v0/util');

// docs reference : https://support.smartly.io/hc/en-us/articles/4406049685788-S2S-integration-API-description#01H8HBXZF6WSKSYBW1C6NY8A88

/**
 * This function generates an array of payload objects, each with the event property set
 * to different values associated with the given event name according to eventsMapping
 * @param {*} event
 * @param {*} eventsMapping
 * @param {*} payload
 * @returns
 */
const getPayloads = (event, Config, payload) => {
  if (!isDefinedAndNotNull(event) || typeof event !== 'string') {
    throw new InstrumentationError('Event is not defined or is not String');
  }
  const eventsMap = getHashFromArrayWithDuplicate(Config.eventsMapping);
  // eventsMap = hashmap {"prop1":["val1","val2"],"prop2":["val2"]}
  const eventList = Array.isArray(eventsMap[event.toLowerCase()])
    ? eventsMap[event.toLowerCase()]
    : Array.from(eventsMap[event.toLowerCase()] || [event]);

  const payloadLists = eventList.map((ev) => ({ ...payload, event_name: ev }));
  return payloadLists;
};

//  ad_interaction_time must be within one year in the future and three years in the past from the current date
// Example : "1735680000"
const verifyAdInteractionTime = (adInteractionTime) => {
  if (isDefinedAndNotNull(adInteractionTime)) {
    const now = moment();
    const threeYearAgo = now.clone().subtract(3, 'year');
    const oneYearFromNow = now.clone().add(1, 'year');
    const inputMoment = moment(adInteractionTime * 1000); // Convert to milliseconds
    if (!inputMoment.isAfter(threeYearAgo) || !inputMoment.isBefore(oneYearFromNow)) {
      throw new InstrumentationError(
        'ad_interaction_time must be within one year in the future and three years in the past.',
      );
    }
  }
};

const buildResponseList = (payloadList) =>
  payloadList.map((payload) => {
    const response = defaultRequestConfig();
    response.body.JSON = payload;
    response.endpoint = config.singleEventEndpoint;
    response.method = 'POST';
    return response;
  });

const batchBuilder = (batch, destination) => ({
  batchedRequest: {
    body: {
      JSON: { events: batch.map((event) => event.output) },
      JSON_ARRAY: {},
      XML: {},
      FORM: {},
    },
    version: '1',
    type: 'REST',
    method: 'POST',
    endpoint: config.batchEndpoint,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${destination.Config.apiToken}`,
    },
    params: {},
    files: {},
  },
  metadata: batch
    .map((event) => event.metadata)
    .filter((metadata, index, self) => self.findIndex((m) => m.jobId === metadata.jobId) === index), // handling jobId duplication for multiplexed events
  batched: true,
  statusCode: 200,
  destination: batch[0].destination,
});

/**
 * This fucntions make chunk of successful events based on MAX_BATCH_SIZE
 * and then build the response for each chunk to be returned as object of an array
 * @param {*} events
 * @returns
 */
const batchResponseBuilder = (events) => {
  if (events.length === 0) {
    return [];
  }
  const { destination } = events[0];
  const batches = BatchUtils.chunkArrayBySizeAndLength(events, { maxItems: config.MAX_BATCH_SIZE });

  const response = [];
  batches.items.forEach((batch) => {
    const batchedResponse = batchBuilder(batch, destination);
    response.push(batchedResponse);
  });
  return response;
};

module.exports = { batchResponseBuilder, getPayloads, buildResponseList, verifyAdInteractionTime };
