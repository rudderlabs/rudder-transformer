const { NetworkError, AbortedError } = require('@rudderstack/integrations-lib');
const { getDynamicErrorType } = require('../../../adapters/utils/networkUtils');
const logger = require('../../../logger');
const { constructPayload, isDefinedAndNotNull, isHttpStatusSuccess } = require('../../util');
const { ENDPOINT, productMapping } = require('./config');
const tags = require('../../util/tags');
const { JSON_MIME_TYPE } = require('../../util/constant');
const { handleHttpRequest } = require('../../../adapters/network');

const isValidEmail = (email) => {
  const re =
    /^(([^\s"(),.:;<>@[\\\]]+(\.[^\s"(),.:;<>@[\\\]]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([\dA-Za-z-]+\.)+[A-Za-z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const isValidTimestamp = (timestamp) => {
  const re =
    /^(-?(?:[1-9]\d*)?\d{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12]\d)T(2[0-3]|[01]\d):([0-5]\d):([0-5]\d)(.\d+)?(Z)?$/;
  return re.test(String(timestamp));
};

const userExists = async (Config, id) => {
  const basicAuth = Buffer.from(Config.apiKey).toString('base64');
  try {
    const { processedResponse: processedResponseDrip } = await handleHttpRequest(
      'get',
      `${ENDPOINT}/v2/${Config.accountId}/subscribers/${id}`,
      {
        headers: {
          Authorization: `Basic ${basicAuth}`,
          'Content-Type': JSON_MIME_TYPE,
        },
      },
      { destType: 'drip', feature: 'transformation' },
    );

    if (!isHttpStatusSuccess(processedResponseDrip.status)) {
      throw new NetworkError(
        'Invalid response.',
        processedResponseDrip.status,
        {
          [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(processedResponseDrip.status),
        },
        processedResponseDrip.response,
      );
    }
    if (processedResponseDrip?.status) {
      return processedResponseDrip.status === 200;
    }
  } catch (error) {
    let errMsg = '';
    let errStatus = 400;
    if (error.response) {
      errStatus = error.response.status || 400;
      errMsg = error.response.data
        ? JSON.stringify(error.response.data)
        : 'error response not found';
    }
    throw new NetworkError(`Error occurred while checking user : ${errMsg}`, errStatus, {
      [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(errStatus),
    });
  }
  return false;
};

const createUpdateUser = async (finalpayload, Config, basicAuth) => {
    const { processedResponse: processedResponseDrip } = await handleHttpRequest(
      'post',
      `${ENDPOINT}/v2/${Config.accountId}/subscribers`,
      finalpayload,
      {
        headers: {
          Authorization: `Basic ${basicAuth}`,
          'Content-Type': JSON_MIME_TYPE,
        },
      },
      { destType: 'drip', feature: 'transformation' },
    );

    if (processedResponseDrip) {
      return processedResponseDrip.status === 200 || processedResponseDrip.status === 201;
    }

    let errMsg = '';
    if (processedResponseDrip.response) {
      errMsg = JSON.stringify(processedResponseDrip.response);
    }
    throw new AbortedError(`Error occurred while creating or updating user : ${errMsg}`);
};

const createList = (productList) => {
  const itemList = [];
  if (productList.length > 0) {
    productList.forEach((product, index) => {
      const itemPayload = constructPayload(product, productMapping);
      if (itemPayload.name && isDefinedAndNotNull(itemPayload.price)) {
        itemList.push(itemPayload);
      } else {
        logger.error(`Item at index ${index} dropped. Name and price is required`);
      }
    });
  }
  return itemList;
};

module.exports = {
  userExists,
  isValidEmail,
  isValidTimestamp,
  createUpdateUser,
  createList,
};
