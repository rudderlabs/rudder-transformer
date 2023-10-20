const get = require('get-value');
const {
  InstrumentationError,
  NetworkInstrumentationError,
} = require('@rudderstack/integrations-lib');
const { httpGET } = require('../../../adapters/network');
const {
  toUnixTimestamp,
  getDestinationExternalID,
  getFieldValueFromMessage,
  defaultRequestConfig,
  defaultPostRequestConfig,
  defaultPutRequestConfig,
  removeUndefinedAndNullValues,
  constructPayload,
} = require('../../util');
const { BASE_ENDPOINT, createPayloadMapping, updatePayloadMapping } = require('./config');

const CURRENCY_CODES = [
  'aed',
  'afn',
  'all',
  'amd',
  'ang',
  'aoa',
  'ars',
  'aud',
  'awg',
  'azn',
  'bam',
  'bbd',
  'bdt',
  'bgn',
  'bhd',
  'bif',
  'bmd',
  'bnd',
  'bob',
  'brl',
  'bsd',
  'btc',
  'btn',
  'bwp',
  'bzd',
  'cad',
  'cdf',
  'chf',
  'clf',
  'clp',
  'cny',
  'cop',
  'crc',
  'cup',
  'cve',
  'czk',
  'djf',
  'dkk',
  'dop',
  'dzd',
  'egp',
  'ern',
  'etb',
  'eur',
  'fjd',
  'fkp',
  'gbp',
  'gel',
  'ghs',
  'gip',
  'gmd',
  'gnf',
  'gtq',
  'gyd',
  'hkd',
  'hnl',
  'hrk',
  'htg',
  'huf',
  'idr',
  'ils',
  'inr',
  'iqd',
  'irr',
  'isk',
  'jep',
  'jmd',
  'jod',
  'jpy',
  'kes',
  'kgs',
  'khr',
  'kmf',
  'kpw',
  'krw',
  'kwd',
  'kyd',
  'kzt',
  'lak',
  'lbp',
  'lkr',
  'lrd',
  'lsl',
  'lyd',
  'mad',
  'mdl',
  'mga',
  'mkd',
  'mmk',
  'mnt',
  'mop',
  'mro',
  'mur',
  'mvr',
  'mwk',
  'mxn',
  'myr',
  'mzn',
  'nad',
  'ngn',
  'nio',
  'nok',
  'npr',
  'nzd',
  'omr',
  'pab',
  'pen',
  'pgk',
  'php',
  'pkr',
  'pln',
  'pyg',
  'qar',
  'ron',
  'rsd',
  'rub',
  'rwf',
  'sar',
  'sbd',
  'scr',
  'sdg',
  'sek',
  'sgd',
  'shp',
  'sll',
  'sos',
  'srd',
  'std',
  'svc',
  'syp',
  'szl',
  'thb',
  'tjs',
  'tmt',
  'tnd',
  'top',
  'try',
  'ttd',
  'twd',
  'tzs',
  'uah',
  'ugx',
  'usd',
  'uyu',
  'uzs',
  'vef',
  'vnd',
  'vuv',
  'wst',
  'xaf',
  'xag',
  'xau',
  'xcd',
  'xdr',
  'xof',
  'xpf',
  'yer',
  'zar',
  'zmw',
  'zwl',
];

const getSubscriptionHistory = async (endpoint, options) => {
  const requestOptions = {
    method: 'get',
    ...options,
  };

  const res = await httpGET(endpoint, requestOptions, {
    destType: 'profitwell',
    feature: 'transformation',
  });
  return res;
};

const unixTimestampOrError = (date, timestamp, originalTimestamp) => {
  if (!date) {
    return toUnixTimestamp(timestamp || originalTimestamp);
  }
  const convertedTS = new Date(Number(date)).getTime();
  if (convertedTS > 0) {
    return convertedTS;
  }
  throw new InstrumentationError('Invalid timestamp format for effectiveDate. Aborting');
};

