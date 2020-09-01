const { getHashFromArray } = require("../../util");

function getTopic(event) {
  const { message } = event;
  const { eventToTopicMap } = event.destination.Config;
  const hashMap = getHashFromArray(eventToTopicMap, "from", "to");
  return hashMap["*"] || hashMap[message.type] || hashMap[message.event];
}

function process(event) {
  const topicPath = getTopic(event);
  if (topicPath) {
    const splitPath = topicPath.split("/");
    if (splitPath && splitPath.length === 4) {
      const topicId = splitPath[3];
      if (topicId) {
        return {
          message: event.message,
          userId: event.message.anonymousId,
          topicId
        };
      }
      throw new Error("Topic id cannot be null.");
    }
    throw new Error("Topic path without topic id.");
  }
  throw new Error("No topic set for this event");
}
exports.process = process;
