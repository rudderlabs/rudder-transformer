const jsonxml = require('jsontoxml');
const get = require('get-value');
const { EventType } = require('../../../constants');
const { ECOM_PRODUCT_EVENTS, commonConfig, formatDestinationConfig } = require('./config');
const {
  constructPayload,
  defaultPostRequestConfig,
  defaultRequestConfig,
  getDestinationExternalID,
  getFieldValueFromMessage,
  isDefinedAndNotNull,
  isDefinedAndNotNullAndNotEmpty,
  getIntegrationsObj,
  simpleProcessRouterDest,
} = require('../../util');
const {
  InstrumentationError,
  TransformationError,
  ConfigurationError,
} = require('../../util/errorTypes');

const {
  handleContextData,
  handleEvar,
  handleHier,
  handleList,
  handleCustomProperties,
  stringifyValueAndJoinWithDelimitter,
} = require('./utils');
/*
  Configuration variables documentation: https://experienceleague.adobe.com/docs/analytics/implementation/vars/config-vars/configuration-variables.html?lang=en
  Page variables documentation: https://experienceleague.adobe.com/docs/analytics/implementation/vars/page-vars/page-variables.html?lang=en
*/
const responseBuilderSimple = async (message, destinationConfig, basicPayload) => {
  let payload = constructPayload(message, commonConfig);
  const { event, context, properties } = message;
  const { overrideEvars, overrideHiers, overrideLists, overrideCustomProperties } = properties;
  // handle contextData
  payload = handleContextData(payload, destinationConfig, message);

  // handle eVar
  if (overrideEvars) {
    Object.assign(payload, overrideEvars);
  } else {
    payload = handleEvar(payload, destinationConfig, message);
  }

  // handle fallbackVisitorId
  const { noFallbackVisitorId } = destinationConfig;
  // 'AdobeFallbackVisitorId' should be the type of external id in the payload i.e "AdobeFallbackVisitorId": "value"
  if (!noFallbackVisitorId) {
    const fallbackVisitorId = getDestinationExternalID(message, 'AdobeFallbackVisitorId');
    if (isDefinedAndNotNull(fallbackVisitorId)) {
      payload.fallbackVisitorId = fallbackVisitorId;
    }
  }

  // handle link values
  // default linktype to 'o', linkName to event name, linkURL to ctx.page.url if not passed in integrations object
  const adobeIntegrationsObject = getIntegrationsObj(message, 'adobe_analytics');
  payload.linkType = adobeIntegrationsObject?.linkType || 'o';
  payload.linkName = adobeIntegrationsObject?.linkName || event;
  // setting linkname to page view for page calls
  if (message.type === 'page') {
    payload.linkName = 'page view';
  }
  payload.linkURL = adobeIntegrationsObject?.linkURL || context?.page?.url || 'No linkURL provided';

  // handle hier
  if (overrideHiers) {
    Object.assign(payload, overrideHiers);
  } else {
    payload = handleHier(payload, destinationConfig, message);
  }

  // handle list
  if (overrideLists) {
    Object.assign(payload, overrideLists);
  } else {
    payload = handleList(payload, destinationConfig, message, properties);
  }

  // handle pageName, pageUrl
  const contextPageUrl = context?.page?.url;
  const { trackPageName } = destinationConfig;
  const propertiesPageUrl = properties?.pageUrl;
  const pageUrl = contextPageUrl || propertiesPageUrl;
  if (isDefinedAndNotNullAndNotEmpty(pageUrl)) {
    payload.pageUrl = pageUrl;
  }
  if (trackPageName) {
    // better handling possible here, both error and implementation wise
    const contextPageName = context?.page?.name;
    const propertiesPageName = properties?.pageName;
    const pageName = propertiesPageName || contextPageName;
    if (isDefinedAndNotNullAndNotEmpty(pageName)) {
      payload.pageName = pageName;
    } else {
      // pageName is defaulted to URL.
      payload.pageName = pageUrl;
    }
  }

  // handle custom properties
  if (overrideCustomProperties) {
    Object.assign(payload, overrideCustomProperties);
  } else {
    payload = handleCustomProperties(payload, destinationConfig, message, properties);
  }

  // handle visitorID and timestamp
  const {
    dropVisitorId,
    timestampOption,
    preferVisitorId,
    timestampOptionalReporting,
    reportSuiteIds,
  } = destinationConfig;
  if (!dropVisitorId) {
    const userId = getFieldValueFromMessage(message, 'userIdOnly');
    if (isDefinedAndNotNullAndNotEmpty(userId)) {
      if (timestampOption === 'disabled') {
        payload.visitorID = userId;
      }

      if (timestampOption === 'hybrid' && preferVisitorId) {
        payload.visitorID = userId;
      }
    }
  }

  if (timestampOptionalReporting) {
    const timestamp =
      getFieldValueFromMessage(message, 'timestamp') ||
      getFieldValueFromMessage(message, 'originalTimestamp');
    if (timestampOption === 'enabled' || (timestampOption === 'hybrid' && !preferVisitorId)) {
      payload.timestamp = timestamp;
    }
  }

  // handle marketingcloudorgid
  const { marketingCloudOrgId } = destinationConfig;
  if (isDefinedAndNotNull(marketingCloudOrgId)) {
    payload.marketingcloudorgid = marketingCloudOrgId;
  }

  const xmlResponse = jsonxml(
    {
      request: {
        ...payload,
        ...basicPayload,
        reportSuiteID: reportSuiteIds,
      },
    },
    true, // add generic XML header
  );

  const { trackingServerSecureUrl } = destinationConfig;
  const response = defaultRequestConfig();
  response.method = defaultPostRequestConfig?.requestMethod;
  response.body.XML = { payload: xmlResponse };
  response.endpoint = trackingServerSecureUrl.startsWith('https')
    ? `${trackingServerSecureUrl}/b/ss//6`
    : `https://${trackingServerSecureUrl}/b/ss//6`;
  response.headers = {
    'Content-type': 'application/xml',
  };

  return response;
};

