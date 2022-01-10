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

function getDynamicConfig(event) {
  const { Config } = event.destination;
  if (Config) {
    Object.keys(Config).forEach(field => {
      // let value = Config[field].toString().trim();
      let value = Config[field];
      if (typeof value !== "string") {
        value.forEach(obj => {
          Object.keys(obj).forEach(key => {
            const val = obj[key];
            if (val.startsWith("{{") && val.endsWith("}}")) {
              setDynamicConfigValue(event, val, Config, field);
            }
          });
        });
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
