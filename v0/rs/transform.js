const { processWarehouseMessage } = require("../util");

function processSingleMessage(message, destination) {
  return processWarehouseMessage("rs", message);
}

function process(event) {
  return processSingleMessage(event.message, event.destination);
}

exports.process = process;
