/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
const get = require('get-value');
const { InstrumentationError, ConfigurationError } = require('@rudderstack/integrations-lib');
const { cloneDeep } = require('lodash');
const {
  isEmpty,
  constructPayload,
  flattenJson,
  isEmptyObject,
  extractCustomFields,
  isDefinedAndNotNull,
  getIntegrationsObj,
  getDestinationExternalID,
  isHybridModeEnabled,
  defaultPostRequestConfig,
  defaultRequestConfig,
} = require('../../util');
const { mappingConfig, ConfigCategory, DEBUG_ENDPOINT, ENDPOINT } = require('./config');
const { finaliseAnalyticsConsents } = require('../../util/googleUtils');
const { JSON_MIME_TYPE } = require('../../util/constant');

/**
 * Reserved event names cannot be used
 * Ref - https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference?client_type=gtag#reserved_names
 * @param {*} event
 * @returns
 */
const isReservedEventName = (event) => {
  const reservedEventNames = [
    'ad_activeview',
    'ad_click',
    'ad_exposure',
    'ad_impression',
    'ad_query',
    'adunit_exposure',
    'app_clear_data',
    'app_install',
    'app_update',
    'app_remove',
    'error',
    'first_open',
    'first_visit',
    'in_app_purchase',
    'notification_dismiss',
    'notification_foreground',
    'notification_open',
    'notification_receive',
    'os_update',
    'screen_view',
    'session_start',
    'user_engagement',
  ];

  return reservedEventNames.includes(event.toLowerCase());
};

/* Event parameters */
/**
 * Reserved parameter names cannot be used
 * Here user_properties is a duplicate key hence excluding it.
 * Ref - https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference?client_type=gtag#reserved_parameter_names
 */
const GA4_RESERVED_PARAMETER_EXCLUSION = ['firebase_conversion', 'user_properties'];

/**
 * GA4 parameters names exclusion list that is passed for a message type
 */
const GA4_PARAMETERS_EXCLUSION = ['engagementTimeMsec', 'sessionId'];

/**
 * event parameter names cannot start with reserved prefixes
 * Ref - https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference?client_type=gtag#reserved_parameter_names
 * @param {*} parameter
 */
const removeReservedParameterPrefixNames = (parameter) => {
  const reservedPrefixesNames = ['google_', 'ga_', 'firebase_'];

  if (!parameter) {
    return;
  }

  Object.keys(parameter).forEach((key) => {
    const valFound = reservedPrefixesNames.some((prefix) => key.toLowerCase().startsWith(prefix));

    // reject if found
    if (valFound) {
      // eslint-disable-next-line no-param-reassign
      delete parameter[key];
    }
  });
};

/* user property */
/**
 * Reserved user property cannot be used
 * Ref - https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference?client_type=gtag#reserved_user_property_names
 */
const GA4_RESERVED_USER_PROPERTY_EXCLUSION = [
  'first_open_time',
  'first_visit_time',
  'last_deep_link_referrer',
  'user_id',
  'first_open_after_install',
];

/* For custom events */
/**
 * Reserved custom event names cannot be used (Web)
 * Ref - https://support.google.com/analytics/answer/10085872#zippy=%2Creserved-prefixes-and-event-names%2Cweb
 * @param {*} event
 * @returns
 */
const isReservedWebCustomEventName = (event) => {
  const reservedEventNames = [
    'app_remove',
    'app_store_refund',
    'app_store_subscription_cancel',
    'app_store_subscription_convert',
    'app_store_subscription_renew',
    'first_open',
    'first_visit',
    'in_app_purchase',
    'session_start',
    'user_engagement',
  ];

  return reservedEventNames.includes(event.toLowerCase());
};

/**
 * Reserved custom event name cannot start with reserved prefixes (Web)
 * Ref - https://support.google.com/analytics/answer/10085872#zippy=%2Creserved-prefixes-and-event-names%2Cweb
 * @param {*} event
 * @returns
 */
const isReservedWebCustomPrefixName = (event) => {
  const reservedPrefixesNames = ['_', 'firebase_', 'ga_', 'google_', 'gtag.'];

  // As soon as a single true is returned, .some() will itself return true and stop
  return reservedPrefixesNames.some((prefix) => event.toLowerCase().startsWith(prefix));
};

/**
 * Validation for event name should only contain letters, numbers, and underscores and events name must start with a letter
 * Ref - https://support.google.com/analytics/answer/13316687?hl=en&ref_topic=13367860&sjid=16827682213264631791-NA
 * @param {*} eventName
 * @returns
 */
