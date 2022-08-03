const { getErrorRespEvents, getSuccessRespEvents } = require("../../util");

// Returns a transformed payload, after necessary property/field mappings.
function process(event) {
  return {
    payload: event.message
  };
}

// Returns a batched response list for a for list of inputs(successRespList)
function batchEvents(successRespList, destination) {
  const batchedResponseList = [];
  const { enableBatchInput } = destination.Config;
  if (enableBatchInput) {
    const msgList = [];
    const batchMetadata = [];
    successRespList.forEach(event => {
      msgList.push(event.payload);
      batchMetadata.push(event.metadata);
    });
    const batchPayload = { payload: msgList };
    batchedResponseList.push(
      getSuccessRespEvents(batchPayload, batchMetadata, destination)
    );
  } else {
    successRespList.forEach(event => {
      batchedResponseList.push(
        getSuccessRespEvents(
          { payload: event.payload },
          [event.metadata],
          destination
        )
      );
    });
  }
  return batchedResponseList;
}

// Router transform with batching by default
const processRouterDest = inputs => {
  let batchResponseList = [];
  const batchErrorRespList = [];
  const successRespList = [];
  const batchMetadata = [];

  inputs.forEach(input => {
    successRespList.push({
      payload: input.message,
      metadata: input.metadata
    });
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

  if (successRespList.length > 0) {
    batchResponseList = batchEvents(successRespList, destination);
  }

  return [...batchResponseList, ...batchErrorRespList];
};

module.exports = { process, processRouterDest };
