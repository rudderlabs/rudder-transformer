async function process(event) {
  var payload = {};
  var noOfFields = event.destination.Config.customMappings.length;
  console.log(noOfFields);
  var keyField = [];
  var mappedField = [];
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
      accessKeyId: event.destination.Config.accessKeyId,
      secretAccessKey: event.destination.Config.secretAccessKey,
      region: event.destination.Config.region,
      datasetName: event.destination.Config.datasetName,
      eventList: [
        /* required */
        {
          eventId: event.message.messageId,
          eventType: event.destination.Config.eventName,
          properties: property,
          sentAt: event.message.sentAt
        }
      ],
      sessionId: event.message.originalTimestamp /* required */,
      trackingId: event.destination.Config.trackingId /* required */,
      userId: event.message.userId,
      statusCode: 200
    };
  }

  return payload;
}
exports.process = process;
