const Message = require('../message');
const { EventType } = require('../../../constants');
const {
    INTEGRATION,
    MAPPING_CATEGORIES
} = require('./config');

const identifyLayer = {
    identifyPayloadBuilder(event) {
        const message = new Message(INTEGRATION);
        message.setEventType(EventType.IDENTIFY);
        message.setPropertiesV2(event, MAPPING_CATEGORIES[EventType.IDENTIFY]);
        if (event.updated_at) {
            // converting shopify updated_at timestamp to rudder timestamp format
            message.setTimestamp(new Date(event.updated_at).toISOString());
        }
        return message;
    }
}

module.exports = { identifyLayer }