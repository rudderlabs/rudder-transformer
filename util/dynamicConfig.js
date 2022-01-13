/* eslint-disable no-param-reassign */
const get = require("get-value");
const unset = require("unset-value");

function setDynamicConfigValue(event, value, config, field) {
  value = value.replace("{{", "").replace("}}", "");
  if (value.includes("||")) {
    const path = value.split("||")[0].trim();
    const getFieldVal = get(event, path);
    if (getFieldVal) {
      config[field] = getFieldVal;
      unset(event, path);
    } else {
      config[field] = JSON.parse(value.split("||")[1].trim()).toString();
    }
  }
}

function configureVal(value, event) {
  if (Array.isArray(value)) {
    value.forEach(key => {
      configureVal(key, event);
    });
  } else if (typeof value === "object") {
    Object.keys(value).forEach(obj => {
      // first checking whether the value is array/object -> in that case we recurse and send that object/array as value
      if (typeof value[obj] === "object") {
        configureVal(value[obj], event);
      } // if we encounter string (actual values), then we start configuring it
      else if (typeof value[obj] === "string") {
        const val = value[obj];
        if (val && val.startsWith("{{") && val.endsWith("}}")) {
          setDynamicConfigValue(event, val, value, obj);
        }
      }
    });
  }
}

function getDynamicConfig(event) {
  const { Config } = event.destination;
  if (Config) {
    Object.keys(Config).forEach(field => {
      let value = Config[field];
      if (Array.isArray(value)) {
        value.forEach(obj => {
          configureVal(obj, event);
        });
      } else if (typeof value === "object") {
        configureVal(value, event);
      } else {
        value = value.toString().trim();
        if (value.startsWith("{{") && value.endsWith("}}")) {
          setDynamicConfigValue(event, value, Config, field);
        }
      }
    });
  }
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
