const get = require("get-value");
const moment = require("moment");
const {
  toSnakeCase,
  toSafeDBString,
  validTimestamp,
  isObject
} = require("../util");
const { ConfigCategory, mappingConfig } = require("./config");

const whDefaultConfigJson = mappingConfig[ConfigCategory.DEFAULT.name];
const whTrackConfigJson = mappingConfig[ConfigCategory.TRACK.name];

function dataType(val) {
  // TODO: find a better way to check for valid datetime
  // const datetimeRegex = /[0-9]{4}\-(?:0[1-9]|1[0-2])\-(?:0[1-9]|[1-2][0-9]|3[0-1])\s+(?:2[0-3]|[0-1][0-9]):[0-5][0-9]:[0-5][0-9]/;

  if (
    validTimestamp(val) ||
    moment(val, "YYYY-MM-DD hh:mm:ss z", true).isValid()
  ) {
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

function setFromConfig(output, input, configJson) {
  Object.keys(configJson).forEach(key => {
    let val = get(input, key);
    if (val !== undefined) {
      if (dataType(val) === "datetime") {
        val = moment(val)
          .utc()
          .format("YYYY-MM-DD hh:mm:ss z");
      }
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
      let val = input[key];
      if (dataType(val) === "datetime") {
        val = moment(val)
          .utc()
          .format("YYYY-MM-DD hh:mm:ss z");
      }
      output[toSafeDBString(prefix + key)] = input[key];
    }
  });
}

function getColumns(obj) {
  const columns = {};
  Object.keys(obj).forEach(key => {
    columns[toSafeDBString(key)] = dataType(obj[key]);
  });
  return columns;
}

function processSingleMessage(message, destination) {
  var responses = [];
  const result = {};
  setFromConfig(result, message, whDefaultConfigJson);
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
      table: toSafeDBString(trackEvent.event),
      columns: getColumns(trackEvent)
    };
    responses.push(trackEvent);
  }
  return responses;
}

function process(events) {
  return events
    .map(event => {
      console.log(event.message);
      return processSingleMessage(event.message, event.destination);
    })
    .flat();
}

exports.process = process;
