const get = require('get-value');
const { EventType } = require('../../../constants');
const {
  defaultPostRequestConfig,
  constructPayload,
  defaultRequestConfig,
  extractCustomFields,
  isEmptyObject,
  getDestinationExternalID,
  removeUndefinedAndNullValues,
  isDefinedAndNotNull,
  getIntegrationsObj,
  isHybridModeEnabled,
} = require('../../util');
const {
  InstrumentationError,
  ConfigurationError,
  UnsupportedEventError,
} = require('../../util/errorTypes');
const {
  ENDPOINT,
  DEBUG_ENDPOINT,
  trackCommonConfig,
  mappingConfig,
  ConfigCategory,
  VALID_ITEM_OR_PRODUCT_PROPERTIES,
} = require('./config');
const {
  isReservedEventName,
  GA4_RESERVED_PARAMETER_EXCLUSION,
  removeReservedParameterPrefixNames,
  GA4_RESERVED_USER_PROPERTY_EXCLUSION,
  removeReservedUserPropertyPrefixNames,
  getItemList,
  getGA4ExclusionList,
  getItem,
  getGA4CustomParameters,
  GA4_PARAMETERS_EXCLUSION,
  validateEventName,
} = require('./utils');
const { JSON_MIME_TYPE } = require('../../util/constant');

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

/**
 * Returns response for GA4 destination
 * @param {*} message
 * @param {*} Config
 * @returns
 */
