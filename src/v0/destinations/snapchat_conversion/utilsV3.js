const { BatchUtils } = require('@rudderstack/workflow-engine');
const { MAX_BATCH_SIZE } = require('./config');

const getMergedPayload = (batch) => ({
  data: batch.flatMap((input) => input.message.body.JSON.data[0]),
});

const getMergedMetadata = (batch) => batch.map((input) => input.metadata);

const buildBatchedResponse = (
  mergedPayload,
  endpoint,
  headers,
  params,
  method,
  metadata,
  destination,
) => ({
  batchedRequest: {
    body: {
      JSON: mergedPayload,
      JSON_ARRAY: {},
      XML: {},
      FORM: {},
    },
    version: '1',
    type: 'REST',
    method: 'POST',
    endpoint,
    headers,
    params,
    files: {},
  },
  metadata,
  batched: true,
  statusCode: 200,
  destination,
});
const processBatch = (eventsChunk) => {
  if (!eventsChunk?.length) {
    return [];
  }
  const batches = BatchUtils.chunkArrayBySizeAndLength(eventsChunk, { maxItems: MAX_BATCH_SIZE });
  return batches.items.map((batch) => {
    const mergedPayload = getMergedPayload(batch);
    const mergedMetadata = getMergedMetadata(batch);
    const { endpoint, headers, params, method } = batch[0].message;
    return buildBatchedResponse(
      mergedPayload,
      endpoint,
      headers,
      params,
      method,
      mergedMetadata,
      batch[0].destination,
    );
  });
};
const batchResponseBuilder = (webOrOfflineEventsChunk, mobileEventsChunk) => {
  const webOrOfflineEventsResp = processBatch(webOrOfflineEventsChunk);
  const mobileEventsResp = processBatch(mobileEventsChunk);
  return [...webOrOfflineEventsResp, ...mobileEventsResp];
};

module.exports = {
  batchResponseBuilder,
};
