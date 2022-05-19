const { processWarehouseMessage } = require("../../../warehouse");

// redshift destination string limit, if the string length crosses 512 we will change data type to text which is varchar(max) in redshift
const RSStringLimit = 512;
const redshift = "rs";

function processSingleMessage(message, options) {
  return processWarehouseMessage(message, options);
}

function getDataTypeOverride(key, val, options, jsonKey = false) {
  if (jsonKey) {
    return "json";
  }

  if (options.rsAlterStringToText === "true" && val) {
    const stringifiedVal = Array.isArray(val) ? JSON.stringify(val) : val;
    if (stringifiedVal.length > RSStringLimit) {
      return "text";
    }
  }
  return "string";
}

function process(event) {
  const whSchemaVersion = event.request.query.whSchemaVersion || "v1";
  const whStoreEvent = event.destination.Config.storeFullEvent === true;
  const destJsonPaths = event.destination?.Config?.jsonPaths || "";
  const rsAlterStringToText =
    event.request.query.rsAlterStringToText || "false";
  const provider = redshift;
  return processSingleMessage(event.message, {
    metadata: event.metadata,
    whSchemaVersion,
    whStoreEvent,
    getDataTypeOverride,
    provider,
    rsAlterStringToText,
    sourceCategory: event.metadata ? event.metadata.sourceCategory : null,
    destJsonPaths
  });
}

module.exports = {
  process,
  getDataTypeOverride
};
