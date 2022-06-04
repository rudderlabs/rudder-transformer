const { processWarehouseMessage } = require("../../../warehouse");

const postgres = "postgres";

function processSingleMessage(message, options) {
  return processWarehouseMessage(message, options);
}

function getDataTypeOverride(key, val, options, jsonKey = false) {
  if (key === "violationErrors" || jsonKey) {
    return "json";
  }
  return "string";
}

function process(event) {
  const whSchemaVersion = event.request.query.whSchemaVersion || "v1";
  const whStoreEvent = event.destination.Config.storeFullEvent === true;
  const destJsonPaths = event.destination?.Config?.jsonPaths || "";
  const provider = postgres;
  return processSingleMessage(event.message, {
    metadata: event.metadata,
    whSchemaVersion,
    whStoreEvent,
    getDataTypeOverride,
    provider,
    sourceCategory: event.metadata ? event.metadata.sourceCategory : null,
    destJsonPaths
  });
}

module.exports = {
  process,
  getDataTypeOverride
};
