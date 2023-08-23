const get = require('get-value');
const {
  RUDDER_ECOM_MAP,
  NO_OPERATION_SUCCESS,
  SHOPIFY_TO_RUDDER_ECOM_EVENTS_MAP,
  MAPPING_CATEGORIES,
  NON_ECOM_SUPPORTED_EVENTS,
  maxTimeToIdentifyRSGeneratedCall,
  INTEGERATION,
  SHOPIFY_TRACK_MAP,
} = require('./config');
const { RedisDB } = require('../../../util/redis/redisConnector');
const Message = require('../message');
const { EventType } = require('../../../constants');
const stats = require('../../../util/stats');
const {
  getHashLineItems,
  createPropertiesForEcomEvent,
  getProductsListFromLineItems,
} = require('./commonUtils');
const logger = require('../../../logger');
const { removeUndefinedAndNullValues } = require('../../util');

const trackLayer = {
  ecomPayloadBuilder(event, shopifyTopic) {
    const message = new Message(INTEGERATION);
    message.setEventType(EventType.TRACK);
    message.setEventName(RUDDER_ECOM_MAP[shopifyTopic]);

    let properties = createPropertiesForEcomEvent(event);
    properties = removeUndefinedAndNullValues(properties);
    Object.keys(properties).forEach((key) =>
      message.setProperty(`properties.${key}`, properties[key]),
    );
    // Map Customer details if present
    const customerDetails = get(event, 'customer');
    if (customerDetails) {
      message.setPropertiesV2(customerDetails, MAPPING_CATEGORIES[EventType.IDENTIFY]);
    }
    if (event.updated_at) {
      // TODO: look for created_at for checkout_create?
      // converting shopify updated_at timestamp to rudder timestamp format
      message.setTimestamp(new Date(event.updated_at).toISOString());
    }
    if (event.customer) {
      message.setPropertiesV2(event.customer, MAPPING_CATEGORIES[EventType.IDENTIFY]);
    }
    if (event.shipping_address) {
      message.setProperty('traits.shippingAddress', event.shipping_address);
    }
    if (event.billing_address) {
      message.setProperty('traits.billingAddress', event.billing_address);
    }
    if (!message.userId && event.user_id) {
      message.setProperty('userId', event.user_id);
    }
    return message;
  },

  trackPayloadBuilder(event, shopifyTopic) {
    const message = new Message(INTEGERATION);
    message.setEventType(EventType.TRACK);
    message.setEventName(SHOPIFY_TRACK_MAP[shopifyTopic]);

    Object.keys(event)
      .filter(
        (key) =>
          ![
            'type',
            'event',
            'line_items',
            'customer',
            'shipping_address',
            'billing_address',
          ].includes(key),
      )
      .forEach((key) => {
        message.setProperty(`properties.${key}`, event[key]);
      });
    // eslint-disable-next-line camelcase
    const { line_items: lineItems, billing_address, user_id, shipping_address, customer } = event;
    const productsList = getProductsListFromLineItems(lineItems); // mapping of line_items will be done here
    message.setProperty('properties.products', productsList);
    if (customer) {
      message.setPropertiesV2(customer, MAPPING_CATEGORIES[EventType.IDENTIFY]);
    }
    // eslint-disable-next-line camelcase
    if (shipping_address) {
      message.setProperty('traits.shippingAddress', shipping_address);
    }
    // eslint-disable-next-line camelcase
    if (billing_address) {
      message.setProperty('traits.billingAddress', billing_address);
    }
    // eslint-disable-next-line camelcase
    if (!message.userId && user_id) {
      message.setProperty('userId', user_id);
    }
    return message;
  },

  /**
   * It checks if the event is valid or not based on previous cartItems
   * @param {*} inputEvent
   * @returns true if event is valid else false
   */
  isValidCartEvent(newCartItems, prevCartItems) {
    return !(prevCartItems === newCartItems);
  },

  async updateCartItemsInRedis(cartToken, newCartItemsHash, metricMetadata) {
    const value = ['itemsHash', newCartItemsHash];
    try {
      stats.increment('shopify_redis_calls', {
        type: 'set',
        field: 'itemsHash',
        ...metricMetadata,
      });
      await RedisDB.setVal(`${cartToken}`, value);
    } catch (e) {
      logger.debug(`{{SHOPIFY::}} itemsHash set call Failed due redis error ${e}`);
      stats.increment('shopify_redis_failures', {
        type: 'set',
        ...metricMetadata,
      });
    }
  },

  /**
   * This function checks for duplicate cart update event by checking the lineItems hash of previous cart update event
   * and comapre it with the received lineItems hash.
   * Also if redis is down or there is no lineItems hash for the given cartToken we be default take it as a valid cart update event
   * @param {*} inputEvent
   * @param {*} metricMetadata
   * @returns boolean
   */
  async checkAndUpdateCartItems(inputEvent, redisData, metricMetadata) {
    const cartToken = inputEvent.token || inputEvent.id;
    const itemsHash = redisData?.itemsHash;
    if (itemsHash) {
      const newCartItemsHash = getHashLineItems(inputEvent);
      const isCartValid = this.isValidCartEvent(newCartItemsHash, itemsHash);
      if (!isCartValid) {
        return false;
      }
      await this.updateCartItemsInRedis(cartToken, newCartItemsHash, metricMetadata);
    } else {
      const { created_at, updated_at } = inputEvent;
      const timeDifference = Date.parse(updated_at) - Date.parse(created_at);
      const isTimeWithinThreshold = timeDifference < maxTimeToIdentifyRSGeneratedCall;
      const isLineItemsEmpty = inputEvent?.line_items?.length === 0;

      if (isTimeWithinThreshold && isLineItemsEmpty) {
        return false;
      }
    }
    return true;
  },

  getUpdatedEventName(event, eventName, redisData) {
    let updatedEventName;
    /* This function will check for cart_update if its is due Product Added or Product Removed and
        for checkout_update which step is completed or started
        */
    return updatedEventName;
  },

  async processtrackEvent(event, eventName, redisData, metricMetadata) {
    let updatedEventName = eventName;
    let payload;
    if (SHOPIFY_TO_RUDDER_ECOM_EVENTS_MAP.includes(eventName)) {
      if (eventName === 'carts_update') {
        const isValidEvent = await this.checkAndUpdateCartItems(event, redisData, metricMetadata);
        if (!isValidEvent) {
          return NO_OPERATION_SUCCESS;
        }
      }
      updatedEventName = this.getUpdatedEventName(event, eventName, redisData);
    }
    if (Object.keys(RUDDER_ECOM_MAP).includes(updatedEventName)) {
      payload = this.ecomPayloadBuilder(event, updatedEventName);
    } else if (NON_ECOM_SUPPORTED_EVENTS.includes(eventName)) {
      payload = this.trackPayloadBuilder(event, updatedEventName);
    } else {
      stats.increment('invalid_shopify_event', {
        event: eventName,
        ...metricMetadata,
      });
      return NO_OPERATION_SUCCESS;
    }
    return payload;
  },
};
module.exports = { trackLayer };
