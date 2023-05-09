const isString = require('lodash/isString');
const { getHashFromArray, simpleProcessRouterDest } = require('../../util');
const { ConfigurationError } = require('../../util/errorTypes');

function getDeliveryStreamMapTo(event) {
  const { message, destination } = event;
  const { mapEvents } = destination.Config;
  const hashMap = getHashFromArray(mapEvents, 'from', 'to');
  return (
    (isString(message.event) && message.event.length > 0
      ? hashMap[message?.event.toLowerCase()]
      : null) ||
    (message.type ? hashMap[message.type.toLowerCase()] : null) ||
    hashMap['*']
  );
}

function process(event) {
  const deliveryStreamMapTo = getDeliveryStreamMapTo(event);
  if (deliveryStreamMapTo) {
    return {
      message: event.message,
      userId: event.message.anonymousId,
      deliveryStreamMapTo,
    };
  }
  throw new ConfigurationError('No delivery stream set for this event');
}
const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
