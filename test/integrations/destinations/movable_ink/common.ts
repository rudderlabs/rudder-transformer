import { Destination } from '../../../../src/types';

const destType = 'movable_ink';
const destTypeInUpperCase = 'MOVABLE_INK';
const displayName = 'Movable Ink';
const channel = 'web';
const destination: Destination = {
  Config: {
    endpoint: 'https://collector.movableink-dmz.com/behavioral/abc123',
    accessKey: 'test-access-key',
    accessSecret: 'test_access_secret',
  },
  DestinationDefinition: {
    DisplayName: displayName,
    ID: '123',
    Name: destTypeInUpperCase,
    Config: { cdkV2Enabled: true },
  },
  Enabled: true,
  ID: '123',
  Name: destTypeInUpperCase,
  Transformations: [],
  WorkspaceID: 'test-workspace-id',
};

const processorInstrumentationErrorStatTags = {
  destType: destTypeInUpperCase,
  errorCategory: 'dataValidation',
  errorType: 'instrumentation',
  feature: 'processor',
  implementation: 'cdkV2',
  module: 'destination',
  destinationId: 'default-destinationId',
  workspaceId: 'default-workspaceId',
};

const RouterInstrumentationErrorStatTags = {
  ...processorInstrumentationErrorStatTags,
  feature: 'router',
};

const traits = {
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  phone: '1234567890',
};

const headers = {
  'Content-Type': 'application/json',
  Authorization: 'Basic dGVzdC1hY2Nlc3Mta2V5OnRlc3RfYWNjZXNzX3NlY3JldA==',
};

const commonProperties = {
  product_id: '622c6f5d5cf86a4c77358033',
  sku: '8472-998-0112',
  categories: [
    { url: 'https://example1', id: '1' },
    { url: 'https://example2', id: '2' },
  ],
  name: 'Cones of Dunshire',
  brand: 'Wyatt Games',
  variant: 'expansion pack',
  price: 49.99,
  quantity: 5,
  coupon: 'PREORDER15',
  position: 1,
  url: 'https://www.website.com/product/path',
  image_url: 'https://www.website.com/product/path.webp',
};

const customProperties = {
  key1: 'value1',
  key2: true,
  key3: ['value3'],
  key4: { key5: { key6: 'value6' } },
};

