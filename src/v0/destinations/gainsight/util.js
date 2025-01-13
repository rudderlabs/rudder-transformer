const {
  NetworkError,
  ConfigurationError,
  RetryableError,
} = require('@rudderstack/integrations-lib');
const { getDynamicErrorType } = require('../../../adapters/utils/networkUtils');
const logger = require('../../../logger');
const { ENDPOINTS, getLookupPayload } = require('./config');
const tags = require('../../util/tags');
const { JSON_MIME_TYPE } = require('../../util/constant');
const { handleHttpRequest } = require('../../../adapters/network');
const { isHttpStatusSuccess } = require('../../util');

const throwNetworkError = (errMsg, status, response) => {
  throw new NetworkError(
    errMsg,
    status,
    {
      [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
    },
    response,
  );
};

const throwRetryableError = (errMsg, response) => {
  throw new RetryableError(errMsg, 500, response);
};

const makeHttpRequest = async ({ method, url, payload, config, statTags, options = {} }) =>
  handleHttpRequest(
    method,
    url,
    payload,
    {
      headers: {
        Accesskey: config.accessKey,
        'Content-Type': JSON_MIME_TYPE,
      },
      ...options,
    },
    {
      destType: 'gainsight',
      feature: 'transformation',
      requestMethod: method.toUpperCase(),
      module: 'router',
      ...statTags,
    },
  );

const searchGroup = async (groupName, Config, metadata) => {
  const { processedResponse } = await makeHttpRequest({
    method: 'post',
    url: `${ENDPOINTS.groupSearchEndpoint(Config.domain)}`,
    payload: getLookupPayload(groupName),
    config: Config,
    statTags: {
      endpointPath: '/data/objects/query/Company',
      metadata,
    },
  });

  if (!isHttpStatusSuccess(processedResponse.status)) {
    throwNetworkError(
      `failed to search group ${JSON.stringify(processedResponse.response)}`,
      processedResponse.status,
      processedResponse,
    );
  }

  if (!processedResponse?.response || processedResponse.status !== 200) {
    throwRetryableError('failed to search group', processedResponse);
  }

  return processedResponse.response;
};

const createGroup = async (payload, Config, metadata) => {
  const { processedResponse } = await makeHttpRequest({
    method: 'post',
    url: `${ENDPOINTS.groupCreateEndpoint(Config.domain)}`,
    payload: {
      records: [payload],
    },
    config: Config,
    statTags: {
      metadata,
      endpointPath: '/data/objects/Company',
    },
  });

  if (!isHttpStatusSuccess(processedResponse.status)) {
    throwNetworkError(
      `failed to create group ${JSON.stringify(processedResponse.response)}`,
      processedResponse.status,
      processedResponse,
    );
  }

  if (!processedResponse?.response || processedResponse.status !== 200) {
    throwRetryableError('failed to create group', processedResponse);
  }

  return processedResponse.response.data.records[0].Gsid;
};

const updateGroup = async (payload, Config, metadata) => {
  const { processedResponse } = await makeHttpRequest({
    method: 'put',
    url: `${ENDPOINTS.groupUpdateEndpoint(Config.domain)}`,
    payload: {
      records: [payload],
    },
    config: Config,
    options: {
      params: {
        keys: 'Name',
      },
    },
    statTags: {
      endpointPath: '/data/objects/Company',
      metadata,
    },
  });

  if (!isHttpStatusSuccess(processedResponse.status)) {
    throwNetworkError(
      `failed to update group ${JSON.stringify(processedResponse.response)}`,
      processedResponse.status,
      processedResponse,
    );
  }

  if (!processedResponse?.response || processedResponse.status !== 200) {
    throwRetryableError('failed to update group', processedResponse);
  }

  return processedResponse.response.data.records[0].Gsid;
};

/**
 * Provides Custom Field name mappping. If map is empty, only keeps
 * the default keys and removes all other keys from payload.
 * @param {*} payload
 * @param {*} fieldsMap
 * @param {*} exlusionKeys
 * @returns
 */
const renameCustomFieldsFromMap = (payload, fieldsMap, exlusionKeys) => {
  const mappedPayload = {};

  if (!fieldsMap || Object.keys(fieldsMap).length === 0) {
    Object.keys(payload).forEach((key) => {
      if (exlusionKeys.includes(key)) {
        mappedPayload[key] = payload[key];
      }
    });
    return mappedPayload;
  }

  const fieldMapKeys = Object.keys(fieldsMap);
  Object.keys(payload).forEach((key) => {
    if (exlusionKeys.includes(key)) {
      mappedPayload[key] = payload[key];
    } else if (fieldMapKeys.includes(key)) {
      mappedPayload[fieldsMap[key]] = payload[key];
    } else {
      logger.info(`dropping key ${key}`);
    }
  });
  return mappedPayload;
};

const getConfigOrThrowError = (Config, requiredKeys, methodName) => {
  const retObj = {};
  requiredKeys.forEach((key) => {
    if (!Config[key]) {
      throw new ConfigurationError(`${key} is required for ${methodName}`, 500);
    }
    retObj[key] = Config[key];
  });
  return retObj;
};

module.exports = {
  searchGroup,
  createGroup,
  updateGroup,
  renameCustomFieldsFromMap,
  getConfigOrThrowError,
};
