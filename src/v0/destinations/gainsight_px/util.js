const { NetworkError } = require('@rudderstack/integrations-lib');
const tags = require('../../util/tags');
const { getDynamicErrorType } = require('../../../adapters/utils/networkUtils');
const { JSON_MIME_TYPE } = require('../../util/constant');
const { handleHttpRequest } = require('../../../adapters/network');
const { getUsersEndpoint, getAccountsEndpoint } = require('./config');

const handleErrorResponse = (error, customErrMessage, expectedErrStatus, defaultStatus = 400) => {
  let destResp;
  let errMessage = '';
  let errorStatus = defaultStatus;

  if (error.response && error.response.data) {
    destResp = error.response?.data?.externalapierror ?? error.response?.data;
    errMessage = JSON.stringify(destResp);

    errorStatus = error.response.status;

    if (error.response.status === expectedErrStatus) {
      return { success: false, err: errMessage };
    }
  }
  throw new NetworkError(
    `${customErrMessage}: ${errMessage}`,
    errorStatus,
    {
      [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(errorStatus),
    },
    destResp,
  );
};

/**
 * Checks if user or account exists
 * @param {*} id
 * @param {*} Config
 * @param {*} objectType
 * @returns
 */
const objectExists = async (id, Config, objectType, metadata) => {
  let url = `${getUsersEndpoint(Config)}/${id}`;

  if (objectType === 'account') {
    url = `${getAccountsEndpoint(Config)}/${id}`;
  }
  const { httpResponse: res } = await handleHttpRequest(
    'get',
    url,
    {
      headers: {
        'X-APTRINSIC-API-KEY': Config.apiKey,
        'Content-Type': JSON_MIME_TYPE,
      },
    },
    {
      metadata,
      destType: 'gainsight_px',
      feature: 'transformation',
      requestMethod: 'GET',
      endpointPath: '/accounts/accountId',
      module: 'router',
    },
  );
  if (res.success && res.response && res.response.status === 200) {
    return { success: true, err: null };
  }
  return handleErrorResponse(res.response, `error while fetching ${objectType}`, 404);
};

const createAccount = async (payload, Config, metadata) => {
  const { httpResponse: res } = await handleHttpRequest(
    'post',
    getAccountsEndpoint(Config),
    payload,
    {
      headers: {
        'X-APTRINSIC-API-KEY': Config.apiKey,
        'Content-Type': JSON_MIME_TYPE,
      },
    },
    {
      metadata,
      destType: 'gainsight_px',
      feature: 'transformation',
      requestMethod: 'POST',
      endpointPath: '/accounts',
      module: 'router',
    },
  );
  if (res.success && res.response.status === 201) {
    return { success: true, err: null };
  }
  return handleErrorResponse(res.response, 'error while creating account', 400);
};

const updateAccount = async (accountId, payload, Config, metadata) => {
  const { httpResponse: res } = await handleHttpRequest(
    'put',
    `${getAccountsEndpoint(Config)}/${accountId}`,
    payload,
    {
      headers: {
        'X-APTRINSIC-API-KEY': Config.apiKey,
        'Content-Type': JSON_MIME_TYPE,
      },
    },
    {
      metadata,
      destType: 'gainsight_px',
      feature: 'transformation',
      requestMethod: 'PUT',
      endpointPath: '/accounts/accountId',
      module: 'router',
    },
  );
  if (res.success && res.response.status === 204) {
    return { success: true, err: null };
  }
  return handleErrorResponse(res.response, 'error while updating account', 400);
};

/**
 * Performs key mapping for Custom Attributes Object.
 * Keys for which mapping is not provided in webapp are dropped.
 * @param {*} payload
 * @param {*} userCustomFieldsMap
 * @returns
 */
const renameCustomFields = (payload, userCustomFieldsMap) => {
  const renamedPayload = {};
  const mapKeys = Object.keys(userCustomFieldsMap);
  Object.keys(payload).forEach((key) => {
    if (mapKeys.includes(key)) {
      renamedPayload[userCustomFieldsMap[key]] = payload[key];
    }
  });
  return renamedPayload;
};

/**
 * Util to stringify object present as value
 * for any key in event properties
 * @param {*} props
 * @returns
 */
const formatEventProps = (props) => {
  const formattedObj = {};
  Object.keys(props).forEach((key) => {
    if (typeof props[key] === 'object') {
      formattedObj[key] = JSON.stringify(props[key]);
    } else {
      formattedObj[key] = props[key];
    }
  });
  return formattedObj;
};

module.exports = {
  renameCustomFields,
  createAccount,
  updateAccount,
  objectExists,
  formatEventProps,
};
