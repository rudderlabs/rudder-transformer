const { processEvent } = require('./serverSideTransform');
const {
  getProductsFromLineItems,
  createPropertiesForEcomEventFromWebhook,
  getAnonymousIdFromAttributes,
  getCartToken,
  setAnonymousId,
} = require('./serverSideUtlis');
const { RedisDB } = require('../../../../util/redis/redisConnector');

const { lineItemsMappingJSON } = require('../../../../v0/sources/shopify/config');
const Message = require('../../../../v0/sources/message');
jest.mock('../../../../v0/sources/message');

const LINEITEMS = [
  {
    id: '41327142600817',
    grams: 0,
    presentment_title: 'The Collection Snowboard: Hydrogen',
    product_id: 7234590408818,
    quantity: 1,
    sku: '',
    taxable: true,
    title: 'The Collection Snowboard: Hydrogen',
    variant_id: 41327142600817,
    variant_title: '',
    variant_price: '600.00',
    vendor: 'Hydrogen Vendor',
    line_price: '600.00',
    price: '600.00',
    applied_discounts: [],
    properties: {},
  },
  {
    id: 14234727743601,
    gift_card: false,
    grams: 0,
    name: 'The Collection Snowboard: Nitrogen',
    price: '600.00',
    product_exists: true,
    product_id: 7234590408817,
    properties: [],
    quantity: 1,
    sku: '',
    title: 'The Collection Snowboard: Nitrogen',
    total_discount: '0.00',
    variant_id: 41327142600817,
    vendor: 'Hydrogen Vendor',
  },
];

describe('serverSideUtils.js', () => {
  beforeEach(() => {
    Message.mockClear();
  });

  describe('Test getProductsFromLineItems function', () => {
    it('should return empty array if lineItems is empty', () => {
      const lineItems = [];
      const result = getProductsFromLineItems(lineItems, lineItemsMappingJSON);
      expect(result).toEqual([]);
    });

    it('should return array of products', () => {
      const result = getProductsFromLineItems(LINEITEMS, lineItemsMappingJSON);
      expect(result).toEqual([
        { brand: 'Hydrogen Vendor', price: '600.00', product_id: 7234590408818, quantity: 1 },
        {
          brand: 'Hydrogen Vendor',
          price: '600.00',
          product_id: 7234590408817,
          quantity: 1,
          title: 'The Collection Snowboard: Nitrogen',
        },
      ]);
    });
  });

  describe('Test createPropertiesForEcomEventFromWebhook function', () => {
    it('should return empty array if lineItems is empty', () => {
      const message = {
        line_items: [],
        type: 'track',
        event: 'checkout created',
      };
      const result = createPropertiesForEcomEventFromWebhook(message);
      expect(result).toEqual([]);
    });

    it('should return array of products', () => {
      const message = {
        line_items: LINEITEMS,
        type: 'track',
        event: 'checkout updated',
      };
      const result = createPropertiesForEcomEventFromWebhook(message);
      expect(result).toEqual({
        products: [
          { brand: 'Hydrogen Vendor', price: 600.0, product_id: '7234590408818', quantity: 1 },
          {
            brand: 'Hydrogen Vendor',
            price: 600.0,
            product_id: '7234590408817',
            quantity: 1,
            title: 'The Collection Snowboard: Nitrogen',
          },
        ],
      });
    });
  });

  describe('getAnonymousIdFromAttributes', () => {
    // Handles empty note_attributes array gracefully
    it('should return null when note_attributes is an empty array', async () => {
      const event = { note_attributes: [] };
      const result = getAnonymousIdFromAttributes(event);
      expect(result).toBeNull();
    });

    it('should return null when note_attributes is not present', async () => {
      const event = {};
      const result = getAnonymousIdFromAttributes(event);
      expect(result).toBeNull();
    });

    it('get anonymousId from noteAttributes', async () => {
      const event = {
        note_attributes: [{ name: 'rudderAnonymousId', value: '123456' }],
      };
      const result = getAnonymousIdFromAttributes(event);
      expect(result).toEqual('123456');
    });
  });

  describe('getCartToken', () => {
    it('should return null if cart_token is not present', () => {
      const event = {};
      const result = getCartToken(event);
      expect(result).toBeNull();
    });

    it('should return cart_token if it is present', () => {
      const event = { cart_token: 'cartTokenTest1' };
      const result = getCartToken(event);
      expect(result).toEqual('cartTokenTest1');
    });
  });
});

describe('Redis cart token tests', () => {
  it('should get anonymousId property from redis', async () => {
    const getValSpy = jest
      .spyOn(RedisDB, 'getVal')
      .mockResolvedValue({ anonymousId: 'anonymousIdTest1' });
    const event = {
      cart_token: `cartTokenTest1`,
      id: 5778367414385,
      line_items: [
        {
          id: 14234727743601,
        },
      ],
      query_parameters: {
        topic: ['orders_updated'],
        version: ['pixel'],
        writeKey: ['dummy-write-key'],
      },
    };
    const message = await processEvent(event);
    expect(getValSpy).toHaveBeenCalledTimes(1);
    expect(getValSpy).toHaveBeenCalledWith('pixel:cartTokenTest1');
    expect(message.anonymousId).toEqual('anonymousIdTest1');
  });

  it('should generate new anonymousId using UUID v5 when no existing ID is found', async () => {
    const message = {};
    const event = {
      note_attributes: [],
    };
    const metricMetadata = { source: 'test', writeKey: 'test-key' };
    const cartToken = 'test-cart-token';
    const mockRedisData = null;
    const expectedAnonymousId = '5c2cff2c-9cb1-59e5-82f9-fa5241f0e240';
    jest.mock('uuid', () => ({
      v5: jest.fn(() => expectedAnonymousId),
      DNS: 'dns-namespace',
    }));
    RedisDB.getVal = jest.spyOn(RedisDB, 'getVal').mockResolvedValue(mockRedisData);
    await setAnonymousId(message, { ...event, cart_token: cartToken }, metricMetadata);
    expect(message.anonymousId).toBe(expectedAnonymousId);
    expect(message.traits.cart_token_hash).toBe(expectedAnonymousId);
  });
});
