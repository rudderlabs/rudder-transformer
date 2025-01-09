const dummyResponseCommonPayload = {
  navigator: {
    language: 'en-US',
    cookieEnabled: true,
    languages: ['en-US', 'en'],
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
  },
  window: {
    innerHeight: 1028,
    innerWidth: 1362,
    outerHeight: 1080,
    outerWidth: 1728,
    pageXOffset: 0,
    pageYOffset: 0,
    location: {
      href: 'https://store.myshopify.com/checkouts/cn/Z2NwLXVzLWVhc3QxOjAxSjY5OVpIRURQNERFMDBKUTVaRkI4UzdU',
      hash: '',
      host: 'store.myshopify.com',
      hostname: 'store.myshopify.com',
      origin: 'https://store.myshopify.com',
      pathname: '/checkouts/cn/Z2NwLXVzLWVhc3QxOjAxSjY5OVpIRURQNERFMDBKUTVaRkI4UzdU',
      port: '',
      protocol: 'https:',
      search: '',
    },
    origin: 'https://store.myshopify.com',
    screen: {
      height: 1117,
      width: 1728,
    },
    screenX: 0,
    screenY: 37,
    scrollX: 0,
    scrollY: 0,
  },
  page: {
    title: 'Checkout - pixel-testing-rs',
    url: 'https://store.myshopify.com/checkouts/cn/Z2NwLXVzLWVhc3QxOjAxSjY5OVpIRURQNERFMDBKUTVaRkI4UzdU',
    path: '/checkouts/cn/Z2NwLXVzLWVhc3QxOjAxSjY5OVpIRURQNERFMDBKUTVaRkI4UzdU',
    search: '',
  },
  userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
  screen: {
    height: 1117,
    width: 1728,
  },
  library: {
    name: 'RudderStack Shopify Cloud',
    eventOrigin: 'client',
    version: '2.0.0',
  },
};

export const dummySourceConfig = {
  ID: 'dummy-source-id',
  OriginalID: '',
  Name: 'Shopify v2',
  Config: {
    disableClientSideIdentifier: false,
    eventUpload: false,
    version: 'pixel',
  },
  Enabled: true,
  WorkspaceID: 'dummy-workspace-id',
  Destinations: null,
  WriteKey: 'dummy-write-key',
};

export const dummyBillingAddresses = [
  {
    address1: null,
    address2: null,
    city: null,
    country: 'US',
    countryCode: 'US',
    firstName: null,
    lastName: null,
    phone: null,
    province: null,
    provinceCode: null,
    zip: null,
  },
];

export const dummyContext = {
  document: {
    location: {
      href: 'https://store.myshopify.com/checkouts/cn/Z2NwLXVzLWVhc3QxOjAxSjY5OVpIRURQNERFMDBKUTVaRkI4UzdU',
      hash: '',
      host: 'store.myshopify.com',
      hostname: 'store.myshopify.com',
      origin: 'https://store.myshopify.com',
      pathname: '/checkouts/cn/Z2NwLXVzLWVhc3QxOjAxSjY5OVpIRURQNERFMDBKUTVaRkI4UzdU',
      port: '',
      protocol: 'https:',
      search: '',
    },
    referrer: 'https://store.myshopify.com/cart',
    characterSet: 'UTF-8',
    title: 'Checkout - pixel-testing-rs',
  },
  navigator: {
    language: 'en-US',
    cookieEnabled: true,
    languages: ['en-US', 'en'],
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
  },
  window: {
    innerHeight: 1028,
    innerWidth: 1362,
    outerHeight: 1080,
    outerWidth: 1728,
    pageXOffset: 0,
    pageYOffset: 0,
    location: {
      href: 'https://store.myshopify.com/checkouts/cn/Z2NwLXVzLWVhc3QxOjAxSjY5OVpIRURQNERFMDBKUTVaRkI4UzdU',
      hash: '',
      host: 'store.myshopify.com',
      hostname: 'store.myshopify.com',
      origin: 'https://store.myshopify.com',
      pathname: '/checkouts/cn/Z2NwLXVzLWVhc3QxOjAxSjY5OVpIRURQNERFMDBKUTVaRkI4UzdU',
      port: '',
      protocol: 'https:',
      search: '',
    },
    origin: 'https://store.myshopify.com',
    screen: {
      height: 1117,
      width: 1728,
    },
    screenX: 0,
    screenY: 37,
    scrollX: 0,
    scrollY: 0,
  },
};

