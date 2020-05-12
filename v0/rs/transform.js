const { processWarehouseMessage } = require("../util");

function processSingleMessage(message) {
  return processWarehouseMessage("rs", message);
}

function process(event) {
  return processSingleMessage(event.message);
}

exports.process = process;
