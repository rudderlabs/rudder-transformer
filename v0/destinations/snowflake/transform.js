const { processWarehouseMessage } = require("../util");

function processSingleMessage(message, destination, schemaVersion) {
  return processWarehouseMessage("snowflake", message, schemaVersion);
}

function process(event) {
  const schemaVersion = event.request.query.whSchemaVersion;
  return processSingleMessage(event.message, event.destination, schemaVersion);
}

exports.process = process;
