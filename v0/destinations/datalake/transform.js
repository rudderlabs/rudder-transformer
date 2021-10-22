const { processWarehouseMessage } = require("../../../warehouse");

// use postgres providers for datalake
const datalakeProvider = "datalake";

function processSingleMessage(message, options) {
    return processWarehouseMessage(message, options);
}

function getDataTypeOverride(val, options) { }

function process(event) {
    const whSchemaVersion = event.request.query.whSchemaVersion || "v1";
    const whStoreEvent = event.destination.Config.storeFullEvent === true;
    const provider = datalakeProvider;
    return processSingleMessage(event.message, {
        metadata: event.metadata,
        whSchemaVersion,
        whStoreEvent,
        getDataTypeOverride,
        provider,
        sourceCategory: event.metadata ? event.metadata.sourceCategory : null
    });
}

exports.process = process;
