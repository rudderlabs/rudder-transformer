/* eslint-disable prettier/prettier */
const path = require("path");
const fs = require("fs");
const get = require("get-value");
const set = require("set-value");
const { getValueFromMessage } = require("../../util/index")
// const { setPropertiesV2 } = require(v0/sources/message.js)

const productMappingJson = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "./productMapping.json"), "utf-8")
);

function setPropertiesV2(event, mappingJson) {
    const product = {};
    mappingJson.forEach(mapping => {
        const { sourceKeys } = mapping;
        let { destKeys } = mapping;
        const setVal = getValueFromMessage(event, sourceKeys);
        if (!Array.isArray(destKeys)) {
            destKeys = [destKeys];
        }
        destKeys.forEach(destKey => {
            const existingVal = get(product, destKey);
            // do not set if val setVal nil
            // give higher pref to first key in mapping.json in case of same value
            if (
                setVal !== null &&
                setVal !== undefined &&
                (existingVal === null || existingVal === undefined)
            ) {
                set(product, destKey, setVal);
            }
        });
    });
    return product;
}

function mapProductsFromLineitems(line_items) {
    const products = [];
    // const shopify_context_products = []; //leaving extra properties for later implementation
    line_items.forEach(lineitem => {

        const product = setPropertiesV2(lineitem, productMappingJson);
        // Object.entries(productMappingJson)
        // product[`${destKeys}`] = get(lineitem, `${sourceKeys}`)
        products.push(product)
    });
    return products;
}
// function mapProductsFromLineitems(line_items) {
//     let products = [];
//     // const shopify_context_products = []; //leaving extra properties for later implementation
//     line_items.forEach(lineitem => {
//         products = Object.entries(productMappingJson)
//         // const product = {};
//         product[`${destKeys}`] = get(lineitem, `${sourceKeys}`)
//         products.push(product)
//     });
//     return products;
// }


module.exports = { mapProductsFromLineitems }