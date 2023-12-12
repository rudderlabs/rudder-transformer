const lodash = require('lodash');
const { maxBatchSize } = require('./config');

const batchEventChunks = (eventChunks) => {
  const batchedEvents = [];
  if (Array.isArray(eventChunks)) {
    eventChunks.forEach((chunk) => {
      const response = { destination: chunk[0].destination };
      chunk.forEach((event, index) => {
        if (index === 0) {
          const [firstMessage] = event.message;
          response.message = firstMessage;
          response.destination = event.destination;
          response.metadata = [event.metadata];
        } else {
          response.message.body.JSON.events.push(...event.message[0].body.JSON.events);
          response.metadata.push(event.metadata);
        }
      });
      batchedEvents.push(response);
    });
  }
  return batchedEvents;
};

const batchEvents = (successfulEvents) => {
  const eventChunks = lodash.chunk(successfulEvents, maxBatchSize);
  const batchedEvents = batchEventChunks(eventChunks);
  return batchedEvents;
};
module.exports = {
  batchEvents,
};
