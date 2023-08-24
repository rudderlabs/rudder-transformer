const path = require('path');
const fs = require('fs');
const { RUDDER_ECOM_MAP, MAPPING_CATEGORIES, EventType } = require('./config');

const enrichPayload = {
    setExtraNonEcomProperties(message, event, shopifyTopic) {
        const updatedMessage = message;
        const fieldsToBeIgnored = Object.keys(JSON.parse(fs.readFileSync(path.resolve(__dirname, 'data', RUDDER_ECOM_MAP[shopifyTopic].mapping))));
        Object.keys(event).forEach((key => {
            if (!fieldsToBeIgnored.includes(key)) {
                updatedMessage.properties[`${key}`] = event[key];
            }
        }))
        return updatedMessage;
    },
    enrichTrackPayloads(event, payload) {
        // Map Customer details if present customer,ship_Add,bill,userId
        if (event.customer) {
            payload.setPropertiesV2(event.customer, MAPPING_CATEGORIES[EventType.IDENTIFY]);
        }
        if (event.shipping_address) {
            payload.setProperty('traits.shippingAddress', event.shipping_address);
        }
        if (event.billing_address) {
            payload.setProperty('traits.billingAddress', event.billing_address);
        }
        if (!payload.userId && event.user_id) {
            payload.setProperty('userId', event.user_id);
        }
        return payload;
    }
}
module.exports = { enrichPayload };