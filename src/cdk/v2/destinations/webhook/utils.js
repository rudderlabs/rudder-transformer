const { BatchUtils } = require('@rudderstack/workflow-engine');

const buildHeaderBlock = (destination) => {
  const headers = { 'content-type': 'application/json' };

  const getHashFromArray = (headersArray) => {
    const headersObject = {};
    headersArray.forEach((header) => {
      headersObject[header.key] = header.value;
    });
    return headersObject;
  };

  const configHeaders = getHashFromArray(destination.Config.headers);
  return {
    ...headers,
    ...configHeaders,
  };
};

const batchBuilder = (batch) => ({
  batchedRequest: {
    body: {
      JSON: batch,
      JSON_ARRAY: {},
      XML: {},
      FORM: {},
    },
    version: '1',
    type: 'REST',
    method: 'POST',
    endpoint: batch[0].destination.Config.webhookUrl,
    headers: buildHeaderBlock(batch[0].destination),
    params: {},
    files: {},
  },
  metadata: '',
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
  const batches = BatchUtils.chunkArrayBySizeAndLength(events, {
    maxItems: events[0].destination.Config.maxBatchSize || 1,
  });
  const response = [];
  batches.items.forEach((batch) => {
    response.push(batchBuilder(batch));
  });
  return response;
};

module.exports = { batchResponseBuilder };
