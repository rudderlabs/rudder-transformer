/* eslint-disable no-param-reassign */
const get = require('get-value');
const { InstrumentationError, ConfigurationError } = require('@rudderstack/integrations-lib');
const {
  VERSION,
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  FB_PIXEL_DEFAULT_EXCLUSION,
  FB_PIXEL_CUSTOM_DATA_EXCLUDE_FLATTENING,
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
  getHashFromArray,
} = require('../../util');

const {
  getActionSource,
  handleProduct,
  handleSearch,
  handleProductListViewed,
  handleOrder,
  populateCustomDataBasedOnCategory,
  getCategoryFromEvent,
  verifyEventDuration,
} = require('./utils');

const {
  transformedPayloadData,
  fetchUserData,
  formingFinalResponse,
} = require('../../util/facebookUtils');

const responseBuilderSimple = (message, category, destination) => {
  const { Config, ID } = destination;
  const { pixelId, accessToken } = Config;
  let { categoryToContent } = Config;
  if (Array.isArray(categoryToContent)) {
    categoryToContent = getValidDynamicFormConfig(categoryToContent, 'from', 'to', 'FB_PIXEL', ID);
  }

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

  const endpoint = `https://graph.facebook.com/${VERSION}/${pixelId}/events?access_token=${accessToken}`;

  const userData = fetchUserData(
    message,
    Config,
    MAPPING_CONFIG[CONFIG_CATEGORIES.USERDATA.name],
    'fb_pixel',
  );

  const commonData = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.COMMON.name],
    'fb_pixel',
  );
  commonData.action_source = getActionSource(commonData, message?.channel);

  let customData = {};

  if (category.type !== 'identify') {
    customData = flattenJson(
      extractCustomFields(
        message,
        customData,
        ['properties'],
        [...FB_PIXEL_DEFAULT_EXCLUSION, ...FB_PIXEL_CUSTOM_DATA_EXCLUDE_FLATTENING],
      ),
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
      integrationsObj,
    );
    message.properties = message.properties || {};
    if (category.standard) {
      commonData.event_name = category.eventName;
      customData = populateCustomDataBasedOnCategory(
        customData,
        message,
        category,
        categoryToContent,
        valueFieldIdentifier,
      );
      customData.currency = STANDARD_ECOMM_EVENTS_TYPE.includes(category.type)
        ? message.properties?.currency || 'USD'
        : undefined;
    } else {
      const { type } = category;
      if (type === 'page' || type === 'screen') {
        commonData.event_name = message.name
          ? `Viewed ${type} ${message.name}`
          : `Viewed a ${type}`;
      }
      if (type === 'simple track') {
        customData.value = message.properties?.revenue;
        delete customData.revenue;
        FB_PIXEL_CUSTOM_DATA_EXCLUDE_FLATTENING.forEach((customDataParameter) => {
          if (message.properties?.[customDataParameter]) {
            customData[customDataParameter] = message.properties[customDataParameter];
          }
        });
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

const processEvent = (message, destination) => {
  if (!message.type) {
    throw new InstrumentationError("'type' is missing");
  }

  const timeStamp = message.timestamp || message.originalTimestamp;
  verifyEventDuration(message, destination, timeStamp);

  let eventsToEvents;
  if (Array.isArray(destination.Config.eventsToEvents)) {
    eventsToEvents = getValidDynamicFormConfig(
      destination.Config.eventsToEvents,
      'from',
      'to',
      'FB_PIXEL',
      destination.ID,
    );
  }

  const { advancedMapping } = destination.Config;
  const messageType = message.type.toLowerCase();
  let category;
  let mappedEvent;
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
      if (eventsToEvents) {
        const eventMappingHash = getHashFromArray(eventsToEvents);
        mappedEvent = eventMappingHash[message.event.toLowerCase()];
      }
      category = getCategoryFromEvent(mappedEvent || message.event.toLowerCase());
      break;
    default:
      throw new InstrumentationError(`Message type ${messageType} not supported`);
  }
  // build the response
  return responseBuilderSimple(message, category, destination);
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
