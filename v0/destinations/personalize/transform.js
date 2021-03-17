const { getHashFromArray, getFieldValueFromMessage } = require("../../util");

async function process(event) {
  const { message, destination } = event;
  const { Config } = destination;
  const { properties, anonymousId, userId } = message;
  const payload = {};
  const noOfFields = Config.customMappings.length;
  const keyField = []; // schema field
  const mappedFields = []; // payload fields
  const property = {};
  const eventObj = {};
  const eventList = [];
  const keyCheckList = [
    "USER_ID",
    "EVENT_TYPE",
    "TIMESTAMP",
    "ITEM_ID",
    "EVENT_VALUE",
    "IMPRESSION",
    "RECOMMENDATION_ID",
    "EVENT_ID"
  ];

  if (message.event) {
    for (let i = 0; i < noOfFields; i += 1) {
      keyField.push(Config.customMappings[i].from);
      mappedFields.push(Config.customMappings[i].to);
    }
    for (let k = 0; k < noOfFields; k += 1) {
      if (
        // except these every thing will go inside properties
        !keyCheckList.includes(keyField[k].toUpperCase())
      ) {
        const mappedField = mappedFields[k];
        keyField[k] = keyField[k]
          .toLowerCase()
          .replace(/_([a-z])/g, function camelCase(g) {
            return g[1].toUpperCase();
          });
        if (properties && properties[mappedField]) {
          property[keyField[k]] = properties[mappedField];
        } else {
          throw new Error(`Mapped Field ${mappedField} not found`);
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
        const mappedField = mappedFields[k];
        eventObj[keyField[k]] = properties[mappedField];
      }
    }
    // itemId is a mandatory field, so even if user doesn't mention, it is needed to be provided

    const mapKeys = getHashFromArray(
      Config.customMappings,
      "from",
      "to",
      false
    );

    // userId is a mandatory field, so even if user doesn't mention, it is needed to be provided

    if (mapKeys.USER_ID && properties[mapKeys.USER_ID]) {
      payload.userId = properties[mapKeys.USER_ID];
    } else {
      payload.userId = userId;
    }

    eventObj.eventType = message.event;
    eventObj.sentAt = getFieldValueFromMessage(message, "historicalTimestamp");
    eventObj.properties = property;
    payload.sessionId =
      anonymousId || getFieldValueFromMessage(message, "userIdOnly");
    payload.trackingId = Config.trackingId;
    eventObj.itemId = eventObj.itemId ? eventObj.itemId : message.messageId;
    eventList.push(eventObj);
    payload.eventList = eventList;
  } else {
    throw new Error(" Cannot process if no event name specified");
  }
  return payload;
}

exports.process = process;
