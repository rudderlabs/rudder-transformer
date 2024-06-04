const { InstrumentationError, NetworkError } = require('@rudderstack/integrations-lib');
const { getDynamicErrorType } = require('../../../adapters/utils/networkUtils');
const { getValueFromMessage } = require('../../util');
const { ENDPOINT } = require('./config');
const tags = require('../../util/tags');
const { JSON_MIME_TYPE } = require('../../util/constant');
const { handleHttpRequest } = require('../../../adapters/network');

const isValidEmail = (email) => {
  const re =
    /^(([^\s"(),.:;<>@[\\\]]+(\.[^\s"(),.:;<>@[\\\]]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([\dA-Za-z-]+\.)+[A-Za-z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};
const isValidPhone = (phone) => {
  const phoneformat = /^\+[1-9]\d{10,14}$/;
  return phoneformat.test(String(phone));
};

const isValidUserIdOrError = (channel, userId) => {
  if (channel === 'email') {
    if (!isValidEmail(userId)) {
      throw new InstrumentationError('Channel is set to email. Enter correct email.');
    }
  } else if (channel === 'sms') {
    if (!isValidPhone(userId)) {
      throw new InstrumentationError(
        'Channel is set to sms. Enter correct phone number i.e. E.164',
      );
    }
  } else {
    throw new InstrumentationError('Invalid Channel type');
  }

  return {
    userIdType: channel === 'sms' ? 'phone_number' : 'email',
    userIdValue: userId,
  };
};

/**
 * Returns final status
 * @param {*} status
 * @returns
 */
const getErrorStatus = (status) => {
  let errStatus;
  switch (status) {
    case 422:
    case 401:
    case 406:
    case 403:
      errStatus = 400;
      break;
    case 500:
    case 503:
      errStatus = 500;
      break;
    default:
      errStatus = status;
  }
  return errStatus;
};

const userValidity = async (channel, Config, userId) => {
  const paramsdata = {};
  if (channel === 'email') {
    paramsdata.email = userId;
  } else if (channel === 'sms') {
    paramsdata.phone_number = userId;
  }

  const basicAuth = Buffer.from(Config.apiKey).toString('base64');
  const { processedResponse } = await handleHttpRequest(
    'get',
    `${ENDPOINT}`,
    {
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': JSON_MIME_TYPE,
      },
      params: paramsdata,
    },
    {
      destType: 'delighted',
      feature: 'transformation',
      requestMethod: 'GET',
      endpointPath: '/people.json',
      module: 'router',
    },
  );

  if (processedResponse.status === 200 && Array.isArray(processedResponse?.response)) {
    return processedResponse.response.length > 0;
  }

  const errStatus = getErrorStatus(processedResponse.status);
  throw new NetworkError(
    `Error occurred while checking user: ${JSON.stringify(processedResponse?.response || 'Invalid response')}`,
    errStatus,
    {
      [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(errStatus),
    },
    processedResponse,
  );
};
const eventValidity = (Config, message) => {
  const event = getValueFromMessage(message, 'event');
  if (!event) {
    throw new InstrumentationError('No event found.');
  }
  let flag = false;
  Config.eventNamesSettings.forEach((eventName) => {
    if (
      eventName.event &&
      eventName.event.trim().length > 0 &&
      eventName.event.trim().toLowerCase() === event.toLowerCase()
    ) {
      flag = true;
    }
  });
  return flag;
};

module.exports = {
  isValidUserIdOrError,
  eventValidity,
  userValidity,
  isValidEmail,
  isValidPhone,
};
