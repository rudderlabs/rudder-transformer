const { getIntegrationsObj } = require("../../util");

function batch(destEvents) {
  const respList = [];
  const batchedRequest = [];
  const metadata = [];
  destEvents.forEach(event => {
    metadata.push(event.metadata);
    batchedRequest.push(event.message);
  });
  respList.push({
    batchedRequest,
    metadata,
    destination: destEvents[0].destination
  });

  return respList;
}

function process(event) {
  const integrationsObj = getIntegrationsObj(event.message, "kafka");
  const { schemaId } = integrationsObj;
  if (schemaId) {
    return {
      message: event.message,
      userId: event.message.userId || event.message.anonymousId,
      schemaId
    };
  }
  return {
    message: event.message,
    userId: event.message.userId || event.message.anonymousId
  };
}

module.exports = { process, batch };
