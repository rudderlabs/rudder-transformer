const ENDPOINT = 'https://ads-api.reddit.com/api/v2.0/conversions/events/';
const V3_ENDPOINT = 'https://ads-api.reddit.com/api/v3/pixels/';
const maxBatchSize = 1000;

const ecomEventMaps = [
  {
    src: ['product viewed', 'product list viewed'],
    dest: 'ViewContent',
  },
  {
    src: ['product added'],
    dest: 'AddToCart',
  },
  {
    src: ['product added to wishlist'],
    dest: 'AddToWishlist',
  },
  {
    src: ['order completed'],
    dest: 'Purchase',
  },
  {
    src: ['products searched'],
    dest: 'Search',
  },
];

module.exports = {
  ENDPOINT,
  V3_ENDPOINT,
  maxBatchSize,
  ecomEventMaps,
};
