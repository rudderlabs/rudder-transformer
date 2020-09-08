const { getHashFromArray } = require("../../util");

function getTopic(event) {
  const { message } = event;
  const { eventToTopicMap } = event.destination.Config;
  const hashMap = getHashFromArray(eventToTopicMap, "from", "to");
  return (
    hashMap["*"] ||
    hashMap[message.type.toLowerCase()] ||
    hashMap[message.event.toLowerCase()]
  );
}

function process(event) {
  const topicId = getTopic(event);
  if (topicId) {
    return {
      message: event.message,
      userId: event.message.anonymousId,
      topicId
    };
  }
  throw new Error("No topic set for this event");
}
exports.process = process;
