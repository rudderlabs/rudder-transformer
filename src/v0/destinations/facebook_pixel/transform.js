/* eslint-disable no-param-reassign */
const get = require('get-value');
const moment = require('moment');
const stats = require('../../../util/stats');
const {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  FB_PIXEL_DEFAULT_EXCLUSION,
  STANDARD_ECOMM_EVENTS_TYPE,
} = require('./config');
const { EventType } = require('../../../constants');

const {
  constructPayload,
  extractCustomFields,
  flattenJson,
  getIntegrationsObj,
  getValidDynamicFormConfig,
  simpleProcessRouterDest,
} = require('../../util');

const {
  transformedPayloadData,
  getActionSource,
  fetchUserData,
  handleProduct,
  handleSearch,
  handleProductListViewed,
  handleOrder,
  formingFinalResponse,
} = require('./utils');

const { InstrumentationError, ConfigurationError } = require('../../util/errorTypes');

const responseBuilderSimple = (message, category, destination, categoryToContent) => {
  const { Config } = destination;
  const { pixelId, accessToken } = Config;

  if (!pixelId) {
    throw new ConfigurationError('Pixel Id not found. Aborting');
  }

  if (!accessToken) {
    throw new ConfigurationError('Access token not found. Aborting');
  }

  const {
    blacklistPiiProperties,
    valueFieldIdentifier,
    whitelistPiiProperties,
    limitedDataUSage,
    testDestination,
    testEventCode,
    standardPageCall,
  } = Config;
  const integrationsObj = getIntegrationsObj(message, 'fb_pixel');

  const endpoint = `https://graph.facebook.com/v16.0/${pixelId}/events?access_token=${accessToken}`;

  const userData = fetchUserData(message, Config);

  let customData = {};
  let commonData = {};

  commonData = constructPayload(message, MAPPING_CONFIG[CONFIG_CATEGORIES.COMMON.name], 'fb_pixel');
  commonData.action_source = getActionSource(commonData, message?.channel);

  if (category.type !== 'identify') {
    customData = flattenJson(
      extractCustomFields(message, customData, ['properties'], FB_PIXEL_DEFAULT_EXCLUSION),
    );
    if (standardPageCall && category.type === 'page') {
      category.standard = true;
    }
    if (Object.keys(customData).length === 0 && category.standard) {
      throw new InstrumentationError(
        `After excluding ${FB_PIXEL_DEFAULT_EXCLUSION}, no fields are present in 'properties' for a standard event`,
      );
    }
    customData = transformedPayloadData(
      message,
      customData,
      blacklistPiiProperties,
      whitelistPiiProperties,
      category.standard,
      integrationsObj,
    );
    message.properties = message.properties || {};
    if (category.standard) {
      switch (category.type) {
        case 'product list viewed':
          customData = {
            ...customData,
            ...handleProductListViewed(message, categoryToContent),
          };
          commonData.event_name = 'ViewContent';
          break;
        case 'product viewed':
          customData = {
            ...customData,
            ...handleProduct(message, categoryToContent, valueFieldIdentifier),
          };
          commonData.event_name = 'ViewContent';
          break;
        case 'product added':
          customData = {
            ...customData,
            ...handleProduct(message, categoryToContent, valueFieldIdentifier),
          };
          commonData.event_name = 'AddToCart';
          break;
        case 'order completed':
          customData = {
            ...customData,
            ...handleOrder(message, categoryToContent),
          };
          commonData.event_name = 'Purchase';
          break;
        case 'products searched': {
          customData = {
            ...customData,
            ...handleSearch(message),
          };
          commonData.event_name = 'Search';
          break;
        }
        case 'checkout started': {
          const orderPayload = handleOrder(message, categoryToContent);
          delete orderPayload.content_name;
          customData = {
            ...customData,
            ...orderPayload,
          };
          commonData.event_name = 'InitiateCheckout';
          break;
        }
        case 'page_view': // executed when sending track calls but with standard type PageView
        case 'page': // executed when page call is done with standard PageView turned on
          customData = { ...customData };
          commonData.event_name = 'PageView';
          break;
        case 'otherStandard':
          customData = { ...customData };
          commonData.event_name = category.event;
          break;
        default:
          throw new InstrumentationError(
            `${category.standard} type of standard event does not exist`,
          );
      }
      customData.currency = STANDARD_ECOMM_EVENTS_TYPE.includes(category.type)
        ? message.properties.currency || 'USD'
        : undefined;
    } else {
      const { type } = category;
      if (type === 'page' || type === 'screen') {
        commonData.event_name = message.name
          ? `Viewed ${type} ${message.name}`
          : `Viewed a ${type}`;
      }
      if (type === 'simple track') {
        customData.value = message.properties ? message.properties.revenue : undefined;
        delete customData.revenue;
      }
    }
  } else {
    customData = undefined;
  }
  if (limitedDataUSage) {
    const dataProcessingOptions = get(message, 'context.dataProcessingOptions');
    if (dataProcessingOptions && Array.isArray(dataProcessingOptions)) {
      [
        commonData.data_processing_options,
        commonData.data_processing_options_country,
        commonData.data_processing_options_state,
      ] = dataProcessingOptions;
    }
  }

  // content_category should only be a string ref: https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/custom-data

  return formingFinalResponse(
    userData,
    commonData,
    customData,
    endpoint,
    testDestination,
    testEventCode,
  );
};

