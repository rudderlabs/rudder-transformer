const { processWarehouseMessage } = require('../../../warehouse');

const provider = 'bq';

function getDataTypeOverride() {}

function process(event) {
  const whSchemaVersion = event.request.query.whSchemaVersion || 'v1';
  const whIDResolve = event.request.query.whIDResolve === 'true' || false;
  const whStoreEvent = event.destination.Config.storeFullEvent === true;
  const destJsonPaths = event.destination?.Config?.jsonPaths || '';
  return processWarehouseMessage(event.message, {
    metadata: event.metadata,
    whSchemaVersion,
    whStoreEvent,
    whIDResolve,
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
