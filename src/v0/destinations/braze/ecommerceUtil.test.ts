import stats from '../../../util/stats';
import {
  BRAZE_ECOMMERCE_EVENTS,
  buildEcommerceEventProperties,
  deriveSource,
  getEcommerceMapping,
} from './ecommerceUtil';
import type { BrazeDestination, RudderBrazeMessage } from './types';

jest.mock('../../../util/stats', () => ({
  __esModule: true,
  default: {
    counter: jest.fn(),
    increment: jest.fn(),
    gauge: jest.fn(),
    histogram: jest.fn(),
    timing: jest.fn(),
  },
}));

const VALIDATION_WARN_COUNTER = 'braze_recommended_event_validation_warn';
const DESTINATION_ID = 'dest-123';
const WORKSPACE_ID = 'ws-456';

const destination = {
  ID: DESTINATION_ID,
  WorkspaceID: WORKSPACE_ID,
  Config: { restApiKey: 'k', dataCenter: 'US-01' },
} as unknown as BrazeDestination;

const mockedCounter = stats.counter as jest.MockedFunction<typeof stats.counter>;

beforeEach(() => {
  mockedCounter.mockClear();
});

const validationCounterCalls = () =>
  mockedCounter.mock.calls.filter(([name]) => name === VALIDATION_WARN_COUNTER);

describe('getEcommerceMapping', () => {
  const mappingCases: Array<{ input: string; brazeEvent: string; action?: string }> = [
    { input: 'Product Viewed', brazeEvent: BRAZE_ECOMMERCE_EVENTS.PRODUCT_VIEWED },
    { input: 'product viewed', brazeEvent: BRAZE_ECOMMERCE_EVENTS.PRODUCT_VIEWED },
    { input: '  PRODUCT VIEWED  ', brazeEvent: BRAZE_ECOMMERCE_EVENTS.PRODUCT_VIEWED },
    { input: 'Product Added', brazeEvent: BRAZE_ECOMMERCE_EVENTS.CART_UPDATED, action: 'add' },
    { input: 'Product Removed', brazeEvent: BRAZE_ECOMMERCE_EVENTS.CART_UPDATED, action: 'remove' },
    { input: 'Checkout Started', brazeEvent: BRAZE_ECOMMERCE_EVENTS.CHECKOUT_STARTED },
    { input: 'Order Completed', brazeEvent: BRAZE_ECOMMERCE_EVENTS.ORDER_PLACED },
    { input: 'Order Refunded', brazeEvent: BRAZE_ECOMMERCE_EVENTS.ORDER_REFUNDED },
    { input: 'Order Cancelled', brazeEvent: BRAZE_ECOMMERCE_EVENTS.ORDER_CANCELLED },
  ];

  it.each(mappingCases)(
    'maps "$input" to $brazeEvent (action=$action)',
    ({ input, brazeEvent, action }) => {
      expect(getEcommerceMapping(input)).toEqual(action ? { brazeEvent, action } : { brazeEvent });
    },
  );

  const unmappedCases: Array<{ input: unknown; label: string }> = [
    { input: 'Login', label: 'unmapped custom event' },
    { input: 'Product Clicked', label: 'product clicked (no Braze counterpart)' },
    { input: '', label: 'empty string' },
    { input: undefined, label: 'undefined' },
    { input: 42, label: 'number' },
  ];

  it.each(unmappedCases)('returns undefined for $label', ({ input }) => {
    expect(getEcommerceMapping(input as string)).toBeUndefined();
  });
});

describe('deriveSource', () => {
  const cases: Array<{ label: string; message: Partial<RudderBrazeMessage>; expected: string }> = [
    // Explicit precedence — properties.source wins
    {
      label: 'properties.source = web overrides envelope',
      message: { properties: { source: 'web' }, context: { channel: 'mobile' } } as any,
      expected: 'web',
    },
    {
      label: 'properties.source = ios on a web-channel event',
      message: { properties: { source: 'ios' }, context: { channel: 'web' } } as any,
      expected: 'ios',
    },
    {
      label: 'properties.source = android (case-insensitive)',
      message: { properties: { source: 'ANDROID' }, channel: 'sources' } as any,
      expected: 'android',
    },
    // Invalid explicit values fall through to envelope
    {
      label: 'properties.source = tablet falls through to envelope (web channel)',
      message: { properties: { source: 'tablet' }, context: { channel: 'web' } } as any,
      expected: 'web',
    },
    // Envelope derivation
    {
      label: 'context.channel = web → web',
      message: { context: { channel: 'web' } } as any,
      expected: 'web',
    },
    {
      label: 'context.channel = mobile + ios OS',
      message: { context: { channel: 'mobile', os: { name: 'iOS' } } } as any,
      expected: 'ios',
    },
    {
      label: 'context.channel = mobile + Android OS',
      message: { context: { channel: 'mobile', os: { name: 'Android' } } } as any,
      expected: 'android',
    },
    // Default to web
    {
      label: 'server channel defaults to web',
      message: { channel: 'server' } as any,
      expected: 'web',
    },
    {
      label: 'unknown channel defaults to web',
      message: { context: { channel: 'sources' } } as any,
      expected: 'web',
    },
    {
      label: 'mobile + unknown OS defaults to web',
      message: { context: { channel: 'mobile', os: { name: 'Linux' } } } as any,
      expected: 'web',
    },
    {
      label: 'no channel at all defaults to web',
      message: {} as any,
      expected: 'web',
    },
  ];

  it.each(cases)('$label → $expected', ({ message, expected }) => {
    expect(deriveSource(message as RudderBrazeMessage)).toBe(expected);
  });
});

