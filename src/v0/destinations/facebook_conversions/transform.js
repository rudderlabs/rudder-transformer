/* eslint-disable no-param-reassign */
const get = require('get-value');
const moment = require('moment');
const {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  FB_CONVERSIONS_DEFAULT_EXCLUSION,
  DESTINATION
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
  populateCustomDataBasedOnCategory,
  getCategoryFromEvent,
} = require('./utils');

const {
  transformedPayloadData,
  getActionSource,
  fetchUserData,
  formingFinalResponse
} = require('../facebook_pixel/utils');

const { InstrumentationError, ConfigurationError } = require('../../util/errorTypes');

const responseBuilderSimple = (message, category, destination) => {
  const { Config, ID } = destination;
  let { categoryToContent } = Config;
  if (Array.isArray(categoryToContent)) {
    categoryToContent = getValidDynamicFormConfig(categoryToContent, 'from', 'to', DESTINATION, ID);
  }

  const {
    blacklistPiiProperties,
    whitelistPiiProperties,
    limitedDataUSage,
    testDestination,
    testEventCode,
    datasetId,
    accessToken
  } = Config;
  const integrationsObj = getIntegrationsObj(message, DESTINATION.toLowerCase());

  const endpoint = `https://graph.facebook.com/v17.0/${datasetId}/events?access_token=${accessToken}`;

  const userData = fetchUserData(message, Config, DESTINATION.toLowerCase());

  if (category.standard) {
    message.event = category.eventName;
  }

  const commonData = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.COMMON.name],
    DESTINATION.toLowerCase(),
  );
  commonData.action_source = getActionSource(commonData, message?.channel);

  let customData = {};
  customData = flattenJson(
    extractCustomFields(message, customData, ['properties'], FB_CONVERSIONS_DEFAULT_EXCLUSION),
  );

  customData = transformedPayloadData(
    message,
    customData,
    blacklistPiiProperties,
    whitelistPiiProperties,
    integrationsObj,
  );
  customData = populateCustomDataBasedOnCategory(
    customData,
    message,
    category,
    categoryToContent,
  );


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
  if (timeStamp) {
    const start = moment.unix(moment(timeStamp).format('X'));
    const current = moment.unix(moment().format('X'));
    // calculates past event in days
    const deltaDay = Math.ceil(moment.duration(current.diff(start)).asDays());
    // calculates future event in minutes
    const deltaMin = Math.ceil(moment.duration(start.diff(current)).asMinutes());
    if (deltaDay > 7 || deltaMin > 1) {
      throw new InstrumentationError(
        'Events must be sent within seven days of their occurrence or up to one minute in the future.',
      );
    }
  }

  const { datasetId, accessToken } = destination.Config;
  if (!datasetId) {
    throw new ConfigurationError('Dataset Id not found. Aborting');
  }
  if (!accessToken) {
    throw new ConfigurationError('Access token not found. Aborting');
  }

  let eventsToEvents;
  if (Array.isArray(destination.Config.eventsToEvents)) {
    eventsToEvents = getValidDynamicFormConfig(
      destination.Config.eventsToEvents,
      'from',
      'to',
      DESTINATION,
      destination.ID,
    );
  }

  const messageType = message.type.toLowerCase();
  let category;
  let mappedEvent;
  switch (messageType) {
    case EventType.PAGE:
    case EventType.SCREEN:
      category = CONFIG_CATEGORIES.PAGE_VIEW;
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
  processRouterDest
};
