export const ENDPOINT = 'https://dy-api.com/v2/collect/user/event';

interface EcomEventsMapping {
  [key: string]: string;
}

export const ecomEventsMapping: EcomEventsMapping = {
  product_added: 'Add to Cart',
  product_removed: 'Remove from Cart',
  product_added_to_wishlist: 'Add to Wishlist',
  order_completed: 'Purchase',
};
