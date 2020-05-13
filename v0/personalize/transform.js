var crypto = require("crypto-js");

async function process(event) {
  var payload = {};
  var noOfFields = event.destination.Config.customMappings.length;
  console.log(noOfFields);
  var keyField = [];
  var mappedField = [];

  function getSignatureKey(key, dateStamp, regionName, serviceName) {
    var kDate = crypto.HmacSHA256(dateStamp, "AWS4" + key);
    var kRegion = crypto.HmacSHA256(regionName, kDate);
    var kService = crypto.HmacSHA256(serviceName, kRegion);
    var kSigning = crypto.HmacSHA256("aws4_request", kService);

    return kSigning;
  }

  function getAmzDate(dateStr) {
    var chars = [":", "-"];
    for (var i = 0; i < chars.length; i++) {
      while (dateStr.indexOf(chars[i]) != -1) {
        dateStr = dateStr.replace(chars[i], "");
      }
    }
    dateStr = dateStr.split(".")[0] + "Z";
    return dateStr;
  }
  // get the various date formats needed to form our request
  var amzDate = getAmzDate(new Date().toISOString());
  var authDate = amzDate.split("T")[0];
  console.log(amzDate);
  console.log(authDate);
  var signature = getSignatureKey(
    event.destination.Config.secretAccessKey,
    authDate,
    event.destination.Config.region,
    "personalize"
  );
  console.log(signature.toString());

  for (var i = 0; i < noOfFields; i++) {
    keyField.push(event.destination.Config.customMappings[i].from);
  }

  for (var j = 0; j < noOfFields; j++) {
    mappedField.push(event.destination.Config.customMappings[j].to);
  }
  console.log(mappedField);
  console.log(keyField);
  if (event.message.event == event.destination.Config.eventName) {
    var property = {};
    for (var k = 0; k < noOfFields; k++) {
      console.log(keyField[k].toUpperCase());
      if (
        keyField[k].toUpperCase() == "USER_ID" ||
        keyField[k].toUpperCase() == "EVENT_TYPE" ||
        keyField[k].toUpperCase() == "TIMESTAMP"
      ) {
        keyField[k] = keyField[k].replace(/_([a-z])/g, function(g) {
          return g[1].toUpperCase();
        });
        console.log(keyField[k]);
      } else {
        var mappedFields = mappedField[k];
        console.log(event.message[mappedFields]);

        if (typeof event.message[mappedFields] !== "undefined") {
          keyField[k] = keyField[k].replace(/_([a-z])/g, function(g) {
            return g[1].toUpperCase();
          });
          property[keyField[k]] = event.message[mappedFields];
        } else {
          payload = {
            statusCode: 400,
            error: "Mapped Field " + mappedFields + " not found"
          };
          return payload;
        }
      }
    }
    console.log(property);

    payload = {
      version: "1",
      type: "REST",
      method: "POST",
      endpoint:
        "https://personalize-events." +
        event.destination.Config.region +
        ".amazonaws.com/events",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "AWS4-HMAC-SHA256 Credential=" +
          event.destination.Config.accessKeyId +
          "/" +
          authDate +
          "/" +
          event.destination.Config.region +
          "/personalize/aws4_request, SignedHeaders=content-type;host;x-amz-content-sha256;x-amz-date, Signature=" +
          signature.toString(),
        "X-Amz-Date": amzDate
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
