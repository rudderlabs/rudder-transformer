const { defaultPostRequestConfig } = require('../../util');
const {
  defaultRequestConfig,
  getSuccessRespEvents,
  defaultBatchRequestConfig,
  removeUndefinedAndNullValues,
  batchMultiplexedEvents,
} = require('../../util');

const { MAX_BATCH_SIZE } = require('./config');

const responseBuilderSimpleNew = (finalPayload, endpoint, conversionToken) => {
  const response = defaultRequestConfig();
  response.endpoint = endpoint;
  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON = removeUndefinedAndNullValues(finalPayload);
  return {
    ...response,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${conversionToken}`,
    },
  };
};

const generateBatchedPayloadForArray = (events, endpoint, conversionToken) => {
  const { batchedRequest } = defaultBatchRequestConfig();
  const batchResponseList = events.map((event) => event.body.JSON);

  batchedRequest.body.JSON = {
    data: batchResponseList,
  };
  batchedRequest.endpoint = endpoint;
  batchedRequest.headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${conversionToken}`,
  };
  return batchedRequest;
};

const batchEventsNew = (successRespList, endpoint, conversionToken) => {
  const batchResponseList = [];
  const batchedEvents = batchMultiplexedEvents(successRespList, MAX_BATCH_SIZE);
  batchedEvents.forEach((batch) => {
    const batchedRequest = generateBatchedPayloadForArray(batch.events, endpoint, conversionToken);
    batchResponseList.push(
      getSuccessRespEvents(batchedRequest, batch.metadata, batch.destination, true),
    );
  });

  return batchResponseList;
};

module.exports = { responseBuilderSimpleNew, batchEventsNew };