const processTrackEvent = (message, adobeEventName, destinationConfig, extras = {}) => {
  // set event string and product string only
  // handle extra properties
  // rest of the properties are handled under common properties
  const {
    eventMerchEventToAdobeEvent,
    eventMerchProperties,
    productMerchEventToAdobeEvent,
    productIdentifier,
    productMerchProperties,
    productMerchEvarsMap,
  } = destinationConfig;
  const { event: rawMessageEvent, properties } = message;
  const { overrideEventString, overrideProductString, products } = properties;
  const event = rawMessageEvent;
  const adobeEventArr = adobeEventName ? adobeEventName.split(',') : [];
  // adobeEventArr is an array of events which is defined as
  // ["eventName", "mapped Adobe Event=mapped merchproperty's value", "mapped Adobe Event=mapped merchproperty's value", . . .]

  // merch event section
  if (eventMerchEventToAdobeEvent[event] && eventMerchProperties) {
    const adobeMerchEvent = eventMerchEventToAdobeEvent[event].split(',');
    eventMerchProperties.forEach((rudderProp) => {
      if (rudderProp.eventMerchProperties in properties) {
        adobeMerchEvent.forEach((value) => {
          if (properties[rudderProp?.eventMerchProperties]) {
            const merchEventString = `${value}=${properties[rudderProp?.eventMerchProperties]}`;
            adobeEventArr.push(merchEventString);
          }
        });
      }
    });
  }

  if (productMerchEventToAdobeEvent[event]) {
    Object.keys(productMerchEventToAdobeEvent).forEach((value) => {
      adobeEventArr.push(productMerchEventToAdobeEvent[value]);
    });
  }

  // product string section
  const adobeProdEvent = productMerchEventToAdobeEvent[event];
  const prodString = [];
  let prodEventString = '';
  let prodEVarsString = '';

  if (adobeProdEvent || ECOM_PRODUCT_EVENTS.includes(event.toLowerCase())) {
    const isSingleProdEvent =
      adobeProdEvent === 'scAdd' ||
      adobeProdEvent === 'scRemove' ||
      (adobeProdEvent === 'prodView' && event.toLowerCase() !== 'product list viewed') ||
      !Array.isArray(products);
    const productsArr = isSingleProdEvent ? [properties] : products;
    let adobeProdEventArr = [];
    if (adobeProdEvent) {
      adobeProdEventArr = adobeProdEvent.split(',');
    }

    productsArr.forEach((value) => {
      const category = value?.category || '';
      const quantity = value?.quantity || 1;
      const total = value?.price ? (value.price * quantity).toFixed(2) : 0;
      let item = value[productIdentifier];
      if (productIdentifier === 'id') {
        item = value?.product_id || value?.id;
      }

      const merchMap = [];
      if (productMerchEventToAdobeEvent[event] && productMerchProperties) {
        productMerchProperties.forEach((rudderProp) => {
          // adding product level merchandise properties
          if (
            rudderProp.productMerchProperties.startsWith('products.') &&
            isSingleProdEvent === false
          ) {
            // take the keys after products. and find the value in properties
            const key = rudderProp?.productMerchProperties.split('.');
            const v = get(value, key[1]);
            if (isDefinedAndNotNull(v)) {
              adobeProdEventArr.forEach((val) => {
                merchMap.push(`${val}=${v}`);
              });
            }
          } else if (rudderProp.productMerchProperties in properties) {
            // adding root level merchandise properties
            adobeProdEventArr.forEach((val) => {
              merchMap.push(`${val}=${properties[rudderProp?.productMerchProperties]}`);
            });
          }
        });
        // forming prodEventString from merchMap array delimited by |
        prodEventString = merchMap.join('|');

        const eVars = [];
        Object.keys(productMerchEvarsMap).forEach((prodKey) => {
          const prodVal = productMerchEvarsMap[prodKey];

          if (prodKey.startsWith('products.')) {
            // take the keys after products. and find the value in properties
            const productValue = get(properties, prodKey?.split('.')?.[1]);
            if (isDefinedAndNotNull(productValue)) {
              eVars.push(`eVar${prodVal}=${productValue}`);
            }
          } else if (prodKey in properties) {
            eVars.push(`eVar${prodVal}=${properties[prodKey]}`);
          }
        });
        prodEVarsString = eVars.join('|');
      }
      // preparing the product string for the final payload
      // if prodEventString or prodEVarsString are missing or not
      let prodArr = [category, item, quantity, total];
      if (prodEventString || prodEVarsString) {
        prodArr = [...prodArr, prodEventString, prodEVarsString];
      }
      const test = stringifyValueAndJoinWithDelimitter(prodArr);
      if (isSingleProdEvent) {
        prodString.push(test);
      } else {
        prodString.push(test);
        prodString.push(',');
      }
    });
    // we delimit multiple products by ',' removing the trailing here
    if (prodString[prodString.length - 1] === ',') {
      prodString.pop();
    }
  }

  return {
    ...extras,
    events: overrideEventString || adobeEventArr.join(','),
    products: overrideProductString || prodString,
  };
};

