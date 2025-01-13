const { ConfigurationError } = require('@rudderstack/integrations-lib');
const { simpleProcessRouterDest } = require('../../util');

const { getTopic, createAttributesMetadata } = require('./util');

function process(event) {
  const { message, destination } = event;
  const topicId = getTopic(event);
  if (topicId) {
    const attributes = createAttributesMetadata(message, destination);

    return {
      userId: message.userId || message.anonymousId,
      message,
      topicId,
      attributes,
    };
  }
  throw new ConfigurationError('No topic set for this event');
}

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};
module.exports = { process, processRouterDest };
