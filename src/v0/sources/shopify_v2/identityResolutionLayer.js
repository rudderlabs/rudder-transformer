const { v5 } = require('uuid');
const get = require('get-value');
const { EventType } = require('../../../constants');
const {
    SHOPIFY_ADMIN_ONLY_EVENTS,
    useRedisDatabase,
    INTEGERATION
} = require('./config');
const { getCartToken, getDataFromRedis, extractEmailFromPayload } = require('./commonUtils');
const { generateUUID, isDefinedAndNotNull } = require('../../util');


const idResolutionLayer = {
    /**
     * This function checks and returns rudderId from message if present
     * returns null if not present or found
     * @param {*} message
     */
    getRudderIdFromNoteAtrributes(noteAttributes, field) {
        const rudderIdObj = noteAttributes.find((obj) => obj.name === field);
        if (isDefinedAndNotNull(rudderIdObj)) {
            return rudderIdObj.value;
        }
        return null;
    },

    /**
     * This function retrieves anonymousId and sessionId in folowing steps:
     * 1. Checks for `rudderAnonymousId`and `rudderSessionId in `note_atrributes`
     * 2. if redis is enabled checks in redis
     * 3. This means we don't have `anonymousId` and hence events CAN NOT be stitched and we check for cartToken
     *    a. if cartToken is available we return its hash value
     *    b. else we check if the event is an SHOPIFY_ADMIN_ONLY_EVENT
     *       -> if true we return `null`;
     *       -> else we don't have any identifer (very edge case) we return `random anonymousId`
     *    No Random SessionId is generated as its not a required field
     * @param {*} message 
     * @param {*} metricMetadata 
     * @returns 
     */
    getAnonymousIdAndSessionId(message, redisData = null) {
        let anonymousId;
        let sessionId;
        const noteAttributes = message.properties?.note_attributes;
        // Giving Priority to note_attributes to fetch rudderAnonymousId over Redis due to better efficiency
        if (isDefinedAndNotNull(noteAttributes)) {
            anonymousId = this.getRudderIdFromNoteAtrributes(noteAttributes, "rudderAnonymousId");
            sessionId = this.getRudderIdFromNoteAtrributes(noteAttributes, "rudderSessionId");
        }
        // falling back to cartToken mapping or its hash in case no rudderAnonymousId or rudderSessionId is found
        if (anonymousId && sessionId) {
            return { anonymousId, sessionId };
        }
        const cartToken = getCartToken(message);
        if (!isDefinedAndNotNull(cartToken)) {
            if (SHOPIFY_ADMIN_ONLY_EVENTS.includes(message.event)) {
                return { anonymousId, sessionId };
            }
            return { anonymousId: isDefinedAndNotNull(anonymousId) ? anonymousId : generateUUID(), sessionId };
        }
        anonymousId = redisData?.anonymousId;
        sessionId = redisData?.sessionId;
        if (!isDefinedAndNotNull(anonymousId)) {
            /* anonymousId or sessionId not found from db as well
            Hash the id and use it as anonymousId (limiting 256 -> 36 chars) and sessionId is not sent as its not required field
            */
            anonymousId = v5(cartToken, v5.URL);
        }
        return { anonymousId, sessionId };
    },

    resolveId(event, message, redisData) {
        const updatedMessage = message;
        const shopifyTopic = message.event;
        if (message.userId) {
            updatedMessage.userId = String(message.userId);
        }
        if (!get(message, 'traits.email')) {
            const email = extractEmailFromPayload(event);
            if (email) {
                updatedMessage.setProperty('traits.email', email);
            }
        }
        if (message.type !== EventType.IDENTIFY) {
            const { anonymousId, sessionId } = this.getAnonymousIdAndSessionId(message, redisData);
            if (isDefinedAndNotNull(anonymousId)) {
                updatedMessage.setProperty('anonymousId', anonymousId);
            } else if (!message.userId) {
                updatedMessage.setProperty('userId', 'shopify-admin');
            }
            if (isDefinedAndNotNull(sessionId)) {
                updatedMessage.setProperty('context.sessionId', sessionId);
            }
        }
        return updatedMessage;
    }
}
module.exports = { idResolutionLayer };