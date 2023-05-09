const sha256 = require('sha256');

const ecomEventsMapping = {
  product_added: 'Add to Cart',
  product_removed: 'Remove from Cart',
  product_added_to_wishlist: 'Add to Wishlist',
  order_completed: 'Purchase',
};

const populateProperties = (messageProperties, event) => {
  const properties = {
    dyType: `${ecomEventsMapping[event].toLowerCase().trim().replace(/\s+/g, '-')}-v1`,
    value: Number(parseFloat(messageProperties.price).toFixed(2)),
    currency: messageProperties.currency,
  };
  if (event === 'order_completed') {
    properties.uniqeTransactionId = messageProperties.order_id;
    properties.value =
      messageProperties.value || messageProperties.revenue || messageProperties.price;
  } else {
    properties.quantity = messageProperties.quantity;
    properties.productId = messageProperties.sku || messageProperties.product_id;
  }
  if (messageProperties.products && Array.isArray(messageProperties.products)) {
    properties.cart = [];
    const { products } = messageProperties;
    products.forEach((product) => {
      const cartObj = {
        productId: product.sku || product.product_id,
        quantity: product.quantity,
        itemPrice: product.price,
      };
      properties.cart.push(cartObj);
    });
  }
  return properties;
};

const prepareIdentifyPayload = (message, payload, hashEmail) => {
  const updatedPayload = payload;
  updatedPayload.events = [];
  const eventsObj = {
    name: 'Identify User',
    properties: {
      dyType: 'identify-v1',
      hashedEmail:
        message.traits?.email || message.context?.traits?.email
          ? message.traits?.email || message.context?.traits?.email
          : null,
    },
  };
  if (hashEmail && eventsObj.properties.hashedEmail) {
    eventsObj.properties.hashedEmail = sha256(eventsObj.properties.hashedEmail);
  }
  if (!eventsObj.properties.hashedEmail) {
    delete eventsObj.properties.hashedEmail;
    eventsObj.properties.cuidType = 'userId';
    eventsObj.properties.cuid = updatedPayload.user.id;
  }
  updatedPayload.events.push(eventsObj);
  return updatedPayload;
};

const prepareTrackPayload = (message, event, payload) => {
  const updatedPayload = payload;
  const eventsObj = {};

  const trimmedEvent = event.toLowerCase().trim().replace(/\s+/g, '_');
  switch (trimmedEvent) {
    case 'product_added':
    case 'product_removed':
    case 'product_added_to_wishlist':
    case 'order_completed':
      eventsObj.name = ecomEventsMapping[trimmedEvent] || event;
      eventsObj.properties = populateProperties(message.properties, trimmedEvent);
      break;
    default:
      eventsObj.name = event;
      eventsObj.properties = message.properties;
      break;
  }
  updatedPayload.events = [eventsObj];
  return updatedPayload;
};

module.exports = {
  prepareIdentifyPayload,
  prepareTrackPayload,
};
