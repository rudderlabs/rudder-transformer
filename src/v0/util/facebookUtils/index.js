const sha256 = require('sha256');
const { InstrumentationError, TransformationError } = require('@rudderstack/integrations-lib');
const {
  isObject,
  getIntegrationsObj,
  getHashFromArray,
  constructPayload,
  defaultRequestConfig,
  defaultPostRequestConfig,
  getFieldValueFromMessage,
  formatTimeStamp,
} = require('../index');

/** This function transforms the payloads according to the config settings and adds, removes or hashes pii data.
 @param message --> the rudder payload

  {
  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
  destination_props: { Fb: { app_id: 'RudderFbApp' } },
  context: {
  device: {
  id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
  manufacturer: 'Xiaomi',
  model: 'Redmi 6',
  name: 'xiaomi'
  },
  network: { carrier: 'Banglalink' },
  os: { name: 'android', version: '8.1.0' },
  screen: { height: '100', density: 50 },
  traits: {
  email: 'abc@gmail.com',
  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1'
  }
  },
  event: 'spin_result',
  integrations: {
  All: true,
  FacebookPixel: {
  dataProcessingOptions: [Array],
  fbc: 'fb.1.1554763741205.AbCdEfGhIjKlMnOpQrStUvWxYz1234567890',
  fbp: 'fb.1.1554763741205.234567890',
  fb_login_id: 'fb_id',
  lead_id: 'lead_id'
  }
  },
  message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
  properties: { revenue: 400, additional_bet_index: 0 },
  timestamp: '2019-09-01T15:46:51.693229+05:30',
  type: 'track'
  }

 @param customData --> properties
  { revenue: 400, additional_bet_index: 0 }

 @param blacklistPiiProperties -->
  [ { blacklistPiiProperties: 'phone', blacklistPiiHash: true } ] // hashes the phone property

 @param whitelistPiiProperties -->
  [ { whitelistPiiProperties: 'email' } ] // sets email


 @param integrationsObj -->
  { hashed: true }

 */

const transformedPayloadData = (
  message,
  customData,
  blacklistPiiProperties,
  whitelistPiiProperties,
  integrationsObj,
) => {
  const defaultPiiProperties = [
    'email',
    'firstName',
    'lastName',
    'firstname',
    'lastname',
    'first_name',
    'last_name',
    'gender',
    'city',
    'country',
    'phone',
    'state',
    'zip',
    'postalCode',
    'birthday',
  ];
  const clonedCustomData = { ...customData };
  const finalBlacklistPiiProperties = blacklistPiiProperties || [];
  const finalWhitelistPiiProperties = whitelistPiiProperties || [];
  const customBlackListedPiiProperties = {};

  // create list of whitelisted properties
  const customWhiteListedProperties = finalWhitelistPiiProperties.map(
    (propObject) => propObject.whitelistPiiProperties,
  );

  // create map of blacklisted properties
  finalBlacklistPiiProperties.forEach((property) => {
    const singularConfigInstance = property;
    customBlackListedPiiProperties[singularConfigInstance.blacklistPiiProperties] =
      singularConfigInstance.blacklistPiiHash;
  });

  // remove properties which are default pii properties and not whitelisted
  Object.keys(clonedCustomData).forEach((eventProp) => {
    const isDefaultPiiProperty = defaultPiiProperties.includes(eventProp);
    const isProperyWhiteListed = customWhiteListedProperties.includes(eventProp);

    if (Object.hasOwn(customBlackListedPiiProperties, eventProp)) {
      if (customBlackListedPiiProperties[eventProp]) {
        // if customBlackListedPiiProperty is marked to be hashed from UI
        clonedCustomData[eventProp] = integrationsObj?.hashed
          ? String(message.properties[eventProp])
          : sha256(String(message.properties[eventProp]));
      } else if (isDefaultPiiProperty && !isProperyWhiteListed) {
        delete clonedCustomData[eventProp];
      }
    } else if (isDefaultPiiProperty && !isProperyWhiteListed) {
      delete clonedCustomData[eventProp];
    }
  });

  return clonedCustomData;
};

/**
 *
 * @param {*} message Rudder Payload
 * @param {*} defaultValue product / product_group
 * @param {*} categoryToContent example: [ { from: 'clothing', to: 'product' } ]
 * @param {*} destinationName destination name
 *
 * We will be mapping properties.category to user provided content else taking the default value as per ecomm spec
 * If category is clothing it will be set to ["product"]
 * @return Content Type array as defined in:
 * - https://developers.facebook.com/docs/facebook-pixel/reference/#object-properties
 */
