interface EventMap {
  src: string[];
  dest: string;
}

const ENDPOINT = 'https://ads-api.reddit.com/api/v2.0/conversions/events/';
const maxBatchSize = 1000;

const ecomEventMaps: EventMap[] = [
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

export { ENDPOINT, maxBatchSize, ecomEventMaps };
