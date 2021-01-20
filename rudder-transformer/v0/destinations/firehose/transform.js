const { getHashFromArray } = require("../../util");

function getDeliveryStreamMapTo(event) {
  const { message } = event;
  const { mapEvents } = event.destination.Config;
  const hashMap = getHashFromArray(mapEvents, "from", "to");
  return (
    (message.event ? hashMap[message.event.toLowerCase()] : null) ||
    hashMap[message.type.toLowerCase()] ||
    hashMap["*"]
  );
}

function process(event) {
  const deliveryStreamMapTo = getDeliveryStreamMapTo(event);
  if (deliveryStreamMapTo) {
    return {
      message: event.message,
      userId: event.message.anonymousId,
      deliveryStreamMapTo
    };
  }
  throw new Error("No delivery stream set for this event");
}
exports.process = process;
