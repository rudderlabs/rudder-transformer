const { processWarehouseMessage } = require("../../../warehouse");
const { validTimestamp } = require("../../../warehouse/util");

const clickhouse = "clickhouse";

function processSingleMessage(message, options) {
  return processWarehouseMessage(message, options);
}

function getDataType(val) {
  if (typeof val === "number") {
    return Number.isInteger(val) ? "int" : "float";
  }
  if (typeof val === "boolean") {
    return "boolean";
  }
  if (validTimestamp(val)) {
    return "datetime";
  }
  return "string";
}
function getDataTypeOverride(val, options) {
  // TODO: make sure all values are of same type
  // check for [] empty arrays
  if (Array.isArray(val)) {
    // for now returning it as string. confirm this case
    if (val.length === 0) {
      return "string";
    }
    // check for different data types in the array. if there are different then return array(string)
    const firstValueDataType = getDataType(val[0]);
    let finalDataType = firstValueDataType;
    for (let i = 1; i < val.length; i += 1) {
      const dataType = getDataType(val[i]);
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
          finalDataType = "float";
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
  return processSingleMessage(event.message, {
    whSchemaVersion,
    whStoreEvent,
    getDataTypeOverride,
    provider
  });
}

exports.process = process;
