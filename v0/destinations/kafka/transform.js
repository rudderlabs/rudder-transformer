/* eslint-disable no-restricted-syntax */
const groupBy = require("lodash/groupBy");
const cloneDeep = require("lodash/cloneDeep");
// const { getDynamicMeta } = require("../../../adapters/utils/networkUtils");
const { getIntegrationsObj } = require("../../util");
// const { TRANSFORMER_METRIC } = require("../../util/constant");
// const ErrorBuilder = require("../../util/error");

function batch(destEvents) {
  const respList = [];

  // Grouping the events by topic
  const groupedEvents = groupBy(destEvents, event => {
    return event.message.topic;
  });

  // Creating a batched request for each topic
  // we are grouping the events based on topics
  // and creating a batched request for each topic
  // example: input events = [{event1,topic1},{event2,topic1},{event3,topic2}]
  // out from transformer:  {batchedRequest:[{event1},{event2}]}, {batchedRequest:[{event3}]} (2 multilexed responses)
  for (const events of Object.values(groupedEvents)) {
    const response = {};
    response.batchedRequest = events.map(event => event.message);
    response.metadata = events.map(event => event.metadata);
    response.destination = events[0].destination;
    respList.push(response);
  }

  return respList;
}

function process(event) {
  const { message, destination } = event;
  const integrationsObj = getIntegrationsObj(message, "kafka");
  const { schemaId } = integrationsObj || {};
  const topic = integrationsObj?.topic || destination.Config?.topic;
  // TODO: Remove commented lines after server release
  // if (!topic) {
  //   throw new ErrorBuilder()
  //     .setStatus(400)
  //     .setMessage("Topic is required for Kafka destination")
  //     .isTransformResponseFailure(true)
  //     .setStatTags({
  //       destType: "KAFKA",
  //       stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.RESPONSE_TRANSFORM,
  //       scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
  //       meta: getDynamicMeta(400)
  //     })
  //     .build();
  // }
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
