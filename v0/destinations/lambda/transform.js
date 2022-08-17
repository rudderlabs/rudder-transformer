const _ = require("lodash");
const {
  getErrorRespEvents,
  getSuccessRespEvents,
  CustomError
} = require("../../util");

const DEFAULT_INVOCATION_TYPE = "Event";
const MAX_PAYLOAD_SIZE_IN_KB = 256;

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

// Returns an array of payloads within the size limit
function payloadSizeRegulator(payload) {
  const size = Buffer.byteLength(JSON.stringify(payload));
  const sizeInKB = size / 1024;
  if (sizeInKB > MAX_PAYLOAD_SIZE_IN_KB) {
    const chunkSize = sizeInKB / MAX_PAYLOAD_SIZE_IN_KB;
    return _.chunk(payload, chunkSize);
  }
  return [payload];
}

// Returns a batched response list for list of inputs
function batchEvents(inputs, destination) {
  const batchedResponseList = [];
  const { enableBatchInput } = destination.Config;
  if (enableBatchInput) {
    const msgList = [];
    const batchMetadata = [];
    inputs.forEach(input => {
      msgList.push(input.message);
      batchMetadata.push(input.metadata);
    });
    const payloadChunks = payloadSizeRegulator(msgList);
    payloadChunks.forEach(chunk => {
      const batchPayload = {
        payload: JSON.stringify(chunk),
        destConfig: destination.Config
      };
      batchedResponseList.push(
        getSuccessRespEvents(batchPayload, batchMetadata)
      );
    });
  } else {
    inputs.forEach(input => {
      batchedResponseList.push(
        getSuccessRespEvents(
          {
            payload: JSON.stringify(input.message),
            destConfig: destination.Config
          },
          [input.metadata]
        )
      );
    });
  }
  return batchedResponseList;
}

// Router transform with batching by default
const processRouterDest = inputs => {
  const batchMetadata = [];
  inputs.forEach(input => {
    batchMetadata.push(input.metadata);
  });

  const { destination } = inputs[0];
  if (!destination.Config) {
    const respEvents = getErrorRespEvents(
      batchMetadata,
      400,
      "destination.Config cannot be undefined"
    );
    return [respEvents];
  }
  destination.Config.invocationType = DEFAULT_INVOCATION_TYPE;

  return batchEvents(inputs, destination);
};

module.exports = { process, processRouterDest };
