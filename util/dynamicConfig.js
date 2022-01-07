/* eslint-disable no-param-reassign */
const get = require("get-value");
const unset = require("unset-value");

function recurse(event, value, Config, field) {
  value = value.replace("{{", "");
  value = value.replace("}}", "");
  if (value.includes("||")) {
    const path = value.split("||")[0].trim();
    const getFieldVal = get(event, path);
    if (getFieldVal) {
      Config[field] = getFieldVal;
      unset(event, path);
    } else {
      Config[field] = JSON.parse(value.split("||")[1].trim()).toString();
    }
  }
}

function getDynamicConfig(event) {
  const { Config } = event.destination;
  if (Config) {
    Object.keys(Config).forEach(field => {
      const value = Config[field].toString().trim();
      if (Array.isArray(value)) {
        value.forEach(obj => {
          Object.keys(obj).forEach(key => {
            if (key.startsWith("{{") && key.endsWith("}}")) {
              recurse(event, key, Config, field);
            }
          });
        });
      } else if (value.startsWith("{{") && value.endsWith("}}")) {
        recurse(event, value, Config, field);
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
