const { processWarehouseMessage } = require('../../../warehouse');

const provider = 'postgres';

function getDataTypeOverride(key, val, options, jsonKey = false) {
  if (key === 'violationErrors' || jsonKey) {
    return 'json';
  }
  return 'string';
}

function process(event) {
  const whSchemaVersion = event.request.query.whSchemaVersion || 'v1';
  const whStoreEvent = event.destination.Config.storeFullEvent === true;
  const destJsonPaths = event.destination?.Config?.jsonPaths || '';
  return processWarehouseMessage(event.message, {
    metadata: event.metadata,
    whSchemaVersion,
    whStoreEvent,
    getDataTypeOverride,
    provider,
    sourceCategory: event.metadata ? event.metadata.sourceCategory : null,
    destJsonPaths,
    destConfig: event.destination?.Config,
  });
}

module.exports = {
  provider,
  process,
  getDataTypeOverride,
};