describe('buildEcommerceEventProperties', () => {
  const baseMessage = (overrides: Partial<RudderBrazeMessage> = {}) =>
    ({
      type: 'track',
      event: 'Order Completed',
      channel: 'web',
      properties: {},
      ...overrides,
    }) as unknown as RudderBrazeMessage;

  describe('Product Viewed → product_viewed (flat event)', () => {
    it('maps all required fields, sets source, no products array', () => {
      const message = baseMessage({
        event: 'Product Viewed',
        channel: 'web',
        properties: {
          product_id: 'sku_42',
          name: 'Widget',
          variant: 'red',
          price: 9.99,
          currency: 'USD',
        },
      });

      const result = buildEcommerceEventProperties(
        message,
        BRAZE_ECOMMERCE_EVENTS.PRODUCT_VIEWED,
        undefined,
        destination,
      );

      expect(result).toEqual({
        product_id: 'sku_42',
        product_name: 'Widget',
        variant_id: 'red',
        price: 9.99,
        currency: 'USD',
        source: 'web',
      });
      expect(validationCounterCalls()).toHaveLength(0);
    });

    it('routes unmapped event-level keys to metadata', () => {
      const message = baseMessage({
        event: 'Product Viewed',
        properties: {
          product_id: 'sku_42',
          name: 'Widget',
          variant: 'red',
          price: 9.99,
          currency: 'USD',
          category: 'home',
          brand: 'Acme',
        },
      });

      const result = buildEcommerceEventProperties(
        message,
        BRAZE_ECOMMERCE_EVENTS.PRODUCT_VIEWED,
        undefined,
        destination,
      );

      expect(result.metadata).toEqual({ category: 'home', brand: 'Acme' });
    });

    it('falls back through product_id → sku for variant_id', () => {
      const message = baseMessage({
        event: 'Product Viewed',
        properties: { sku: 'sku_99', name: 'X', price: 1, currency: 'USD' },
      });

      const result = buildEcommerceEventProperties(
        message,
        BRAZE_ECOMMERCE_EVENTS.PRODUCT_VIEWED,
        undefined,
        destination,
      );

      // product_id and variant_id both fall back to sku
      expect(result.product_id).toBe('sku_99');
      expect(result.variant_id).toBe('sku_99');
    });
  });

  describe('Product Added → cart_updated(add) — single-product wrap', () => {
    it('wraps top-level product fields into a 1-element products array', () => {
      const message = baseMessage({
        event: 'Product Added',
        properties: {
          cart_id: 'cart_001',
          currency: 'USD',
          product_id: 'sku_42',
          name: 'Widget',
          quantity: 2,
          price: 9.99,
          category: 'home',
        },
      });

      const result = buildEcommerceEventProperties(
        message,
        BRAZE_ECOMMERCE_EVENTS.CART_UPDATED,
        'add',
        destination,
      );

      expect(result).toEqual({
        cart_id: 'cart_001',
        currency: 'USD',
        action: 'add',
        source: 'web',
        products: [
          {
            product_id: 'sku_42',
            product_name: 'Widget',
            variant_id: 'sku_42',
            quantity: 2,
            price: 9.99,
          },
        ],
        metadata: { category: 'home' },
      });
    });

    it('preserves quantity = 0 (falsy but valid for cart removal flows)', () => {
      const message = baseMessage({
        event: 'Product Added',
        properties: {
          cart_id: 'cart_001',
          currency: 'USD',
          product_id: 'sku_42',
          name: 'Widget',
          quantity: 0,
          price: 9.99,
        },
      });

      const result = buildEcommerceEventProperties(
        message,
        BRAZE_ECOMMERCE_EVENTS.CART_UPDATED,
        'add',
        destination,
      );

      expect((result.products as Record<string, unknown>[])[0].quantity).toBe(0);
    });

    it('fires the validation counter when Product Added has no currency (RS-spec gap)', () => {
      const message = baseMessage({
        event: 'Product Added',
        properties: {
          cart_id: 'cart_001',
          product_id: 'sku_42',
          name: 'Widget',
          quantity: 1,
          price: 9.99,
        },
      });

      buildEcommerceEventProperties(
        message,
        BRAZE_ECOMMERCE_EVENTS.CART_UPDATED,
        'add',
        destination,
      );

      const calls = validationCounterCalls();
      expect(calls).toHaveLength(1);
      expect(calls[0][2]).toEqual({
        destination_id: DESTINATION_ID,
        workspace_id: WORKSPACE_ID,
        braze_event: BRAZE_ECOMMERCE_EVENTS.CART_UPDATED,
      });
    });
  });

  describe('Order Completed → order_placed', () => {
    it('maps products[] and falls back total → revenue → value', () => {
      const message = baseMessage({
        event: 'Order Completed',
        properties: {
          order_id: 'ord_001',
          revenue: 99.99,
          currency: 'USD',
          products: [
            { product_id: 'sku_42', name: 'Widget', quantity: 1, price: 99.99, color: 'blue' },
          ],
          campaign_id: 'spring26',
        },
      });

      const result = buildEcommerceEventProperties(
        message,
        BRAZE_ECOMMERCE_EVENTS.ORDER_PLACED,
        undefined,
        destination,
      );

      expect(result).toEqual({
        order_id: 'ord_001',
        total_value: 99.99,
        currency: 'USD',
        source: 'web',
        products: [
          {
            product_id: 'sku_42',
            product_name: 'Widget',
            variant_id: 'sku_42',
            quantity: 1,
            price: 99.99,
            metadata: { color: 'blue' },
          },
        ],
        metadata: { campaign_id: 'spring26' },
      });
    });

    it('emits a single validation counter when multiple required fields are missing (no throw)', () => {
      const message = baseMessage({
        event: 'Order Completed',
        properties: {
          // order_id, total/revenue/value, currency all missing
          products: [{ product_id: 'sku_42', name: 'Widget', quantity: 1, price: 1 }],
        },
      });

      expect(() =>
        buildEcommerceEventProperties(
          message,
          BRAZE_ECOMMERCE_EVENTS.ORDER_PLACED,
          undefined,
          destination,
        ),
      ).not.toThrow();

      const calls = validationCounterCalls();
      expect(calls).toHaveLength(1);
      expect(calls[0][2]).toEqual({
        destination_id: DESTINATION_ID,
        workspace_id: WORKSPACE_ID,
        braze_event: BRAZE_ECOMMERCE_EVENTS.ORDER_PLACED,
      });
    });

    it('routes per-product unmapped keys to products[].metadata', () => {
      const message = baseMessage({
        event: 'Order Completed',
        properties: {
          order_id: 'ord_001',
          total: 10,
          currency: 'USD',
          products: [
            { product_id: 'sku', name: 'W', quantity: 1, price: 10, color: 'blue', size: 'L' },
          ],
        },
      });

      const result = buildEcommerceEventProperties(
        message,
        BRAZE_ECOMMERCE_EVENTS.ORDER_PLACED,
        undefined,
        destination,
      );

      expect((result.products as Record<string, unknown>[])[0].metadata).toEqual({
        color: 'blue',
        size: 'L',
      });
    });

    it('fires the validation counter when properties.products is empty', () => {
      const message = baseMessage({
        event: 'Order Completed',
        properties: {
          order_id: 'ord_001',
          total: 10,
          currency: 'USD',
          products: [],
        },
      });

      const result = buildEcommerceEventProperties(
        message,
        BRAZE_ECOMMERCE_EVENTS.ORDER_PLACED,
        undefined,
        destination,
      );

      expect(result.products).toEqual([]);
      const calls = validationCounterCalls();
      expect(calls).toHaveLength(1);
      expect(calls[0][2]).toEqual({
        destination_id: DESTINATION_ID,
        workspace_id: WORKSPACE_ID,
        braze_event: BRAZE_ECOMMERCE_EVENTS.ORDER_PLACED,
      });
    });
  });

  describe('Order Refunded → order_refunded (chronic GAP per OQ-8)', () => {
    it('fires one validation counter when RS only sends order_id', () => {
      const message = baseMessage({
        event: 'Order Refunded',
        properties: { order_id: 'ord_001' },
      });

      const result = buildEcommerceEventProperties(
        message,
        BRAZE_ECOMMERCE_EVENTS.ORDER_REFUNDED,
        undefined,
        destination,
      );

      expect(result.order_id).toBe('ord_001');
      expect(result.products).toEqual([]);
      const calls = validationCounterCalls();
      expect(calls).toHaveLength(1);
      expect(calls[0][2]).toEqual({
        destination_id: DESTINATION_ID,
        workspace_id: WORKSPACE_ID,
        braze_event: BRAZE_ECOMMERCE_EVENTS.ORDER_REFUNDED,
      });
    });
  });
});
