/* eslint-disable no-restricted-syntax */
const cloneDeep = require("lodash/cloneDeep");
const { getIntegrationsObj } = require("../../util");

function batch(destEvents) {
  const respList = [];

  // Grouping the events by topic
  const groupedEvents = destEvents.reduce((acc, event) => {
    const { topic } = event.message;
    if (acc[topic]) {
      acc[topic].push(event);
    } else {
      acc[topic] = [event];
    }
    return acc;
  }, {});

  // Creating a batched request for each topic
  // we are grouping the events based on topics
  // and creating a batched request for each topic
  // example: input events = [{event1,topic1},{event2,topic1},{event3,topic2}]
  // out from transformer:  {batchedRequest:[{event1},{event2}]}, {batchedRequest:[{event3}]} (2 multilexed responses)
  for (const [events] of Object.entries(groupedEvents)) {
    const response = {
      batchedRequest: [],
      metadata: []
    };
    response.batchedRequest.push(events.map(event => event.message));
    response.metadata.push(events.map(event => event.metadata));
    respList.push(response);
  }

  return respList;
}

function process(event) {
  const { message, destination } = event;
  const integrationsObj = getIntegrationsObj(message, "kafka");
  const { schemaId } = integrationsObj || {};
  const topic = integrationsObj?.topic || destination.Config.topic;
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
 * the outputEvent is the transformed event which is guranateed to contain the topic
 * @param {*} input
 * @returns {*} metadata
 */
function processMetadata(input) {
  const { metadata, outputEvent } = input;
  const clonedMetadata = cloneDeep(metadata);
  const { topic } = outputEvent;
  if (topic) {
    clonedMetadata.rudderId = `${clonedMetadata.rudderId}<<>>${topic}`;
  }
  return clonedMetadata;
}

module.exports = { process, batch, processMetadata };