const isEventNameValid = (eventName) => {
  const pattern = /^[A-Za-z]\w*$/;
  return pattern.test(eventName);
};

const GA4_ITEM_EXCLUSION = [
  'item_id',
  'itemId',
  'product_id',
  'item_name',
  'itemName',
  'name',
  'coupon',
  'item_category',
  'itemCategory',
  'category',
  'item_brand',
  'itemBrand',
  'brand',
  'item_variant',
  'itemVariant',
  'variant',
  'price',
  'quantity',
  'index',
  'position',
];

/**
 * Remove arrays and objects from transformed payload
 * @param {*} params
 * @returns
 */
const removeInvalidParams = (params) =>
  Object.fromEntries(
    Object.entries(params).filter(
      ([key, value]) => key === 'items' || (typeof value !== 'object' && !isEmpty(value)),
    ),
  );

/**
 * get product list properties for a event.
 * @param {*} message
 * @returns
 */
const getItemList = (message, isItemsRequired = false) => {
  const products = get(message, 'properties.products');
  if ((isItemsRequired && !products) || (isItemsRequired && products && products.length === 0)) {
    throw new InstrumentationError(`Products is an required field for '${message.event}' event`);
  }

  if (isItemsRequired && !Array.isArray(products)) {
    throw new InstrumentationError('Invalid type. Expected Array of products');
  }

  const items = [];
  if (Array.isArray(products)) {
    products.forEach((item, index) => {
      let element = constructPayload(item, mappingConfig[ConfigCategory.ITEM_LIST.name]);
      if (!isDefinedAndNotNull(element.item_id) && !isDefinedAndNotNull(element.item_name)) {
        throw new InstrumentationError('One of product_id or name is required');
      }

      // take additional parameters apart from mapped one
      let itemProperties = extractCustomFields(
        message,
        {},
        [`properties.products.${index}`],
        GA4_ITEM_EXCLUSION,
      );
      if (!isEmptyObject(itemProperties)) {
        itemProperties = removeInvalidParams(flattenJson(itemProperties, '_', 'strict'));
        element = { ...element, ...itemProperties };
      }

      items.push(element);
    });
  }
  return items;
};

/**
 * get product properties for a event.
 * @param {*} message
 * @returns
 */
const getItem = (message, isItemsRequired) => {
  const properties = get(message, 'properties');
  if (!properties && isItemsRequired) {
    throw new InstrumentationError(
      `Item/product parameters not found for '${message.event}' event`,
    );
  }

  const items = [];
  if (properties) {
    const product = removeInvalidParams(
      constructPayload(properties, mappingConfig[ConfigCategory.ITEM.name]),
    );
    if (!isDefinedAndNotNull(product.item_id) && !isDefinedAndNotNull(product.item_name)) {
      throw new InstrumentationError('One of product_id or name is required');
    }
    items.push(product);
  }
  return items;
};

/**
 * Returns items array for ga4 event payload
 * @param {*} message
 * @param {*} item
 * @param {*} itemList
 * @returns
 */
const getItemsArray = (message, item, itemList) => {
  let items = [];
  let mapRootLevelPropertiesToGA4ItemsArray = false;
  if (itemList && item) {
    items = getItemList(message, itemList === 'YES');

    if (!(items && items.length > 0)) {
      mapRootLevelPropertiesToGA4ItemsArray = true;
      items = getItem(message, item === 'YES');
    }
  } else if (item) {
    // item
    items = getItem(message, item === 'YES');
    mapRootLevelPropertiesToGA4ItemsArray = true;
  } else if (itemList) {
    // itemList
    items = getItemList(message, itemList === 'YES');
  }

  return { items, mapRootLevelPropertiesToGA4ItemsArray };
};
/**
 * get exclusion list for a particular event
 * ga4ExclusionList contains the sourceKeys that are already mapped
 * @param {*} mappingJson
 * @returns
 */
const getGA4ExclusionList = (mappingJson) => {
  let ga4ExclusionList = [];

  mappingJson.forEach((element) => {
    const mappingSourceKeys = element.sourceKeys;

    if (typeof mappingSourceKeys === 'string') {
      ga4ExclusionList.push(mappingSourceKeys.split('.').pop());
    } else if (Array.isArray(mappingSourceKeys)) {
      mappingSourceKeys.forEach((item) => {
        if (typeof item === 'string') {
          ga4ExclusionList.push(item.split('.').pop());
        }
      });
    }
  });

  // We are mapping "products" to "items", so to remove redundancy we should not send products again
  ga4ExclusionList.push('products');
  ga4ExclusionList = ga4ExclusionList
    .concat(GA4_RESERVED_PARAMETER_EXCLUSION)
    .concat(GA4_PARAMETERS_EXCLUSION);

  return ga4ExclusionList;
};

