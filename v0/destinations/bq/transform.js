const { processWarehouseMessage } = require("../../../warehouse");

const bigquery = "bq";

function processSingleMessage(message, options) {
  return processWarehouseMessage(message, options);
}

function getDataTypeOverride(val, options) {}

function process(event) {
  const whSchemaVersion = event.request.query.whSchemaVersion || "v1";
  const whIDResolve = event.request.query.whIDResolve === "true" || false;
  const whStoreEvent = event.destination.Config.storeFullEvent === true;
  const provider = bigquery;
  return processSingleMessage(event.message, {
    metadata: event.metadata,
    whSchemaVersion,
    whStoreEvent,
    whIDResolve,
    getDataTypeOverride,
    provider,
    sourceCategory: event.metadata ? event.metadata.sourceCategory : null
  });
}

exports.process = process;
