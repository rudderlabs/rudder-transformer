const ENDPOINT = 'https://dy-api.com/v2/collect/user/event';

const ecomEventsMapping = {
  product_added: 'Add to Cart',
  product_removed: 'Remove from Cart',
  product_added_to_wishlist: 'Add to Wishlist',
  order_completed: 'Purchase',
};

module.exports = {
  ENDPOINT,
  ecomEventsMapping,
};
