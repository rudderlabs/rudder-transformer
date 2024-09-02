import { Destination } from '../../../../src/types';

const destType = 'webhook_v2';
const destTypeInUpperCase = 'WEBHOOK_V2';
const displayName = 'Webhook V2';
const destinations: Destination[] = [
  {
    Config: {
      webhookUrl: 'http://abc.com/contacts',
      auth: 'noAuth',
      method: 'POST',
      format: 'JSON',
      isBatchingEnabled: true,
      maxBatchSize: '2',
      propertiesMapping: [
        {
          from: '$.traits.firstName',
          to: '$.contacts.first_name',
        },
        {
          from: '$.traits.email',
          to: '$.contacts.email',
        },
        {
          from: '$.traits.address.pinCode',
          to: '$.contacts.address.pin_code',
        },
      ],
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
  },
  {
    Config: {
      webhookUrl: 'http://abc.com/contact/$traits.userId',
      auth: 'basicAuth',
      username: 'test-user',
      password: '',
      method: 'GET',
      format: 'JSON',
      isBatchingEnabled: true,
      maxBatchSize: 2,
      headers: [
        {
          to: '$.h1',
          from: "'val1'",
        },
        {
          to: '$.h2',
          from: '2',
        },
        {
          to: "$.'content-type'",
          from: "'application/json'",
        },
        {
          to: '$.h3',
          from: '$.traits.firstName',
        },
      ],
      queryParams: [
        {
          to: '$.q1',
          from: "'val1'",
        },
        {
          to: '$.q2',
          from: '$.traits.email',
        },
      ],
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
  },
  {
    Config: {
      webhookUrl: 'http://abc.com/contacts/$.traits.userId/',
      auth: 'apiKeyAuth',
      apiKeyName: 'x-api-key',
      apiKeyValue: 'test-api-key',
      method: 'DELETE',
      isBatchingEnabled: true,
      maxBatchSize: 4,
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
  },
  {
    Config: {
      webhookUrl: 'http://abc.com/contacts/$.traits.userId/',
      auth: 'apiKeyAuth',
      apiKeyName: 'x-api-key',
      apiKeyValue: 'test-api-key',
      method: 'GET',
      isBatchingEnabled: true,
      maxBatchSize: 4,
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
  },
  {
    Config: {
      webhookUrl: 'http://abc.com/events',
      auth: 'bearerTokenAuth',
      bearerToken: 'test-token',
      method: 'POST',
      format: 'XML',
      headers: [
        {
          to: '$.h1',
          from: "'val1'",
        },
        {
          to: '$.h2',
          from: '$.key1',
        },
        {
          to: "$.'content-type'",
          from: "'application/json'",
        },
      ],
      propertiesMapping: [
        {
          from: '$.event',
          to: '$.event',
        },
        {
          from: '$.properties.currency',
          to: '$.currency',
        },
        {
          from: '$.userId',
          to: '$.userId',
        },
        {
          from: '$.properties.products[*].product_id',
          to: '$.properties.items[*].item_id',
        },
        {
          from: '$.properties.products[*].name',
          to: '$.properties.items[*].name',
        },
        {
          from: '$.properties.products[*].price',
          to: '$.properties.items[*].price',
        },
      ],
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
  },
  {
    Config: {
      webhookUrl: 'http://abc.com/events',
      auth: 'noAuth',
      method: 'POST',
      format: 'JSON',
      isBatchingEnabled: true,
      maxBatchSize: '4',
      headers: [
        {
          to: "$.'content-type'",
          from: "'application/json'",
        },
      ],
      propertiesMapping: [
        {
          from: '$.event',
          to: '$.event',
        },
        {
          from: '$.properties.currency',
          to: '$.currency',
        },
        {
          from: '$.userId',
          to: '$.userId',
        },
        {
          from: '$.properties.products[*].product_id',
          to: '$.properties.items[*].item_id',
        },
        {
          from: '$.properties.products[*].name',
          to: '$.properties.items[*].name',
        },
        {
          from: '$.properties.products[*].price',
          to: '$.properties.items[*].price',
        },
      ],
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
  },
];

const traits = {
  email: 'john.doe@example.com',
  firstName: 'John',
  lastName: 'Doe',
  phone: '1234567890',
  address: {
    city: 'New York',
    country: 'USA',
    pinCode: '123456',
  },
};

const properties = {
  checkout_id: '70324a1f0eaf000000000000',
  order_id: '40684e8f0eaf000000000000',
  affiliation: 'Vandelay Games',
  total: 52.0,
  subtotal: 45.0,
  revenue: 50.0,
  shipping: 4.0,
  tax: 3.0,
  discount: 5.0,
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
  ],
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

export {
  destType,
  destinations,
  processorInstrumentationErrorStatTags,
  RouterInstrumentationErrorStatTags,
  traits,
  properties,
};
