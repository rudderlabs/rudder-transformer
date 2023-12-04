const lodash = require('lodash');
const { maxBatchSize } = require('./config');

const batchEventChunks = (events) => {
  const batchedPersonEvents = [];
  if (Array.isArray(events)) {
    events.forEach((chunk) => {
      const response = { destination: chunk[0].destination };

      chunk.forEach((event, index) => {
        if (index === 0) {
          response.message = event.message;
          response.destination = event.destination;
          response.metadata = [event.metadata];
        } else {
          response.message.body.JSON.events.push(...event.message.body.JSON.events);
          response.metadata.push(event.metadata);
        }
      });
      batchedPersonEvents.push(response);
    });
  }
  return batchedPersonEvents;
};

const batchEvents = (successfulEvents) => {
  const eventChunks = lodash.chunk(successfulEvents, maxBatchSize);
  const batchedEvents = batchEventChunks(eventChunks);
  return batchedEvents;
};
module.exports = {
  batchEvents,
};
