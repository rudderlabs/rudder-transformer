const { NetworkError } = require('@rudderstack/integrations-lib');
const myAxios = require('../../../util/myAxios');
const { ENDPOINTS } = require('./config');
const tags = require('../../util/tags');
const { getDynamicErrorType } = require('../../../adapters/utils/networkUtils');
const { JSON_MIME_TYPE } = require('../../util/constant');

const handleErrorResponse = (error, customErrMessage, expectedErrStatus, defaultStatus = 400) => {
  let errMessage = '';
  let errorStatus = defaultStatus;

  if (error.response && error.response.data) {
    errMessage = error.response.data.externalapierror
      ? JSON.stringify(error.response.data.externalapierror)
      : JSON.stringify(error.response.data);

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
    error,
  );
};

/**
 * Checks if user or account exists
 * @param {*} id
 * @param {*} Config
 * @param {*} objectType
 * @returns
 */
const objectExists = async (id, Config, objectType) => {
  let url = `${ENDPOINTS.USERS_ENDPOINT}/${id}`;
  let err = 'invalid response while searching user';

  if (objectType === 'account') {
    url = `${ENDPOINTS.ACCOUNTS_ENDPOINT}/${id}`;
    err = 'invalid response while searching account';
  }

  let response;
  try {
    response = await myAxios.get(
      url,
      {
        headers: {
          'X-APTRINSIC-API-KEY': Config.apiKey,
          'Content-Type': JSON_MIME_TYPE,
        },
      },
      { destType: 'gainsight_px', feature: 'transformation' },
    );
    if (response && response.status === 200) {
      return { success: true, err: null };
    }
    const defStatus = 400;
    const status = response ? response.status || defStatus : defStatus;
    throw new NetworkError(
      err,
      status,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
      },
      response,
    );
  } catch (error) {
    return handleErrorResponse(error, `error while fetching ${objectType}`, 404);
  }
};

const createAccount = async (payload, Config) => {
  let response;
  try {
    response = await myAxios.post(
      ENDPOINTS.ACCOUNTS_ENDPOINT,
      payload,
      {
        headers: {
          'X-APTRINSIC-API-KEY': Config.apiKey,
          'Content-Type': JSON_MIME_TYPE,
        },
      },
      { destType: 'gainsight_px', feature: 'transformation' },
    );
    if (response && response.status === 201) {
      return { success: true, err: null };
    }

    const defStatus = 400;
    const status = response ? response.status || defStatus : defStatus;
    throw new NetworkError(
      'invalid response while creating account',
      status,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
      },
      response,
    );
  } catch (error) {
    return handleErrorResponse(error, 'error while creating account', 400);
  }
};

const updateAccount = async (accountId, payload, Config) => {
  let response;
  try {
    response = await myAxios.put(
      `${ENDPOINTS.ACCOUNTS_ENDPOINT}/${accountId}`,
      payload,
      {
        headers: {
          'X-APTRINSIC-API-KEY': Config.apiKey,
          'Content-Type': JSON_MIME_TYPE,
        },
      },
      { destType: 'gainsight_px', feature: 'transformation' },
    );
    if (response && response.status === 204) {
      return { success: true, err: null };
    }
    const defStatus = 400;
    const status = response ? response.status || defStatus : defStatus;
    throw new NetworkError(
      'invalid response while updating account',
      status,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
      },
      response,
    );
  } catch (error) {
    // it will only occur if the user does not exist
    if (
      error.response?.status === 404 &&
      error.response?.data?.externalapierror?.status === 'NOT_FOUND'
    ) {
      return { success: false, err: null };
    }
    return handleErrorResponse(error, 'error while updating account', 400);
  }
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
