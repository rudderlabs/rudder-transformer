const jsonxml = require('jsontoxml');
const get = require('get-value');
const { EventType } = require('../../../constants');
const { commonConfig, formatDestinationConfig } = require('./config');
const {
  constructPayload,
  defaultPostRequestConfig,
  defaultRequestConfig,
  getDestinationExternalID,
  getFieldValueFromMessage,
  isDefinedAndNotNull,
  isDefinedAndNotNullAndNotEmpty,

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

const responseBuilderSimple = async (message, destinationConfig, basicPayload) => {
  let payload = constructPayload(message, commonConfig);
  const { context, properties } = message;
  // handle contextData
  payload = handleContextData(payload, destinationConfig, message);

  // handle eVar
  payload = handleEvar(payload, destinationConfig, message);

  // handle fallbackVisitorId
  const { noFallbackVisitorId } = destinationConfig;
  // 'AdobeFallbackVisitorId' should be the type of external id in the payload i.e "AdobeFallbackVisitorId": "value"
  if (!noFallbackVisitorId) {
    const fallbackVisitorId = getDestinationExternalID(message, 'AdobeFallbackVisitorId');
    if (isDefinedAndNotNull(fallbackVisitorId)) {
      payload.fallbackVisitorId = fallbackVisitorId;
    }
  }

  // handle hier
  payload = handleHier(payload, destinationConfig, message);

  // handle list
  payload = handleList(payload, destinationConfig, message, properties);

  // handle pageName, pageUrl
  const contextPageUrl = context?.page?.url;
  const propertiesPageUrl = properties?.pageUrl;
  const pageUrl = contextPageUrl || propertiesPageUrl;
  if (isDefinedAndNotNullAndNotEmpty(pageUrl)) {
    payload.pageUrl = pageUrl;
  }
  if (destinationConfig?.trackPageName) {
    // better handling possible here, both error and implementation wise
    const contextPageName = context?.page?.name;
    const propertiesPageName = properties?.pageName;
    const pageName = propertiesPageName || contextPageName;
    if (isDefinedAndNotNullAndNotEmpty(pageName)) {
      payload.pageName = pageName;
    }
  }

  // handle custom properties
  payload = handleCustomProperties(payload, destinationConfig, message, properties);

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
    const timestamp = getFieldValueFromMessage(message, 'timestamp');
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
  response.method = defaultPostRequestConfig.requestMethod;
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
  const event = rawMessageEvent.toLowerCase();
  const adobeEventArr = adobeEventName ? adobeEventName.split(',') : [];
  // adobeEventArr is an array of events which is defined as
  // ["eventName", "mapped Adobe Event=mapped merchproperty's value", "mapped Adobe Event=mapped merchproperty's value", . . .]

  // merch event section
  if (eventMerchEventToAdobeEvent[event] && eventMerchProperties) {
    const adobeMerchEvent = eventMerchEventToAdobeEvent[event].split(',');
    eventMerchProperties.forEach(rudderProp => {
      if (rudderProp.eventMerchProperties in properties) {
        adobeMerchEvent.forEach(value => {
          if (properties[rudderProp.eventMerchProperties]) {
            const merchEventString = `${value}=${properties[rudderProp.eventMerchProperties]}`;
            adobeEventArr.push(merchEventString);
          }
        });
      }
    });
  }

  if (productMerchEventToAdobeEvent[event]) {
    Object.keys(productMerchEventToAdobeEvent).forEach(value => {
      adobeEventArr.push(productMerchEventToAdobeEvent[value]);
    });
  }

  const ECOM_PRODUCT_EVENTS = ["product viewed", "viewed product", "product list viewed", "viewed product list", "product added", "added product", "product removed", "removed product", "order completed", "completed order", "cart viewed", "viewed cart", "checkout started", "started checkout", "cart opened", "opened cart"]
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
      !Array.isArray(properties.products);
    const productsArr = isSingleProdEvent ? [properties] : properties.products;
    let adobeProdEventArr = [];
    if (adobeProdEvent) {
      adobeProdEventArr = adobeProdEvent.split(',');
    }

    productsArr.forEach(value => {
      const category = value.category || '';
      const quantity = value.quantity || 1;
      const total = value.price ? (value.price * quantity).toFixed(2) : 0;
      let item;
      if (productIdentifier === 'id') {
        item = value.product_id || value.id;
      } else {
        item = value[productIdentifier];
      }

      const merchMap = [];
      if (productMerchEventToAdobeEvent[event] && productMerchProperties) {
        productMerchProperties.forEach(rudderProp => {
          // adding product level merchandise properties
          if (
            rudderProp.productMerchProperties.startsWith('products.') &&
            isSingleProdEvent === false
          ) {
            // take the keys after products. and find the value in properties
            const key = rudderProp.productMerchProperties.split('.');
            const v = get(value, key[1]);
            if (isDefinedAndNotNull(v)) {
              adobeProdEventArr.forEach(val => {
                merchMap.push(`${val}=${v}`);
              });
            }
          } else if (rudderProp.productMerchProperties in properties) {
            // adding root level merchandise properties
            adobeProdEventArr.forEach(val => {
              merchMap.push(`${val}=${properties[rudderProp.productMerchProperties]}`);
            });
          }
        });
        // forming prodEventString from merchMap array delimited by |
        prodEventString = merchMap.join('|');

        const eVars = [];
        Object.keys(productMerchEvarsMap).forEach(prodKey => {
          const prodVal = productMerchEvarsMap[prodKey];

          if (prodKey.startsWith('products.')) {
            // take the keys after products. and find the value in properties
            const productValue = get(properties, prodKey.split('.')[1]);
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
        prodArr = [ ...prodArr, prodEventString, prodEVarsString ];
      }
      const test = stringifyValueAndJoinWithDelimitter(prodArr);
      prodString.push(test);
    });
  }

  return {
    ...extras,
    events: adobeEventArr.join(','),
    products: prodString,
  };
};

const handleTrack = (message, destinationConfig) => {
  const { event: rawEvent } = message;
  let payload = null;
  // handle ecommerce events separately
  // generic events should go to the default
  const event = rawEvent?.toLowerCase();
  switch (event) {
    case 'product viewed':
    case 'viewed product':
    case 'product list viewed':
    case 'viewed product list':
      payload = processTrackEvent(message, 'prodView', destinationConfig);
      break;
    case 'product added':
    case 'added product':
      payload = processTrackEvent(message, 'scAdd', destinationConfig);
      break;
    case 'product removed':
    case 'removed product':
      payload = processTrackEvent(message, 'scRemove', destinationConfig);
      break;
    case 'order completed':
    case 'completed order':
      payload = processTrackEvent(message, 'purchase', destinationConfig, {
        purchaseID: get(message, 'properties.purchaseId') || get(message, 'properties.order_id'),
        transactionID:
          get(message, 'properties.transactionId') || get(message, 'properties.order_id'),
      });
      break;
    case 'cart viewed':
    case 'viewed cart':
      payload = processTrackEvent(message, 'scView', destinationConfig);
      break;
    case 'checkout started':
    case 'started checkout':
      payload = processTrackEvent(message, 'scCheckout', destinationConfig, {
        purchaseID: get(message, 'properties.purchaseId') || get(message, 'properties.order_id'),
        transactionID:
          get(message, 'properties.transactionId') || get(message, 'properties.order_id'),
      });
      break;
    case 'cart opened':
    case 'opened cart':
      payload = processTrackEvent(message, 'scOpen', destinationConfig);
      break;
    default:
      if (destinationConfig.rudderEventsToAdobeEvents[event.toLowerCase()]) {
        payload = processTrackEvent(
          message,
          destinationConfig.rudderEventsToAdobeEvents[event.toLowerCase()].trim(),
          destinationConfig,
        );
      }
      break;
  }

  return payload;
};

const process = async event => {
  const { message, destination } = event;
  if (!message.type) {
    throw InstrumentationError('Message Type is not present. Aborting message.');
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
