const get = require('get-value');
const {
  RUDDER_ECOM_MAP,
  NO_OPERATION_SUCCESS,
  SHOPIFY_TO_RUDDER_ECOM_EVENTS_MAP,
  INTEGRATION,
  SHOPIFY_NON_ECOM_TRACK_MAP,
  MAPPING_CATEGORIES,
  ECOM_MAPPING_JSON,
  lineItemsMappingJSON,
  LINE_ITEM_EXCLUSION_FIELDS,
} = require('./config');
const { RedisDB } = require('../../../util/redis/redisConnector');
const logger = require('../../../logger');
const { idResolutionLayer } = require('./identityResolutionLayer');
const { enrichPayload } = require('./enrichmentLayer');
const Message = require('../../../v0/sources/message');
const { EventType } = require('../../../constants');
const stats = require('../../../util/stats');
const {
  extractEmailFromPayload,
  getUnhashedLineItems,
  getLineItemsToStore,
} = require('./commonUtils');
const {
  removeUndefinedAndNullValues,
  constructPayload,
  extractCustomFields,
} = require('../../../v0/util');

const trackLayer = {
  getProductsListFromLineItems(lineItems) {
    if (!lineItems || lineItems.length === 0) {
      return [];
    }
    const products = [];
    lineItems.forEach((lineItem) => {
      const product = constructPayload(lineItem, lineItemsMappingJSON);
      extractCustomFields(lineItem, product, 'root', LINE_ITEM_EXCLUSION_FIELDS);
      products.push(product);
    });
    return products;
  },

  createPropertiesForEcomEvent(message, shopifyTopic) {
    const mappedPayload = constructPayload(
      message,
      ECOM_MAPPING_JSON[RUDDER_ECOM_MAP[shopifyTopic].name],
    );
    if (RUDDER_ECOM_MAP[shopifyTopic].lineItems) {
      const { line_items: lineItems } = message;
      const productsList = this.getProductsListFromLineItems(lineItems);
      mappedPayload.products = productsList;
    }

    return mappedPayload;
  },

  /**
   * This function creates the ecom event specific payload through mapping jsons
   * @param {*} message
   * @param {*} shopifyTopic
   * @returns mapped payload for an ecom event
   */
  ecomPayloadBuilder(event, shopifyTopic) {
    const message = new Message(INTEGRATION);
    message.setEventType(EventType.TRACK);
    message.setEventName(RUDDER_ECOM_MAP[shopifyTopic].event);

    let properties = this.createPropertiesForEcomEvent(event, shopifyTopic);
    properties = removeUndefinedAndNullValues(properties);
    message.properties = properties;
    if (event.updated_at) {
      // converting shopify updated_at timestamp to rudder timestamp format
      message.setTimestamp(new Date(event.updated_at).toISOString());
    }
    enrichPayload.setExtraNonEcomProperties(message, event, shopifyTopic);
    return message;
  },

  /**
   * This function builds the payload for general track events i.e. non-ecom events
   * @param {*} event
   * @param {*} shopifyTopic
   * @returns
   */
  nonEcomPayloadBuilder(event, shopifyTopic) {
    const message = new Message(INTEGRATION);
    message.setEventType(EventType.TRACK);
    message.setEventName(SHOPIFY_NON_ECOM_TRACK_MAP[shopifyTopic]);
    const excludedKeys = [
      'type',
      'event',
      'line_items',
      'customer',
      'shipping_address',
      'billing_address',
    ];
    const properties = Object.keys(event).reduce((result, key) => {
      if (!excludedKeys.includes(key)) {
        // eslint-disable-next-line no-param-reassign
        result[key] = event[key];
      }
      return result;
    }, {});

    message.properties = { ...message.properties, ...properties };
    // eslint-disable-next-line camelcase
    const { line_items: lineItems } = event;
    const productsList = this.getProductsListFromLineItems(lineItems); // mapping of line_items will be done here
    message.setProperty('properties.products', productsList);
    return message;
  },

  /**
   * This function maps the checkout update event from shopify side to rudder ecom event name based upon the contents of payload.
   * @param {*} event
   * @param {*} eventName
   * @param {*} dbData
   * @returns the updated name of the payload
   */
  getUpdatedEventNameForCheckoutUpateEvent(event) {
    let updatedEventName;
    updatedEventName = 'checkout_step_viewed';
    if (event.completed_at) {
      updatedEventName = 'checkout_step_completed';
    } else if (event.gateway) {
      updatedEventName = 'payment_info_entered';
    }
    return updatedEventName;
  },

  /**
   * This function maps the customer data (including anonymousId and sessionId),if available
   * @param {*} payload
   * @param {*} event
   * @param {*} dbData
   * @param {*} eventName
   * @returns updated Payload
   */
  mapCustomerDetails(payload, event, dbData, eventName) {
    let updatedPayload = payload;
    if (!get(payload, 'traits.email')) {
      const email = extractEmailFromPayload(event);
      if (email) {
        updatedPayload.setProperty('traits.email', email);
      }
    }
    // Map Customer details if present customer,ship_Add,bill,userId
    if (event.customer) {
      updatedPayload.setPropertiesV2(event.customer, MAPPING_CATEGORIES[EventType.IDENTIFY]);
    }
    if (event.shipping_address) {
      updatedPayload.setProperty('traits.shippingAddress', event.shipping_address);
    }
    if (event.billing_address) {
      updatedPayload.setProperty('traits.billingAddress', event.billing_address);
    }
    if (!payload.userId && event.user_id) {
      updatedPayload.setProperty('userId', event.user_id);
    }
    updatedPayload = idResolutionLayer.resolveId(updatedPayload, dbData, eventName);
    return updatedPayload;
  },

  /**
   * This function generates the updated product properties
   * @param {*} product
   * @param {*} updatedQuantity
   * @param {*} cart_token
   * @returns
   */
  getUpdatedProductProperties(product, cart_token, updatedQuantity = null) {
    const updatedCartProperties = product;
    if (updatedQuantity) {
      updatedCartProperties.quantity = updatedQuantity;
    }
    updatedCartProperties.cart_id = cart_token;
    return updatedCartProperties;
  },

  async generateProductAddedAndRemovedEvents(event, dbData, metricMetadata) {
    const events = [];
    let prevLineItems = dbData?.lineItems;
    // if no prev cart is found we trigger product added event for every line_item present
    if (!prevLineItems) {
      event?.line_items.forEach((product) => {
        const updatedProduct = this.getUpdatedProductProperties(product, event?.id || event?.token);
        events.push(this.ecomPayloadBuilder(updatedProduct, 'product_added'));
      });
      return events;
    }
    prevLineItems = getUnhashedLineItems(prevLineItems);
    // This will compare current cartSate with previous cartState
    event?.line_items.forEach((product) => {
      const key = product.id;
      const currentQuantity = product.quantity;
      const prevQuantity = prevLineItems?.[key]?.quantity;
      if (prevQuantity) {
        delete prevLineItems[key];
      }
      if (currentQuantity !== prevQuantity) {
        const updatedQuantity = Math.abs(currentQuantity - prevQuantity);
        const updatedProduct = this.getUpdatedProductProperties(
          product,
          event?.id || event?.token,
          updatedQuantity,
        );
        // TODO1: map extra properties from axios call

        // This means either this Product is Added or Removed
        if (!prevQuantity || currentQuantity > prevQuantity) {
          events.push(this.ecomPayloadBuilder(updatedProduct, 'product_added'));
        } else {
          events.push(this.ecomPayloadBuilder(updatedProduct, 'product_removed'));
        }
      }
    });
    // We also want to see what prevLineItems are not present in the currentCart to trigger Product Removed Event for them
    Object.keys(prevLineItems).forEach((lineItemID) => {
      const product = prevLineItems[lineItemID];
      const updatedProduct = this.getUpdatedProductProperties(product, event?.id || event?.token);
      updatedProduct.id = lineItemID;
      events.push(this.ecomPayloadBuilder(updatedProduct, 'product_removed'));
    });
    if (events.length > 0) {
      await this.updateCartState(
        getLineItemsToStore(event),
        event.id || event.token,
        metricMetadata,
      );
    }
    return events;
  },

  /**
   * This function sets the updated cart stae in redis in the form 
   * newCartItemsHash = [{
      id: "some_id",
      quantity: 2,
      variant_id: "vairnat_id",
      key: 'some:key',
      price: '30.00',
      product_id: 1234,
      sku: '40',
      title: 'Product Title',
      vendor: 'example',
    }]
   * @param {*} updatedCartState
   * @param {*} cart_token
   * @param {*} metricMetadata
   */
  async updateCartState(updatedCartState, cart_token, metricMetadata) {
    if (cart_token) {
      try {
        stats.increment('shopify_redis_calls', {
          type: 'set',
          field: 'lineItems',
          ...metricMetadata,
        });
        await RedisDB.setVal(`${cart_token}`, ['lineItems', updatedCartState]);
      } catch (e) {
        logger.debug(`{{SHOPIFY::}} cartToken map set call Failed due redis error ${e}`);
        stats.increment('shopify_redis_failures', {
          type: 'set',
          ...metricMetadata,
        });
      }
    }
  },

  async processTrackEvent(event, eventName, dbData, metricMetadata) {
    let updatedEventName = eventName;
    let payload;
    /* if event is cart update then we do the build the payload for Product Added and/or
     * Product Removed events and return the array from the same block
     */
    if (SHOPIFY_TO_RUDDER_ECOM_EVENTS_MAP.CART_UPDATED === eventName) {
      let productAddedOrRemovedEvents = await this.generateProductAddedAndRemovedEvents(
        event,
        dbData,
        metricMetadata,
      );
      if (productAddedOrRemovedEvents.length === 0) return [NO_OPERATION_SUCCESS];
      productAddedOrRemovedEvents = productAddedOrRemovedEvents.map((productEvent) =>
        this.mapCustomerDetails(productEvent, event, dbData, eventName),
      );
      return productAddedOrRemovedEvents;
    }
    // if event is checkout updated we get the updated event name
    if (SHOPIFY_TO_RUDDER_ECOM_EVENTS_MAP.CHECKOUTS_UPDATE === eventName) {
      updatedEventName = this.getUpdatedEventNameForCheckoutUpateEvent(event);
    }
    if (Object.keys(RUDDER_ECOM_MAP).includes(updatedEventName)) {
      payload = this.ecomPayloadBuilder(event, updatedEventName);
    } else if (Object.keys(SHOPIFY_NON_ECOM_TRACK_MAP).includes(updatedEventName)) {
      payload = this.nonEcomPayloadBuilder(event, updatedEventName);
    } else {
      stats.increment('invalid_shopify_event', {
        event: eventName,
        ...metricMetadata,
      });
      return [NO_OPERATION_SUCCESS];
    }
    return [this.mapCustomerDetails(payload, event, dbData, eventName)];
  },
};
module.exports = { trackLayer };
