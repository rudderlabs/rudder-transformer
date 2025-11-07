const {
  isDefinedAndNotNull,
  InstrumentationError,
  PlatformError,
} = require('@rudderstack/integrations-lib');
const lodash = require('lodash');
const crypto = require('crypto');
const { maxBatchSize } = require('./config');

const decideVersion = ({ Config }) => {
  const configVersion = Config.version;
  let version = 'v2';
  if (isDefinedAndNotNull(configVersion) && configVersion === 'v3') {
    version = 'v3';
  }
  return version;
};

const batchEventChunks = (eventChunks) => {
  const batchedEvents = [];
  if (Array.isArray(eventChunks)) {
    eventChunks.forEach((chunk) => {
      const response = { destination: chunk[0].destination };
      const version = decideVersion(chunk[0].destination);
      chunk.forEach((event, index) => {
        if (index === 0) {
          const [firstMessage] = event.message;
          response.message = firstMessage;
          response.destination = event.destination;
          response.metadata = [event.metadata];
        } else {
          if (version === 'v3') {
            response.message.body.JSON.data.events.push(...event.message[0].body.JSON.data.events);
          } else {
            response.message.body.JSON.events.push(...event.message[0].body.JSON.events);
          }
          response.metadata.push(event.metadata);
        }
      });
      batchedEvents.push(response);
    });
  }
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
    case 'PURCHASE':
      revenueInCents =
        properties.revenue && !Number.isNaN(properties.revenue)
          ? Math.round(Number(properties?.revenue) * 100)
          : null;
      break;
    case 'AddToCart':
    case 'ADD_TO_CART':
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

// ref: https://business.reddithelp.com/s/article/about-event-metadata
const itemCountSupportedEvents = new Set(['Purchase', 'AddToCart', 'AddToWishlist', 'Custom']);
const valueAndCurrencySupportedEvents = new Set([
  'Purchase',
  'AddToCart',
  'AddToWishlist',
  'Lead',
  'SignUp',
  'Custom',
]);

const removeUnsupportedFields = (eventType, eventMetadata) => {
  const updatedEventMetadata = { ...eventMetadata }; // Ensure immutability

  if (!itemCountSupportedEvents.has(eventType)) {
    delete updatedEventMetadata.item_count;
  }
  if (!valueAndCurrencySupportedEvents.has(eventType)) {
    ['value', 'value_decimal', 'currency'].forEach((field) => delete updatedEventMetadata[field]);
  }

  return updatedEventMetadata;
};

const convertToUpperSnakeCase = (type) => {
  const trackingTypeMap = {
    Purchase: 'PURCHASE',
    AddToCart: 'ADD_TO_CART',
    ViewContent: 'VIEW_CONTENT',
    AddToWishlist: 'ADD_TO_WISHLIST',
    Search: 'SEARCH',
    Lead: 'LEAD',
    SignUp: 'SIGN_UP',
    PageVisit: 'PAGE_VISIT',
  };
  return trackingTypeMap[type];
};

const generateAndValidateTimestamp = (timestamp) => {
  if (!timestamp) {
    throw new InstrumentationError(
      'Required field "timestamp" or "originalTimestamp" is missing from the message.',
    );
  }

  const eventAt = new Date(timestamp).getTime();
  if (Number.isNaN(eventAt)) {
    throw new InstrumentationError('Invalid timestamp format.');
  }

  const now = Date.now();
  const maxPastMs = 168 * 60 * 60 * 1000; // 168h * 60m * 60s * 1000ms = 7 days in ms
  const maxFutureMs = 5 * 60 * 1000; // 5 minutes in ms

  if (now - eventAt > maxPastMs) {
    throw new InstrumentationError('event_at timestamp must be less than 168 hours (7 days) old.');
  }
  if (eventAt - now > maxFutureMs) {
    throw new InstrumentationError(
      'event_at timestamp must not be more than 5 minutes in the future.',
    );
  }

  return eventAt;
};

const prepareBatches = (successfulEvents) => {
  const batches = [];
  // filter out events that are marked as dontBatch or have a test_id
  const nonBatchableEvents = successfulEvents.filter(
    (event) => event.metadata?.dontBatch || event.message[0].body.JSON?.data?.test_id,
  );
  // filter out events that are not marked as dontBatch and do not have a test_id
  const batchableEvents = successfulEvents.filter(
    (event) => !event.metadata?.dontBatch && !event.message[0].body.JSON?.data?.test_id,
  );
  const nonBatchableEventsChunks = lodash.chunk(nonBatchableEvents, 1);
  const batchableEventsChunks = lodash.chunk(batchableEvents, maxBatchSize);
  // Check if the combined length of nonBatchableEvents and batchableEvents matches successfulEvents
  if (nonBatchableEvents.length + batchableEvents.length !== successfulEvents.length) {
    throw new PlatformError(
      'The sum of non-batchable and batchable events does not match the total number of successful events.',
      500,
    );
  }
  batches.push(
    ...batchEventChunks(nonBatchableEventsChunks),
    ...batchEventChunks(batchableEventsChunks),
  );
  return batches;
};

const hashSHA256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
module.exports = {
  batchEventChunks,
  populateRevenueField,
  calculateDefaultRevenue,
  removeUnsupportedFields,
  convertToUpperSnakeCase,
  decideVersion,
  generateAndValidateTimestamp,
  hashSHA256,
  prepareBatches,
};
