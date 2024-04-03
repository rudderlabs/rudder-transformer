const { NetworkError, ConfigurationError } = require('@rudderstack/integrations-lib');
const { getDynamicErrorType } = require('../../../adapters/utils/networkUtils');
const logger = require('../../../logger');
const { ENDPOINTS, getLookupPayload } = require('./config');
const tags = require('../../util/tags');
const { JSON_MIME_TYPE } = require('../../util/constant');
const { handleHttpRequest } = require('../../../adapters/network');
const { isHttpStatusSuccess } = require('../../util');
const { RetryRequestError } = require('../../../util/utils');

const searchGroup = async (groupName, Config) => {
  const { processedResponse } = await handleHttpRequest(
    'post',
    `${ENDPOINTS.groupSearchEndpoint(Config.domain)}`,
    getLookupPayload(groupName),
    {
      headers: {
        Accesskey: Config.accessKey,
        'Content-Type': JSON_MIME_TYPE,
      },
    },
    {
      destType: 'gainsight',
      feature: 'transformation',
      requestMethod: 'POST',
      endpointPath: '/data/objects/query/Company',
      module: 'router',
    },
  );

  if (!isHttpStatusSuccess(processedResponse.status)) {
    throw new NetworkError(
      `failed to search group ${JSON.stringify(processedResponse.response)}`,
      processedResponse.status,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(processedResponse.status),
      },
      processedResponse,
    );
  }

  if (!processedResponse || !processedResponse.response || processedResponse.status !== 200) {
    throw new RetryRequestError('failed to search group');
  }

  return processedResponse.response;
};

const createGroup = async (payload, Config) => {
  const { processedResponse } = await handleHttpRequest(
    'post',
    `${ENDPOINTS.groupCreateEndpoint(Config.domain)}`,
    {
      records: [payload],
    },
    {
      headers: {
        Accesskey: Config.accessKey,
        'Content-Type': JSON_MIME_TYPE,
      },
    },
    {
      destType: 'gainsight',
      feature: 'transformation',
      requestMethod: 'POST',
      endpointPath: '/data/objects/Company',
      module: 'router',
    },
  );

  if (!isHttpStatusSuccess(processedResponse.status)) {
    throw new NetworkError(
      `failed to create group ${JSON.stringify(processedResponse.response)}`,
      processedResponse.status,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(processedResponse.status),
      },
      processedResponse,
    );
  }

  if (!processedResponse || !processedResponse.response || processedResponse.status !== 200) {
    throw new RetryRequestError('failed to create group');
  }

  return processedResponse.response.data.records[0].Gsid;
};

const updateGroup = async (payload, Config) => {
  const { processedResponse } = await handleHttpRequest(
    'put',
    `${ENDPOINTS.groupUpdateEndpoint(Config.domain)}`,
    {
      records: [payload],
    },
    {
      headers: {
        Accesskey: Config.accessKey,
        'Content-Type': JSON_MIME_TYPE,
      },
      params: {
        keys: 'Name',
      },
    },
    {
      destType: 'gainsight',
      feature: 'transformation',
      requestMethod: 'PUT',
      endpointPath: '/data/objects/Company',
      module: 'router',
    },
  );

  if (!isHttpStatusSuccess(processedResponse.status)) {
    throw new NetworkError(
      `failed to update group ${JSON.stringify(processedResponse.response)}`,
      processedResponse.status,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(processedResponse.status),
      },
      processedResponse,
    );
  }

  if (!processedResponse || !processedResponse.response || processedResponse.status !== 200) {
    throw new RetryRequestError('failed to update group');
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
