const { getHashFromArray } = require("../../util");

function mapEventName(event) {
  const { message, destination } = event;
  const { eventName } = destination.Config;
  const hashMap = getHashFromArray(eventName, "from", "to");
  return hashMap[message.event.toLowerCase()];
}

async function process(event) {
  const { message, destination } = event;
  const { Config } = destination;
  const { properties, sentAt, anonymousId, userId } = message;
  const payload = {};
  const noOfFields = Config.customMappings.length;
  const keyField = []; // schema field
  const mappedField = []; // payload fields
  const property = {};
  const eventObj = {};
  const eventList = [];

  if (message.event) {
    for (let i = 0; i < noOfFields; i += 1) {
      keyField.push(Config.customMappings[i].from);
    }

    for (let j = 0; j < noOfFields; j += 1) {
      mappedField.push(Config.customMappings[j].to);
    }
    const mappedEvent = mapEventName(event);
    if (mappedEvent) {
      for (let k = 0; k < noOfFields; k += 1) {
        if (
          // except these every thing will go inside properties
          !(
            keyField[k].toUpperCase() === "USER_ID" ||
            keyField[k].toUpperCase() === "EVENT_TYPE" ||
            keyField[k].toUpperCase() === "TIMESTAMP" ||
            keyField[k].toUpperCase() === "ITEM_ID" ||
            keyField[k].toUpperCase() === "EVENT_VALUE" ||
            keyField[k].toUpperCase() === "IMPRESSION" ||
            keyField[k].toUpperCase() === "RECOMMENDATION_ID" ||
            keyField[k].toUpperCase() === "EVENT_ID"
          )
        ) {
          const mappedFields = mappedField[k];
          keyField[k] = keyField[k]
            .toLowerCase()
            .replace(/_([a-z])/g, function camelCase(g) {
              return g[1].toUpperCase();
            });
          if (properties && properties[mappedFields]) {
            property[keyField[k]] = properties[mappedFields];
          } else {
            throw new Error(`Mapped Field ${mappedFields} not found`);
          }
        } else if (
          // userId and eventType is handled later as shown below and others are saved outside properties
          !(
            keyField[k].toUpperCase() === "USER_ID" ||
            keyField[k].toUpperCase() === "EVENT_TYPE"
          )
        ) {
          keyField[k] = keyField[k]
            .toLowerCase()
            .replace(/_([a-z])/g, function camelCase(g) {
              return g[1].toUpperCase();
            });
          const mappedFields = mappedField[k];
          eventObj[keyField[k]] = properties[mappedFields];
        }
      }
      // itemId is a mandatory field, so even if user doesn't mention, it is needed to be provided

      if (properties.itemId) {
        if (mappedField.includes("itemId")) {
          eventObj.itemId = properties.itemId;
        } else {
          eventObj.itemId = message.messageId;
        }
      } else {
        eventObj.itemId = message.messageId;
      }
      eventObj.eventType = mappedEvent;
      eventObj.sentAt = sentAt;
      eventObj.properties = property;
      payload.sessionId = anonymousId;
      payload.trackingId = Config.trackingId;

      // itemId is a mandatory field, so even if user doesn't mention, it is needed to be provided

      if (properties.userId) {
        if (mappedField.includes("userId")) {
          payload.userId = properties.userId;
        } else {
          payload.userId = userId;
        }
      } else {
        payload.userId = userId;
      }

      eventList.push(eventObj);
      payload.eventList = eventList;
    } else throw new Error("Event type not set for this event");
  } else {
    throw new Error(" Cannot process if no event name specified");
  }
  return payload;
}

exports.process = process;
