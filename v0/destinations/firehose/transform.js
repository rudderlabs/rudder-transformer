function getDeliveryStreamMapTo(event) {
  const config = event.destination.Config;
  const { message } = event;

  const { mapEvents } = config;
  let check = true;
  let deliveryStreamMapFrom;
  let deliveryStreamMapTo;
  mapEvents.forEach(mapEvent => {
    deliveryStreamMapFrom = mapEvent.from;
    if (deliveryStreamMapFrom === "*") {
      check = false;
      deliveryStreamMapTo = mapEvent.to;
    }
  });

  if (check) {
    mapEvents.forEach(mapEvent => {
      deliveryStreamMapFrom = mapEvent.from;
      if (deliveryStreamMapFrom === message.type) {
        check = false;
        deliveryStreamMapTo = mapEvent.to;
      }
    });
  }
  if (check) {
    mapEvents.forEach(mapEvent => {
      deliveryStreamMapFrom = mapEvent.from;
      if (deliveryStreamMapFrom === message.event) {
        deliveryStreamMapTo = mapEvent.to;
      }
    });
  }
  return deliveryStreamMapTo;
}

function process(event) {
  const result = {
    message: event.message,
    userId: event.message.userId || event.message.anonymousId,
    deliveryStreamMapTo: getDeliveryStreamMapTo(event)
  };
  return result;
}

exports.process = process;
