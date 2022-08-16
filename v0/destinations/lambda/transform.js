const {
  getErrorRespEvents,
  getSuccessRespEvents,
  CustomError
} = require("../../util");

const DEFAULT_INVOCATION_TYPE = "Event";

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
    const batchPayload = {
      payload: JSON.stringify(msgList),
      destConfig: destination.Config
    };
    batchedResponseList.push(getSuccessRespEvents(batchPayload, batchMetadata));
  } else {
    successRespList.forEach(event => {
      batchedResponseList.push(
        getSuccessRespEvents(
          {
            payload: JSON.stringify(event.payload),
            destConfig: destination.Config
          },
          [event.metadata]
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
  destination.Config.invocationType = DEFAULT_INVOCATION_TYPE;

  if (successRespList.length > 0) {
    batchResponseList = batchEvents(successRespList, destination);
  }

  return [...batchResponseList, ...batchErrorRespList];
};

module.exports = { process, processRouterDest };
