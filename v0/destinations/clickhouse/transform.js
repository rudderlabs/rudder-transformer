const { processWarehouseMessage } = require("../../../warehouse");
const { validTimestamp } = require("../../../warehouse/util");

const clickhouse = "clickhouse";

function processSingleMessage(message, options) {
  return processWarehouseMessage(message, options);
}

function getDataTypeOverride(val, options) {
  // TODO: make sure all values are of same type
  // check for [] empty arrays
  if (Array.isArray(val)) {
    // for now returning it as string. confirm this case
    if (val.length === 0) {
      return "string";
    }
    // check for different data types in the array. if there are different then return string
    if (val.length > 1) {
      if (typeof val[0] !== typeof val[1]) {
        return "string";
      }
    }
    if (typeof val[0] === "number") {
      return Number.isInteger(val[0]) ? "array(int)" : "array(float)";
    }
    if (typeof val[0] === "boolean") {
      return "array(boolean)";
    }
    if (validTimestamp(val[0])) {
      return "array(datetime)";
    }
    return "array(string)";
  }
  return "string";
}

function process(event) {
  const whSchemaVersion = event.request.query.whSchemaVersion || "v1";
  const whStoreEvent = event.destination.Config.storeFullEvent === true;
  const provider = clickhouse;
  return processSingleMessage(event.message, {
    whSchemaVersion,
    whStoreEvent,
    getDataTypeOverride,
    provider
  });
}

exports.process = process;