/**
 * takes all extra/custom parameters that is passed for GA4 standard or custom events
 * @param {*} message
 * @param {*} keys
 * @param {*} exclusionFields
 * @returns
 */
const getGA4CustomParameters = (message, keys, exclusionFields, payload) => {
  let customParameters = {};
  customParameters = extractCustomFields(message, customParameters, keys, exclusionFields);
  // append in the params if any custom fields are passed after flattening the JSON
  if (!isEmptyObject(customParameters)) {
    customParameters = flattenJson(customParameters, '_', 'strict');
    // eslint-disable-next-line no-param-reassign
    payload.params = {
      ...payload.params,
      ...customParameters,
    };
    return payload.params;
  }

  return payload.params;
};

/**
 * Validation for event name
 * Ref - https://support.google.com/analytics/answer/13316687?hl=en&ref_topic=13367860&sjid=16827682213264631791-NA
 * @param {*} event
 */
const validateEventName = (event) => {
  /**
   * Event name should not use reserved prefixes and event names
   * Event names are case sensitive
   * Event name must start with alphabetic characters only
   */

  if (isReservedWebCustomEventName(event)) {
    throw new InstrumentationError('Reserved custom event names are not allowed');
  }

  if (isReservedWebCustomPrefixName(event)) {
    throw new InstrumentationError('Reserved custom prefix names are not allowed');
  }

  if (!isEventNameValid(event)) {
    throw new InstrumentationError(
      'Event name must start with a letter and can only contain letters, numbers, and underscores',
    );
  }
};

/**
 * Function to verify user_property value type
 * @param {*} value
 * @returns
 */
const isValidValueType = (value) => {
  if (typeof value === 'string') {
    return value.trim() !== '' && value.trim().length <= 36;
  }

  if (typeof value === 'number') {
    return value.toString().length <= 36;
  }

  return typeof value === 'boolean';
};

/**
 * Function to validate user_property name and it's value
 * user_property name should start with alphabetic characters
 * user_property name length should not more then 24 characters
 * user_property name should not start with reserved prefixes
 * user_property value should not null and empty
 * user_property value type should either string, number or boolean
 * user_property value length should not more then 36 characters
 * Ref - https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference?client_type=gtag#reserved_parameter_names
 * @param {*} name
 * @returns
 */
const isValidUserProperty = (key, value) => {
  const pattern = /^[A-Za-z]\w{0,23}$/;
  const reservedPrefixesNames = ['google_', 'ga_', 'firebase_'];

  const isValidKey =
    pattern.test(key) &&
    !reservedPrefixesNames.some((prefix) => key.toLowerCase().startsWith(prefix));

  const isValidValue = isDefinedAndNotNull(value) && isValidValueType(value);

  return isValidKey && isValidValue;
};

/**
 * Function to validate and prepare user_properties
 * @param {*} message
 * @param {*} piiPropertiesToIgnore
 * @returns
 */
const prepareUserProperties = (message, piiPropertiesToIgnore = []) => {
  // Exclude PII user traits
  const piiProperties = [];
  if (piiPropertiesToIgnore.length > 0) {
    piiPropertiesToIgnore.forEach((property) => {
      if (typeof property.piiProperty === 'string' && property.piiProperty.trim() !== '') {
        piiProperties.push(property.piiProperty.trim());
      }
    });
  }

  const userProperties = extractCustomFields(
    message,
    {},
    ['properties.user_properties', 'context.traits'],
    [...GA4_RESERVED_USER_PROPERTY_EXCLUSION, ...piiProperties],
  );

  const validatedUserProperties = Object.entries(userProperties)
    .filter(([key, value]) => isValidUserProperty(key, value))
    .reduce((acc, [key, value]) => {
      const userPropertiesObj = acc;
      userPropertiesObj[key] = { value };
      return userPropertiesObj;
    }, {});

  return validatedUserProperties;
};

/**
 * Returns user consents
 * Ref : https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference?client_type=gtag#payload_consent
 * @param {*} message
 * @returns
 */
const prepareUserConsents = (message) => {
  const integrationObj = getIntegrationsObj(message, 'ga4') || {};
  const eventLevelConsentsData = integrationObj?.consents || {};
  const consentConfigMap = {
    analyticsPersonalizationConsent: 'ad_user_data',
    analyticsUserDataConsent: 'ad_personalization',
  };

  const consents = finaliseAnalyticsConsents(consentConfigMap, eventLevelConsentsData);
  return consents;
};

