const { toXML } = require('jstoxml');
const { groupBy } = require('lodash');
const { createHash } = require('crypto');
const { ConfigurationError } = require('@rudderstack/integrations-lib');
const { BatchUtils } = require('@rudderstack/workflow-engine');
const {
  base64Convertor,
  applyCustomMappings,
  isEmptyObject,
  applyJSONStringTemplate,
} = require('../../../../v0/util');

const getAuthHeaders = (config) => {
  let headers;
  switch (config.auth) {
    case 'basicAuth': {
      const credentials = `${config.username}:${config.password}`;
      const encodedCredentials = base64Convertor(credentials);
      headers = {
        Authorization: `Basic ${encodedCredentials}`,
      };
      break;
    }
    case 'bearerTokenAuth':
      headers = { Authorization: `Bearer ${config.bearerToken}` };
      break;
    case 'apiKeyAuth':
      headers = { [config.apiKeyName]: `${config.apiKeyValue}` };
      break;
    default:
      headers = {};
  }
  return headers;
};

const getCustomMappings = (message, mapping) => {
  try {
    return applyCustomMappings(message, mapping);
  } catch (e) {
    throw new ConfigurationError(`Error in custom mappings: ${e.message}`);
  }
};

const addPathParams = (message, apiUrl) => {
  try {
    return applyJSONStringTemplate(message, `\`${apiUrl}\``);
  } catch (e) {
    throw new ConfigurationError(`Error in api url template: ${e.message}`);
  }
};

const excludeMappedFields = (payload, mapping) => {
  const rawPayload = { ...payload };
  if (mapping) {
    mapping.forEach(({ from, to }) => {
      // continue when from === to
      if (from === to) return;

      // Remove the '$.' prefix and split the remaining string by '.'
      const keys = from.replace(/^\$\./, '').split('.');
      let current = rawPayload;

      // Traverse to the parent of the key to be removed
      keys.slice(0, -1).forEach((key) => {
        if (current?.[key]) {
          current = current[key];
        } else {
          current = null;
        }
      });

      if (current) {
        // Remove the 'from' field from input payload
        delete current[keys[keys.length - 1]];
      }
    });
  }

  return rawPayload;
};

const getXMLPayload = (payload) =>
  toXML(payload, {
    header: true,
  });

const getMergedEvents = (batch) => {
  const events = [];
  batch.forEach((event) => {
    if (!isEmptyObject(event.batchedRequest.body.JSON)) {
      events.push(event.batchedRequest.body.JSON);
    }
  });
  return events;
};

const mergeMetadata = (batch) => batch.map((event) => event.metadata[0]);

const createHashKey = (endpoint, headers, params) => {
  const hash = createHash('sha256');
  hash.update(endpoint);
  hash.update(JSON.stringify(headers));
  hash.update(JSON.stringify(params));
  return hash.digest('hex');
};

const buildBatchedRequest = (batch) => ({
  batchedRequest: {
    body: {
      JSON: {},
      JSON_ARRAY: { batch: JSON.stringify(getMergedEvents(batch)) },
      XML: {},
      FORM: {},
    },
    version: '1',
    type: 'REST',
    method: batch[0].batchedRequest.method,
    endpoint: batch[0].batchedRequest.endpoint,
    headers: batch[0].batchedRequest.headers,
    params: batch[0].batchedRequest.params,
    files: {},
  },
  metadata: mergeMetadata(batch),
  batched: true,
  statusCode: 200,
  destination: batch[0].destination,
});

const batchSuccessfulEvents = (events, batchSize) => {
  const response = [];
  // group events by endpoint, headers and query params
  const groupedEvents = groupBy(events, (event) => {
    const { endpoint, headers, params } = event.batchedRequest;
    return createHashKey(endpoint, headers, params);
  });

  // batch the each grouped event
  Object.keys(groupedEvents).forEach((groupKey) => {
    const batches = BatchUtils.chunkArrayBySizeAndLength(groupedEvents[groupKey], {
      maxItems: batchSize,
    }).items;
    batches.forEach((batch) => {
      response.push(buildBatchedRequest(batch));
    });
  });
  return response;
};

module.exports = {
  getAuthHeaders,
  getCustomMappings,
  addPathParams,
  excludeMappedFields,
  getXMLPayload,
  batchSuccessfulEvents,
};
