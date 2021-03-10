const { EventType } = require("../../../constants");
const { getFieldValueFromMessage } = require("../../util");

async function process(event) {
  const payload = {};
  const noOfFields = event.destination.Config.customMappings.length;
  const keyField = []; // schema field
  const mappedField = []; // payload field
  let traits = {};
  let context = {};
  const property = {};
  const { message } = event;
  const messageType = message.type.toLowerCase();

  for (let i = 0; i < noOfFields; i += 1) {
    keyField.push(event.destination.Config.customMappings[i].from);
  }

  for (let j = 0; j < noOfFields; j += 1) {
    mappedField.push(event.destination.Config.customMappings[j].to);
  }
  if (message.event === event.destination.Config.eventName) {
    for (let k = 0; k < noOfFields; k += 1) {
      if (
        keyField[k].toUpperCase() === "USER_ID" ||
        keyField[k].toUpperCase() === "EVENT_TYPE" ||
        keyField[k].toUpperCase() === "TIMESTAMP"
      ) {
        keyField[k] = keyField[k].replace(/_([a-z])/g, function (g) {
          return g[1].toUpperCase();
        });
      } else {
        const mappedFields = mappedField[k];
        switch (messageType) {
          case EventType.TRACK:
          case EventType.PAGE:
          case EventType.SCREEN:
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
            break;
          default:
            traits = getFieldValueFromMessage(message, "traits");
            keyField[k] = keyField[k]
              .toLowerCase()
              .replace(/_([a-z])/g, function (g) {
                return g[1].toUpperCase();
              });
            if (traits[mappedFields]) {
              property[keyField[k]] = traits[mappedFields];
            } else if (
              // if traits present in both roots and context
              message.traits &&
              message.context &&
              message.context.traits
            ) {
              // retrieve traits inside context
              context = message.context;
              if (context.traits[mappedFields]) {
                property[keyField[k]] = context.traits[mappedFields];
              } else if (typeof event.message[mappedFields] !== "undefined") {
                // if field is not present both in messsage.traits and message.context.traits we have search in the root
                property[keyField[k]] = event.message[mappedFields];
              }
            } else if (typeof event.message[mappedFields] !== "undefined") {
              // if no trait is present and we have search in the root
              property[keyField[k]] = event.message[mappedFields];
            } else {
              throw new Error(`Mapped Field ${mappedFields} not found`);
            }
            break;
        }
      }
    }

    if (property.eventValue) {
      payload.eventValue = property.eventValue;
      delete property.eventValue;
    }
    if (property.impression) {
      payload.impression = property.impression;
      delete property.impression;
    }
    if (property.itemId) {
      payload.itemId = property.itemId;
      delete property.itemId;
    }
    if (property.recommendationId) {
      payload.recommendationId = property.recommendationId;
      delete property.recommendationId;
    }
    let eventId;
    if (property.eventId) {
      eventId = property.eventId;
      delete property.eventId;
    } else {
      eventId = event.message.messageId;
    }

    payload.eventId = eventId;
    payload.eventType = event.destination.Config.eventName;
    payload.sentAt = event.message.sentAt;
    payload.properties = property;
    payload.sessionId = event.message.originalTimestamp;
    payload.trackingId = event.destination.Config.trackingId;
    payload.userId = event.message.userId;
  }
  return payload;
}
exports.process = process;