export const dummyContextwithCampaign = {
  document: {
    location: {
      href: 'https://store.myshopify.com/checkouts/cn/Z2NwLXVzLWVhc3QxOjAxSjY5OVpIRURQNERFMDBKUTVaRkI4UzdU?checkout%5Bpayment_gateway%5D=shopify_payments&utm_campaign=shopifySale&utm_medium=checkout&utm_term=term_checkout&utm_content=web&utm_custom1=customutm&tag=tag',
      hash: '',
      host: 'store.myshopify.com',
      hostname: 'store.myshopify.com',
      origin: 'https://store.myshopify.com',
      pathname: '/checkouts/cn/Z2NwLXVzLWVhc3QxOjAxSjY5OVpIRURQNERFMDBKUTVaRkI4UzdU',
      port: '',
      protocol: 'https:',
      search: '',
    },
    referrer: 'https://store.myshopify.com/cart',
    characterSet: 'UTF-8',
    title: 'Checkout - pixel-testing-rs',
  },
  navigator: {
    language: 'en-US',
    cookieEnabled: true,
    languages: ['en-US', 'en'],
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
  },
  window: {
    innerHeight: 1028,
    innerWidth: 1362,
    outerHeight: 1080,
    outerWidth: 1728,
    pageXOffset: 0,
    pageYOffset: 0,
    location: {
      href: 'https://store.myshopify.com/checkouts/cn/Z2NwLXVzLWVhc3QxOjAxSjY5OVpIRURQNERFMDBKUTVaRkI4UzdU',
      hash: '',
      host: 'store.myshopify.com',
      hostname: 'store.myshopify.com',
      origin: 'https://store.myshopify.com',
      pathname: '/checkouts/cn/Z2NwLXVzLWVhc3QxOjAxSjY5OVpIRURQNERFMDBKUTVaRkI4UzdU',
      port: '',
      protocol: 'https:',
      search: '',
    },
    origin: 'https://store.myshopify.com',
    screen: {
      height: 1117,
      width: 1728,
    },
    screenX: 0,
    screenY: 37,
    scrollX: 0,
    scrollY: 0,
  },
};

export const note_attributes = [
  {
    name: 'cartId',
    value: '9c623f099fc8819aa4d6a958b65dfe7d',
  },
  {
    name: 'cartToken',
    value: 'Z2NwLXVzLWVhc3QxOjAxSkQzNUFXVEI4VkVUNUpTTk1LSzBCMzlF',
  },
  {
    name: 'rudderAnonymousId',
    value: '50ead33e-d763-4854-b0ab-765859ef05cb',
  },
];

export const responseDummyContext = {
  document: {
    location: {
      href: 'https://store.myshopify.com/checkouts/cn/Z2NwLXVzLWVhc3QxOjAxSjY5OVpIRURQNERFMDBKUTVaRkI4UzdU',
      hash: '',
      host: 'store.myshopify.com',
      hostname: 'store.myshopify.com',
      origin: 'https://store.myshopify.com',
      pathname: '/checkouts/cn/Z2NwLXVzLWVhc3QxOjAxSjY5OVpIRURQNERFMDBKUTVaRkI4UzdU',
      port: '',
      protocol: 'https:',
      search: '',
    },
    referrer: 'https://store.myshopify.com/cart',
    characterSet: 'UTF-8',
    title: 'Checkout - pixel-testing-rs',
  },
  ...dummyResponseCommonPayload,
};

export const responseDummyContextwithCampaign = {
  document: {
    location: {
      href: 'https://store.myshopify.com/checkouts/cn/Z2NwLXVzLWVhc3QxOjAxSjY5OVpIRURQNERFMDBKUTVaRkI4UzdU?checkout%5Bpayment_gateway%5D=shopify_payments&utm_campaign=shopifySale&utm_medium=checkout&utm_term=term_checkout&utm_content=web&utm_custom1=customutm&tag=tag',
      hash: '',
      host: 'store.myshopify.com',
      hostname: 'store.myshopify.com',
      origin: 'https://store.myshopify.com',
      pathname: '/checkouts/cn/Z2NwLXVzLWVhc3QxOjAxSjY5OVpIRURQNERFMDBKUTVaRkI4UzdU',
      port: '',
      protocol: 'https:',
      search: '',
    },
    referrer: 'https://store.myshopify.com/cart',
    title: 'Checkout - pixel-testing-rs',
    characterSet: 'UTF-8',
  },
  // title: 'Checkout - pixel-testing-rs',
  ...dummyResponseCommonPayload,
};
