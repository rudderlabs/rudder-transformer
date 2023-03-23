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
// It builds request according to transformer server contract
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
const addConversionToTheJob = async (message, Config, offlineUserDataJobI, event) => {
  const { context, properties } = message;
  const { customerId, validateOnly, UserIdentifierSource, hashUserIdentifier,
    defaultUserIdentifier, customerEligible } = Config;
  const payload = constructPayload(message, trackAddStoreConversionsMapping);
  payload.enable_partial_failure = false;
  payload.enable_warnings = false;
  payload.validate_only = validateOnly;
  // mapping custom_key that should be predefined in google Ui and mentioned when new job is created
  payload.operations.create.transaction_attribute[properties.custom_key] = properties[properties.custom_key];
  const address = buildAddress(message);

  const transactionCost = properties.transaction_amount_micros || properties.transactionAmountMicros || properties.conversionValue ||
    properties.total ||
    properties.value ||
    properties.revenue;
  // Converting transaction Cost to micro as mentioned here : https://developers.google.com/google-ads/api/reference/rpc/v13/TransactionAttribute#:~:text=30%2B03%3A00%22-,transaction_amount_micros,-double
  payload.operations.create.transaction_attribute.transaction_amount_micros = `${Number(transactionCost) * 1000000}`;

  // Mapping Conversion Action
  payload.operations.create.transaction_attribute.conversion_action = await getConversionActionId({
    Authorization: `Bearer ${getAccessToken(metadata)}`,
    'Content-Type': 'application/json',
    'developer-token': get(metadata, 'secret.developer_token'),
  }, { event: event, customerId })

  // userIdentifierSource
  // if userIdentifierSource doesn't exist in properties
  // then it is taken from the webapp config
  if (!properties.userIdentifierSource && UserIdentifierSource !== 'none') {
    set(payload, 'operations.create.userIdentifiers[0].userIdentifierSource', UserIdentifierSource);

    // one of email or phone must be provided
    if (!email && !phone && !Object.keys(address).length > 0) {
      throw new InstrumentationError(`Either of email or phone or address attributes is required for user identifier`);
    }
  }

  // Mapping userIdentifer
  let email = getFieldValueFromMessage(message, 'email');;
  let phone = getFieldValueFromMessage(message, 'phone');;
  if (defaultUserIdentifier === 'email' && email) {
    email = hashUserIdentifier ? sha256(email).toString() : email;
    set(payload, 'operations.create.userIdentifiers[0].hashedEmail', email);
  } else if (defaultUserIdentifier === 'phone' && phone) {
    phone = hashUserIdentifier ? sha256(phone).toString() : phone;
    set(payload, 'operations.create.userIdentifiers[0].hashedPhoneNumber', phone);
  } else {
    // case when default choosen value is not present
    if (email) {
      email = hashUserIdentifier ? sha256(email).toString() : email;
      set(payload, 'operations.create.userIdentifiers[0].hashedEmail', email);
    } else {
      phone = hashUserIdentifier ? sha256(phone).toString() : phone;
      set(payload, 'operations.create.userIdentifiers[0].hashedPhoneNumber', phone);
    }
  }

  // Mapping item_attribute if customer is eligible
  if (customerEligible) {
    // item Attribute -> https://developers.google.com/google-ads/api/docs/conversions/upload-store-sales-transactions#include_shopping_items_with_transactions
    const item_attribute = {
      item_id: properties.product_id || properties.item_id,
      country_code: context.traits.country_code || context.traits.countryCode || properties.country_code || properties.countryCode,
      language_code: properties.language_code || properties.languageCode,
      quantity: properties.quantity,
      merchant_id: properties.merchant_id || properties.merchantId

    }
    payload.operations.create.transaction_attribute.item_attribute = item_attribute;
  }
  const filteredCustomerId = removeHyphens(customerId);
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
