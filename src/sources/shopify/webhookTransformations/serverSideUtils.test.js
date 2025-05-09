const { processEvent } = require('./serverSideTransform');
const {
  getProductsFromLineItems,
  createPropertiesForEcomEventFromWebhook,
  getAnonymousIdFromAttributes,
  getCartToken,
  setAnonymousId,
  addCartTokenHashToTraits,
  ensureAnonymousId,
} = require('./serverSideUtlis');

const stats = require('../../../util/stats');

const { lineItemsMappingJSON } = require('../config');
const Message = require('../../message');
const { RedisDB } = require('../../../util/redis/redisConnector');

jest.mock('../../message');
jest.mock('../../../util/stats', () => ({
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
        { brand: 'Hydrogen Vendor', price: 600, product_id: '7234590408818', quantity: 1 },
        {
          brand: 'Hydrogen Vendor',
          price: 600,
          product_id: '7234590408817',
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
    it('should add cart_token_hash to message context traits when cart token exists', () => {
      const message = { context: { traits: { existingTrait: 'value' } } };
      const event = { cart_token: 'Z2NwLXVzLWVhc3QxOjAxSkJaTUVRSjgzNUJUN1BTNjEzRFdRUFFQ' };
      const expectedHash = '9125e1da-57b9-5bdc-953e-eb2b0ded5edc';

      addCartTokenHashToTraits(message, event);

      expect(message.context.traits).toEqual({
        existingTrait: 'value',
        cart_token_hash: expectedHash,
      });
    });

    // Do not add cart token hash to traits when cart token does not exist in event
    it('should not add cart_token_hash to message context traits when cart token does not exist', () => {
      const message = { context: { traits: { existingTrait: 'value' } } };
      const event = { property: 'value' };
      addCartTokenHashToTraits(message, event);

      expect(message.context.traits).toEqual({ existingTrait: 'value' });
    });
  });

  describe('Test ensureAnonymousId', () => {
    it('should not modify message if anonymousId already exists', () => {
      const message = { anonymousId: 'existing-id' };
      const metricMetadata = { source: 'test', writeKey: 'test-key' };

      const result = ensureAnonymousId(message, metricMetadata);

      expect(result.anonymousId).toBe('existing-id');
      expect(stats.increment).not.toHaveBeenCalled();
    });

    it('should generate a random UUID if anonymousId is missing', () => {
      const message = {};
      const metricMetadata = { source: 'test', writeKey: 'test-key' };

      const result = ensureAnonymousId(message, metricMetadata);

      expect(result.anonymousId).toBeDefined();
      expect(typeof result.anonymousId).toBe('string');
      expect(stats.increment).toHaveBeenCalledWith('shopify_pixel_id_stitch_gaps', {
        event: undefined,
        reason: 'fallback_random_uuid',
        source: 'test',
        writeKey: 'test-key',
      });
    });
  });
});

describe('Redis cart token tests', () => {
  it('should get anonymousId property from redis', async () => {
    const getValSpy = jest
      .spyOn(RedisDB, 'getVal')
      .mockResolvedValue({ anonymousId: 'anonymousIdTest1' });
    const event = {
      id: 35550298931313,
      token: '84ad78572dae52a8cbea7d55371afe89',
      cart_token: 'Z2NwLXVzLWVhc3QxOjAxSkJaTUVRSjgzNUJUN1BTNjEzRFdRUFFQ',
      email: null,
      gateway: null,
      buyer_accepts_marketing: false,
      buyer_accepts_sms_marketing: false,
      sms_marketing_phone: null,
      created_at: '2024-11-06T02:22:00+00:00',
      updated_at: '2024-11-05T21:22:02-05:00',
      landing_site: '/',
      note: '',
      note_attributes: [],
      referring_site: '',
      shipping_lines: [],
      shipping_address: [],
      taxes_included: false,
      total_weight: 0,
      currency: 'USD',
      completed_at: null,
      phone: null,
      customer_locale: 'en-US',
      line_items: [
        {
          key: '41327142600817',
          fulfillment_service: 'manual',
          gift_card: false,
          grams: 0,
          presentment_title: 'The Collection Snowboard: Hydrogen',
          presentment_variant_title: '',
          product_id: 7234590408817,
          quantity: 1,
          requires_shipping: true,
          sku: '',
          tax_lines: [],
          taxable: true,
          title: 'The Collection Snowboard: Hydrogen',
          variant_id: 41327142600817,
          variant_title: '',
          variant_price: '600.00',
          vendor: 'Hydrogen Vendor',
          unit_price_measurement: {
            measured_type: null,
            quantity_value: null,
            quantity_unit: null,
            reference_value: null,
            reference_unit: null,
          },
          compare_at_price: null,
          line_price: '600.00',
          price: '600.00',
          applied_discounts: [],
          destination_location_id: null,
          user_id: null,
          rank: null,
          origin_location_id: null,
          properties: {},
        },
      ],
      name: '#35550298931313',
      abandoned_checkout_url:
        'https://pixel-testing-rs.myshopify.com/59026964593/checkouts/ac/Z2NwLXVzLWVhc3QxOjAxSkJaTUVRSjgzNUJUN1BTNjEzRFdRUFFQ/recover?key=0385163be3875d3a2117e982d9cc3517&locale=en-US',
      discount_codes: [],
      tax_lines: [],
      presentment_currency: 'USD',
      source_name: 'web',
      total_line_items_price: '600.00',
      total_tax: '0.00',
      total_discounts: '0.00',
      subtotal_price: '600.00',
      total_price: '600.00',
      total_duties: '0.00',
      device_id: null,
      user_id: null,
      location_id: null,
      source_identifier: null,
      source_url: null,
      source: null,
      closed_at: null,
      query_parameters: {
        topic: ['checkouts_create'],
        version: ['pixel'],
        writeKey: ['2mw9SN679HngnXXXHT4oSVVBVmb'],
      },
    };
    const message = await processEvent(event);
    expect(getValSpy).toHaveBeenCalledTimes(2);
    expect(getValSpy).toHaveBeenCalledWith('pixel:anonymousIdTest1');
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
