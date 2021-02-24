const crypto = require("crypto-js");
const { string } = require("is");
const { EventType } = require("../../../constants");
const { getFieldValueFromMessage } = require("../../util");

async function process(event) {
  let payload = {};
  const noOfFields = event.destination.Config.customMappings.length;
  const keyField = [];
  const mappedField = [];
  let traits = {};
  let context = {};
  const { message } = event;
  const messageType = message.type.toLowerCase();

  function getSignatureKey(key, dateStamp, regionName, serviceName) {
    const kDate = crypto.HmacSHA256(dateStamp, `AWS4${key}`);
    const kRegion = crypto.HmacSHA256(regionName, kDate);
    const kService = crypto.HmacSHA256(serviceName, kRegion);
    const kSigning = crypto.HmacSHA256("aws4_request", kService);

    return kSigning;
  }

  function getAmzDate(dateStr) {
    const chars = [":", "-"];
    for (let i = 0; i < chars.length; i += 1) {
      while (dateStr.indexOf(chars[i]) !== -1) {
        dateStr = dateStr.replace(chars[i], "");
      }
    }
    dateStr = `${dateStr.split(".")[0]}Z`;
    return dateStr;
  }
  // get the various date formats needed to form our request
  const amzDate = getAmzDate(new Date().toISOString());
  const authDate = amzDate.split("T")[0];
  const signature = getSignatureKey(
    event.destination.Config.secretAccessKey,
    authDate,
    event.destination.Config.region,
    "personalize"
  );

  for (let i = 0; i < noOfFields; i += 1) {
    keyField.push(event.destination.Config.customMappings[i].from);
  }

  for (let j = 0; j < noOfFields; j += 1) {
    mappedField.push(event.destination.Config.customMappings[j].to);
  }
  if (message.event === event.destination.Config.eventName) {
    const property = {};
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
            keyField[k] = keyField[k].replace(/_([a-z])/g, function(g) {
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
            keyField[k] = keyField[k].replace(/_([a-z])/g, function(g) {
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

    payload = {
      version: "1",
      type: "REST",
      method: "POST",
      endpoint: `https://personalize-events.${event.destination.Config.region}.amazonaws.com/events`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `AWS4-HMAC-SHA256 Credential=${event.destination.Config.accessKeyId
        }/${authDate}/${
          event.destination.Config.region
        }/personalize/aws4_request, SignedHeaders=content-type;host;x-amz-content-sha256;x-amz-date, Signature=${signature.toString()}`,
        "X-Amz-Date": "20210224T095706Z"
      },
      params: {},
      body: {
        JSON: {
          eventList: [
            {
              eventId: event.message.messageId,
              eventType: event.destination.Config.eventName,
              properties: property,
              sentAt: event.message.sentAt
            }
          ],
          sessionId: event.message.originalTimestamp,
          trackingId: event.destination.Config.trackingId,
          userId: event.message.userId
        },
        XML: {},
        FORM: {}
      },
      statusCode: 200
    };
  }
  return payload;
}
exports.process = process;
