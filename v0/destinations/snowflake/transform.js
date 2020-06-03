const { processWarehouseMessage } = require("../../../warehouse");

function processSingleMessage(message, schemaVersion) {
  return processWarehouseMessage("snowflake", message, schemaVersion);
}

function process(event) {
  const schemaVersion = event.request.query.whSchemaVersion;
  return processSingleMessage(event.message, schemaVersion);
}

exports.process = process;
