const { constructPayload } = require('../../util');
const { ConfigCategory } = require('./config');

const ecomEventsMapping = {
  product_added: 'Add to Cart',
  product_removed: 'Remove from Cart',
  product_added_to_wishlist: 'Add to Wishlist',
  order_completed: 'Purchase',
};

const populateProperties = (messageProperties, event) => {
  const properties = {
    dyType: `${ecomEventsMapping[event].toLowerCase().trim().replace(/\s+/g, '-')}-v1`,
    value: messageProperties.price,
  };
  if (event === 'order_completed') {
    properties.uniqeTransactionId = messageProperties.order_id;
  } else {
    properties.quantity = messageProperties.quantity;
    properties.productId = messageProperties.sku;
  }
  if (messageProperties.products && Array.isArray(messageProperties.products)) {
    properties.cart = [];
    const { products } = messageProperties;
    products.forEach((product) => {
      const cartObj = {};
      cartObj.productId = product.sku;
      cartObj.quantity = product.quantity;
      cartObj.itemPrice = product.price;
      properties.cart.push(cartObj);
    });
  }
  return properties;
};

const preparePayload = (message, event) => {
  const payload = constructPayload(message, ConfigCategory.TRACK);
  const eventsObj = {};

  switch (event) {
    case 'product_added':
    case 'product_removed':
    case 'product_added_to_wishlist':
    case 'order_completed':
      eventsObj.name = ecomEventsMapping[event] || event;
      eventsObj.properties = populateProperties(message.properties, event);
      break;
    default:
      eventsObj.name = event;
      eventsObj.properties = message.properties;
      break;
  }
  payload.events = [eventsObj];
  return payload;
};

module.exports = {
  preparePayload,
};
