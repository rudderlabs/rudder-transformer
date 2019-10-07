// Library references
const jsonQ = require("jsonq");
const fs = require("fs");
const get = require('get-value');

var defaultConfigFile = fs.readFileSync("data/WarehouseDefaultConfig.json");
var defaultConfigJson = JSON.parse(defaultConfigFile);

var trackConfigFile = fs.readFileSync("data/WarehouseTrackConfig.json");
var trackConfigJson = JSON.parse(trackConfigFile);

function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

function toSnakeCase(str) {

  if (!str) return '';

  return String(str)
    .replace(/^[^A-Za-z0-9]*|[^A-Za-z0-9]*$/g, '')
    .replace(/([a-z])([A-Z])/g, (m, a, b) => a + '_' + b.toLowerCase())
    .replace(/[^A-Za-z0-9]+|_+/g, '_')
    .toLowerCase();

}


function setFromConfig(output, input, configJson) {
  for (const key in configJson) {
    let val = get(input, key)
    if (val !== undefined) {
      output[configJson[key]] = val
    }
  }
}

function setFromProperties(output, input, prefix = "") {
  if (!input) return;
  for (const key in input) {
    if (isObject(input[key])) {
      setFromProperties(output, input[key], `${key}_`)
    } else {
      output[prefix + key] = input[key]
    }
  }
}

function dataType(val) {
  // TODO: find a better way to check for valid datetime
  const datetimeRegex = /[0-9]{4}\-(?:0[1-9]|1[0-2])\-(?:0[1-9]|[1-2][0-9]|3[0-1])\s+(?:2[0-3]|[0-1][0-9]):[0-5][0-9]:[0-5][0-9]/

  if (datetimeRegex.test(val)) {
    return 'datetime'
  } else {
    let type = typeof val
    switch (type) {
      case "string":
      case "boolean":
        if (isNaN(val)) {
          return type
        } else {
          return Number.isInteger(val) ? "int" : "float";
        }
      case "number":
        return Number.isInteger(val) ? "int" : "float";
      default:
        return "string"
    }
  }
}

function getColumns(obj) {
  let columns = {};
  for (const key in obj) {
    columns[key] = dataType(obj[key])
  }
  return columns
}

// Iterate over input batch and generate response for each message
function process(jsonQObj) {
  let respList = [];
  jsonQObj.find("rl_message").each((index, path, payload) => {
    let result = {};
    result.received_at = new Date().toISOString().replace("T", " ");
    setFromConfig(result, payload, defaultConfigJson);
    if (payload.rl_type == "track") {
      setFromConfig(result, payload, trackConfigJson);
      result.event = toSnakeCase(result.event_text);

      restult
      
      trackEvent = Object.assign({}, result)
      setFromProperties(trackEvent, payload.rl_properties);
      

      result.metadata = {
        table: 'tracks',
        columns: getColumns(result)
      }
      respList.push(result);
      
      trackEvent.metadata = {
        table: trackEvent.event,
        columns: getColumns(trackEvent)
      }
      respList.push(trackEvent);
    }
  });
  return [JSON.stringify(respList)];
}

exports.process = process;