const trackTestProperties = {
  'Product Added': { ...commonProperties, ...customProperties },
  'Product Viewed': { ...commonProperties, ...customProperties },
  'Order Completed': {
    checkout_id: '70324a1f0eaf000000000000',
    order_id: '40684e8f0eaf000000000000',
    affiliation: 'Vandelay Games',
    total: 52,
    subtotal: 45,
    revenue: 50,
    shipping: 4,
    tax: 3,
    discount: 5,
    coupon: 'NEWCUST5',
    currency: 'USD',
    products: [
      {
        product_id: '622c6f5d5cf86a4c77358033',
        sku: '8472-998-0112',
        name: 'Cones of Dunshire',
        price: 40,
        position: 1,
        category: 'Games',
        url: 'https://www.website.com/product/path',
        image_url: 'https://www.website.com/product/path.jpg',
      },
      {
        product_id: '577c6f5d5cf86a4c7735ba03',
        sku: '3309-483-2201',
        name: 'Five Crowns',
        price: 5,
        position: 2,
        category: 'Games',
      },
      {
        product_id: '122c6f5d5cf86a4c77358033',
        sku: '7472-998-0112',
        name: 'Ticket to Ride',
        price: 20,
        position: 3,
        category: 'Games',
      },
      {
        product_id: '222c6f5d5cf86a4c77358033',
        sku: '9472-998-0112',
        name: 'Catan',
        price: 30,
        position: 4,
        category: 'Games',
      },
      {
        product_id: '322c6f5d5cf86a4c77358033',
        sku: '7472-998-0112',
        name: 'Pandemic',
        price: 25,
        position: 5,
        category: 'Games',
      },
      {
        product_id: '422c6f5d5cf86a4c77358033',
        sku: '8472-998-0113',
        name: 'Exploding Kittens',
        price: 15,
        position: 6,
        category: 'Games',
      },
      {
        product_id: '522c6f5d5cf86a4c77358033',
        sku: '8472-998-0114',
        name: 'Codenames',
        price: 18,
        position: 7,
        category: 'Games',
      },
      {
        product_id: '622c6f5d5cf86a4c77358034',
        sku: '8472-998-0115',
        name: 'Scythe',
        price: 35,
        position: 8,
        category: 'Games',
      },
      {
        product_id: '622c6f5d5cf86a4c77358033',
        sku: '8472-998-0112',
        name: 'Cones of Dunshire',
        price: 40,
        position: 1,
        category: 'Games',
        url: 'https://www.website.com/product/path',
        image_url: 'https://www.website.com/product/path.jpg',
      },
      {
        product_id: '577c6f5d5cf86a4c7735ba03',
        sku: '3309-483-2201',
        name: 'Five Crowns',
        price: 5,
        position: 2,
        category: 'Games',
      },
      {
        product_id: '122c6f5d5cf86a4c77358033',
        sku: '7472-998-0112',
        name: 'Ticket to Ride',
        price: 20,
        position: 3,
        category: 'Games',
      },
      {
        product_id: '222c6f5d5cf86a4c77358033',
        sku: '9472-998-0112',
        name: 'Catan',
        price: 30,
        position: 4,
        category: 'Games',
      },
      {
        product_id: '322c6f5d5cf86a4c77358033',
        sku: '7472-998-0112',
        name: 'Pandemic',
        price: 25,
        position: 5,
        category: 'Games',
      },
      {
        product_id: '422c6f5d5cf86a4c77358033',
        sku: '8472-998-0113',
        name: 'Exploding Kittens',
        price: 15,
        position: 6,
        category: 'Games',
      },
      {
        product_id: '522c6f5d5cf86a4c77358033',
        sku: '8472-998-0114',
        name: 'Codenames',
        price: 18,
        position: 7,
        category: 'Games',
      },
      {
        product_id: '622c6f5d5cf86a4c77358034',
        sku: '8472-998-0115',
        name: 'Scythe',
        price: 35,
        position: 8,
        category: 'Games',
      },
      {
        product_id: '622c6f5d5cf86a4c77358033',
        sku: '8472-998-0112',
        name: 'Cones of Dunshire',
        price: 40,
        position: 1,
        category: 'Games',
        url: 'https://www.website.com/product/path',
        image_url: 'https://www.website.com/product/path.jpg',
      },
      {
        product_id: '577c6f5d5cf86a4c7735ba03',
        sku: '3309-483-2201',
        name: 'Five Crowns',
        price: 5,
        position: 2,
        category: 'Games',
      },
      {
        product_id: '122c6f5d5cf86a4c77358033',
        sku: '7472-998-0112',
        name: 'Ticket to Ride',
        price: 20,
        position: 3,
        category: 'Games',
      },
      {
        product_id: '222c6f5d5cf86a4c77358033',
        sku: '9472-998-0112',
        name: 'Catan',
        price: 30,
        position: 4,
        category: 'Games',
      },
      {
        product_id: '322c6f5d5cf86a4c77358033',
        sku: '7472-998-0112',
        name: 'Pandemic',
        price: 25,
        position: 5,
        category: 'Games',
      },
      {
        product_id: '422c6f5d5cf86a4c77358033',
        sku: '8472-998-0113',
        name: 'Exploding Kittens',
        price: 15,
        position: 6,
        category: 'Games',
      },
      {
        product_id: '522c6f5d5cf86a4c77358033',
        sku: '8472-998-0114',
        name: 'Codenames',
        price: 18,
        position: 7,
        category: 'Games',
      },
      {
        product_id: '622c6f5d5cf86a4c77358034',
        sku: '8472-998-0115',
        name: 'Scythe',
        price: 35,
        position: 8,
        category: 'Games',
      },
    ],
  },
  'Products Searched': { query: 'HDMI cable', url: 'https://www.website.com/product/path' },
  'Custom event': { ...commonProperties, key1: 'value1', key2: true },
};

export {
  destType,
  channel,
  destination,
  processorInstrumentationErrorStatTags,
  RouterInstrumentationErrorStatTags,
  traits,
  headers,
  trackTestProperties,
};
