const get = require('get-value');
const {
  validateEventName,
  basicValidation,
  isReservedEventName,
  addClientDetails,
  removeReservedParameterPrefixNames,
  prepareUserConsents,
  removeInvalidParams,
  GA4_RESERVED_PARAMETER_EXCLUSION,
  getGA4CustomParameters,
  buildDeliverablePayload,
  GA4_PARAMETERS_EXCLUSION,
  prepareUserProperties,
} = require('../ga4/utils');
const { InstrumentationError } = require('@rudderstack/integrations-lib');
const {
  removeUndefinedAndNullRecurse,
  constructPayload,
  isDefinedAndNotNull,
  isEmptyObject,
  removeUndefinedAndNullValues,
  isHybridModeEnabled,
  getIntegrationsObj,
  applyCustomMappings,
} = require('../../util');
const { trackCommonConfig, ConfigCategory, mappingConfig } = require('../ga4/config');

const findGA4Events = (eventsMapping, event) => {
  // Find the event using destructuring and early return

  const validMappings = eventsMapping.filter(
    (mapping) =>
      mapping.rsEventName?.trim().toLowerCase() === event.trim().toLowerCase() &&
      mapping.destEventName,
  );
  // Return an empty object if event not found
  return validMappings;
};

const handleCustomMappings = (message, Config) => {
  const { eventsMapping } = Config;

  let rsEvent = '';
  if (message.type.toString().toLowerCase() === 'track') {
    rsEvent = get(message, 'event');
    basicValidation(rsEvent);
  } else {
    const messageType = get(message, 'type');
    if (typeof messageType !== 'string') {
      throw new InstrumentationError(`[GA4]:: Message type ${messageType} is not supported`);
    }
    // for events other than track we will search with $eventType
    // example $track / $page
    rsEvent = `$${messageType}`;
  }

  const validMappings = findGA4Events(eventsMapping, rsEvent);

  if (validMappings.length === 0) {
    // trim and replace spaces with "_"
    rsEvent = rsEvent.trim().replace(/\s+/g, '_');
    // reserved event names are not allowed
    if (isReservedEventName(rsEvent)) {
      throw new InstrumentationError(`[GA4]:: Reserved event name: ${rsEvent} are not allowed`);
    }
    // validation for ga4 event name
    validateEventName(rsEvent);

    // Default mapping

    let rawPayload = constructPayload(message, trackCommonConfig);

    const ga4EventPayload = {};

    // take optional params parameters for custom events
    ga4EventPayload.params = {
      ...ga4EventPayload.params,
      ...constructPayload(message, mappingConfig[ConfigCategory.TrackPageCommonParamsConfig.name]),
    };

    // all extra parameters passed is incorporated inside params
    ga4EventPayload.params = getGA4CustomParameters(
      message,
      ['properties'],
      GA4_RESERVED_PARAMETER_EXCLUSION.concat(GA4_PARAMETERS_EXCLUSION),
      ga4EventPayload,
    );

    // Prepare GA4 user properties
    const userProperties = prepareUserProperties(message, Config.piiPropertiesToIgnore);
    if (!isEmptyObject(userProperties)) {
      rawPayload.user_properties = userProperties;
    }

    rawPayload = removeUndefinedAndNullValues(rawPayload);
    rawPayload = { ...rawPayload, events: [ga4EventPayload] };

    boilerplateOperations(rawPayload, message, Config, rsEvent);

    return buildDeliverablePayload(rawPayload, Config);
  }

  const processedPayloads = validMappings.map((mapping) => {
    const eventName = mapping.destEventName;
    // reserved event names are not allowed
    if (isReservedEventName(eventName)) {
      throw new InstrumentationError(`[GA4]:: Reserved event name: ${eventName} are not allowed`);
    }
    // validation for ga4 event name
    validateEventName(eventName);

    // Add common top level payload
    let ga4BasicPayload = constructPayload(message, trackCommonConfig);
    ga4BasicPayload = addClientDetails(ga4BasicPayload, message, Config);

    const eventPropertiesMappings = mapping.eventProperties || [];

    const ga4MappedPayload = applyCustomMappings(message, eventPropertiesMappings);

    removeUndefinedAndNullRecurse(ga4MappedPayload);

    boilerplateOperations(ga4MappedPayload, message, Config, eventName);

    if (isDefinedAndNotNull(ga4BasicPayload)) {
      return { ...ga4BasicPayload, ...ga4MappedPayload };
    } else {
      return ga4MappedPayload;
    }
  });

  return processedPayloads.map((processedPayload) =>
    buildDeliverablePayload(processedPayload, Config),
  );
};

const boilerplateOperations = (ga4Payload, message, Config, eventName) => {
  removeReservedParameterPrefixNames(ga4Payload.events[0].params);
  ga4Payload.events[0].name = eventName;
  const integrationsObj = getIntegrationsObj(message, 'ga4');

  if (isHybridModeEnabled(Config) && integrationsObj?.sessionId) {
    ga4Payload.events[0].params.session_id = integrationsObj.sessionId;
  }

  if (ga4Payload.events[0].params) {
    ga4Payload.events[0].params = removeInvalidParams(
      removeUndefinedAndNullValues(ga4Payload.events[0].params),
    );
  }

  if (isEmptyObject(ga4Payload.events[0].params)) {
    delete ga4Payload.events[0].params;
  }

  // Prepare GA4 consents
  const consents = prepareUserConsents(message);
  if (!isEmptyObject(consents)) {
    ga4Payload.consent = consents;
  }
};

module.exports = {
  handleCustomMappings,
};
