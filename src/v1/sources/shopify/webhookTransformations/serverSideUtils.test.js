const { processEvent } = require('./serverSideTransform');
const {
  getProductsFromLineItems,
  createPropertiesForEcomEventFromWebhook,
  getAnonymousIdFromAttributes,
  getCartToken,
  setAnonymousId,
  addCartTokenHashToTraits,
} = require('./serverSideUtlis');
const { RedisDB } = require('../../../../util/redis/redisConnector');
const stats = require('../../../../util/stats');

const { lineItemsMappingJSON } = require('../../../../v0/sources/shopify/config');
const Message = require('../../../../v0/sources/message');
const { property } = require('lodash');
jest.mock('../../../../v0/sources/message');
jest.mock('../../../../util/stats', () => ({
  increment: jest.fn(),
}));

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

  describe('Test getCartToken', () => {
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

  describe('Test addCartTokenHashToTraits', () => {
    // Add cart token hash to traits when cart token exists in event
    it('should add cart_token_hash to message traits when cart token exists', () => {
      const message = { traits: { existingTrait: 'value' } };
      const event = { cart_token: 'Z2NwLXVzLWVhc3QxOjAxSkJaTUVRSjgzNUJUN1BTNjEzRFdRUFFQ' };
      const expectedHash = '9125e1da-57b9-5bdc-953e-eb2b0ded5edc';

      addCartTokenHashToTraits(message, event);

      expect(message.traits).toEqual({
        existingTrait: 'value',
        cart_token_hash: expectedHash,
      });
    });

    // Do not add cart token hash to traits when cart token does not exist in event
    it('should not add cart_token_hash to message traits when cart token does not exist', () => {
      const message = { traits: { existingTrait: 'value' } };
      const event = { property: 'value' };
      addCartTokenHashToTraits(message, event);

      expect(message.traits).toEqual({ existingTrait: 'value' });
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
    const expectedAnonymousId = '40a532a2-88be-5e3a-8687-56e34739e89d';
    jest.mock('uuid', () => ({
      v5: jest.fn(() => expectedAnonymousId),
      DNS: 'dns-namespace',
    }));
    RedisDB.getVal = jest.spyOn(RedisDB, 'getVal').mockResolvedValue(mockRedisData);
    await setAnonymousId(message, { ...event, cart_token: cartToken }, metricMetadata);
    expect(message.anonymousId).toBe(expectedAnonymousId);
  });

  it('should handle undefined event parameter without error', async () => {
    const message = {};

    const metricMetadata = {
      source: 'test-source',
      writeKey: 'test-key',
    };

    await setAnonymousId(message, undefined, metricMetadata);

    expect(message.anonymousId).toBeUndefined();

    expect(stats.increment).toHaveBeenCalledWith('shopify_pixel_id_stitch_gaps', {
      event: message.event,
      reason: 'cart_token_miss',
      source: metricMetadata.source,
      writeKey: metricMetadata.writeKey,
    });
  });
});