const basicValidation = (event) => {
  if (!event) {
    throw new InstrumentationError('Event name is required');
  }
  if (typeof event !== 'string') {
    throw new InstrumentationError('track:: event name should be string');
  }
};

/**
 * returns client_id
 * @param {*} message
 * @returns
 */
const getGA4ClientId = (message, Config) => {
  let clientId;

  if (isHybridModeEnabled(Config)) {
    const integrationsObj = getIntegrationsObj(message, 'ga4');
    if (integrationsObj?.clientId) {
      clientId = integrationsObj.clientId;
    }
  }

  if (!clientId) {
    clientId =
      getDestinationExternalID(message, 'ga4ClientId') ||
      get(message, 'anonymousId') ||
      get(message, 'rudderId');
  }

  return clientId;
};

const addClientDetails = (payload, message, Config) => {
  const { typesOfClient } = Config;
  const rawPayload = cloneDeep(payload);
  switch (typesOfClient) {
    case 'gtag':
      // gtag.js uses client_id
      // GA4 uses it as an identifier to distinguish site visitors.
      rawPayload.client_id = getGA4ClientId(message, Config);
      if (!isDefinedAndNotNull(rawPayload.client_id)) {
        throw new ConfigurationError('ga4ClientId, anonymousId or messageId must be provided');
      }
      break;
    case 'firebase':
      // firebase uses app_instance_id
      rawPayload.app_instance_id = getDestinationExternalID(message, 'ga4AppInstanceId');
      if (!isDefinedAndNotNull(rawPayload.app_instance_id)) {
        throw new InstrumentationError('ga4AppInstanceId must be provided under externalId');
      }
      break;
    default:
      throw new ConfigurationError('Invalid type of client');
  }
  return rawPayload;
};

const buildDeliverablePayload = (payload, Config) => {
  // build response
  const response = defaultRequestConfig();
  response.method = defaultPostRequestConfig.requestMethod;
  // if debug_mode is true, we need to send the event to debug validation server
  // ref: https://developers.google.com/analytics/devguides/collection/protocol/ga4/validating-events?client_type=firebase#sending_events_for_validation
  if (Config.debugMode) {
    response.endpoint = DEBUG_ENDPOINT;
  } else {
    response.endpoint = ENDPOINT;
  }
  response.headers = {
    HOST: 'www.google-analytics.com',
    'Content-Type': JSON_MIME_TYPE,
  };
  response.params = {
    api_secret: Config.apiSecret,
  };

  // setting response params as per client type
  switch (Config.typesOfClient) {
    case 'gtag':
      response.params.measurement_id = Config.measurementId;
      break;
    case 'firebase':
      response.params.firebase_app_id = Config.firebaseAppId;
      break;
    default:
      break;
  }

  response.body.JSON = payload;
  return response;
};

const sanitizeUserProperties = (userProperties) => {
  Object.keys(userProperties).forEach((key) => {
    const propetyValue = userProperties[key];
    if (
      typeof propetyValue === 'string' ||
      typeof propetyValue === 'number' ||
      typeof propetyValue === 'boolean'
    ) {
      delete userProperties[key];
      userProperties[key] = {
        value: propetyValue,
      };
    }
  });
};

const basicConfigvalidaiton = (Config) => {
  if (!Config.typesOfClient) {
    throw new ConfigurationError('Client type not found. Aborting ');
  }
  if (!Config.apiSecret) {
    throw new ConfigurationError('API Secret not found. Aborting ');
  }
  if (Config.typesOfClient === 'gtag' && !Config.measurementId) {
    throw new ConfigurationError('measurementId must be provided. Aborting');
  }
  if (Config.typesOfClient === 'firebase' && !Config.firebaseAppId) {
    throw new ConfigurationError('firebaseAppId must be provided. Aborting');
  }
};

module.exports = {
  addClientDetails,
  basicValidation,
  buildDeliverablePayload,
  basicConfigvalidaiton,
  getItem,
  getItemList,
  getItemsArray,
  validateEventName,
  prepareUserConsents,
  removeInvalidParams,
  isReservedEventName,
  getGA4ExclusionList,
  prepareUserProperties,
  getGA4CustomParameters,
  sanitizeUserProperties,
  GA4_PARAMETERS_EXCLUSION,
  isReservedWebCustomEventName,
  isReservedWebCustomPrefixName,
  GA4_RESERVED_PARAMETER_EXCLUSION,
  removeReservedParameterPrefixNames,
  GA4_RESERVED_USER_PROPERTY_EXCLUSION,
};
