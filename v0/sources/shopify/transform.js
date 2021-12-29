/* eslint-disable prettier/prettier */
const path = require("path");
const fs = require("fs");
const Message = require("../message");
const { mapProductsFromLineitems } = require("./util");

// const {
//     removeUndefinedAndNullValues,
//     extractCustomFields
// } = require("../../util");

const mappingJson = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "./mapping.json"), "utf-8")
);

function guidGenerator() {
    const S4 = () =>
        // eslint-disable-next-line no-bitwise
        (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    return `${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`;
}
// event: Shopify
// message: Rudder

function processEvent(event) {
    // console.log("==In processEvent==");
    const message = new Message(`SHOPIFY`);
    message.setEventType("track");

    switch (event.shopifyType) {
        case "cart_create":
            message.setEventName(event.shopifyType);
            message.setPropertiesV2(event, mappingJson);
            break;
        default:

    }
    // message.setPropertiesV2(products, productMappingJson);

    // message.products = products
    const products = mapProductsFromLineitems(event.line_items);
    message.anonymousId = guidGenerator();
    message.products = products;
    return message;
}

function process(event) {
    const response = processEvent(event);
    // console.log(event)
    return response;
}

exports.process = process;
