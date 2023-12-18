/* eslint-disable no-restricted-syntax */
const groupBy = require('lodash/groupBy');
const cloneDeep = require('lodash/cloneDeep');
const {
  getIntegrationsObj,
  getHashFromArray,
  removeUndefinedAndNullValues,
  getSuccessRespEvents,
  getErrorRespEvents,
} = require('../../util');

const filterConfigTopics = (message, destination) => {
  const { Config } = destination;
  if (Config?.enableMultiTopic) {
    const eventTypeTopicMap = getHashFromArray(Config?.eventTypeToTopicMap);
    const eventNameTopicMap = getHashFromArray(Config?.eventToTopicMap, 'from', 'to', false);
    switch (message.type) {
      case 'identify':
      case 'screen':
      case 'page':
      case 'group':
      case 'alias':
        return eventTypeTopicMap[message.type];
      case 'track':
        {
          const { event: eventName } = message;
          if (eventName) {
            return eventNameTopicMap[eventName];
          }
        }
        break;
      default:
        return null;
    }
  }
  return null;
};

const batch = (destEvents) => {
  const respList = [];
  if (!Array.isArray(destEvents) || destEvents.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, 'Invalid event array');
    return [respEvents];
  }

  // Grouping the events by topic
  const groupedEvents = groupBy(destEvents, (event) => event.message.topic);

  // Creating a batched request for each topic
  // we are grouping the events based on topics
  // and creating a batched request for each topic
  // example: input events = [{event1,topic1},{event2,topic1},{event3,topic2}]
  // out from transformer:  {batchedRequest:[{event1},{event2}]}, {batchedRequest:[{event3}]} (2 multilexed responses)
  for (const events of Object.values(groupedEvents)) {
    const response = {
      batchedRequest: events.map((event) => event.message),
      metadata: events.map((event) => event.metadata),
      destination: events[0].destination,
    };
    respList.push(
      getSuccessRespEvents(response.batchedRequest, response.metadata, response.destination, true),
    );
  }
  return respList;
};

const process = (event) => {
  const { message, destination } = event;
  const integrationsObj = getIntegrationsObj(message, 'kafka');
  const { schemaId } = integrationsObj || {};

  const topic =
    integrationsObj?.topic || filterConfigTopics(message, destination) || destination.Config?.topic;

  // TODO: uncomment this when v.1.3.0 of server is avialble in all envs
  // if (!topic) {
  //   throw new InstrumentationError("Topic is required for Kafka destination");
  // }

  const userId = message.userId || message.anonymousId;
  let outputEvent;
  if (schemaId) {
    outputEvent = {
      message,
      userId,
      schemaId,
      topic,
    };
  } else {
    outputEvent = {
      message,
      userId,
      topic,
    };
  }
  return removeUndefinedAndNullValues(outputEvent);
};

/**
 * This functions takes event matadata and updates it based on the transformed and raw paylaod
 * the outputEvent is the transformed event which is guranateed to contain the topic
 * @param {*} input
 * @returns {*} metadata
 */
const processMetadata = (input) => {
  const { metadata, outputEvent } = input;
  const clonedMetadata = cloneDeep(metadata);
  const { topic } = outputEvent;
  if (topic) {
    clonedMetadata.rudderId = `${clonedMetadata.rudderId}<<>>${topic}`;
  }
  return clonedMetadata;
};

module.exports = { process, batch, processMetadata };
