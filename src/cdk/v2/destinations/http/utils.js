const { XMLBuilder } = require('fast-xml-parser');
const { groupBy } = require('lodash');
const { createHash } = require('crypto');
const { ConfigurationError } = require('@rudderstack/integrations-lib');
const { BatchUtils } = require('@rudderstack/workflow-engine');
const jsonpath = require('rs-jsonpath');
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

const encodeParamsObject = (params) => {
  if (!params || typeof params !== 'object') {
    return {}; // Return an empty object if input is null, undefined, or not an object
  }
  const encodedParams = {};
  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined) {
      encodedParams[encodeURIComponent(key)] = encodeURIComponent(params[key]);
    }
  });
  return encodedParams;
};

const getValueFromJsonPath = (message, jsonPath) => {
  let finalPath = jsonPath;
  if (jsonPath.includes('$')) {
    try {
      [finalPath = null] = jsonpath.query(message, jsonPath);
    } catch (error) {
      throw new ConfigurationError(
        `An error occurred while querying the JSON path: ${error.message}`,
      );
    }
    if (finalPath === null) {
      throw new ConfigurationError('Path not found in the object.');
    }
  }
  return finalPath;
};

const getPathParamsSubString = (message, pathParamsArray) => {
  if (pathParamsArray.length === 0) {
    return '';
  }
  const pathParamsValuesArray = pathParamsArray.map((pathParam) => {
    const path = pathParam.path.replace(/^\/+/, '');
    return getValueFromJsonPath(message, path);
  });
  return `/${pathParamsValuesArray.join('/')}`;
};

const prepareEndpoint = (message, apiUrl, pathParams) => {
  let requestUrl;
  try {
    requestUrl = applyJSONStringTemplate(message, `\`${apiUrl}\``);
  } catch (e) {
    throw new ConfigurationError(`Error in api url template: ${e.message}`);
  }
  if (!Array.isArray(pathParams)) {
    return requestUrl;
  }
  const pathParamsSubString = getPathParamsSubString(message, pathParams);
  return `${requestUrl}${pathParamsSubString}`;
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

const getXMLPayload = (payload) => {
  const builderOptions = {
    ignoreAttributes: false, // Include attributes if they exist
  };
  const builder = new XMLBuilder(builderOptions);

  return `<?xml version="1.0" encoding="UTF-8"?>${builder.build(payload)}`;
};

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
  encodeParamsObject,
  prepareEndpoint,
  excludeMappedFields,
  getXMLPayload,
  batchSuccessfulEvents,
};
