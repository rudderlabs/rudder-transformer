const { processWarehouseMessage } = require('../../../warehouse');

// redshift destination string limit, if the string length crosses 512 we will change data type to text which is varchar(max) in redshift
const RSStringLimit = 512;
const provider = 'rs';

function getDataTypeOverride(key, val, options, jsonKey = false) {
  if (jsonKey) {
    return 'json';
  }

  if (val) {
    const stringifiedVal = Array.isArray(val) ? JSON.stringify(val) : val;
    if (stringifiedVal.length > RSStringLimit) {
      return 'text';
    }
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
