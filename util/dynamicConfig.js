/* eslint-disable no-param-reassign */
const get = require("get-value");
const unset = require("unset-value");

function isValidPattern(val) {
  // this rgegex checks for pattern  "only spaces {{ path || defaultvalue }}  only spaces" .
  //  " {{message.traits.key  ||   \"email\" }} "
  //  " {{ message.traits.key || 1233 }} "
  const re = /^\s*\{\{\s*(?<path>[a-zA-Z_]([a-zA-Z0-9_]*\.[a-zA-Z_][a-zA-Z0-9_]*)+)+\s*\|\|\s*"?(?<defaultValue>.*)"?\s*\}\}\s*$/;
  return re.test(String(val));
}

function getDynamicConfigValue(event, value) {
  value = value.replace("{{", "").replace("}}", "");
  if (value.includes("||")) {
    const path = value.split("||")[0].trim();
    const fieldVal = get(event, path);
    if (fieldVal) {
      value = fieldVal;
      unset(event, path);
    } else {
      value = JSON.parse(value.split("||")[1].trim());
    }
  }
  return value;
}

// eslint-disable-next-line consistent-return
function configureVal(value, event) {
  if (value) {
    if (Array.isArray(value)) {
      value.forEach((key, index) => {
        value[index] = configureVal(key, event);
      });
    } else if (typeof value === "object") {
      Object.keys(value).forEach(obj => {
        value[obj] = configureVal(value[obj], event);
      });
    } else if (
      typeof value !== "function" &&
      typeof value !== "symbol" &&
      typeof value !== "boolean"
    ) {
      const val = value.toString().trim();
      if (isValidPattern(val)) {
        value = getDynamicConfigValue(event, val);
      }
    }
    return value;
  }
  return value;
}

function getDynamicConfig(event) {
  const { Config } = event.destination;
  event.destination.Config = configureVal(Config, event);
  return event;
}

function processDynamicConfig(event, type) {
  if (type === "router" || type === "batch") {
    const eventRetArr = [];
    event.forEach(e => {
      const newEvent = getDynamicConfig(e);
      eventRetArr.push(newEvent);
    });
    return eventRetArr;
  }
  return getDynamicConfig(event);
}

exports.processDynamicConfig = processDynamicConfig;
