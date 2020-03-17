// config = {
//             destinationID : destinationID,
//             accessKeyId : accessKeyId,
//             secretAccessKey : secretAccessKey,
//             region : region,
//             datasetName  : name,
//             eventName : eventName,
//             keyFields : keyField,
//             mappedFields : mappedField,
//             fieldTypes : fieldType,
//             isCampaign : isCampaign,
//             isSolution : isSolution,
//             noOfFields : noOfFields,
//             extras:   result
//     }

async function process(event) {
  var payload = {};

  if (event.message.type == event.destination.config.eventName) {
    var property = {};
    var mappedFields = JSON.parse(
      event.destination.config.mappedFields.replace(/(?<!\\)'/g, '"')
    );
    var keyFields = JSON.parse(
      event.destination.config.keyFields.replace(/(?<!\\)'/g, '"')
    );

    for (var i = 0; i < event.destination.config.noOfFields; i++) {
      var mappedField = mappedFields[i];
      console.log(mappedField);
      property[keyFields[i]] = event.message[mappedField];
    }
    console.log(property);

    payload = {
      accessKeyId: event.destination.config.accessKeyId,
      secretAccessKey: event.destination.config.secretAccessKey,
      region: event.destination.config.region,
      datasetName: event.destination.config.datasetName,
      eventList: [
        /* required */
        {
          eventId: event.message.messageId,
          eventType: event.destination.config.eventName,
          properties: property,
          sentAt: event.message.sentAt
        }
      ],
      sessionId: event.message.originalTimestamp /* required */,
      trackingId: event.destination.extras.trackingId /* required */,
      userId: event.message.userId
    };
  }

  return payload;
}
exports.process = process;
