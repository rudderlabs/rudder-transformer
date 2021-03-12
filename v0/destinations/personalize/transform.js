const { getHashFromArray } = require("../../util");

function getDeliveryStreamMapTo(event) {
  const { message } = event;
  const { eventName } = event.destination.Config;
  const hashMap = getHashFromArray(eventName, "from", "to");
  return hashMap[message.event.toLowerCase()];
}

async function process(event) {
  const payload = {};
  const noOfFields = event.destination.Config.customMappings.length;
  const keyField = [];
  const mappedField = [];
  const property = {};
  const { message } = event;

  for (let i = 0; i < noOfFields; i += 1) {
    keyField.push(event.destination.Config.customMappings[i].from);
  }

  for (let j = 0; j < noOfFields; j += 1) {
    mappedField.push(event.destination.Config.customMappings[j].to);
  }
  const deliveryStreamMapTo = getDeliveryStreamMapTo(event);
  if (deliveryStreamMapTo) {
    for (let k = 0; k < noOfFields; k += 1) {
      if (
        !(
          keyField[k].toUpperCase() === "USER_ID" ||
          keyField[k].toUpperCase() === "EVENT_TYPE" ||
          keyField[k].toUpperCase() === "TIMESTAMP"
        )
      ) {
        const mappedFields = mappedField[k];

        keyField[k] = keyField[k]
          .toLowerCase()
          .replace(/_([a-z])/g, function (g) {
            return g[1].toUpperCase();
          });
        if (message.properties && message.properties[mappedFields]) {
          property[keyField[k]] = message.properties[mappedFields];
        } else if (typeof message[mappedFields] !== "undefined") {
          property[keyField[k]] = message[mappedFields];
        } else {
          throw new Error(`Mapped Field ${mappedFields} not found`);
        }
      }
    }
    const eventList = [];
    const eventObj = {};

    if (property.eventValue) {
      eventObj.eventValue = property.eventValue;
      delete property.eventValue;
    }
    if (property.impression) {
      eventObj.impression = property.impression;
      delete property.impression;
    }
    if (property.itemId) {
      eventObj.itemId = property.itemId;
      delete property.itemId;
    }
    if (property.recommendationId) {
      eventObj.recommendationId = property.recommendationId;
      delete property.recommendationId;
    }
    let eventId;
    if (property.eventId) {
      eventId = property.eventId;
      delete property.eventId;
    } else {
      eventId = event.message.messageId;
    }

    eventObj.eventId = eventId;
    eventObj.eventType = deliveryStreamMapTo;
    eventObj.sentAt = event.message.sentAt;
    eventObj.properties = property;
    payload.sessionId = event.message.originalTimestamp;
    payload.trackingId = event.destination.Config.trackingId;
    payload.userId = event.message.userId;
    eventList.push(eventObj);
    payload.eventList = eventList;
  } else throw new Error("Event type not set for this event");
  return payload;
}

exports.process = process;
