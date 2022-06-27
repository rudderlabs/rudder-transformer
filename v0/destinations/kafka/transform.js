function batch(destEvents) {
  const respList = [];
  const batchedRequest = [];
  const metadata = [];
  destEvents.forEach(event => {
    metadata.push(event.metadata);
    batchedRequest.push(event.message);
  });
  respList.push({
    batchedRequest,
    metadata,
    destination: destEvents[0].destination
  });

  return respList;
}

function process(event) {
  const schemaId = event.message?.integrations?.KAFKA?.schemaId;
  if (schemaId) {
    return {
      message: event.message,
      userId: event.message.userId || event.message.anonymousId,
      schemaId
    };
  }
  return {
    message: event.message,
    userId: event.message.userId || event.message.anonymousId
  };
}

module.exports = { process, batch };
