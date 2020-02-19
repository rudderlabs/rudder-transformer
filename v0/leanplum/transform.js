const { EventType } = require("../../constants");
const {ConfigCategory, mappingConfig, ENDPOINT} = require("./config");

function responseBuilderSimple(message, category, destination) {
    mappingJson = mappingConfig[category.name];
    const rawpayload = {};
    
    return [];
}

function processSingleMessage(message, destination) {
    let messageType = message.type.toLowerCase();
    let category;

    switch(messageType)
    {
        case EventType.PAGE:
            category = ConfigCategory.PAGE;
            break;
        default:
            throw new Error("Message type not supported");
    }
    
    return responseBuilderSimple(
        message,
        category,
        destination
    );
}

function process(event) {
    const resp = processSingleMessage(event.message, event.destination);
    return resp;
}

exports.process = process;