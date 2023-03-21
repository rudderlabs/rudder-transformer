const sha256 = require('sha256');
const { isObject, getFieldValueFromMessage, formatTimeStamp, getIntegrationsObj } = require('../../util');
const { ACTION_SOURCES_VALUES } = require('./config');
const { InstrumentationError } = require('../../util/errorTypes');

/**  format revenue according to fb standards with max two decimal places.
 * @param revenue
 * @return number
 */

const formatRevenue = (revenue) => {
  const formattedRevenue = parseFloat(parseFloat(revenue || 0).toFixed(2));
  if (!Number.isNaN(formattedRevenue)) {
    return formattedRevenue;
  }
  throw new InstrumentationError('Revenue could not be converted to number');
};

/**
 *
 * @param {*} message Rudder Payload
 * @param {*} defaultValue product / product_group
 * @param {*} categoryToContent [ { from: 'clothing', to: 'product' } ]
 *
 * We will be mapping properties.category to user provided content else taking the default value as per ecomm spec
 * If category is clothing it will be set to ["product"]
 * @return Content Type array as defined in:
 * - https://developers.facebook.com/docs/facebook-pixel/reference/#object-properties
 */
const getContentType = (message, defaultValue, categoryToContent) => {
  const { properties } = message;
  const integrationsObj = getIntegrationsObj(message, 'fb_pixel');

  if(integrationsObj?.contentType){
    return integrationsObj.contentType;
  }

  let { category } = properties;
  if (!category) {
    const { products } = properties;
    if (products && products.length > 0 && Array.isArray(products) && isObject(products[0])) {
      category = products[0].category;
    }
  } else {
    if (categoryToContent === undefined) {
      categoryToContent = [];
    }
    const mapped = categoryToContent;
    const mappedTo = mapped.reduce((filtered, map) => {
      if (map.from === category) {
        filtered = map.to;
      }
      return filtered;
    }, '');
    if (mappedTo.length > 0) {
      return mappedTo;
    }
  }
  return defaultValue;
};

/** This function transforms the payloads according to the config settings and adds, removes or hashes pii data.
Also checks if it is a standard event and sends properties only if it is mentioned in our configs.
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

@param isStandard --> is standard if among the ecommerce spec of rudder other wise is not standard for simple track, identify and page calls
false

@param eventCustomProperties -->
[ { eventCustomProperties: 'leadId' } ] // leadId if present will be set

*/

const transformedPayloadData = (
  message,
  customData,
  blacklistPiiProperties,
  whitelistPiiProperties,
  isStandard,
  eventCustomProperties,
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
  blacklistPiiProperties = blacklistPiiProperties || [];
  whitelistPiiProperties = whitelistPiiProperties || [];
  eventCustomProperties = eventCustomProperties || [];
  const customBlackListedPiiProperties = {};
  const customWhiteListedProperties = {};
  const customEventProperties = {};
  blacklistPiiProperties.forEach((property) => {
    const singularConfigInstance = property;
    customBlackListedPiiProperties[singularConfigInstance.blacklistPiiProperties] =
      singularConfigInstance.blacklistPiiHash;
  });

  whitelistPiiProperties.forEach((property) => {
    const singularConfigInstance = property;
    customWhiteListedProperties[singularConfigInstance.whitelistPiiProperties] = true;
  });

  eventCustomProperties.forEach((property) => {
    const singularConfigInstance = property;
    customEventProperties[singularConfigInstance.eventCustomProperties] = true;
  });

  Object.keys(customData).forEach((eventProp) => {
    const isDefaultPiiProperty = defaultPiiProperties.includes(eventProp);
    const isProperyWhiteListed = customWhiteListedProperties[eventProp] || false;
    if (isDefaultPiiProperty && !isProperyWhiteListed) {
      delete customData[eventProp];
    }

    if (Object.prototype.hasOwnProperty.call(customBlackListedPiiProperties, eventProp)) {
      if (customBlackListedPiiProperties[eventProp]) {
        customData[eventProp] =
          integrationsObj && integrationsObj.hashed
            ? String(message.properties[eventProp])
            : sha256(String(message.properties[eventProp]));
      } else {
        delete customData[eventProp];
      }
    }
    const isCustomProperty = customEventProperties[eventProp] || false;
    if (isStandard && !isCustomProperty && !isDefaultPiiProperty) {
      delete customData[eventProp];
    }
  });

  return customData;
};

/**
 *
 * @param {*} message
 * @returns fbc parameter which is a combined string of the parameters below
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

/**
 * Returns action source
 * ref : https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/server-event#action-source
 * @param {*} payload
 * @param {*} channel
 * @returns
 */
const getActionSource = (payload, channel) => {
  let actionSource = 'other';
  if (payload.action_source) {
    const isActionSourceValid = ACTION_SOURCES_VALUES.includes(payload.action_source);
    if (!isActionSourceValid) {
      throw new InstrumentationError('Invalid Action Source type');
    }
    actionSource = payload.action_source;
  } else if (channel === 'web') {
    actionSource = 'website';
  } else if (channel === 'mobile') {
    actionSource = 'app';
  }

  return actionSource;
};

module.exports = {
  deduceFbcParam,
  formatRevenue,
  getContentType,
  transformedPayloadData,
  getActionSource,
};
