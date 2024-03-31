const { processWarehouseMessage } = require('../../../warehouse');
const { getDataType } = require('../../../warehouse/index');

const provider = 'clickhouse';

function getDataTypeOverride(key, val, options) {
  if (options.chEnableArraySupport === 'false') {
    return 'string';
  }
  if (!Array.isArray(val) || val.length === 0) {
    return 'string';
  }

  // check for different data types in the array. if there are different -> return array(string)
  let finalDataType = getDataType(key, val[0], {});
  for (let i = 1; i < val.length; i += 1) {
    const dataType = getDataType(key, val[i], {});
    if (finalDataType !== dataType) {
      if (finalDataType === 'string') {
        break;
      }
      if (dataType === 'float' && finalDataType === 'int') {
        finalDataType = 'float';
        // eslint-disable-next-line no-continue
        continue;
      }
      if (dataType === 'int' && finalDataType === 'float') {
        // eslint-disable-next-line no-continue
        continue;
      }
      finalDataType = 'string';
    }
  }
  return `array(${finalDataType})`;
}

function process(event) {
  const whSchemaVersion = event.request.query.whSchemaVersion || 'v1';
  const whStoreEvent = event.destination.Config.storeFullEvent === true;
  const chEnableArraySupport = event.request.query.chEnableArraySupport || 'false';
  return processWarehouseMessage(event.message, {
    metadata: event.metadata,
    whSchemaVersion,
    whStoreEvent,
    getDataTypeOverride,
    provider,
    chEnableArraySupport,
    sourceCategory: event.metadata ? event.metadata.sourceCategory : null,
    destConfig: event.destination?.Config,
  });
}

module.exports = {
  provider,
  process,
  getDataTypeOverride,
};
