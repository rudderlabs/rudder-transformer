const { processWarehouseMessage } = require("../../../warehouse");
const clickhouse="clickhouse"

function processSingleMessage(message, options) {
    return processWarehouseMessage(message, options);
}

function getDataTypeOverride(val, options) {

}

function process(event) {
    const whSchemaVersion = event.request.query.whSchemaVersion || "v1";
    const provider = clickhouse
    return processSingleMessage(event.message, { whSchemaVersion, getDataTypeOverride, provider });
}

exports.process = process;