const responseBuilder = (message, { Config }) => {
  let event = get(message, 'event');
  if (!event) {
    throw new InstrumentationError('Event name is required');
  }

  // trim and replace spaces with "_"
  if (typeof event !== 'string') {
    throw new InstrumentationError('track:: event name should be string');
  }
  event = event.trim().replace(/\s+/g, '_');

  // reserved event names are not allowed
  if (isReservedEventName(event)) {
    throw new InstrumentationError('track:: Reserved event names are not allowed');
  }

  // get common top level rawPayload
  let rawPayload = constructPayload(message, trackCommonConfig);

  switch (Config.typesOfClient) {
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
      throw ConfigurationError('Invalid type of client');
  }

  let payload = {};
  const eventConfig = ConfigCategory[`${event.toUpperCase()}`];
  if (message.type === 'track' && eventConfig) {
    // GA4 standard events
    // get event specific parameters

    const { itemList, item, event: evConfigEvent, name } = eventConfig;
    payload.name = evConfigEvent;
    payload.params = constructPayload(message, mappingConfig[name]);

    let mapRootLevelPropertiesToGA4ItemsArray;
    if (itemList && item) {
      payload.params.items = getItemList(message, itemList === 'YES');

      if (!(payload.params.items && payload.params.items.length > 0)) {
        mapRootLevelPropertiesToGA4ItemsArray = true;
        payload.params.items = getItem(message, item === 'YES');
      }
    } else if (item) {
      // item
      payload.params.items = getItem(message, item === 'YES');
      mapRootLevelPropertiesToGA4ItemsArray = true;
    } else if (itemList) {
      // itemList
      payload.params.items = getItemList(message, itemList === 'YES');
    }

    // excluding event + root-level properties which are already mapped
    if (
      mapRootLevelPropertiesToGA4ItemsArray &&
      VALID_ITEM_OR_PRODUCT_PROPERTIES.includes(payload.name)
    ) {
      // exclude event properties which are already mapped
      let ITEM_EXCLUSION_LIST = getGA4ExclusionList(mappingConfig[name]);
      ITEM_EXCLUSION_LIST = ITEM_EXCLUSION_LIST.concat(
        // exclude root-level properties (GA4ItemConfig.json) which are already mapped
        getGA4ExclusionList(mappingConfig[ConfigCategory.ITEM.name]),
      );

      payload.params = getGA4CustomParameters(
        message,
        ['properties'],
        ITEM_EXCLUSION_LIST,
        payload,
      );
    } else {
      payload.params = getGA4CustomParameters(
        message,
        ['properties'],
        getGA4ExclusionList(mappingConfig[name]),
        payload,
      );
    }

    // take optional params parameters for track()
    payload.params = {
      ...payload.params,
      ...constructPayload(message, mappingConfig[ConfigCategory.TrackPageCommonParamsConfig.name]),
    };
  } else if (message.type === 'page') {
    // page event
    payload.name = event;
    payload.params = constructPayload(message, mappingConfig[ConfigCategory.PAGE.name]);

    payload.params = getGA4CustomParameters(
      message,
      ['properties'],
      GA4_RESERVED_PARAMETER_EXCLUSION.concat(GA4_PARAMETERS_EXCLUSION),
      payload,
    );

    // take optional params parameters for page()
    payload.params = {
      ...payload.params,
      ...constructPayload(message, mappingConfig[ConfigCategory.TrackPageCommonParamsConfig.name]),
    };
  } else if (message.type === 'group') {
    // group event
    payload.name = event;
    payload.params = constructPayload(message, mappingConfig[ConfigCategory.GROUP.name]);

    payload.params = getGA4CustomParameters(
      message,
      ['traits', 'context.traits'],
      getGA4ExclusionList(mappingConfig[ConfigCategory.GROUP.name]),
      payload,
    );

    // take optional params parameters for group()
    payload.params = {
      ...payload.params,
      ...constructPayload(
        message,
        mappingConfig[ConfigCategory.IdentifyGroupCommonParamsConfig.name],
      ),
    };
  } else {
    validateEventName(event);
    
    payload.name = event;

    // all extra parameters passed is incorporated inside params
    payload.params = getGA4CustomParameters(
      message,
      ['properties'],
      GA4_RESERVED_PARAMETER_EXCLUSION.concat(GA4_PARAMETERS_EXCLUSION),
      payload,
    );

    // take optional params parameters for custom events
    payload.params = {
      ...payload.params,
      ...constructPayload(message, mappingConfig[ConfigCategory.TrackPageCommonParamsConfig.name]),
    };
  }

  removeReservedParameterPrefixNames(payload.params);
  const integrationsObj = getIntegrationsObj(message, 'ga4');
  if (isHybridModeEnabled(Config) && integrationsObj && integrationsObj.sessionId) {
    payload.params.session_id = integrationsObj.sessionId;
  }

  if (integrationsObj?.sessionNumber) {
    payload.params.session_number = integrationsObj.sessionNumber;
  }

  if (payload.params) {
    payload.params = removeUndefinedAndNullValues(payload.params);
  }

  if (isEmptyObject(payload.params)) {
    delete payload.params;
  }

  // take GA4 user properties
  let userProperties = {};
  userProperties = extractCustomFields(
    message,
    userProperties,
    ['properties.user_properties'],
    GA4_RESERVED_USER_PROPERTY_EXCLUSION,
  );

  if (!isEmptyObject(userProperties)) {
    rawPayload.user_properties = userProperties;
  }

  removeReservedUserPropertyPrefixNames(rawPayload.user_properties);

  payload = removeUndefinedAndNullValues(payload);
  rawPayload = { ...rawPayload, events: [payload] };

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

  response.body.JSON = rawPayload;
  return response;
};

const process = (event) => {
  const { message, destination } = event;
  const { Config } = destination;

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

  if (!message.type) {
    throw new InstrumentationError('Message Type is not present. Aborting message.');
  }

  const messageType = message.type.toLowerCase();
  let response;
  switch (messageType) {
    case EventType.TRACK:
      response = responseBuilder(message, destination);
      break;
    case EventType.PAGE:
      // GA4 custom event 'page_view' is fired for page
      if (!isHybridModeEnabled(Config)) {
        message.event = 'page_view';
        response = responseBuilder(message, destination);
      } else {
        throw new UnsupportedEventError(
          'GA4 Hybrid mode is enabled, page calls will be sent through device mode',
        );
      }
      break;
    case EventType.GROUP:
      // GA4 standard event 'join_group' is fired for group
      message.event = 'join_group';
      response = responseBuilder(message, destination);
      break;
    default:
      throw new InstrumentationError(`Message type ${messageType} not supported`);
  }
  return response;
};

module.exports = { process };
