const myAxios = require('../../../util/myAxios');
const { getDynamicErrorType } = require('../../../adapters/utils/networkUtils');
const logger = require('../../../logger');
const { ConfigurationError, RetryableError, NetworkError } = require('../../util/errorTypes');
const { ENDPOINTS, getLookupPayload } = require('./config');
const tags = require('../../util/tags');
const { JSON_MIME_TYPE } = require('../../util/constant');

const searchGroup = async (groupName, Config) => {
  let resp;
  try {
    resp = await myAxios.post(
      `${ENDPOINTS.groupSearchEndpoint(Config.domain)}`,
      getLookupPayload(groupName),
      {
        headers: {
          Accesskey: Config.accessKey,
          'Content-Type': JSON_MIME_TYPE,
        },
      },
      { destType: 'gainsight', feature: 'transformation' },
    );
  } catch (error) {
    let errMessage = '';
    let errorStatus = 500;
    if (error.response && error.response.data) {
      errMessage = error.response.data.errorDesc;
      errorStatus = error.response.status;
    }
    throw new NetworkError(`failed to search group ${errMessage}`, errorStatus, {
      [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(errorStatus),
    });
  }

  if (!resp || !resp.data || resp.status !== 200) {
    throw new RetryableError('failed to search group');
  }
  return resp;
};

const createGroup = async (payload, Config) => {
  let resp;
  try {
    resp = await myAxios.post(
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
      { destType: 'gainsight', feature: 'transformation' },
    );
  } catch (error) {
    let errMessage = '';
    let errorStatus = 500;
    if (error.response && error.response.data) {
      errMessage = error.response.data.errorDesc;
      errorStatus = error.response.status;
    }
    throw new NetworkError(`failed to create group ${errMessage}`, errorStatus, {
      [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(errorStatus),
    });
  }

  if (!resp || !resp.data || resp.status !== 200) {
    throw new RetryableError('failed to create group');
  }
  return resp.data.data.records[0].Gsid;
};

const updateGroup = async (payload, Config) => {
  let resp;
  try {
    resp = await myAxios.put(
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
      { destType: 'gainsight', feature: 'transformation' },
    );
  } catch (error) {
    let errMessage = '';
    let errorStatus = 500;
    if (error.response && error.response.data) {
      errMessage = error.response.data.errorDesc;
      errorStatus = error.response.status;
    }
    throw new NetworkError(`failed to update group ${errMessage}`, errorStatus, {
      [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(errorStatus),
    });
  }

  if (!resp || !resp.data || resp.status !== 200) {
    throw new RetryableError('failed to update group');
  }
  return resp.data.data.records[0].Gsid;
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
