/* eslint-disable no-param-reassign */
const get = require('get-value');
const unset = require('unset-value');

function getDynamicConfigValue(event, value) {
  // this regex checks for pattern  "only spaces {{ path || defaultvalue }}  only spaces" .
  //  " {{message.traits.key  ||   \"email\" }} "
  //  " {{ message.traits.key || 1233 }} "
  const defFormat =
    /^\s*{{\s*(?<path>[A-Z_a-z](\w*\.[A-Z_a-z]\w*)+)+\s*\|\|\s*(?<defaultVal>.*)\s*}}\s*$/;
  const matResult = value.match(defFormat);
  if (matResult) {
    // Support "event.<obj1>.<key>" alias for "message.<obj1>.<key>"
    const fieldPath = matResult.groups.path.replace(/^event\.(.*)$/, 'message.$1');
    const pathVal = get(event, fieldPath);
    if (pathVal) {
      value = pathVal;
      unset(event, fieldPath);
    } else {
      value = matResult.groups.defaultVal.replace(/"/g, '').trim();
    }
    return value;
  }
  /** var format2 = /<some other regex>/;
  matResult = value.match(format2);
  if (matResult) {
    <more logic here>
    return value
  } */
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
