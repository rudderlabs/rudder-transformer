const { processWarehouseMessage } = require("../../../warehouse");

function processSingleMessage(message, schemaVersion, RSAlterStringToText) {
  return processWarehouseMessage("rs", message, schemaVersion, RSAlterStringToText);
}

function process(event) {
  const schemaVersion = event.request.query.whSchemaVersion || "v1";
  let RSAlterStringToText = event.request.query.RSAlterStringToText || "false";
  return processSingleMessage(event.message, schemaVersion, RSAlterStringToText);
}

exports.process = process;