const handleTrack = (message, destinationConfig) => {
  const { event: rawEvent } = message;
  let payload = null;
  // handle ecommerce events separately
  // generic events should go to the default
  const event = rawEvent;
  switch (event.toLowerCase()) {
    case 'product viewed':
    case 'product list viewed':
      payload = processTrackEvent(message, 'prodView', destinationConfig);
      break;
    case 'product added':
      payload = processTrackEvent(message, 'scAdd', destinationConfig);
      break;
    case 'product removed':
      payload = processTrackEvent(message, 'scRemove', destinationConfig);
      break;
    case 'order completed':
      payload = processTrackEvent(message, 'purchase', destinationConfig, {
        purchaseID: get(message, 'properties.purchaseId') || get(message, 'properties.order_id'),
        transactionID:
          get(message, 'properties.transactionId') || get(message, 'properties.order_id'),
      });
      break;
    case 'cart viewed':
      payload = processTrackEvent(message, 'scView', destinationConfig);
      break;
    case 'checkout started':
      payload = processTrackEvent(message, 'scCheckout', destinationConfig, {
        purchaseID: get(message, 'properties.purchaseId') || get(message, 'properties.order_id'),
        transactionID:
          get(message, 'properties.transactionId') || get(message, 'properties.order_id'),
      });
      break;
    case 'cart opened':
      payload = processTrackEvent(message, 'scOpen', destinationConfig);
      break;
    default:
      if (destinationConfig.rudderEventsToAdobeEvents[event]) {
        payload = processTrackEvent(
          message,
          destinationConfig.rudderEventsToAdobeEvents[event].trim(),
          destinationConfig,
        );
      } else {
        throw new ConfigurationError(
          'The event is not a supported ECOM event or a mapped custom event. Aborting.',
        );
      }
      break;
  }

  return payload;
};

const process = async (event) => {
  const { message, destination } = event;
  if (!message.type) {
    throw new InstrumentationError('Message Type is not present. Aborting message.');
  }
  const messageType = message.type.toLowerCase();
  const formattedDestination = formatDestinationConfig(destination.Config);
  let payload;

  const messageClone = { ...message };
  if (messageType === EventType.PAGE || messageType === EventType.SCREEN) {
    messageClone.event = message.name;
  }

  switch (messageType) {
    case EventType.TRACK:
    case EventType.PAGE:
    case EventType.SCREEN:
      payload = handleTrack(messageClone, formattedDestination);
      break;
    default:
      throw new InstrumentationError('Message type is not supported');
  }
  if (payload) {
    const response = await responseBuilderSimple(message, formattedDestination, payload);
    return response;
  }
  throw new TransformationError('AA: Unprocessable Event');
};

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
