const cloneDeep = require("lodash/cloneDeep");
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
  const { message } = event;
  const integrationsObj = getIntegrationsObj(message, "kafka");
  const { schemaId, topic } = integrationsObj || {};
  const userId = message.userId || message.anonymousId;
  if (schemaId) {
    return {
      message,
      userId,
      schemaId,
      topic
    };
  }
  return {
    message,
    userId,
    topic
  };
}

/**
 * This functions takes event matadata and updates it based on the transformed and raw paylaod
 * @param {*} input
 * @returns {*} metadata
 */
function processMetadata(input) {
  const { metadata, inputEvent } = input;
  const clonedMetadata = cloneDeep(metadata);
  const integrationsObj = getIntegrationsObj(inputEvent.message, "kafka");
  const { topic } = integrationsObj || {};
  if (topic) {
    clonedMetadata.rudderId = `${clonedMetadata.rudderId}<<>>${topic}`;
  }
  return clonedMetadata;
}

module.exports = { process, batch, processMetadata };
