const sha256 = require("sha256");
const {
  CustomError,
  isObject,
  getFieldValueFromMessage,
  formatTimeStamp
} = require("../../util");
const { TRANSFORMER_METRIC } = require("../../util/constant");
const ErrorBuilder = require("../../util/error");
const { DESTINATION } = require("./config");

/**  format revenue according to fb standards with max two decimal places.
 * @param revenue
 * @return number
 */

const formatRevenue = revenue => {
  const formattedRevenue = parseFloat(parseFloat(revenue || 0).toFixed(2));
  if (!isNaN(formattedRevenue)) {
    return formattedRevenue;
  }
  throw new ErrorBuilder()
    .setMessage("Revenue could not be converted to number")
    .setStatus(400)
    .setStatTags({
      destType: DESTINATION,
      stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM,
      scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.SCOPE,
      meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META.BAD_PARAM
    })
    .build();
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
  const { integrations } = message;
  if (
    integrations &&
    integrations.FacebookPixel &&
    isObject(integrations.FacebookPixel) &&
    integrations.FacebookPixel.contentType
  ) {
    return integrations.FacebookPixel.contentType;
  }

  let { category } = message.properties;
  if (!category) {
    const { products } = message.properties;
    if (products && products.length > 0 && Array.isArray(products)) {
      if (isObject(products[0])) {
        category = products[0].category;
      }
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
    }, "");
    if (mappedTo.length) {
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
  integrationsObj
) => {
  const defaultPiiProperties = [
    "email",
    "firstName",
    "lastName",
    "firstname",
    "lastname",
    "first_name",
    "last_name",
    "gender",
    "city",
    "country",
    "phone",
    "state",
    "zip",
    "birthday"
  ];
  blacklistPiiProperties = blacklistPiiProperties || [];
  whitelistPiiProperties = whitelistPiiProperties || [];
  eventCustomProperties = eventCustomProperties || [];
  const customBlackListedPiiProperties = {};
  const customWhiteListedProperties = {};
  const customEventProperties = {};
  for (const property of blacklistPiiProperties) {
    const singularConfigInstance = property;
    customBlackListedPiiProperties[
      singularConfigInstance.blacklistPiiProperties
    ] = singularConfigInstance.blacklistPiiHash;
  }
  for (const property of whitelistPiiProperties) {
    const singularConfigInstance = property;
    customWhiteListedProperties[
      singularConfigInstance.whitelistPiiProperties
    ] = true;
  }
  for (const property of eventCustomProperties) {
    const singularConfigInstance = property;
    customEventProperties[singularConfigInstance.eventCustomProperties] = true;
  }
  Object.keys(customData).forEach(eventProp => {
    const isDefaultPiiProperty = defaultPiiProperties.indexOf(eventProp) >= 0;
    const isProperyWhiteListed =
      customWhiteListedProperties[eventProp] || false;
    if (isDefaultPiiProperty && !isProperyWhiteListed) {
      delete customData[eventProp];
    }

    if (
      Object.prototype.hasOwnProperty.call(
        customBlackListedPiiProperties,
        eventProp
      )
    ) {
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
  let parseUrl = new URL(url)
  let paramsList = new URLSearchParams(parseUrl.search);
  const fbclid = paramsList.get('fbclid')

  if (!fbclid) {
    return undefined;
  }
  const creationTime = getFieldValueFromMessage(message, "timestamp");
  return `fb.1.${formatTimeStamp(creationTime)}.${fbclid}`;
};

module.exports = {
  deduceFbcParam,
  formatRevenue,
  getContentType,
  transformedPayloadData
};