const getContentType = (message, defaultValue, categoryToContent, destinationName) => {
  const { properties } = message;
  const integrationsObj = getIntegrationsObj(message, destinationName || 'fb_pixel');

  if (integrationsObj?.contentType) {
    return integrationsObj.contentType;
  }

  let { category } = properties;
  if (!category) {
    const { products } = properties;
    if (products && products.length > 0 && Array.isArray(products) && isObject(products[0])) {
      category = products[0].category;
    }
  }

  if (Array.isArray(categoryToContent) && category) {
    const categoryToContentHash = getHashFromArray(categoryToContent, 'from', 'to', false);
    if (categoryToContentHash[category]) {
      return categoryToContentHash[category];
    }
  }

  return defaultValue;
};

/**
 * This method gets content category with proper error-handling
 *
 * @param {*} category
 * @returns The content category as a string
 */
const getContentCategory = (category) => {
  let contentCategory = category;
  if (Array.isArray(contentCategory)) {
    contentCategory = contentCategory.map(String).join(',');
  }
  if (
    contentCategory &&
    typeof contentCategory !== 'string' &&
    typeof contentCategory !== 'object'
  ) {
    contentCategory = String(contentCategory);
  }
  if (
    contentCategory &&
    typeof contentCategory !== 'string' &&
    !Array.isArray(contentCategory) &&
    typeof contentCategory === 'object'
  ) {
    throw new InstrumentationError("'properties.category' must be either be a string or an array");
  }
  return contentCategory;
};

/**
 *
 * @param {*} message
 * @returns string which is fbc parameter
 *
 * version : "fb" (default)
 *
 * subdomainIndex : 1 ( recommended by facebook, as well as our JS SDK sets cookies on the main domain, i.e "facebook.com")
 *
 * creationTime : mapped to originalTimestamp converted in miliseconds
 *
 * fbclid : deduced query paramter from context.page.url
 *
 * ref: https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/fbp-and-fbc#fbc
 */
const deduceFbcParam = (message) => {
  const url = message.context?.page?.url;
  if (!url) {
    return undefined;
  }
  let parseUrl;
  try {
    parseUrl = new URL(url);
  } catch {
    return undefined;
  }
  const paramsList = new URLSearchParams(parseUrl.search);
  const fbclid = paramsList.get('fbclid');

  if (!fbclid) {
    return undefined;
  }
  const creationTime = getFieldValueFromMessage(message, 'timestamp');
  return `fb.1.${formatTimeStamp(creationTime)}.${fbclid}`;
};

const fetchUserData = (message, Config, mappingJson, destinationName) => {
  const integrationsObj = getIntegrationsObj(message, destinationName);
  const userData = constructPayload(message, mappingJson, destinationName);
  const { removeExternalId } = Config;
  if (removeExternalId) {
    delete userData.external_id;
  }

  if (userData) {
    const split = userData.name?.split(' ');
    if (split && split.length === 2) {
      const hashValue = (value) => (integrationsObj?.hashed ? value : sha256(value));
      userData.fn = hashValue(split[0]);
      userData.ln = hashValue(split[1]);
    }
    delete userData.name;
    userData.fbc = userData.fbc || deduceFbcParam(message);
  }

  return userData;
};

const formingFinalResponse = (
  userData,
  commonData,
  customData,
  endpoint,
  testDestination,
  testEventCode,
  appData,
) => {
  if (userData && commonData) {
    const response = defaultRequestConfig();
    response.endpoint = endpoint;
    response.method = defaultPostRequestConfig.requestMethod;
    const jsonData = {
      user_data: userData,
      ...commonData,
    };
    if (appData && Object.keys(appData).length > 0) {
      jsonData.app_data = appData;
    }
    if (customData && Object.keys(customData).length > 0) {
      jsonData.custom_data = customData;
    }
    const jsonStringify = JSON.stringify(jsonData);
    const payload = {
      data: [jsonStringify],
    };

    // Ref: https://developers.facebook.com/docs/marketing-api/conversions-api/using-the-api/
    // Section: Test Events Tool
    if (testDestination) {
      payload.test_event_code = testEventCode;
    }
    response.body.FORM = payload;
    return response;
  }
  // fail-safety for developer error
  throw new TransformationError('Payload could not be constructed');
};

module.exports = {
  getContentType,
  getContentCategory,
  transformedPayloadData,
  formingFinalResponse,
  fetchUserData,
};
