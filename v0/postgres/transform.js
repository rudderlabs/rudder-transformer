const { processWarehouseMessage } = require("../util");

function processSingleMessage(message, destination) {
    const modifiedMessage = Object.fromEntries( // converting object keys to lower case.
        Object.entries(message).map(([k, v]) => [k.toLowerCase(), v])
    );
    return processWarehouseMessage("postgres", modifiedMessage);
}

function process(event) {
    return processSingleMessage(event.message, event.destination);
}

exports.process = process;
