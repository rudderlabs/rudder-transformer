const { getErrorRespEvents, getSuccessRespEvents } = require("../../util");

function process(event) {
  return {
    payload: event.message
  };
}

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

const processRouterDest = async inputs => {
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }

  let batchResponseList = [];
  const batchErrorRespList = [];
  const successRespList = [];
  const { destination } = inputs[0];

  if (!destination.Config) {
    const respEvents = getErrorRespEvents(
      null,
      400,
      "destination.Config cannot be undefined"
    );
    return [respEvents];
  }

  inputs.forEach(event => {
    successRespList.push({
      payload: event.message,
      metadata: event.metadata
    });
  });

  if (successRespList.length > 0) {
    batchResponseList = batchEvents(successRespList, destination);
  }

  return [...batchResponseList, ...batchErrorRespList];
};

module.exports = { process, processRouterDest };
