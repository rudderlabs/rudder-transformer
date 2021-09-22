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
  const result = {
    message: event.message,
    userId: event.message.userId || event.message.anonymousId
  };
  return result;
}

module.exports = { process, batch };
