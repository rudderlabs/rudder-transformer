const get = require('get-value');
const { InstrumentationError, UnsupportedEventError } = require('@rudderstack/integrations-lib');
const { EventType } = require('../../../constants');
const {
  isEmptyObject,
  constructPayload,
  getIntegrationsObj,
  isHybridModeEnabled,
  removeUndefinedAndNullValues,
} = require('../../util');
const {
  mappingConfig,
  ConfigCategory,
  trackCommonConfig,
  VALID_ITEM_OR_PRODUCT_PROPERTIES,
} = require('./config');
const {
  getItemsArray,
  validateEventName,
  prepareUserConsents,
  removeInvalidParams,
  isReservedEventName,
  getGA4ExclusionList,
  prepareUserProperties,
  getGA4CustomParameters,
  GA4_PARAMETERS_EXCLUSION,
  GA4_RESERVED_PARAMETER_EXCLUSION,
  removeReservedParameterPrefixNames,
  basicValidation,
  addClientDetails,
  buildDeliverablePayload,
  basicConfigvalidaiton,
} = require('./utils');
require('../../util/constant');

/**
 * Returns response for GA4 destination
 * @param {*} message
 * @param {*} Config
 * @returns
 */
const responseBuilder = (message, { Config }) => {
  let event = get(message, 'event');
  basicValidation(event);

  // trim and replace spaces with "_"
  event = event.trim().replace(/\s+/g, '_');

  // reserved event names are not allowed
  if (isReservedEventName(event)) {
    throw new InstrumentationError('track:: Reserved event names are not allowed');
  }

  // get common top level rawPayload
  let rawPayload = constructPayload(message, trackCommonConfig);

  rawPayload = addClientDetails(rawPayload, message, Config);

  let payload = {};
  const eventConfig = ConfigCategory[`${event.toUpperCase()}`];
  if (message.type === 'track' && eventConfig) {
    // GA4 standard events
    // get event specific parameters

    const { itemList, item, event: evConfigEvent, name } = eventConfig;
    payload.name = evConfigEvent;
    payload.params = constructPayload(message, mappingConfig[name]);

    const { items, mapRootLevelPropertiesToGA4ItemsArray } = getItemsArray(message, item, itemList);

    if (items.length > 0) {
      payload.params.items = items;
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
    payload.params = removeInvalidParams(removeUndefinedAndNullValues(payload.params));
  }

  if (isEmptyObject(payload.params)) {
    delete payload.params;
  }

  // Prepare GA4 user properties
  const userProperties = prepareUserProperties(message, Config.piiPropertiesToIgnore);
  if (!isEmptyObject(userProperties)) {
    rawPayload.user_properties = userProperties;
  }

  // Prepare GA4 consents
  const consents = prepareUserConsents(message);
  if (!isEmptyObject(consents)) {
    rawPayload.consent = consents;
  }

  payload = removeUndefinedAndNullValues(payload);
  rawPayload = { ...rawPayload, events: [payload] };

  return buildDeliverablePayload(rawPayload, Config);
};

const process = (event) => {
  const { message, destination } = event;
  const { Config } = destination;

  if (!message.type) {
    throw new InstrumentationError('Message Type is not present. Aborting message.');
  }

  basicConfigvalidaiton(Config);

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
