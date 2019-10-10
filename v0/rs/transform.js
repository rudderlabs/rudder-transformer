const get = require("get-value");
const { toSnakeCase, isObject } = require("../util");
const { ConfigCategory, mappingConfig } = require("./config");

const whDefaultConfigJson = mappingConfig[ConfigCategory.DEFAULT.name];
const whTrackConfigJson = mappingConfig[ConfigCategory.TRACK.name];

function setFromConfig(output, input, configJson) {
  Object.keys(configJson).forEach(key => {
    const val = get(input, key);
    if (val !== undefined) {
      output[configJson[key]] = val;
    }
  });
}

function setFromProperties(output, input, prefix = "") {
  if (!input) return;
  Object.keys(input).forEach(key => {
    if (isObject(input[key])) {
      setFromProperties(output, input[key], `${key}_`);
    } else {
      output[prefix + key] = input[key];
    }
  });
}

function dataType(val) {
  // TODO: find a better way to check for valid datetime
  const datetimeRegex = /[0-9]{4}\-(?:0[1-9]|1[0-2])\-(?:0[1-9]|[1-2][0-9]|3[0-1])\s+(?:2[0-3]|[0-1][0-9]):[0-5][0-9]:[0-5][0-9]/;

  if (datetimeRegex.test(val)) {
    return "datetime";
  }

  const type = typeof val;
  switch (type) {
    case "string":
    case "boolean":
      if (Number.isNaN(Number(val))) {
        return type;
      }
      return Number.isInteger(val) ? "int" : "float";
    case "number":
      return Number.isInteger(val) ? "int" : "float";
    default:
      return "string";
  }
}

function getColumns(obj) {
  const columns = {};
  Object.keys(obj).forEach(key => {
    columns[key] = dataType(obj[key]);
  });
  return columns;
}

function processSingleMessage(message, destination) {
  var responses = [];
  const result = {};
  setFromConfig(result, message, whDefaultConfigJson);
  // TODO: Remove this after received_at is set in sdk's
  result.received_at = new Date().toISOString();
  if (message.type.toLowerCase() == "track") {
    setFromConfig(result, message, whTrackConfigJson);
    result.event = toSnakeCase(result.event_text);

    const trackEvent = { ...result };
    setFromProperties(trackEvent, message.properties);

    result.metadata = {
      table: "tracks",
      columns: getColumns(result)
    };
    responses.push(result);

    trackEvent.metadata = {
      table: trackEvent.event,
      columns: getColumns(trackEvent)
    };
    responses.push(trackEvent);
  }
  return [responses];
}

function process(events) {
  return events
    .map(event => {
      return processSingleMessage(event.message, event.destination);
    })
    .flat();
}

exports.process = process;
