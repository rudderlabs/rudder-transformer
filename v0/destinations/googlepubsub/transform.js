const { getTopic, createAttributesMetadata } = require("./util");

function process(event) {
  const { message, destination } = event;
  const topicId = getTopic(event);
  if (topicId) {
    const attributes = createAttributesMetadata(message, destination);

    return {
      userId: message.userId || message.anonymousId,
      message,
      topicId,
      attributes
    };
  }
  throw new Error("No topic set for this event");
}
exports.process = process;
