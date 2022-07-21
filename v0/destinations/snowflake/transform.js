const { processWarehouseMessage } = require("../../../warehouse");

const snowflake = "snowflake";

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
  const whIDResolve = event.request.query.whIDResolve === "true" || false;
  const whStoreEvent = event.destination.Config.storeFullEvent === true;
  const destJsonPaths = event.destination?.Config?.jsonPaths || "";
  const provider = snowflake;
  return processSingleMessage(event.message, {
    metadata: event.metadata,
    whSchemaVersion,
    whStoreEvent,
    whIDResolve,
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
