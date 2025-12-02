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
  removeUndefinedAndNullRecurse,
} = require('../../../../v0/util');

const CONTENT_TYPES_MAP = {
  JSON: 'JSON',
  XML: 'XML',
  FORM: 'FORM',
};

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

const enhanceMappings = (mappings) => {
  let enhancedMappings = mappings;
  if (Array.isArray(mappings)) {
    enhancedMappings = mappings.map((mapping) => {
      const enhancedMapping = { ...mapping };
      if (
        mapping.hasOwnProperty('from') &&
        !mapping.from.includes('$') &&
        !(mapping.from.startsWith("'") && mapping.from.endsWith("'"))
      ) {
        enhancedMapping.from = `'${mapping.from}'`;
      }
      return enhancedMapping;
    });
  }
  return enhancedMappings;
};

const getCustomMappings = (message, mapping) => {
  const enhancedMappings = enhanceMappings(mapping);
  try {
    return applyCustomMappings(message, enhancedMappings);
  } catch (e) {
    throw new ConfigurationError(`Error in custom mappings: ${e.message}`);
  }
};

const encodeParamsObject = (params) => {
  if (!params || typeof params !== 'object') {
    return {}; // Return an empty object if input is null, undefined, or not an object
  }
  return Object.keys(params)
    .filter((key) => params[key] !== undefined)
    .reduce((acc, key) => {
      acc[encodeURIComponent(key)] = encodeURIComponent(params[key]);
      return acc;
    }, {});
};

const getPathValueFromJsonpath = (message, path) => {
  let finalPath = path;
  if (path.includes('/')) {
    throw new ConfigurationError('Path value cannot contain "/"');
  }
  if (path.includes('$')) {
    try {
      [finalPath = null] = jsonpath.query(message, path);
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
  const pathParamsValuesArray = pathParamsArray.map((pathParam) =>
    encodeURIComponent(getPathValueFromJsonpath(message, pathParam.path)),
  );
  return `/${pathParamsValuesArray.join('/')}`;
};

const prepareEndpoint = (message, apiUrl, pathParams) => {
  if (!Array.isArray(pathParams)) {
    return apiUrl;
  }
  const pathParamsSubString = getPathParamsSubString(message, pathParams);
  return `${apiUrl}${pathParamsSubString}`.replace(/([^:]\/)\/+/g, '$1');
};

const sanitizeKey = (key) =>
  key
    .replace(/[^\w.-]/g, '_') // Replace invalid characters with underscores
    .replace(/^[^A-Z_a-z]/, '_'); // Ensure key starts with a letter or underscore

const preprocessJson = (obj) => {
  if (typeof obj !== 'object' || obj === null) {
    return obj; // Return primitive values as is
  }

  if (Array.isArray(obj)) {
    return obj.map(preprocessJson);
  }

  return Object.entries(obj).reduce((acc, [key, value]) => {
    const sanitizedKey = sanitizeKey(key);
    acc[sanitizedKey] = preprocessJson(value);
    return acc;
  }, {});
};

const getXMLPayload = (payload, rootKey = 'root') => {
  const builderOptions = {
    ignoreAttributes: false,
    suppressEmptyNode: true,
  };

  const builder = new XMLBuilder(builderOptions);
  const processesPayload = {
    [rootKey]: {
      ...preprocessJson(payload),
    },
  };
  return `<?xml version="1.0" encoding="UTF-8"?>${builder.build(processesPayload)}`;
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

const metadataHeaders = (contentType) => {
  switch (contentType) {
    case CONTENT_TYPES_MAP.XML:
      return { 'Content-Type': 'application/xml' };
    case CONTENT_TYPES_MAP.FORM:
      return { 'Content-Type': 'application/x-www-form-urlencoded' };
    default:
      return { 'Content-Type': 'application/json' };
  }
};

function stringifyFirstLevelValues(obj) {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    acc[key] = typeof value === 'string' ? value : JSON.stringify(value);
    return acc;
  }, {});
}

const prepareBody = (payload, contentType, xmlRootKey) => {
  let responseBody;
  removeUndefinedAndNullRecurse(payload);
  if (contentType === CONTENT_TYPES_MAP.XML && !isEmptyObject(payload)) {
    responseBody = {
      payload: getXMLPayload(payload, xmlRootKey),
    };
  } else if (contentType === CONTENT_TYPES_MAP.FORM && !isEmptyObject(payload)) {
    responseBody = stringifyFirstLevelValues(payload);
  } else {
    responseBody = payload || {};
  }
  return responseBody;
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
  CONTENT_TYPES_MAP,
  getAuthHeaders,
  enhanceMappings,
  getCustomMappings,
  encodeParamsObject,
  prepareEndpoint,
  metadataHeaders,
  prepareBody,
  batchSuccessfulEvents,
  stringifyFirstLevelValues,
};