function getCategoryFromEvent(checkEvent) {
  let category;
  switch (checkEvent) {
    case CONFIG_CATEGORIES.PRODUCT_LIST_VIEWED.type:
    case 'ViewContent':
      category = CONFIG_CATEGORIES.PRODUCT_LIST_VIEWED;
      break;
    case CONFIG_CATEGORIES.PRODUCT_VIEWED.type:
      category = CONFIG_CATEGORIES.PRODUCT_VIEWED;
      break;
    case CONFIG_CATEGORIES.PRODUCT_ADDED.type:
    case 'AddToCart':
      category = CONFIG_CATEGORIES.PRODUCT_ADDED;
      break;
    case CONFIG_CATEGORIES.ORDER_COMPLETED.type:
    case 'Purchase':
      category = CONFIG_CATEGORIES.ORDER_COMPLETED;
      break;
    case CONFIG_CATEGORIES.PRODUCTS_SEARCHED.type:
    case 'Search':
      category = CONFIG_CATEGORIES.PRODUCTS_SEARCHED;
      break;
    case CONFIG_CATEGORIES.CHECKOUT_STARTED.type:
    case 'InitiateCheckout':
      category = CONFIG_CATEGORIES.CHECKOUT_STARTED;
      break;
    case 'AddToWishlist':
    case 'AddPaymentInfo':
    case 'Lead':
    case 'CompleteRegistration':
    case 'Contact':
    case 'CustomizeProduct':
    case 'Donate':
    case 'FindLocation':
    case 'Schedule':
    case 'StartTrial':
    case 'SubmitApplication':
    case 'Subscribe':
      category = CONFIG_CATEGORIES.OTHER_STANDARD;
      category.event = checkEvent;
      break;
    case 'PageView':
      category = CONFIG_CATEGORIES.PAGE_VIEW;
      break;
    default:
      category = CONFIG_CATEGORIES.SIMPLE_TRACK;
      break;
  }
  return category;
}

const processEvent = (message, destination) => {
  if (!message.type) {
    throw new InstrumentationError("'type' is missing");
  }

  const timeStamp = message.timestamp || message.originalTimestamp;
  if (timeStamp) {
    const start = moment.unix(moment(timeStamp).format('X'));
    const current = moment.unix(moment().format('X'));
    // calculates past event in days
    const deltaDay = Math.ceil(moment.duration(current.diff(start)).asDays());
    // calculates future event in minutes
    const deltaMin = Math.ceil(moment.duration(start.diff(current)).asMinutes());
    if (deltaDay > 7 || deltaMin > 1) {
      // TODO: Remove after testing in mirror transformer
      stats.increment('fb_pixel_timestamp_error', {
        destinationId: destination.ID,
      });
      throw new InstrumentationError(
        'Events must be sent within seven days of their occurrence or up to one minute in the future.',
      );
    }
  }

  let eventsToEvents;
  if (destination.Config.eventsToEvents)
    eventsToEvents = getValidDynamicFormConfig(
      destination.Config.eventsToEvents,
      'from',
      'to',
      'FB_PIXEL',
      destination.ID,
    );
  let categoryToContent;
  if (destination.Config.categoryToContent)
    categoryToContent = getValidDynamicFormConfig(
      destination.Config.categoryToContent,
      'from',
      'to',
      'FB_PIXEL',
      destination.ID,
    );
  const { advancedMapping } = destination.Config;
  let standard;
  let standardTo = '';
  let checkEvent;
  const messageType = message.type.toLowerCase();
  let category;
  switch (messageType) {
    case EventType.IDENTIFY:
      if (advancedMapping) {
        category = CONFIG_CATEGORIES.USERDATA;
        break;
      } else {
        throw new ConfigurationError(
          'For identify events, "Advanced Mapping" configuration must be enabled on the RudderStack dashboard',
        );
      }
    case EventType.PAGE:
    case EventType.SCREEN:
      category = CONFIG_CATEGORIES.PAGE;
      break;
    case EventType.TRACK:
      if (!message.event) {
        throw new InstrumentationError("'event' is required");
      }
      if (typeof message.event !== 'string') {
        throw new InstrumentationError('event name should be string');
      }
      standard = eventsToEvents;
      if (standard) {
        standardTo = standard.reduce((filtered, standards) => {
          if (standards.from.toLowerCase() === message.event.toLowerCase()) {
            filtered = standards.to;
          }
          return filtered;
        }, '');
      }
      checkEvent = standardTo !== '' ? standardTo : message.event.toLowerCase();

      category = getCategoryFromEvent(checkEvent);
      break;
    default:
      throw new InstrumentationError(`Message type ${messageType} not supported`);
  }
  // build the response
  return responseBuilderSimple(message, category, destination, categoryToContent);
};

const process = (event) => processEvent(event.message, event.destination);

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = {
  process,
  processRouterDest,
  handleSearch,
  handleProductListViewed,
  handleProduct,
  handleOrder,
};
