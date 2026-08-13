const { BatchUtils } = require('@rudderstack/workflow-engine');
const lodash = require('lodash');
const config = require('./config');
const { constructPayload, isDefinedAndNotNull } = require('../../../../v0/util');

// Ninetailed validates context.page against a schema where every one of these is a
// required string. A single event with a partial page object gets the whole batch
// (up to MAX_BATCH_SIZE events) rejected, so the gaps are filled with empty strings.
const PAGE_REQUIRED_STRING_FIELDS = ['path', 'referrer', 'search', 'url'];

/**
 * Fills in the page fields Ninetailed requires but the source may not have sent.
 *
 * Note this cannot be expressed as `defaultValue` in contextMapping.json: an empty
 * string default is falsy, so `handleMetadataForValue` returns the original undefined
 * and `constructPayload` skips the assignment entirely. Both would silently no-op.
 *
 * @param {*} page the mapped context.page value
 * @returns page with all required fields present, or the input untouched if it is not an object
 */
const normalizePageContext = (page) => {
  if (!lodash.isPlainObject(page)) {
    return page;
  }
  const normalizedPage = { ...page };
  PAGE_REQUIRED_STRING_FIELDS.forEach((field) => {
    if (typeof normalizedPage[field] !== 'string') {
      normalizedPage[field] = '';
    }
  });
  if (!lodash.isPlainObject(normalizedPage.query)) {
    normalizedPage.query = {};
  }
  return normalizedPage;
};

/**
 * This fucntion constructs payloads based upon mappingConfig for all calls
 * We build context as it has some specific payloads with default values so just breaking them down
 * @param {*} message
 * @returns
 */
const constructFullPayload = (message) => {
  const context = constructPayload(
    message?.context || {},
    config.mappingConfig[config.ConfigCategories.CONTEXT.name],
  );
  const payload = constructPayload(
    message,
    config.mappingConfig[config.ConfigCategories.GENERAL.name],
  );
  let typeSpecifcPayload;
  switch (message.type) {
    case 'track':
      typeSpecifcPayload = constructPayload(
        message,
        config.mappingConfig[config.ConfigCategories.TRACK.name],
      );
      break;
    case 'identify':
      typeSpecifcPayload = constructPayload(
        message,
        config.mappingConfig[config.ConfigCategories.IDENTIFY.name],
      );
      typeSpecifcPayload.userId = typeSpecifcPayload.userId || '';
      break;
    default:
      break;
  }
  // Only normalize a page the source actually sent; do not invent one for events
  // (server-side track calls, for instance) that legitimately carry no page context.
  if (isDefinedAndNotNull(context.page)) {
    context.page = normalizePageContext(context.page);
  }
  payload.context = context;
  return { ...payload, ...typeSpecifcPayload }; // merge base and type-specific payloads;
};

const getEndpoint = (Config) => {
  const { organisationId, environment } = Config;
  return config.batchEndpoint
    .replace('{{organisationId}}', organisationId)
    .replace('{{environment}}', environment);
};

const mergeMetadata = (batch) => {
  const metadata = [];
  batch.forEach((event) => {
    metadata.push(event.metadata);
  });
  return metadata;
};

const getMergedEvents = (batch) => {
  const events = [];
  batch.forEach((event) => {
    events.push(event.output);
  });
  return events;
};

const batchBuilder = (batch) => ({
  batchedRequest: {
    body: {
      JSON: { events: getMergedEvents(batch) },
      JSON_ARRAY: {},
      XML: {},
      FORM: {},
    },
    version: '1',
    type: 'REST',
    method: 'POST',
    endpoint: getEndpoint(batch[0].destination.Config),
    headers: {
      'Content-Type': 'application/json',
    },
    params: {},
    files: {},
  },
  metadata: mergeMetadata(batch),
  batched: true,
  statusCode: 200,
  destination: batch[0].destination,
});

/**
 * This fucntions make chunk of successful events based on MAX_BATCH_SIZE
 * and then build the response for each chunk to be returned as object of an array
 * @param {*} events
 * @returns
 */
const batchResponseBuilder = (events) => {
  const batches = BatchUtils.chunkArrayBySizeAndLength(events, { maxItems: config.MAX_BATCH_SIZE });
  const response = [];
  batches.items.forEach((batch) => {
    response.push(batchBuilder(batch));
  });
  return response;
};

module.exports = {
  constructFullPayload,
  getEndpoint,
  batchResponseBuilder,
  normalizePageContext,
};
