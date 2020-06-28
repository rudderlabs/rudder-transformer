const { processWarehouseMessage } = require("../../../warehouse");

// redshift destination string limit, if the string length crosses 512 we will change data type to text which is varchar(max) in redshift
const RSStringLimit = 512;
const redshift = "rs"

function processSingleMessage(message, options) {
  return processWarehouseMessage(message, options);
}

function getDataTypeOverride(val, options) {
  if (options.rsAlterStringToText === "true") {
    if (val && val.length > RSStringLimit) {
      return "text"
    }
  }
  return "string"
}

function process(event) {
  const whSchemaVersion = event.request.query.whSchemaVersion || "v1";
  const rsAlterStringToText = event.request.query.rsAlterStringToText || "false";
  const provider = redshift
  return processSingleMessage(event.message, { whSchemaVersion, getDataTypeOverride, provider, rsAlterStringToText });
}

exports.process = process;
