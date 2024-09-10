/* eslint-disable @typescript-eslint/naming-convention */
const { mapObjectKeys } = require('./util');
const Message = require('../../../v0/sources/message');
const { EventType } = require('../../../constants');
const {
  INTEGERATION,
  PIXEL_EVENT_MAPPING,
  contextualFieldMapping,
  cartViewedEventMapping,
  productListViewedEventMapping,
  productViewedEventMapping,
  productToCartEventMapping,
  checkoutStartedCompletedEventMapping,
} = require('./config');

const pageViewedEventBuilder = (inputEvent) => {
  const { data, context } = inputEvent;
  const pageEventContextValues = mapObjectKeys(context, contextualFieldMapping);
  const message = new Message(INTEGERATION);
  message.name = 'Page View';
  message.setEventType(EventType.PAGE);
  message.properties = { ...data };
  message.context = { ...pageEventContextValues };
  return message;
};

const cartViewedEventBuilder = (inputEvent) => {
  const lines = inputEvent?.data?.cart?.lines;
  const products = [];
  let total;
  if (lines) {
    lines.forEach((line) => {
      const product = mapObjectKeys(line, cartViewedEventMapping);
      products.push(product);
      total = line.cost.totalAmount.amount;
    });
  }

  const properties = {
    products,
    cart_id: inputEvent.data.cart.id,
    total,
  };
  const contextualPayload = mapObjectKeys(inputEvent.context, contextualFieldMapping);
  const message = new Message(INTEGERATION);
  message.setEventType(EventType.TRACK);
  message.setEventName('Cart Viewed');
  message.properties = properties;
  message.context = contextualPayload;
  return message;
};

const productListViewedEventBuilder = (inputEvent) => {
  const productVariants = inputEvent?.data?.collection?.productVariants;
  const products = [];

  productVariants.forEach((productVariant) => {
    const mappedProduct = mapObjectKeys(productVariant, productListViewedEventMapping);
    products.push(mappedProduct);
  });

  const properties = {
    cart_id: inputEvent.clientId,
    list_id: inputEvent.id,
    products,
  };

  const contextualPayload = mapObjectKeys(inputEvent.context, contextualFieldMapping);

  const message = new Message(INTEGERATION);
  message.setEventType(EventType.TRACK);
  message.setEventName('Product List Viewed');
  message.properties = properties;
  message.context = contextualPayload;
  return message;
};

const productViewedEventBuilder = (inputEvent) => {
  const properties = {
    ...mapObjectKeys(inputEvent.data, productViewedEventMapping),
  };
  const contextualPayload = mapObjectKeys(inputEvent.context, contextualFieldMapping);
  const message = new Message(INTEGERATION);
  message.setEventType(EventType.TRACK);
  message.setEventName('Product Viewed');
  message.properties = properties;
  message.context = contextualPayload;
  return message;
};

const productToCartEventBuilder = (inputEvent) => {
  const properties = {
    ...mapObjectKeys(inputEvent.data, productToCartEventMapping),
  };
  const contextualPayload = mapObjectKeys(inputEvent.context, contextualFieldMapping);
  const message = new Message(INTEGERATION);
  message.setEventType(EventType.TRACK);
  message.setEventName(PIXEL_EVENT_MAPPING[inputEvent.name]);
  message.properties = properties;
  message.context = contextualPayload;
  return message;
};

const checkoutEventBuilder = (inputEvent) => {
  const lineItems = inputEvent?.data?.checkout?.lineItems;
  const products = [];

  lineItems.forEach((lineItem) => {
    const mappedProduct = mapObjectKeys(lineItem, checkoutStartedCompletedEventMapping);
    products.push(mappedProduct);
  });

  const properties = {
    products,
    order_id: inputEvent.id,
    checkout_id: inputEvent?.data?.checkout?.token,
    total: inputEvent?.data?.checkout?.totalPrice?.amount,
    currency: inputEvent?.data?.checkout?.currencyCode,
    discount: inputEvent?.data?.checkout?.discountsAmount?.amount,
    shipping: inputEvent?.data?.checkout?.shippingLine?.price?.amount,
    revenue: inputEvent?.data?.checkout?.subtotalPrice?.amount,
    value: inputEvent?.data?.checkout?.totalPrice?.amount,
    tax: inputEvent?.data?.checkout?.totalTax?.amount,
  };
  const contextualPayload = mapObjectKeys(inputEvent.context, contextualFieldMapping);

  const message = new Message(INTEGERATION);
  message.setEventType(EventType.TRACK);
  message.setEventName(PIXEL_EVENT_MAPPING[inputEvent.name]);
  message.properties = properties;
  message.context = contextualPayload;
  return message;
};

const checkoutStepEventBuilder = (inputEvent) => {
  const contextualPayload = mapObjectKeys(inputEvent.context, contextualFieldMapping);
  const properties = {
    ...inputEvent.data.checkout,
  };
  const message = new Message(INTEGERATION);
  message.setEventType(EventType.TRACK);
  message.setEventName(PIXEL_EVENT_MAPPING[inputEvent.name]);
  message.properties = properties;
  message.context = contextualPayload;
  return message;
};

const searchEventBuilder = (inputEvent) => {
  const properties = {
    query: inputEvent.data.searchResult.query,
  };
  const contextualPayload = mapObjectKeys(inputEvent.context, contextualFieldMapping);
  const message = new Message(INTEGERATION);
  message.setEventType(EventType.TRACK);
  message.setEventName(PIXEL_EVENT_MAPPING[inputEvent.name]);
  message.properties = properties;
  message.context = contextualPayload;
  return message;
};

module.exports = {
  pageViewedEventBuilder,
  cartViewedEventBuilder,
  productListViewedEventBuilder,
  productViewedEventBuilder,
  productToCartEventBuilder,
  checkoutEventBuilder,
  checkoutStepEventBuilder,
  searchEventBuilder,
};
