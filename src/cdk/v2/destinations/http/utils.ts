import { XMLBuilder } from 'fast-xml-parser';
import { groupBy } from 'lodash';
import { createHash } from 'crypto';
import { ConfigurationError, InstrumentationError, isDefined } from '@rudderstack/integrations-lib';
import { BatchUtils } from '@rudderstack/workflow-engine';
import jsonpath from 'rs-jsonpath';
import {
  base64Convertor,
  applyCustomMappings,
  isEmptyObject,
  removeUndefinedAndNullRecurse,
} from '../../../../v0/util';
import type { Mapping, PathParam } from './types';
import { BatchRequestOutput } from '../../../../types';

const CONTENT_TYPES_MAP = {
  JSON: 'JSON',
  XML: 'XML',
  FORM: 'FORM',
};

const getAuthHeaders = (config: Record<string, unknown>): Record<string, string> => {
  let headers: Record<string, string>;
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
      headers = { [config.apiKeyName as string]: `${config.apiKeyValue}` };
      break;
    default:
      headers = {};
  }
  return headers;
};

const enhanceMappings = (mappings: Mapping[]): Mapping[] => {
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

const getCustomMappings = (message: Record<string, unknown>, mapping: Mapping[]) => {
  const enhancedMappings = enhanceMappings(mapping);
  try {
    return applyCustomMappings(message, enhancedMappings);
  } catch (e: any) {
    throw new ConfigurationError(`Error in custom mappings: ${e.message}`);
  }
};

const validateQueryParams = (params: Record<string, unknown>): Record<string, unknown> => {
  if (!params || typeof params !== 'object' || Array.isArray(params)) {
    return {}; // Return an empty object if input is null, undefined, or not an object
  }
  const filteredKeys = Object.keys(params).filter((key) => params[key] !== undefined);
  return Object.fromEntries(filteredKeys.map((key) => [key, params[key]]));
};

const getPathValueFromJsonpath = (message: Record<string, unknown>, path: string) => {
  let finalPath: string | null = path;
  if (path.includes('/')) {
    throw new ConfigurationError('Path value cannot contain "/"');
  }
  if (path.includes('$')) {
    try {
      [finalPath = null] = jsonpath.query(message, path);
    } catch (error: any) {
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

const getPathParamsSubString = (message: Record<string, unknown>, pathParamsArray: PathParam[]) => {
  if (pathParamsArray.length === 0) {
    return '';
  }
  const pathParamsValuesArray = pathParamsArray.map((pathParam) =>
    encodeURIComponent(getPathValueFromJsonpath(message, pathParam.path)),
  );
  return `/${pathParamsValuesArray.join('/')}`;
};

const prepareEndpoint = (
  message: Record<string, unknown>,
  apiUrl: string,
  pathParams: PathParam[],
) => {
  if (!Array.isArray(pathParams)) {
    return apiUrl;
  }
  const pathParamsSubString = getPathParamsSubString(message, pathParams);
  return `${apiUrl}${pathParamsSubString}`.replace(/([^:]\/)\/+/g, '$1');
};

const sanitizeKey = (key: string) =>
  key
    .replace(/[^\w.-]/g, '_') // Replace invalid characters with underscores
    .replace(/^[^A-Z_a-z]/, '_'); // Ensure key starts with a letter or underscore

const preprocessJson = (obj: unknown): unknown => {
  if (typeof obj !== 'object' || obj === null) {
    return obj; // Return primitive values as is
  }

  if (Array.isArray(obj)) {
    return obj.map(preprocessJson);
  }

  return Object.entries(obj).reduce((acc: Record<string, unknown>, [key, value]) => {
    const sanitizedKey = sanitizeKey(key);
    acc[sanitizedKey] = preprocessJson(value);
    return acc;
  }, {});
};

const getXMLPayload = (payload: Record<string, unknown>, rootKey = 'root') => {
  const builderOptions = {
    ignoreAttributes: false,
    suppressEmptyNode: true,
  };

  const builder = new XMLBuilder(builderOptions);
  const processesPayload = {
    [rootKey]: {
      ...(preprocessJson(payload) as Record<string, unknown>),
    },
  };
  return `<?xml version="1.0" encoding="UTF-8"?>${builder.build(processesPayload)}`;
};

const getMergedEvents = (batch: BatchRequestOutput[]) => {
  const events: BatchRequestOutput['batchedRequest']['body']['JSON'][] = [];
  batch.forEach((event) => {
    if (!isEmptyObject(event.batchedRequest.body.JSON)) {
      events.push(event.batchedRequest.body.JSON);
    }
  });
  return events;
};

const metadataHeaders = (contentType: string): Record<string, string> => {
  switch (contentType) {
    case CONTENT_TYPES_MAP.XML:
      return { 'Content-Type': 'application/xml' };
    case CONTENT_TYPES_MAP.FORM:
      return { 'Content-Type': 'application/x-www-form-urlencoded' };
    default:
      return { 'Content-Type': 'application/json' };
  }
};

function stringifyFirstLevelValues(obj: Record<string, unknown>): Record<string, string> {
  return Object.entries(obj).reduce((acc: Record<string, string>, [key, value]) => {
    acc[key] = typeof value === 'string' ? value : JSON.stringify(value);
    return acc;
  }, {});
}

const prepareBody = (
  payload: Record<string, unknown>,
  contentType: string,
  xmlRootKey?: string,
) => {
  let responseBody: Record<string, unknown> | string;
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

const mergeMetadata = (batch: BatchRequestOutput[]) => batch.map((event) => event.metadata[0]);

const createHashKey = (
  endpoint: string,
  headers: BatchRequestOutput['batchedRequest']['headers'],
  params: BatchRequestOutput['batchedRequest']['params'],
) => {
  const hash = createHash('sha256');
  hash.update(endpoint);
  hash.update(JSON.stringify(headers));
  hash.update(JSON.stringify(params));
  return hash.digest('hex');
};

const buildBatchedRequest = (batch: BatchRequestOutput[]) => ({
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

const batchSuccessfulEvents = (events: BatchRequestOutput[], batchSize: number) => {
  const response: ReturnType<typeof buildBatchedRequest>[] = [];
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
    batches.forEach((batch: BatchRequestOutput[]) => {
      response.push(buildBatchedRequest(batch));
    });
  });
  return response;
};

// rudder-server unmarshals headers into map[string]string, so all values must be strings.
// Non-string values (including numbers and booleans) will cause unmarshalling to fail.
const validateHeaders = (headers: Record<string, unknown>): void => {
  if (!headers || typeof headers !== 'object' || Array.isArray(headers)) {
    return;
  }
  Object.entries(headers).forEach(([key, value]) => {
    if (isDefined(value) && typeof value !== 'string') {
      throw new InstrumentationError(
        `Header "${key}" has a non-string value of type "${typeof value}"`,
      );
    }
  });
};

export {
  CONTENT_TYPES_MAP,
  getAuthHeaders,
  enhanceMappings,
  getCustomMappings,
  validateQueryParams,
  validateHeaders,
  prepareEndpoint,
  metadataHeaders,
  prepareBody,
  batchSuccessfulEvents,
  stringifyFirstLevelValues,
};
