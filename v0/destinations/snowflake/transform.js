const { processWarehouseMessage } = require("../../../warehouse");

const snowflake = "snowflake"

function processSingleMessage(message, options) {
  return processWarehouseMessage(message, options);
}

function getDataTypeOverride(val, options) {

}

function getDataOverride(val, datatype) {
  if (datatype === "datetime") {
    return new Date(val).toISOString();
  }
  return val
}

function process(event) {
  const whSchemaVersion = event.request.query.whSchemaVersion || "v1";
  const provider = snowflake
  return processSingleMessage(event.message, {whSchemaVersion, getDataTypeOverride, getDataOverride, provider});
}

exports.process = process;
