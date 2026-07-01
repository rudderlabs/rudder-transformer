import stats from '../../../util/stats';
import { ConfigCategory } from './config';
import { buildEcommerceEventProperties, deriveSource, getEcommerceMapping } from './ecommerceUtil';
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
    { input: 'Product Viewed', brazeEvent: ConfigCategory.BRAZE_PRODUCT_VIEWED.brazeEvent },
    { input: 'product viewed', brazeEvent: ConfigCategory.BRAZE_PRODUCT_VIEWED.brazeEvent },
    { input: '  PRODUCT VIEWED  ', brazeEvent: ConfigCategory.BRAZE_PRODUCT_VIEWED.brazeEvent },
    {
      input: 'Product Added',
      brazeEvent: ConfigCategory.BRAZE_CART_UPDATED.brazeEvent,
      action: 'add',
    },
    {
      input: 'Product Removed',
      brazeEvent: ConfigCategory.BRAZE_CART_UPDATED.brazeEvent,
      action: 'remove',
    },
    { input: 'Checkout Started', brazeEvent: ConfigCategory.BRAZE_CHECKOUT_STARTED.brazeEvent },
    { input: 'Order Completed', brazeEvent: ConfigCategory.BRAZE_ORDER_PLACED.brazeEvent },
    { input: 'Order Refunded', brazeEvent: ConfigCategory.BRAZE_ORDER_REFUNDED.brazeEvent },
    { input: 'Order Cancelled', brazeEvent: ConfigCategory.BRAZE_ORDER_CANCELLED.brazeEvent },
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
        ConfigCategory.BRAZE_PRODUCT_VIEWED.brazeEvent,
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
        ConfigCategory.BRAZE_PRODUCT_VIEWED.brazeEvent,
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
        ConfigCategory.BRAZE_PRODUCT_VIEWED.brazeEvent,
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
        ConfigCategory.BRAZE_CART_UPDATED.brazeEvent,
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
        ConfigCategory.BRAZE_CART_UPDATED.brazeEvent,
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
        ConfigCategory.BRAZE_CART_UPDATED.brazeEvent,
        'add',
        destination,
      );

      const calls = validationCounterCalls();
      expect(calls).toHaveLength(1);
      expect(calls[0][2]).toEqual({
        destination_id: DESTINATION_ID,
        workspace_id: WORKSPACE_ID,
        braze_event: ConfigCategory.BRAZE_CART_UPDATED.brazeEvent,
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
        ConfigCategory.BRAZE_ORDER_PLACED.brazeEvent,
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
          ConfigCategory.BRAZE_ORDER_PLACED.brazeEvent,
          undefined,
          destination,
        ),
      ).not.toThrow();

      const calls = validationCounterCalls();
      expect(calls).toHaveLength(1);
      expect(calls[0][2]).toEqual({
        destination_id: DESTINATION_ID,
        workspace_id: WORKSPACE_ID,
        braze_event: ConfigCategory.BRAZE_ORDER_PLACED.brazeEvent,
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
        ConfigCategory.BRAZE_ORDER_PLACED.brazeEvent,
        undefined,
        destination,
      );

      expect((result.products as Record<string, unknown>[])[0].metadata).toEqual({
        color: 'blue',
        size: 'L',
      });
    });

    it('fires the validation counter when properties.products is empty and strips the field', () => {
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
        ConfigCategory.BRAZE_ORDER_PLACED.brazeEvent,
        undefined,
        destination,
      );

      // empty products[] is scrubbed off the outgoing payload
      expect(result.products).toBeUndefined();
      const calls = validationCounterCalls();
      expect(calls).toHaveLength(1);
      expect(calls[0][2]).toEqual({
        destination_id: DESTINATION_ID,
        workspace_id: WORKSPACE_ID,
        braze_event: ConfigCategory.BRAZE_ORDER_PLACED.brazeEvent,
      });
    });

    it('accepts total_discounts under either properties.discount or properties.total_discounts', () => {
      const messageWithDiscount = baseMessage({
        event: 'Order Completed',
        properties: {
          order_id: 'ord_001',
          total: 10,
          currency: 'USD',
          discount: 3,
          products: [{ product_id: 'sku', name: 'W', variant: 'v', quantity: 1, price: 10 }],
        },
      });
      const messageWithTotalDiscounts = baseMessage({
        event: 'Order Completed',
        properties: {
          order_id: 'ord_001',
          total: 10,
          currency: 'USD',
          total_discounts: 3,
          products: [{ product_id: 'sku', name: 'W', variant: 'v', quantity: 1, price: 10 }],
        },
      });

      const a = buildEcommerceEventProperties(
        messageWithDiscount,
        ConfigCategory.BRAZE_ORDER_PLACED.brazeEvent,
        undefined,
        destination,
      );
      const b = buildEcommerceEventProperties(
        messageWithTotalDiscounts,
        ConfigCategory.BRAZE_ORDER_PLACED.brazeEvent,
        undefined,
        destination,
      );

      expect(a.total_discounts).toBe(3);
      expect(b.total_discounts).toBe(3);
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
        ConfigCategory.BRAZE_ORDER_REFUNDED.brazeEvent,
        undefined,
        destination,
      );

      expect(result.order_id).toBe('ord_001');
      // empty products[] is scrubbed off the outgoing payload
      expect(result.products).toBeUndefined();
      const calls = validationCounterCalls();
      expect(calls).toHaveLength(1);
      expect(calls[0][2]).toEqual({
        destination_id: DESTINATION_ID,
        workspace_id: WORKSPACE_ID,
        braze_event: ConfigCategory.BRAZE_ORDER_REFUNDED.brazeEvent,
      });
    });
  });

  describe('payload scrubbing & metadata handling', () => {
    it('cart_updated with an explicit products[] keeps top-level product-like fields in metadata', () => {
      const message = baseMessage({
        event: 'Product Added',
        properties: {
          cart_id: 'cart_001',
          currency: 'USD',
          // top-level product-like fields coexisting with an explicit products[] array
          product_id: 'top-level-pid',
          name: 'top-level-name',
          products: [
            { product_id: 'sku_42', name: 'Widget', variant: 'v', quantity: 2, price: 9.99 },
          ],
        },
      });

      const result = buildEcommerceEventProperties(
        message,
        ConfigCategory.BRAZE_CART_UPDATED.brazeEvent,
        'add',
        destination,
      );

      // array is mapped, not the top-level wrap
      expect(result.products).toEqual([
        { product_id: 'sku_42', product_name: 'Widget', variant_id: 'v', quantity: 2, price: 9.99 },
      ]);
      // top-level product-like fields flow to metadata
      expect(result.metadata).toEqual({ product_id: 'top-level-pid', name: 'top-level-name' });
    });

    it('does not leak a caller-provided properties.action into metadata', () => {
      const message = baseMessage({
        event: 'Product Added',
        properties: {
          cart_id: 'cart_001',
          currency: 'USD',
          product_id: 'sku_42',
          name: 'Widget',
          variant: 'v',
          quantity: 1,
          price: 9.99,
          action: 'caller-supplied',
        },
      });

      const result = buildEcommerceEventProperties(
        message,
        ConfigCategory.BRAZE_CART_UPDATED.brazeEvent,
        'add',
        destination,
      );

      expect(result.action).toBe('add');
      expect(result.metadata).toBeUndefined();
    });

    it('does not emit a degenerate [{}] when cart_updated has no product fields', () => {
      const message = baseMessage({
        event: 'Product Added',
        properties: { cart_id: 'cart_001', currency: 'USD' },
      });

      const result = buildEcommerceEventProperties(
        message,
        ConfigCategory.BRAZE_CART_UPDATED.brazeEvent,
        'add',
        destination,
      );

      // no degenerate `[{}]` — the empty products array is scrubbed off entirely
      expect(result.products).toBeUndefined();
    });

    it('scrubs null/empty values out of event-level and per-product metadata', () => {
      const message = baseMessage({
        event: 'Order Completed',
        properties: {
          order_id: 'ord_001',
          total: 31.98,
          currency: 'USD',
          coupon: '',
          note: null,
          campaign: 'spring',
          products: [
            {
              product_id: 'sku',
              name: 'W',
              variant: 'v',
              quantity: 2,
              price: 15.99,
              color: '',
              shade: null,
              finish: 'matte',
            },
          ],
        },
      });

      const result = buildEcommerceEventProperties(
        message,
        ConfigCategory.BRAZE_ORDER_PLACED.brazeEvent,
        undefined,
        destination,
      );

      expect(result.metadata).toEqual({ campaign: 'spring' });
      expect((result.products as Record<string, unknown>[])[0].metadata).toEqual({
        finish: 'matte',
      });
    });

    it('honors an explicit properties.source with surrounding whitespace', () => {
      const message = baseMessage({
        event: 'Product Viewed',
        properties: {
          product_id: 'sku_42',
          name: 'Widget',
          variant: 'v',
          price: 9.99,
          currency: 'USD',
          source: 'ios ',
        },
      });

      const result = buildEcommerceEventProperties(
        message,
        ConfigCategory.BRAZE_PRODUCT_VIEWED.brazeEvent,
        undefined,
        destination,
      );

      expect(result.source).toBe('ios');
    });

    it('warns and scrubs a required field provided as an empty object', () => {
      const message = baseMessage({
        event: 'Product Viewed',
        properties: {
          product_id: 'sku_42',
          name: 'Widget',
          variant: 'v',
          price: 9.99,
          currency: {} as unknown as string,
        },
      });

      const result = buildEcommerceEventProperties(
        message,
        ConfigCategory.BRAZE_PRODUCT_VIEWED.brazeEvent,
        undefined,
        destination,
      );

      // empty-object required value is scrubbed off the payload...
      expect(result.currency).toBeUndefined();
      // ...AND counted as missing.
      expect(validationCounterCalls()).toHaveLength(1);
    });

    it('coerces numeric-string price to Float (event-level, Product Viewed)', () => {
      const message = baseMessage({
        event: 'Product Viewed',
        properties: {
          product_id: 'sku_42',
          name: 'Widget',
          variant: 'v',
          price: '29.99',
          currency: 'USD',
        },
      });

      const result = buildEcommerceEventProperties(
        message,
        ConfigCategory.BRAZE_PRODUCT_VIEWED.brazeEvent,
        undefined,
        destination,
      );

      expect(result.price).toBe(29.99);
      expect(typeof result.price).toBe('number');
    });

    it('coerces numeric-string quantity to Integer (per-product)', () => {
      const message = baseMessage({
        event: 'Order Completed',
        properties: {
          order_id: 'ord_001',
          total: 99.99,
          currency: 'USD',
          products: [
            {
              product_id: 'sku',
              name: 'W',
              variant: 'v',
              quantity: '2' as unknown as number,
              price: 99.99,
            },
          ],
        },
      });

      const result = buildEcommerceEventProperties(
        message,
        ConfigCategory.BRAZE_ORDER_PLACED.brazeEvent,
        undefined,
        destination,
      );

      const product = (result.products as Record<string, unknown>[])[0];
      expect(product.quantity).toBe(2);
      expect(typeof product.quantity).toBe('number');
    });

    it('coerces numeric order_id to String', () => {
      const message = baseMessage({
        event: 'Order Completed',
        properties: {
          order_id: 12345 as unknown as string,
          total: 99.99,
          currency: 'USD',
          products: [{ product_id: 'sku', name: 'W', variant: 'v', quantity: 1, price: 99.99 }],
        },
      });

      const result = buildEcommerceEventProperties(
        message,
        ConfigCategory.BRAZE_ORDER_PLACED.brazeEvent,
        undefined,
        destination,
      );

      expect(result.order_id).toBe('12345');
      expect(typeof result.order_id).toBe('string');
    });

    it('passes non-numeric string through verbatim for Float fields', () => {
      const message = baseMessage({
        event: 'Product Viewed',
        properties: {
          product_id: 'sku_42',
          name: 'Widget',
          variant: 'v',
          price: 'abc' as unknown as number,
          currency: 'USD',
        },
      });

      const result = buildEcommerceEventProperties(
        message,
        ConfigCategory.BRAZE_PRODUCT_VIEWED.brazeEvent,
        undefined,
        destination,
      );

      expect(result.price).toBe('abc');
    });

    it('does NOT coerce fractional numeric-string to Integer (would be lossy)', () => {
      const message = baseMessage({
        event: 'Order Completed',
        properties: {
          order_id: 'ord_001',
          total: 10,
          currency: 'USD',
          products: [
            {
              product_id: 'sku',
              name: 'W',
              variant: 'v',
              quantity: '2.5' as unknown as number,
              price: 10,
            },
          ],
        },
      });

      const result = buildEcommerceEventProperties(
        message,
        ConfigCategory.BRAZE_ORDER_PLACED.brazeEvent,
        undefined,
        destination,
      );

      const product = (result.products as Record<string, unknown>[])[0];
      // fractional string stays as-is — Braze will reject; no silent truncation
      expect(product.quantity).toBe('2.5');
    });

    it('leaves already-correct types untouched', () => {
      const message = baseMessage({
        event: 'Product Viewed',
        properties: {
          product_id: 'sku_42',
          name: 'Widget',
          variant: 'v',
          price: 29.99,
          currency: 'USD',
        },
      });

      const result = buildEcommerceEventProperties(
        message,
        ConfigCategory.BRAZE_PRODUCT_VIEWED.brazeEvent,
        undefined,
        destination,
      );

      expect(result.price).toBe(29.99);
      expect(result.product_id).toBe('sku_42');
    });

    it('strips Braze-reserved keys (`time`, `event_name`) from event-level metadata', () => {
      const message = baseMessage({
        event: 'Order Completed',
        properties: {
          order_id: 'ord_001',
          total: 10,
          currency: 'USD',
          time: 'should-be-stripped',
          event_name: 'should-be-stripped',
          campaign: 'spring',
          products: [
            { product_id: 'sku_42', name: 'Widget', variant: 'v', quantity: 1, price: 10 },
          ],
        },
      });

      const result = buildEcommerceEventProperties(
        message,
        ConfigCategory.BRAZE_ORDER_PLACED.brazeEvent,
        undefined,
        destination,
      );

      // reserved keys never reach metadata; legitimate unmapped key still flows through
      expect(result.metadata).toEqual({ campaign: 'spring' });
    });
  });
});
