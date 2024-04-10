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

const calculateDefaultRevenue = (properties) => {
  // Check if working with products array
  if (properties?.products && properties.products.length > 0) {
    // Check if all product prices are undefined
    if (properties.products.every((product) => product.price === undefined)) {
      return null; // Return null if all product prices are undefined
    }
    // Proceed with calculation if not all prices are undefined
    return properties.products.reduce(
      (acc, product) => acc + (product.price || 0) * (product.quantity || 1),
      0,
    );
  }
  // For single product scenario, check if price is undefined
  if (properties.price === undefined) {
    return null; // Return null if price is undefined
  }
  // Proceed with calculation if price is defined
  return properties.price * (properties.quantity ?? 1);
};

const populateRevenueField = (eventType, properties) => {
  let revenueInCents;
  switch (eventType) {
    case 'Purchase':
      revenueInCents =
        properties.revenue && !Number.isNaN(properties.revenue)
          ? Math.round(Number(properties?.revenue) * 100)
          : null;
      break;
    case 'AddToCart':
      revenueInCents =
        properties.price && !Number.isNaN(properties.price)
          ? Math.round(Number(properties?.price) * Number(properties?.quantity || 1) * 100)
          : null;
      break;
    default:
      // for viewContent
      // eslint-disable-next-line no-case-declarations
      const revenue = calculateDefaultRevenue(properties);
      revenueInCents = revenue ? revenue * 100 : null;
      break;
  }

  if (lodash.isNaN(revenueInCents)) {
    return null;
  }
  // Return the value as it is if it's not NaN
  return revenueInCents;
};
module.exports = {
  batchEvents,
  populateRevenueField,
  calculateDefaultRevenue,
};
