const { cloneDeep } = require("lodash/cloneDeep");
const { getIntegrationsObj } = require("../../util");

function process(event) {
  const { message, destination } = event;
  const integrationsObj = getIntegrationsObj(message, "confluent_cloud");
  const topic = integrationsObj?.topic || destination.Config?.topic;
  // TODO: Remove commented lines after server release
  // if (!topic) {
  //   throw new ErrorBuilder()
  //     .setStatus(400)
  //     .setMessage("Topic is required for Kafka destination")
  //     .isTransformResponseFailure(true)
  //     .setStatTags({
  //       destType: "AZURE_EVENT_HUB",
  //       stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.RESPONSE_TRANSFORM,
  //       scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
  //       meta: getDynamicMeta(400)
  //     })
  //     .build();
  // }
  const result = {
    message: event.message,
    userId: event.message.userId || event.message.anonymousId,
    topic
  };
  return result;
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
module.exports = { process, processMetadata };

exports.process = process;
