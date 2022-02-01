const { processWarehouseMessage } = require("../../../warehouse");

const azureSynapse = "azure_synapse";

function processSingleMessage(message, options) {
  return processWarehouseMessage(message, options);
}

function getDataTypeOverride(key, val, options) {}

function process(event) {
  const whSchemaVersion = event.request.query.whSchemaVersion || "v1";
  const whStoreEvent = event.destination.Config.storeFullEvent === true;
  const provider = azureSynapse;
  return processSingleMessage(event.message, {
    metadata: event.metadata,
    whSchemaVersion,
    whStoreEvent,
    getDataTypeOverride,
    provider,
    sourceCategory: event.metadata ? event.metadata.sourceCategory : null
  });
}

module.exports = {
  process,
  getDataTypeOverride
};
