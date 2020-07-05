const { processWarehouseMessage } = require("../../../warehouse");


const clickhouse="clickhouse"

function processSingleMessage(message, options) {
    return processWarehouseMessage(message, options);
}

function getDataTypeOverride(val, options) {

}

function getDataOverride(val, datatype) {
    if (datatype === "datetime") {
        return new Date(val).toISOString();
    }
    if (datatype === "boolean") {
        return val?1:0
    }
    return val
}

function process(event) {
    const whSchemaVersion = event.request.query.whSchemaVersion || "v1";
    const provider = clickhouse
    return processSingleMessage(event.message, { whSchemaVersion, getDataTypeOverride, getDataOverride, provider });
}

exports.process = process;
