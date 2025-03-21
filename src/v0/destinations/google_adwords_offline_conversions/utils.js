const sha256 = require('sha256');
const SqlString = require('sqlstring');
const isString = require('lodash/isString');
const { get, set, cloneDeep } = require('lodash');
const {
  AbortedError,
  ConfigurationError,
  InstrumentationError,
} = require('@rudderstack/integrations-lib');
const { httpPOST } = require('../../../adapters/network');
const {
  isHttpStatusSuccess,
  constructPayload,
  defaultRequestConfig,
  defaultPostRequestConfig,
  removeHyphens,
  getFieldValueFromMessage,
  isDefinedAndNotNullAndNotEmpty,
  isDefinedAndNotNull,
  getAccessToken,
  getIntegrationsObj,
} = require('../../util');
const {
  SEARCH_STREAM,
  CONVERSION_ACTION_ID_CACHE_TTL,
  trackCreateStoreConversionsMapping,
  trackAddStoreConversionsMapping,
  trackAddStoreAddressConversionsMapping,
  trackClickConversionsMapping,
  CLICK_CONVERSION,
  trackCallConversionsMapping,
  consentConfigMap,
} = require('./config');
const { processAxiosResponse } = require('../../../adapters/utils/networkUtils');
const Cache = require('../../util/cache');
const helper = require('./helper');
const { finaliseConsent, getAuthErrCategory } = require('../../util/googleUtils');

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
 * get conversionAction using the conversion name using searchStream endpoint
 * @param {*} customerId
 * @param {*} event
 * @param {*} headers
 * @returns
 */
const getConversionActionId = async ({ headers, params, metadata }) => {
  const conversionActionIdKey = sha256(params.event + params.customerId).toString();
  return conversionActionIdCache.get(conversionActionIdKey, async () => {
    const queryString = SqlString.format(
      'SELECT conversion_action.id FROM conversion_action WHERE conversion_action.name = ?',
      [params.event],
    );
    const data = {
      query: queryString,
    };
    const endpoint = SEARCH_STREAM.replace(':customerId', params.customerId);
    const requestOptions = {
      headers,
    };
    let searchStreamResponse = await httpPOST(endpoint, data, requestOptions, {
      destType: 'google_adwords_offline_conversions',
      feature: 'transformation',
      endpointPath: `/googleAds:searchStream`,
      requestMethod: 'POST',
      module: 'dataDelivery',
      metadata,
    });
    searchStreamResponse = processAxiosResponse(searchStreamResponse);
    const { response, status } = searchStreamResponse;
    if (!isHttpStatusSuccess(status)) {
      throw new AbortedError(
        `[Google Ads Offline Conversions]:: ${JSON.stringify(
          response,
        )} during google_ads_offline_conversions response transformation`,
        status,
        response,
        getAuthErrCategory(searchStreamResponse),
      );
    }
    const conversionAction = get(
      searchStreamResponse,
      'response.0.results.0.conversionAction.resourceName',
    );
    if (!conversionAction) {
      throw new AbortedError(
        `Unable to find conversionActionId for conversion:${params.event}. Most probably the conversion name in Google dashboard and Rudderstack dashboard are not same.`,
      );
    }
    return conversionAction;
  });
};

