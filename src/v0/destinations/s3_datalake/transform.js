const { processWarehouseMessage } = require('../../../warehouse');

// use postgres providers for s3-datalake
const s3datalakeProvider = 's3_datalake';

function processSingleMessage(message, options) {
  return processWarehouseMessage(message, options);
}

function getDataTypeOverride() {}

function process(event) {
  const whSchemaVersion = event.request.query.whSchemaVersion || 'v1';
  const whStoreEvent = event.destination.Config.storeFullEvent === true;
  const provider = s3datalakeProvider;
  return processSingleMessage(event.message, {
    metadata: event.metadata,
    whSchemaVersion,
    whStoreEvent,
    getDataTypeOverride,
    provider,
    sourceCategory: event.metadata ? event.metadata.sourceCategory : null,
  });
}

module.exports = {
  process,
  getDataTypeOverride,
};
