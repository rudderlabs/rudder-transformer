const { processWarehouseMessage } = require("../../../warehouse");

function processSingleMessage(message, schemaVersion) {
  return processWarehouseMessage("rs", message, schemaVersion);
}

function process(event) {
  const schemaVersion = event.request.query.whSchemaVersion || "v1";
  return processSingleMessage(event.message, schemaVersion);
}

exports.process = process;
