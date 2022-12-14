const _ = require("lodash");
const { getErrorRespEvents, getSuccessRespEvents } = require("../../util");
const { ConfigurationError } = require("../../util/errorTypes");

const DEFAULT_INVOCATION_TYPE = "Event"; // asynchronous invocation
const MAX_PAYLOAD_SIZE_IN_KB = 256; // only for asynchronous invocation

// Returns a transformed payload, after necessary property/field mappings.
function process(event) {
  if (!event.destination.Config) {
    throw new ConfigurationError("destination.Config cannot be undefined");
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
function getBatchedPayloads(inputs, maxBatchSize, sizesInKB) {
  const batchedPayloads = [];
  let payloadChunk = [];
  let payloadChunkSizeInKB = getSizeInKB(payloadChunk);
  let chunkMetadata = [];
  inputs.forEach(input => {
    const inputSizeInKB = sizesInKB.get(input.metadata.jobId);
    if (
      payloadChunk.length.toString() === maxBatchSize ||
      payloadChunkSizeInKB + inputSizeInKB > MAX_PAYLOAD_SIZE_IN_KB
    ) {
      batchedPayloads.push({ payloadChunk, chunkMetadata });
      payloadChunk = [input.message];
      chunkMetadata = [input.metadata];
      payloadChunkSizeInKB = inputSizeInKB;
    } else {
      payloadChunk.push(input.message);
      chunkMetadata.push(input.metadata);
    }
  });
  if (payloadChunk.length > 0) {
    batchedPayloads.push({ payloadChunk, chunkMetadata });
  }
  return batchedPayloads;
}

// Returns a batched response list for a list of inputs
function batchEvents(inputs, destConfig, sizesInKB) {
  const batchedResponseList = [];
  const { maxBatchSize } = destConfig;
  const batchedPayloads = getBatchedPayloads(inputs, maxBatchSize, sizesInKB);
  batchedPayloads.forEach(data => {
    const message = {
      payload: JSON.stringify(data.payloadChunk),
      destConfig
    };
    batchedResponseList.push(getSuccessRespEvents(message, data.chunkMetadata));
  });

  return batchedResponseList;
}

function responseBuilderSimple(inputs, destConfig) {
  const processedEventList = [];
  inputs.forEach(input => {
    const message = {
      payload: JSON.stringify(input.message),
      destConfig
    };
    processedEventList.push(getSuccessRespEvents(message, [input.metadata]));
  });
  return processedEventList;
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

  const successEventsList = [];
  const errorMetadata = [];
  const errorResponseList = [];
  const sizesInKB = new Map();

  inputs.forEach(input => {
    const sizeInKB = getSizeInKB([input.message]);
    if (sizeInKB > MAX_PAYLOAD_SIZE_IN_KB) {
      errorMetadata.push(input.metadata);
    } else {
      successEventsList.push(input);
      sizesInKB.set(input.metadata.jobId, sizeInKB); // metadata.jobId is unique/mandatory for each event in a batch
    }
  });

  if (errorMetadata.length > 0) {
    errorResponseList.push(
      getErrorRespEvents(errorMetadata, 400, "payload size limit exceeded")
    );
  }

  let successResponseList;
  const { enableBatchInput } = destConfig;
  if (enableBatchInput) {
    successResponseList = batchEvents(successEventsList, destConfig, sizesInKB);
  } else {
    successResponseList = responseBuilderSimple(successEventsList, destConfig);
  }

  return [...successResponseList, ...errorResponseList];
};

module.exports = { process, processRouterDest };
