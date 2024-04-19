var jsonpath = require('jsonpath');
const { validateEventName } = require('./utils');
const { get, InstrumentationError } = require('@rudderstack/integrations-lib');

const findGA4Event = (eventsMapping, event) => {
  // Find the event using destructuring and early return
  const { ga4EventName, eventProperties } = eventsMapping.find(
    (mapping) =>
      mapping.rsEventName?.trim().toLowerCase() === event.trim().toLowerCase() &&
      mapping.ga4EventName,
  );

  // Return an empty object if event not found
  return { eventName: ga4EventName, eventProperties } || {};
};

const handleCustomMappings = (message, Config) => {
  const { eventsMapping } = Config;

  let rsEvent = get(message, 'event');
  if (!rsEvent) {
    throw new InstrumentationError('event name is required for track call');
  }

  const ga4Event = findGA4Event(eventsMapping, rsEvent);

  const eventName = ga4Event.eventName;
  const eventPropertiesMappings = ga4Event.eventProperties || {};

  validateEventName(eventName); // validation for ga4 event name
  const ga4Payload = {};

  for (let propertyMapping of eventPropertiesMappings) {
    mapWithJsonPath(message, ga4Payload, propertyMapping.from, propertyMapping.to);
  }

  return ga4Payload;
};

function mapWithJsonPath(message, targetObject, sourcePath, targetPath) {
  const values = jsonpath.query(message, sourcePath);
  if (/\[\*\]/.test(sourcePath) && /\[\*\]/.test(targetPath)) {
    // both paths are arrays

    for (let i = 0; i < values.length; i++) {
      const targetPathWithIndex = targetPath.replace(/\[\*\]/g, `[${i}]`);
      jsonpath.value(targetObject, targetPathWithIndex, values[i]);
    }
  } else if (!/\[\*\]/.test(sourcePath) && /\[\*\]/.test(targetPath)) {
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
  } else if (/\[\*\]/.test(sourcePath)) {
    // source path is an array but target path is not
    jsonpath.value(targetObject, targetPath, values);
  } else {
    // both paths are not arrays
    jsonpath.value(targetObject, targetPath, values[0]);
  }
}

module.exports = {
  handleCustomMappings,
};
