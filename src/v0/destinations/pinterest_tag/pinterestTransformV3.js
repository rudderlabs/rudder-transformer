const { defaultPostRequestConfig } = require('../../util');
const {
  defaultRequestConfig,
  getSuccessRespEvents,
  defaultBatchRequestConfig,
  removeUndefinedAndNullValues,
  batchMultiplexedEvents,
} = require('../../util');

const { MAX_BATCH_SIZE, ENDPOINT } = require('./config');

const responseBuilderSimple = (finalPayload) => {
  const response = defaultRequestConfig();
  response.endpoint = ENDPOINT;
  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON = removeUndefinedAndNullValues(finalPayload);
  return {
    ...response,
    headers: {
      'Content-Type': 'application/json',
    },
  };
};

const generateBatchedPayloadForArray = (events) => {
  const { batchedRequest } = defaultBatchRequestConfig();
  const batchResponseList = events.map((event) => event.body.JSON);

  batchedRequest.body.JSON = {
    data: batchResponseList,
  };
  batchedRequest.endpoint = ENDPOINT;
  batchedRequest.headers = {
    'Content-Type': 'application/json',
  };
  return batchedRequest;
};

const batchEvents = (successRespList) => {
  const batchResponseList = [];
  const batchedEvents = batchMultiplexedEvents(successRespList, MAX_BATCH_SIZE);
  batchedEvents.forEach((batch) => {
    const batchedRequest = generateBatchedPayloadForArray(batch.events);
    batchResponseList.push(
      getSuccessRespEvents(batchedRequest, batch.metadata, batch.destination, true),
    );
  });

  return batchResponseList;
};

module.exports = { responseBuilderSimple, batchEvents };
