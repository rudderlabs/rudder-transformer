const sha256 = require('sha256');
const get = require('get-value');
const { httpPOST } = require('../../../adapters/network');
const {
  isHttpStatusSuccess,
  constructPayload,
  defaultRequestConfig,
  defaultPostRequestConfig,
  removeHyphens,
} = require('../../util');
const { REFRESH_TOKEN } = require('../../../adapters/networkhandler/authConstants');
const {
  SEARCH_STREAM,
  CONVERSION_ACTION_ID_CACHE_TTL,
  trackCreateStoreConversionsMapping,
  trackAddStoreConversionsMapping,
  STORE_CONVERSION_CONFIG_ADD_CONVERSION,
  STORE_CONVERSION_CONFIG_CREATE_JOB,
} = require('./config');
const { processAxiosResponse } = require('../../../adapters/utils/networkUtils');
const Cache = require('../../util/cache');
const { AbortedError, OAuthSecretError, ConfigurationError } = require('../../util/errorTypes');

const conversionActionIdCache = new Cache(CONVERSION_ACTION_ID_CACHE_TTL);

/**
 * validate destination config and check for existence of data
 * @param {*} param0
 */
const validateDestinationConfig = ({ Config }) => {
  if (!Config.customerId) {
    throw new ConfigurationError('Customer ID not found. Aborting');
  }
};

/**
 * for OAuth destination
 * get access_token from metadata.secret{ ... }
 * @param {*} param0
 * @returns
 */
const getAccessToken = ({ secret }) => {
  if (!secret) {
    throw new OAuthSecretError('OAuth - access token not found');
  }
  return secret.access_token;
};

/**
 * This function helps to determine the type of error occured. We set the authErrorCategory
 * as per the destination response that is received and take the decision whether
 * to refresh the access_token or disable the destination.
 * @param {*} status
 * @returns
 */
const getAuthErrCategory = (status) => {
  switch (status) {
    case 401:
      // UNAUTHORIZED
      return REFRESH_TOKEN;
    default:
      return '';
  }
};

/**
 * get conversionAction using the conversion name using searchStream endpoint
 * @param {*} customerId
 * @param {*} event
 * @param {*} headers
 * @returns
 */
const getConversionActionId = async (headers, params) => {
  const conversionActionIdKey = sha256(params.event + params.customerId).toString();
  return conversionActionIdCache.get(conversionActionIdKey, async () => {
    const data = {
      query: `SELECT conversion_action.id FROM conversion_action WHERE conversion_action.name = '${params.event}'`,
    };
    const endpoint = SEARCH_STREAM.replace(':customerId', params.customerId);
    const requestOptions = {
      headers,
    };
    let searchStreamResponse = await httpPOST(endpoint, data, requestOptions);
    searchStreamResponse = processAxiosResponse(searchStreamResponse);
    if (!isHttpStatusSuccess(searchStreamResponse.status)) {
      throw new AbortedError(
        `[Google Ads Offline Conversions]:: ${searchStreamResponse.response[0].error.message} during google_ads_offline_conversions response transformation`,
        searchStreamResponse.status,
        searchStreamResponse.response,
        getAuthErrCategory(get(searchStreamResponse, 'status')),
      );
    }
    const conversionAction = get(
      searchStreamResponse,
      'response.0.results.0.conversionAction.resourceName',
    );
    if (!conversionAction) {
      throw new AbortedError(`Unable to find conversionActionId for conversion:${params.event}`);
    }
    return conversionAction;
  });
};

/**
 * update mapping Json config to remove 'hashToSha256'
 * operation from metadata.type and replace it with
 * 'toString'
 * @param {*} mapping
 * @returns
 */
const removeHashToSha256TypeFromMappingJson = (mapping) => {
  const newMapping = [];
  mapping.forEach((element) => {
    if (get(element, 'metadata.type') && element.metadata.type === 'hashToSha256') {
      // eslint-disable-next-line no-param-reassign
      element.metadata.type = 'toString';
    }
    newMapping.push(element);
  });
  return newMapping;
};
const requestBuilder = (
  payload,
  endpoint,
  Config,
  metadata,
  event,
  filteredCustomerId,
  properties,
) => {
  const { customVariables, subAccount, loginCustomerId } = Config;
  const response = defaultRequestConfig();
  response.method = defaultPostRequestConfig.requestMethod;
  response.endpoint = endpoint;
  response.params = {
    event,
    customerId: filteredCustomerId,
    customVariables,
    properties,
  };
  response.body.JSON = payload;
  response.headers = {
    Authorization: `Bearer ${getAccessToken(metadata)}`,
    'Content-Type': 'application/json',
    'developer-token': get(metadata, 'secret.developer_token'),
  };

  if (subAccount) {
    if (loginCustomerId) {
      const filteredLoginCustomerId = removeHyphens(loginCustomerId);
      response.headers['login-customer-id'] = filteredLoginCustomerId;
    } else {
      throw new ConfigurationError(`loginCustomerId is required as subAccount is enabled`);
    }
  }
  return response;
};
/**
 * This function creates a offlineUserDataJob
 * returns the respective id
 */
const getOfflineUserDataJobId = async (message, Config, metadata) => {
  const payload = constructPayload(message, trackCreateStoreConversionsMapping);
  payload.job.type = 'STORE_SALES_UPLOAD_FIRST_PARTY';
  const filteredCustomerId = removeHyphens(Config.customerId);
  const endpoint = STORE_CONVERSION_CONFIG_CREATE_JOB.replace(':customerId', filteredCustomerId);
  const options = {
    headers: {
      Authorization: `Bearer ${getAccessToken(metadata)}`,
      'Content-Type': 'application/json',
      'developer-token': get(metadata, 'secret.developer_token'),
    },
  };
  let createJobResponse = await httpPOST(endpoint, payload, options);
  createJobResponse = processAxiosResponse(createJobResponse);
  if (!isHttpStatusSuccess(createJobResponse.status)) {
    throw new AbortedError(
      `[Google Ads Offline Conversions]:: ${createJobResponse.response[0].error.message} during google_ads_offline_conversions response transformation`,
      createJobResponse.status,
      createJobResponse.response,
      getAuthErrCategory(get(createJobResponse, 'status')),
    );
  }
  return createJobResponse;
};

/**
 * This Function adds the conversion to the Job and
 * returns true if conversion is added succesfully to the job
 */
const addConversionToTheJob = async (message, Config, offlineUserDataJobId) => {
  const payload = constructPayload(message, trackAddStoreConversionsMapping);
  const filteredCustomerId = removeHyphens(Config.customerId);
  const endpoint = STORE_CONVERSION_CONFIG_ADD_CONVERSION.replace(
    'customerAndJobId',
    offlineUserDataJobId,
  ).replace(':customerId', filteredCustomerId);
  let addConversionResponse = await httpPOST(endpoint, payload, options);
  addConversionResponse = processAxiosResponse(addConversionResponse);
  if (!isHttpStatusSuccess(addConversionResponse.status)) {
    throw new AbortedError(
      `[Google Ads Offline Conversions]:: ${addConversionResponse.response[0].error.message} during google_ads_offline_conversions response transformation`,
      addConversionResponse.status,
      addConversionResponse.response,
      getAuthErrCategory(get(addConversionResponse, 'status')),
    );
  }
  return true;
};
module.exports = {
  validateDestinationConfig,
  getAccessToken,
  getConversionActionId,
  removeHashToSha256TypeFromMappingJson,
  getOfflineUserDataJobId,
  addConversionToTheJob,
  requestBuilder,
};
