const _ = require("lodash");
const {
  getErrorRespEvents,
  getSuccessRespEvents,
  CustomError
} = require("../../util");

const DEFAULT_INVOCATION_TYPE = "Event"; // asynchronous invocation
const MAX_PAYLOAD_SIZE_IN_KB = 256; // only for asynchronous invocation

// Returns a transformed payload, after necessary property/field mappings.
function process(event) {
  if (!event.destination.Config) {
    throw new CustomError("destination.Config cannot be undefined", 400);
  }
  return {
    payload: JSON.stringify(event.message),
    destConfig: event.destination.Config
  };
}

// Returns the size of the data in kilobytes
function getSizeInKB(data) {
  const size = Buffer.byteLength(JSON.stringify(data));
  return size / 1024;
}

// Returns an array of payloads within the size limit
function getBatchedPayloads(inputs, maxBatchSize) {
  const batchedPayloads = [];
  let payloadChunk = [];
  let chunkMetadata = [];
  const errorMetadata = [];
  inputs.forEach(input => {
    if (getSizeInKB([input.message]) > MAX_PAYLOAD_SIZE_IN_KB) {
      errorMetadata.push(input.metadata);
      return;
    }
    if (
      payloadChunk.length.toString() === maxBatchSize ||
      getSizeInKB([...payloadChunk, input.message]) > MAX_PAYLOAD_SIZE_IN_KB
    ) {
      batchedPayloads.push({ payloadChunk, chunkMetadata });
      payloadChunk = [input.message];
      chunkMetadata = [input.metadata];
    } else {
      payloadChunk.push(input.message);
      chunkMetadata.push(input.metadata);
    }
  });
  if (payloadChunk.length > 0) {
    batchedPayloads.push({ payloadChunk, chunkMetadata });
  }
  return { batchedPayloads, errorMetadata };
}

// Returns a batched response list for a list of inputs
function batchEvents(inputs, destConfig) {
  const batchedResponseList = [];
  const { enableBatchInput, maxBatchSize } = destConfig;
  if (enableBatchInput) {
    const { batchedPayloads, errorMetadata } = getBatchedPayloads(
      inputs,
      maxBatchSize
    );
    batchedPayloads.forEach(data => {
      const batchPayload = {
        payload: JSON.stringify(data.payloadChunk),
        destConfig
      };
      batchedResponseList.push(
        getSuccessRespEvents(batchPayload, data.chunkMetadata)
      );
    });
    if (errorMetadata.length > 0) {
      batchedResponseList.push(
        getErrorRespEvents(errorMetadata, 400, "payload size limit exceeded")
      );
    }
  } else {
    inputs.forEach(input => {
      if (getSizeInKB(input.message) < MAX_PAYLOAD_SIZE_IN_KB) {
        const batchPayload = {
          payload: JSON.stringify(input.message),
          destConfig
        };
        batchedResponseList.push(
          getSuccessRespEvents(batchPayload, [input.metadata])
        );
      } else {
        batchedResponseList.push(
          getErrorRespEvents(
            [input.metadata],
            400,
            "payload size limit exceeded"
          )
        );
      }
    });
  }
  return batchedResponseList;
}

// Router transform with batching by default
const processRouterDest = inputs => {
  const { destination } = inputs[0];
  if (!destination.Config) {
    const batchMetadata = [];
    inputs.forEach(input => {
      batchMetadata.push(input.metadata);
    });
    const respEvents = getErrorRespEvents(
      batchMetadata,
      400,
      "destination.Config cannot be undefined"
    );
    return [respEvents];
  }
  const destConfig = _.cloneDeep(destination.Config);
  destConfig.invocationType = DEFAULT_INVOCATION_TYPE;

  return batchEvents(inputs, destConfig);
};

module.exports = { process, processRouterDest };
