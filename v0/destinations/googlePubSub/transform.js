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
    const projectId = splitPath[1];
    const topicId = splitPath[3];
    return {
      message: event.message,
      userId: event.message.anonymousId,
      projectId,
      topicId
    };
  }
  throw new Error("No topic set for this event");
}
exports.process = process;
