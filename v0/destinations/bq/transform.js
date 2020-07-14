const { processWarehouseMessage } = require("../../../warehouse");

const bigquery = "bq"

function processSingleMessage(message, options) {
  return processWarehouseMessage(message, options);
}

function getDataTypeOverride(val, options) {

}

function process(event) {
  const whSchemaVersion = event.request.query.whSchemaVersion || "v1";
  const provider = bigquery
  return processSingleMessage(event.message, { whSchemaVersion, getDataTypeOverride, provider });
}

exports.process = process;