const isValidPlanCurrency = (planCurrency) => CURRENCY_CODES.includes(planCurrency.toLowerCase());

const validatePayloadAndRetunImpIds = (message) => {
  const userId = getDestinationExternalID(message, 'profitwellUserId');
  const userAlias = getFieldValueFromMessage(message, 'userId');

  const subscriptionId = getDestinationExternalID(message, 'profitwellSubscriptionId');
  const subscriptionAlias =
    get(message, 'traits.subscriptionAlias') || get(message, 'context.traits.subscriptionAlias');

  if (!userId && !userAlias) {
    throw new InstrumentationError('userId or userAlias is required for identify');
  }
  if (!subscriptionId && !subscriptionAlias) {
    throw new InstrumentationError('subscriptionId or subscriptionAlias is required for identify');
  }
  return { userId, userAlias, subscriptionId, subscriptionAlias };
};

function createMissingSubscriptionResponse(
  userId,
  userAlias,
  subscriptionId,
  subscriptionAlias,
  message,
  Config,
) {
  // for a given userId, subscriptionId not found
  // dropping event if profitwellSubscriptionId (externalId) did not
  // match with any subscription_id at destination
  let payload = {};
  const response = defaultRequestConfig();
  if (subscriptionId) {
    throw new NetworkInstrumentationError('Profitwell subscription_id not found');
  }
  payload = constructPayload(message, createPayloadMapping);
  payload = {
    ...payload,
    user_id: userId,
    user_alias: userAlias,
  };
  if (
    payload.plan_interval &&
    !(
      payload.plan_interval.toLowerCase() === 'month' ||
      payload.plan_interval.toLowerCase() === 'year'
    )
  ) {
    throw new InstrumentationError('invalid format for planInterval. Aborting');
  }
  if (payload.plan_currency && !isValidPlanCurrency(payload.plan_currency)) {
    payload.plan_currency = null;
  }
  if (
    payload.status &&
    !(payload.status.toLowerCase() === 'active' || payload.status.toLowerCase() === 'trialing')
  ) {
    payload.status = null;
  }
  payload.effective_date = unixTimestampOrError(
    payload.effective_date,
    message.timestamp,
    message.originalTimestamp,
  );
  response.method = defaultPostRequestConfig.requestMethod;
  response.endpoint = `${BASE_ENDPOINT}/v2/subscriptions/`;
  response.headers = {
    'Content-Type': 'application/json',
    Authorization: Config.privateApiKey,
  };
  response.body.JSON = removeUndefinedAndNullValues(payload);
  return response;
}

const createResponseForSubscribedUser = (message, subscriptionId, subscriptionAlias, Config) => {
  const response = defaultRequestConfig();
  const payload = constructPayload(message, updatePayloadMapping);
  if (
    payload.plan_interval &&
    !(
      payload.plan_interval.toLowerCase() === 'month' ||
      payload.plan_interval.toLowerCase() === 'year'
    )
  ) {
    throw new InstrumentationError('invalid format for planInterval. Aborting');
  }
  if (
    payload.status &&
    !(payload.status.toLowerCase() === 'active' || payload.status.toLowerCase() === 'trialing')
  ) {
    payload.status = null;
  }
  payload.effective_date = unixTimestampOrError(
    payload.effective_date,
    unixTimestampOrError,
    message.originalTimestamp,
  );
  response.method = defaultPutRequestConfig.requestMethod;
  response.endpoint = `${BASE_ENDPOINT}/v2/subscriptions/${subscriptionId || subscriptionAlias}/`;
  response.headers = {
    'Content-Type': 'application/json',
    Authorization: Config.privateApiKey,
  };
  response.body.JSON = removeUndefinedAndNullValues(payload);
  return response;
};

module.exports = {
  getSubscriptionHistory,
  unixTimestampOrError,
  isValidPlanCurrency,
  validatePayloadAndRetunImpIds,
  createMissingSubscriptionResponse,
  createResponseForSubscribedUser,
};
