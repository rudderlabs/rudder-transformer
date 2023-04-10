const sha256 = require('sha256');
const { get, set, cloneDeep } = require('lodash');
const moment = require('moment');
const { httpPOST } = require('../../../adapters/network');
const {
  isHttpStatusSuccess,
  constructPayload,
  defaultRequestConfig,
  defaultPostRequestConfig,
  removeHyphens,
  getFieldValueFromMessage
} = require('../../util');
const { REFRESH_TOKEN } = require('../../../adapters/networkhandler/authConstants');
const {
  SEARCH_STREAM,
  CONVERSION_ACTION_ID_CACHE_TTL,
  trackCreateStoreConversionsMapping,
  trackAddStoreConversionsMapping,
  trackAddStoreAddressConversionsMapping,
  trackClickConversionsMapping,
  CLICK_CONVERSION
} = require('./config');
const { processAxiosResponse } = require('../../../adapters/utils/networkUtils');
const Cache = require('../../util/cache');
const { AbortedError, OAuthSecretError, ConfigurationError, InstrumentationError } = require('../../util/errorTypes');

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
/**
 * To construct the address object according to the google ads documentation
 * @param {*} message 
 */
const buildAndGetAddress = (message, hashUserIdentifier) => {
  const address = constructPayload(message, trackAddStoreAddressConversionsMapping);
  if(address.hashed_last_name){
    address.hashed_last_name = hashUserIdentifier? sha256(address.hashed_last_name).toString(): address.hashed_last_name;
  }
  if(address.hashed_first_name){
    address.hashed_first_name = hashUserIdentifier? sha256(address.hashed_first_name).toString(): address.hashed_first_name;
  }
  if(address.hashed_street_address){
    address.hashed_street_address = hashUserIdentifier? sha256(address.hashed_street_address).toString(): address.hashed_street_address;
  }
  return Object.keys(address).length > 0 ? address : null;
};

