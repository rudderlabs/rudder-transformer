const { processWarehouseMessage } = require("../util");
const { ConfigCategory, mappingConfig } = require("./config");

const whDefaultConfigJson = mappingConfig[ConfigCategory.DEFAULT.name];
const whTrackConfigJson = mappingConfig[ConfigCategory.TRACK.name];

function processSingleMessage(message, destination) {
  return processWarehouseMessage(
    message,
    whDefaultConfigJson,
    whTrackConfigJson
  );
}

function process(event) {
  return processSingleMessage(event.message, event.destination);
}

exports.process = process;