const generateItemListFromProducts = (products) => {
  const itemList = [];
  products.forEach((product) => {
    if (Object.keys(product).length > 0) {
      itemList.push({
        productId: product.product_id,
        quantity: parseInt(product.quantity, 10),
        unitPrice: Number(product.price),
      });
    }
  });
  return itemList;
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
  if (address.hashed_last_name) {
    address.hashed_last_name = hashUserIdentifier
      ? sha256(address.hashed_last_name.trim()).toString()
      : address.hashed_last_name;
  }
  if (address.hashed_first_name) {
    address.hashed_first_name = hashUserIdentifier
      ? sha256(address.hashed_first_name.trim()).toString()
      : address.hashed_first_name;
  }
  if (address.hashed_street_address) {
    address.hashed_street_address = hashUserIdentifier
      ? sha256(address.hashed_street_address.trim()).toString()
      : address.hashed_street_address;
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
  properties,
) => {
  const { customVariables, subAccount, loginCustomerId } = Config;
  const response = defaultRequestConfig();
  response.method = defaultPostRequestConfig.requestMethod;
  response.endpoint = endpoint;
  response.params = {
    event,
    customerId: filteredCustomerId,
  };
  if (!payload?.isStoreConversion) {
    response.params.customVariables = customVariables;
    response.params.properties = properties;
  }
  response.body.JSON = payload;
  response.headers = {
    Authorization: `Bearer ${getAccessToken(metadata, 'access_token')}`,
    'Content-Type': 'application/json',
    'developer-token': get(metadata, 'secret.developer_token'),
  };

  if (subAccount) {
    if (loginCustomerId) {
      const filteredLoginCustomerId = removeHyphens(loginCustomerId);
      response.headers['login-customer-id'] = filteredLoginCustomerId;
    } else {
      throw new ConfigurationError(`"Login Customer ID" is required as "Sub Account" is enabled`);
    }
  }
  return response;
};
/**
 * This function creates a offlineUserDataJob Payload
 * and returns the payload
 */
const getCreateJobPayload = (message) => {
  const payload = constructPayload(message, trackCreateStoreConversionsMapping);
  set(payload, 'job.type', 'STORE_SALES_UPLOAD_FIRST_PARTY');
  if (!payload.job?.storeSalesMetadata?.loyaltyFraction) {
    set(payload, 'job.storeSalesMetadata.loyaltyFraction', '1');
  }
  if (!payload.job?.storeSalesMetadata?.transaction_upload_fraction) {
    set(payload, 'job.storeSalesMetadata.transaction_upload_fraction', '1');
  }
  return payload;
};

const UserIdentifierFieldNameMap = {
  email: 'hashedEmail',
  phone: 'hashedPhoneNumber',
  address: 'address_info',
};

function getExisitingUserIdentifier(userIdentifierInfo, defaultUserIdentifier) {
  const result = Object.keys(userIdentifierInfo).find(
    (key) =>
      key !== defaultUserIdentifier && isDefinedAndNotNullAndNotEmpty(userIdentifierInfo[key]),
  );
  return result;
}

const getCallConversionPayload = (message, eventLevelConsentsData) => {
  const payload = constructPayload(message, trackCallConversionsMapping);
  // here conversions[0] should be present because there are some mandatory properties mapped in the mapping json.
  payload.conversions[0].consent = finaliseConsent(consentConfigMap, eventLevelConsentsData);
  return payload;
};

/**
 * This Function create the add conversion payload
 * and returns the payload
 */
const getAddConversionPayload = (message, Config, eventLevelConsentsData) => {
  const { properties } = message;
  const { validateOnly, hashUserIdentifier, defaultUserIdentifier } = Config;
  const payload = constructPayload(message, trackAddStoreConversionsMapping);
  payload.enable_partial_failure = false;
  payload.enable_warnings = false;
  payload.validate_only = validateOnly || false;

  // transform originalTimestamp to format (yyyy-mm-dd hh:mm:ss+|-hh:mm)
  // e.g 2019-10-14T11:15:18.299Z -> 2019-10-14 16:10:29+0530
  const timestamp = payload.operations.create.transaction_attribute.transaction_date_time;
  const convertedDateTime = helper.formatTimestamp(timestamp);
  payload.operations.create.transaction_attribute.transaction_date_time = convertedDateTime;
  // mapping custom_key that should be predefined in google Ui and mentioned when new job is created
  if (properties.custom_key && properties[properties.custom_key]) {
    payload.operations.create.transaction_attribute[properties.custom_key] =
      properties[properties.custom_key];
  }
  // Converting transaction Cost to micro as mentioned here : https://developers.google.com/google-ads/api/reference/rpc/v13/TransactionAttribute#:~:text=30%2B03%3A00%22-,transaction_amount_micros,-double
  payload.operations.create.transaction_attribute.transaction_amount_micros = `${
    payload.operations.create.transaction_attribute.transaction_amount_micros * 1000000
  }`;
  // userIdentifierSource
  // if userIdentifierSource doesn't exist in properties
  // then it is taken from the webapp config
  const email = getFieldValueFromMessage(message, 'email');
  const phone = getFieldValueFromMessage(message, 'phone');

  const userIdentifierInfo = {
    email:
      hashUserIdentifier && isString(email) && isDefinedAndNotNull(email)
        ? sha256(email.trim()).toString()
        : email,
    phone:
      hashUserIdentifier && isDefinedAndNotNull(phone) ? sha256(phone.trim()).toString() : phone,
    address: buildAndGetAddress(message, hashUserIdentifier),
  };

  if (isDefinedAndNotNull(userIdentifierInfo[defaultUserIdentifier])) {
    set(
      payload,
      `operations.create.userIdentifiers[0].${UserIdentifierFieldNameMap[defaultUserIdentifier]}`,
      userIdentifierInfo[defaultUserIdentifier],
    );
  } else {
    const keyName = getExisitingUserIdentifier(userIdentifierInfo, defaultUserIdentifier);
    if (isDefinedAndNotNull(keyName)) {
      set(
        payload,
        `operations.create.userIdentifiers[0].${UserIdentifierFieldNameMap[keyName]}`,
        userIdentifierInfo[keyName],
      );
    } else {
      set(payload, 'operations.create.userIdentifiers[0]', {});
    }
  }
  // add consent support for store conversions. Note: No event level consent supported.
  const consentObject = finaliseConsent(consentConfigMap, eventLevelConsentsData);
  // create property should be present because there are some mandatory properties mapped in the mapping json.
  set(payload, 'operations.create.consent', consentObject);
  return payload;
};

const getStoreConversionPayload = (message, Config, event, eventLevelConsentsData) => {
  const { validateOnly } = Config;
  const payload = {
    event,
    isStoreConversion: true,
    createJobPayload: getCreateJobPayload(message),
    addConversionPayload: getAddConversionPayload(message, Config, eventLevelConsentsData),
    executeJobPayload: { validate_only: validateOnly },
  };
  return payload;
};

const hasClickId = (conversion) => {
  const { gbraid, wbraid, gclid } = conversion;
  return gclid || wbraid || gbraid;
};
const populateUserIdentifier = ({ email, phone, properties, payload, UserIdentifierSource }) => {
  const copiedPayload = cloneDeep(payload);
  // userIdentifierSource
  // if userIdentifierSource doesn't exist in properties
  // then it is taken from the webapp config
  if (!properties.userIdentifierSource && UserIdentifierSource !== 'none') {
    set(
      copiedPayload,
      'conversions[0].userIdentifiers[0].userIdentifierSource',
      UserIdentifierSource,
    );
    // one of email or phone must be provided when none of gclid, wbraid and gbraid provided
  }
  if (!email && !phone) {
    if (!hasClickId(copiedPayload.conversions[0])) {
      throw new InstrumentationError(
        `Either an email address or a phone number is required for user identification when none of gclid, wbraid, or gbraid is provided.`,
      );
    } else {
      // we are deleting userIdentifiers if any one of gclid, wbraid and gbraid is there but email or phone is not present
      delete copiedPayload.conversions[0].userIdentifiers;
    }
  }
  return copiedPayload;
};

/**
 * remove redundant ids
 * @param {*} conversionCopy
 */
const updateConversion = (conversion) => {
  const conversionCopy = cloneDeep(conversion);
  if (conversionCopy.gclid) {
    delete conversionCopy.wbraid;
    delete conversionCopy.gbraid;
  } else if (conversionCopy.wbraid && conversionCopy.gbraid) {
    throw new InstrumentationError(`You can't use both wbraid and gbraid.`);
  } else if (conversionCopy.wbraid || conversionCopy.gbraid) {
    delete conversionCopy.userIdentifiers;
  }
  return conversionCopy;
};

const getClickConversionPayloadAndEndpoint = (
  message,
  Config,
  filteredCustomerId,
  eventLevelConsent,
) => {
  const email = getFieldValueFromMessage(message, 'emailOnly');
  const phone = getFieldValueFromMessage(message, 'phone');
  const { hashUserIdentifier, defaultUserIdentifier, UserIdentifierSource, conversionEnvironment } =
    Config;
  const { properties } = message;
  // click conversions
  let updatedClickMapping = cloneDeep(trackClickConversionsMapping);

  if (hashUserIdentifier === false) {
    updatedClickMapping = removeHashToSha256TypeFromMappingJson(updatedClickMapping);
  }

  let payload = constructPayload(message, updatedClickMapping);

  const endpoint = CLICK_CONVERSION.replace(':customerId', filteredCustomerId);

  const products = get(message, 'properties.products');
  if (Array.isArray(products)) {
    // products is a list of items
    const itemList = products
      .filter((product) => Object.keys(product).length > 0)
      .map((product) => ({
        productId: product.product_id,
        quantity: parseInt(product.quantity, 10),
        unitPrice: Number(product.price),
      }));

    set(payload, 'conversions[0].cartData.items', itemList);
  }

  payload = populateUserIdentifier({ email, phone, properties, payload, UserIdentifierSource });

  // either of email or phone should be passed
  // defaultUserIdentifier depends on the webapp configuration
  // Ref - https://developers.google.com/google-ads/api/rest/reference/rest/v11/customers/uploadClickConversions#ClickConversion

  const userIdentifierInfo = {
    email:
      hashUserIdentifier && isString(email) && isDefinedAndNotNull(email)
        ? sha256(email.trim()).toString()
        : email,
    phone:
      hashUserIdentifier && isDefinedAndNotNull(phone) ? sha256(phone.trim()).toString() : phone,
  };

  const keyName = getExisitingUserIdentifier(userIdentifierInfo, defaultUserIdentifier);
  if (isDefinedAndNotNull(userIdentifierInfo[defaultUserIdentifier])) {
    set(
      payload,
      `conversions[0].userIdentifiers[0].${UserIdentifierFieldNameMap[defaultUserIdentifier]}`,
      userIdentifierInfo[defaultUserIdentifier],
    );
  } else if (isDefinedAndNotNull(keyName)) {
    set(
      payload,
      `conversions[0].userIdentifiers[0].${UserIdentifierFieldNameMap[keyName]}`,
      userIdentifierInfo[keyName],
    );
  }

  // conversionEnvironment
  // if conversionEnvironment doesn't exist in properties
  // then it is taken from the webapp config
  if (!properties.conversionEnvironment && conversionEnvironment !== 'none') {
    set(payload, 'conversions[0].conversionEnvironment', conversionEnvironment);
  }

  // add consent support for click conversions
  const consentObject = finaliseConsent(consentConfigMap, eventLevelConsent);
  // here conversions[0] is expected to be present there are some mandatory properties mapped in the mapping json.
  set(payload, 'conversions[0].consent', consentObject);
  payload.conversions[0] = updateConversion(payload.conversions[0]);
  return { payload, endpoint };
};

const getConsentsDataFromIntegrationObj = (message) => {
  const integrationObj = getIntegrationsObj(message, 'GOOGLE_ADWORDS_OFFLINE_CONVERSIONS') || {};
  return integrationObj?.consents || {};
};

module.exports = {
  validateDestinationConfig,
  generateItemListFromProducts,
  getConversionActionId,
  removeHashToSha256TypeFromMappingJson,
  getStoreConversionPayload,
  requestBuilder,
  buildAndGetAddress,
  getClickConversionPayloadAndEndpoint,
  getExisitingUserIdentifier,
  getConsentsDataFromIntegrationObj,
  getCallConversionPayload,
  updateConversion,
};
