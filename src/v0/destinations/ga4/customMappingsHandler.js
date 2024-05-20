const get = require('get-value');
const jsonpath = require('rs-jsonpath');
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
} = require('./utils');
const { InstrumentationError } = require('@rudderstack/integrations-lib');
const {
  removeUndefinedAndNullRecurse,
  constructPayload,
  isDefinedAndNotNull,
  isEmptyObject,
  removeUndefinedAndNullValues,
  isHybridModeEnabled,
  getIntegrationsObj,
} = require('../../util');
const { trackCommonConfig, ConfigCategory } = require('./config');

const findGA4Events = (eventsMapping, event) => {
  // Find the event using destructuring and early return
  const validMappings = eventsMapping.filter(
    (mapping) =>
      mapping.rsEventName?.trim().toLowerCase() === event.trim().toLowerCase() &&
      mapping.ga4EventName,
  );
  // Return an empty object if event not found
  return validMappings;
};

const handleCustomMappings = (message, Config) => {
  const { eventsMapping } = Config;

  let rsEvent = get(message, 'event');
  basicValidation(rsEvent);

  const validMappings = findGA4Events(eventsMapping, rsEvent);

  if (validMappings.length === 0) {
    // Default mapping

    let rawPayload = constructPayload(message, trackCommonConfig);

    const ga4EventPayload = {};

    ga4EventPayload.name = event;

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

    boilerplateOperations(rawPayload, message, Config);
  }

  const processedPayloads = validMappings.map((mapping) => {
    const eventName = mapping.ga4EventName;
    // reserved event names are not allowed
    if (isReservedEventName(eventName)) {
      throw new InstrumentationError(`[GA4]:: Reserved event name: ${eventName} are not allowed`);
    }
    // validation for ga4 event name
    validateEventName(eventName);

    // Add common top level payload
    let ga4BasicPayload = constructPayload(message, trackCommonConfig);
    ga4BasicPayload = addClientDetails(ga4BasicPayload, message, Config);

    const eventPropertiesMappings = mapping.eventProperties || {};

    const ga4MappedPayload = {};

    for (const propertyMapping of eventPropertiesMappings) {
      mapWithJsonPath(message, ga4MappedPayload, propertyMapping.from, propertyMapping.to);
    }
    removeUndefinedAndNullRecurse(ga4MappedPayload);

    boilerplateOperations(ga4MappedPayload, message, Config);

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

const boilerplateOperations = (ga4Payload, message, Config) => {
  removeReservedParameterPrefixNames(ga4Payload.events[0].params);

  const integrationsObj = getIntegrationsObj(message, 'ga4');

  if (isHybridModeEnabled(Config) && integrationsObj && integrationsObj.sessionId) {
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

function mapWithJsonPath(message, targetObject, sourcePath, targetPath) {
  const values = jsonpath.query(message, sourcePath);
  const matchTargetPath = targetPath.split('$.events[0].')[1];
  const regexMatch = /\[([^\]\n]+)\]/;
  if (regexMatch.test(sourcePath) && regexMatch.test(matchTargetPath)) {
    // both paths are arrays
    for (let i = 0; i < values.length; i++) {
      const targetPathWithIndex = targetPath.replace(/\[\*\]/g, `[${i}]`);
      const tragetValue = values[i] ? values[i] : null;
      jsonpath.value(targetObject, targetPathWithIndex, tragetValue);
    }
  } else if (!regexMatch.test(sourcePath) && regexMatch.test(matchTargetPath)) {
    // source path is not array and target path is
    const targetPathArr = targetPath.split('.');
    const holdingArr = [];
    for (let i = 0; i < targetPathArr.length; i++) {
      if (/\[\*\]/.test(targetPathArr[i])) {
        holdingArr.push(targetPathArr[i]);
        break;
      } else {
        holdingArr.push(targetPathArr[i]);
      }
    }
    const parentTargetPath = holdingArr.join('.');
    const exisitngTargetValues = jsonpath.query(targetObject, parentTargetPath);
    if (exisitngTargetValues.length > 0) {
      for (let i = 0; i < exisitngTargetValues.length; i++) {
        const targetPathWithIndex = targetPath.replace(/\[\*\]/g, `[${i}]`);
        jsonpath.value(targetObject, targetPathWithIndex, values[0]);
      }
    } else {
      const targetPathWithIndex = targetPath.replace(/\[\*\]/g, '[0]');
      jsonpath.value(targetObject, targetPathWithIndex, values[0]);
    }
  } else if (regexMatch.test(sourcePath)) {
    // source path is an array but target path is not

    // filter out null values
    const filteredValues = values.filter((value) => value !== null);
    if (filteredValues.length > 1) {
      jsonpath.value(targetObject, targetPath, filteredValues);
    } else {
      jsonpath.value(targetObject, targetPath, filteredValues[0]);
    }
  } else {
    // both paths are not arrays
    jsonpath.value(targetObject, targetPath, values[0]);
  }
}

module.exports = {
  handleCustomMappings,
};
