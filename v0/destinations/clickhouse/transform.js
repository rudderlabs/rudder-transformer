const { processWarehouseMessage } = require("../../../warehouse");
const { getDataType } = require("../../../warehouse/index");

const clickhouse = "clickhouse";

function processSingleMessage(message, options) {
  return processWarehouseMessage(message, options);
}

function getDataTypeOverride(key, val, options) {
  if (options.chEnableArraySupport === "false") {
    return "string";
  }
  if (Array.isArray(val)) {
    // for now returning it as string. confirm this case
    if (val.length === 0) {
      return "string";
    }
    // check for different data types in the array. if there are different then return array(string)
    const firstValueDataType = getDataType(key, val[0], {});
    let finalDataType = firstValueDataType;
    for (let i = 1; i < val.length; i += 1) {
      const dataType = getDataType(key, val[i], {});
      if (finalDataType !== dataType) {
        if (finalDataType === "string") {
          break;
        }
        if (dataType === "float" && finalDataType === "int") {
          finalDataType = "float";
          // eslint-disable-next-line no-continue
          continue;
        }
        if (dataType === "int" && finalDataType === "float") {
          // eslint-disable-next-line no-continue
          continue;
        }
        finalDataType = "string";
      }
    }
    return `array(${finalDataType})`;
  }
  return "string";
}

function process(event) {
  const whSchemaVersion = event.request.query.whSchemaVersion || "v1";
  const whStoreEvent = event.destination.Config.storeFullEvent === true;
  const provider = clickhouse;
  const chEnableArraySupport =
    event.request.query.chEnableArraySupport || "false";
  return processSingleMessage(event.message, {
    metadata: event.metadata,
    whSchemaVersion,
    whStoreEvent,
    getDataTypeOverride,
    provider,
    chEnableArraySupport,
    sourceCategory: event.metadata ? event.metadata.sourceCategory : null
  });
}

module.exports = {
  process,
  getDataTypeOverride
};
