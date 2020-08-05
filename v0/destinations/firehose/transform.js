const { getHashFromArray } = require("../../util");

function getDeliveryStreamMapTo(event) {
  const { message } = event;
  const { mapEvents } = event.destination.Config;
  const hashMap = getHashFromArray(mapEvents, "from", "to");
  return hashMap["*"] || hashMap[message.type] || hashMap[message.event];
}

function process(event) {
  const deliveryStreamMapTo = getDeliveryStreamMapTo(event);
  if (deliveryStreamMapTo) {
    return {
      message: event.message,
      userId: event.message.userId || event.message.anonymousId,
      deliveryStreamMapTo
    };
  }
  throw new Error("No delivery stream set for this event");
}

exports.process = process;