// It builds request according to transformer server contract
const requestBuilder = (
  payload,
  endpoint,
  Config,
  metadata,
  event,
  filteredCustomerId,
  properties
) => {
  const { customVariables, subAccount, loginCustomerId } = Config;
  const response = defaultRequestConfig();
  response.method = defaultPostRequestConfig.requestMethod;
  response.endpoint = endpoint;
  response.params = {
    event,
    customerId: filteredCustomerId
  };
  if (!payload?.isStoreConversion) {
    response.params.customVariables = customVariables;
    response.params.properties = properties;
  }
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
 * This function creates a offlineUserDataJob Payload
 * and returns the payload
 */
const getCreateJobPayload = message => {
  const payload = constructPayload(message, trackCreateStoreConversionsMapping);
  set(payload, "job.type", 'STORE_SALES_UPLOAD_FIRST_PARTY');
  if (!payload.job?.storeSalesMetadata?.loyaltyFraction) {
    set(payload, "job.storeSalesMetadata.loyaltyFraction", '1');
  }
  if (!payload.job?.storeSalesMetadata?.transaction_upload_fraction) {
    set(payload, "job.storeSalesMetadata.transaction_upload_fraction", '1');
  }
  return payload;
};

/**
 * This Function create the add conversion payload 
 * and returns the payload
 */
const getAddConversionPayload = (message, Config) => {
  const { properties } = message;
  const { validateOnly, hashUserIdentifier,
    defaultUserIdentifier } = Config;
  const payload = constructPayload(message, trackAddStoreConversionsMapping);
  payload.enable_partial_failure = false;
  payload.enable_warnings = false;
  payload.validate_only = validateOnly || false;

  // transform originalTimestamp to format (yyyy-mm-dd hh:mm:ss+|-hh:mm)
  // e.g 2019-10-14T11:15:18.299Z -> 2019-10-14 16:10:29+0530
  const timestamp = payload.operations.create.transaction_attribute.transaction_date_time;
  const convertedDateTime = moment(timestamp)
    .utcOffset(moment(timestamp).utcOffset())
    .format('YYYY-MM-DD HH:mm:ssZ');
  payload.operations.create.transaction_attribute.transaction_date_time = convertedDateTime;
  // mapping custom_key that should be predefined in google Ui and mentioned when new job is created
  if (properties.custom_key && properties[properties.custom_key]) {
    payload.operations.create.transaction_attribute[properties.custom_key] = properties[properties.custom_key];
  }
  // Converting transaction Cost to micro as mentioned here : https://developers.google.com/google-ads/api/reference/rpc/v13/TransactionAttribute#:~:text=30%2B03%3A00%22-,transaction_amount_micros,-double
  payload.operations.create.transaction_attribute.transaction_amount_micros = `${payload.operations.create.transaction_attribute.transaction_amount_micros * 1000000}`;
  // userIdentifierSource
  // if userIdentifierSource doesn't exist in properties
  // then it is taken from the webapp config
  let email = getFieldValueFromMessage(message, 'email');
  let phone = getFieldValueFromMessage(message, 'phone');
  const address = buildAndGetAddress(message, hashUserIdentifier);
  if (defaultUserIdentifier === 'email' && email) {
    email = hashUserIdentifier ? sha256(email).toString() : email;
    set(payload, 'operations.create.userIdentifiers[0].hashedEmail', email);
  } else if (defaultUserIdentifier === 'phone' && phone) {
    phone = hashUserIdentifier ? sha256(phone).toString(): phone;
    set(payload, 'operations.create.userIdentifiers[0].hashedPhoneNumber', phone);
  } else if (address) {
    // priortizing address in case defaultUserIdentifier is not present
    set(payload, 'operations.create.userIdentifiers[0].address_info', address);
  } else if (email) {
    // case when default choosen value is not present
    email = hashUserIdentifier ? sha256(email).toString() : email;
    set(payload, 'operations.create.userIdentifiers[0].hashedEmail', email);
  } else if (phone) {
    phone = hashUserIdentifier ? sha256(phone).toString(): phone;
    set(payload, 'operations.create.userIdentifiers[0].hashedPhoneNumber', phone);
  } else {
    set(payload, 'operations.create.userIdentifiers[0]', {}); // if no user identifier is present
  }
  return payload;
};

const getStoreConversionPayload = (message, Config, event) => {
  const { validateOnly } = Config;
  const payload = {};
  payload.event = event;
  payload.isStoreConversion = true;
  payload.createJobPayload = getCreateJobPayload(message);
  payload.addConversionPayload = getAddConversionPayload(message, Config);
  payload.executeJobPayload = { validate_only: validateOnly }
  return payload;
}

const getClickConversionPayloadAndEndpoint = (message, Config, filteredCustomerId) => {
  let email = getFieldValueFromMessage(message, 'email');
  let phone = getFieldValueFromMessage(message, 'phone');
  const {
    hashUserIdentifier,
    defaultUserIdentifier,
    UserIdentifierSource,
    conversionEnvironment
  } = Config;
  const { properties } = message;
  // click conversions
  let updatedClickMapping = cloneDeep(trackClickConversionsMapping);

  if (hashUserIdentifier === false) {
    updatedClickMapping = removeHashToSha256TypeFromMappingJson(updatedClickMapping);
  }

  const payload = constructPayload(message, updatedClickMapping);


  const endpoint = CLICK_CONVERSION.replace(':customerId', filteredCustomerId);

  const products = get(message, 'properties.products');
  const itemList = [];
  if (products && products.length > 0 && Array.isArray(products)) {
    // products is a list of items
    products.forEach((product) => {
      if (Object.keys(product).length > 0) {
        itemList.push({
          productId: product.product_id,
          quantity: parseInt(product.quantity, 10),
          unitPrice: Number(product.price),
        });
      }
    });

    set(payload, 'conversions[0].cartData.items', itemList);
  }

  // userIdentifierSource
  // if userIdentifierSource doesn't exist in properties
  // then it is taken from the webapp config
  if (!properties.userIdentifierSource && UserIdentifierSource !== 'none') {
    set(payload, 'conversions[0].userIdentifiers[0].userIdentifierSource', UserIdentifierSource);

    // one of email or phone must be provided
    if (!email && !phone) {
      throw new InstrumentationError(`Either of email or phone is required for user identifier`);
    }
  }
  // either of email or phone should be passed
  // defaultUserIdentifier depends on the webapp configuration
  // Ref - https://developers.google.com/google-ads/api/rest/reference/rest/v11/customers/uploadClickConversions#ClickConversion
  if (defaultUserIdentifier === 'email' && email) {
    email = hashUserIdentifier ? sha256(email).toString() : email;
    set(payload, 'conversions[0].userIdentifiers[0].hashedEmail', email);
  } else if (defaultUserIdentifier === 'phone' && phone) {
    phone = hashUserIdentifier ? sha256(phone).toString() : phone;
    set(payload, 'conversions[0].userIdentifiers[0].hashedPhoneNumber', phone);
  } else if (email) {
    // case when default choosen value is not present
    email = hashUserIdentifier ? sha256(email).toString() : email;
    set(payload, 'conversions[0].userIdentifiers[0].hashedEmail', email);
  } else if (phone) {
    phone = hashUserIdentifier ? sha256(phone).toString() : phone;
    set(payload, 'conversions[0].userIdentifiers[0].hashedPhoneNumber', phone);
  }

  // conversionEnvironment
  // if conversionEnvironment doesn't exist in properties
  // then it is taken from the webapp config
  if (!properties.conversionEnvironment && conversionEnvironment !== 'none') {
    set(payload, 'conversions[0].conversionEnvironment', conversionEnvironment);
  }
  return { payload, endpoint };
}

module.exports = {
  validateDestinationConfig,
  getAccessToken,
  getConversionActionId,
  removeHashToSha256TypeFromMappingJson,
  getStoreConversionPayload,
  requestBuilder,
  buildAndGetAddress,
  getClickConversionPayloadAndEndpoint
};