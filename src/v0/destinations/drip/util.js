const { NetworkError, AbortedError } = require('@rudderstack/integrations-lib');
const myAxios = require('../../../util/myAxios');
const { getDynamicErrorType } = require('../../../adapters/utils/networkUtils');
const logger = require('../../../logger');
const { constructPayload, isDefinedAndNotNull } = require('../../util');
const { ENDPOINT, productMapping } = require('./config');
const tags = require('../../util/tags');
const { JSON_MIME_TYPE } = require('../../util/constant');

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
  let response;
  try {
    response = await myAxios.get(
      `${ENDPOINT}/v2/${Config.accountId}/subscribers/${id}`,
      {
        headers: {
          Authorization: `Basic ${basicAuth}`,
          'Content-Type': JSON_MIME_TYPE,
        },
      },
      { destType: 'drip', feature: 'transformation' },
    );
    if (response && response.status) {
      return response.status === 200;
    }
    throw new NetworkError(
      'Invalid response.',
      response?.status,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(response?.status),
      },
      response,
    );
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
};

const createUpdateUser = async (finalpayload, Config, basicAuth) => {
  try {
    const response = await myAxios.post(
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
    if (response) {
      return response.status === 200 || response.status === 201;
    }
    throw new AbortedError('Invalid response.');
  } catch (error) {
    let errMsg = '';
    if (error.response && error.response.data) {
      errMsg = JSON.stringify(error.response.data);
    }
    throw new AbortedError(`Error occurred while creating or updating user : ${errMsg}`);
  }
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
