const { NetworkError } = require('@rudderstack/integrations-lib');
const tags = require('../../util/tags');
const { getDynamicErrorType } = require('../../../adapters/utils/networkUtils');
const { JSON_MIME_TYPE } = require('../../util/constant');
const { isHttpStatusSuccess } = require('../../util');
const { handleHttpRequest } = require('../../../adapters/network');
const { getUsersEndpoint, getAccountsEndpoint } = require('./config');

// processedResponse already maps no-response failures (timeout/reset) to a retryable status
const handleErrorResponse = ({ response, status }, customErrMessage, expectedErrStatus) => {
  const destResp = response.externalapierror ?? response;
  const errMessage = destResp ? JSON.stringify(destResp) : '';

  // callers treat an empty err as "no error", so only a response with a body counts as expected
  if (status === expectedErrStatus && errMessage) {
    return { success: false, err: errMessage };
  }
  // an unexpected 2xx (e.g. 200 instead of 201) is not a success here, so it still aborts
  const errStatus = isHttpStatusSuccess(status) ? 400 : status;
  throw new NetworkError(
    `${customErrMessage}: ${errMessage}`,
    errStatus,
    {
      [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(errStatus),
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
  const { processedResponse } = await handleHttpRequest(
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
  if (processedResponse.status === 200) {
    return { success: true, err: null };
  }
  return handleErrorResponse(processedResponse, `error while fetching ${objectType}`, 404);
};

const createAccount = async (payload, Config, metadata) => {
  const { processedResponse } = await handleHttpRequest(
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
  if (processedResponse.status === 201) {
    return { success: true, err: null };
  }
  return handleErrorResponse(processedResponse, 'error while creating account', 400);
};

const updateAccount = async (accountId, payload, Config, metadata) => {
  const { processedResponse } = await handleHttpRequest(
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
  if (processedResponse.status === 204) {
    return { success: true, err: null };
  }
  return handleErrorResponse(processedResponse, 'error while updating account', 400);
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
