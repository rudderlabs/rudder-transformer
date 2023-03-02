const { MAX_BATCH_SIZE } = require('./config');

const getSizeInBytes = (obj) => {
  let str = null;
  if (typeof obj === 'string') {
    // If obj is a string, then use it
    str = obj;
  } else {
    // Else, make obj into a string
    str = JSON.stringify(obj);
  }
  // Get the length of the Uint8Array
  const bytes = new TextEncoder().encode(str).length;
  return bytes;
};

const getEventChunks = (groupEvents) => {
  const eventChunks = [];
  let batchedData = [];
  let metadata = [];
  let size = 0;

  groupEvents.forEach((events) => {
    const objSize = getSizeInBytes(events);
    size += objSize;
    if (batchedData.length === MAX_BATCH_SIZE || size > 500000) {
      eventChunks.push({ data: batchedData, metadata });
      batchedData = [];
      metadata = [];
      size = 0;
    }
    metadata.push(events.metadata);
    batchedData.push(events.message.body.JSON);
  });

  if (batchedData.length > 0) {
    eventChunks.push({ data: batchedData, metadata });
  }

  return eventChunks;
};

module.exports = { getEventChunks };
