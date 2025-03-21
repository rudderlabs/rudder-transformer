/* eslint-disable no-param-reassign */
const get = require('get-value');
const unset = require('unset-value');

function getDynamicConfigValue(event, value) {
  // Check if the value contains the "{{ }}" pattern
  value = value.trim();
  if (value.startsWith(`{{`) && value.endsWith(`}}`)) {
    // Remove the surrounding "{{ }}" and trim spaces
    const innerContent = value.slice(2, -2).trim();

    // Split the content by "||" to separate path and default value
    const parts = innerContent.split('||').map((part) => part.trim());

    // Ensure there are exactly two parts: path and default value
    if (parts.length === 2) {
      const [path, defaultVal] = parts;

      // Replace "event.<obj1>.<key>" with "message.<obj1>.<key>"
      const fieldPath = path.startsWith('event.') ? path.replace(/^event\./, 'message.') : path;

      // Retrieve the value from the event object
      const pathVal = get(event, fieldPath);

      // Use the path value if available, otherwise use the default value
      if (pathVal) {
        unset(event, fieldPath); // Remove the used path from the event object
        return pathVal;
      }
      return defaultVal.replace(/"/g, '').trim(); // Clean up and use default value
    }
  }

  // Return the value unchanged if no "{{ }}" pattern or invalid format
  return value;
}

// eslint-disable-next-line consistent-return
function configureVal(value, event) {
  if (value) {
    if (Array.isArray(value)) {
      value.forEach((key, index) => {
        value[index] = configureVal(key, event);
      });
    } else if (typeof value === 'object') {
      Object.keys(value).forEach((obj) => {
        value[obj] = configureVal(value[obj], event);
      });
    } else if (typeof value === 'string') {
      value = getDynamicConfigValue(event, value);
    }
  }
  return value;
}

function getDynamicConfig(event) {
  const { Config } = event.destination;
  event.destination.Config = configureVal(Config, event);
  return event;
}

function processDynamicConfig(events, type) {
  if (type === 'router' || type === 'batch') {
    const eventRetArr = [];
    events.forEach((e) => {
      const newEvent = getDynamicConfig(e);
      eventRetArr.push(newEvent);
    });
    return eventRetArr;
  }
  return getDynamicConfig(events);
}

exports.processDynamicConfig = processDynamicConfig;
