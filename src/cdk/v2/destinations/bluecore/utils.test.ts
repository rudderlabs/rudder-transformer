import {
  normalizeProductArray,
  verifyPayload,
  isStandardBluecoreEvent,
  deduceTrackEventName,
  populateAccurateDistinctId,
  createProductForStandardEcommEvent,
} from './utils';
import { InstrumentationError } from '@rudderstack/integrations-lib';

describe('Bluecore Utils', () => {
  describe('normalizeProductArray', () => {
    const testCases = [
      {
        name: 'should normalize array of products',
        products: [
          { product_id: 1, name: 'Product 1' },
          { product_id: 2, name: 'Product 2' },
        ],
        expected: [
          { id: 1, name: 'Product 1' },
          { id: 2, name: 'Product 2' },
        ],
      },
      {
        name: 'should normalize single product object',
        products: { product_id: 1, name: 'Product 1' },
        expected: [{ id: 1, name: 'Product 1' }],
      },
      {
        name: 'should handle null products for custom event',
        products: null,
        expected: null,
      },
    ];

    testCases.forEach(({ name, products, expected }) => {
      it(name, () => {
        const result = normalizeProductArray(products);
        expect(result).toEqual(expected);
      });
    });
  });

  describe('verifyPayload', () => {
    const testCases = [
      {
        name: 'should verify search event with search_term',
        payload: {
          event: 'search',
          properties: { search_term: 'example' },
        },
        message: { type: 'track' },
        shouldThrow: false,
      },
      {
        name: 'should verify purchase event with missing customer',
        payload: {
          event: 'purchase',
          properties: { order_id: '123', total: 100 },
        },
        message: { type: 'track' },
        shouldThrow: true,
      },
      {
        name: 'should verify identify event with email',
        payload: {
          event: 'identify',
          properties: { customer: { first_name: 'John' } },
        },
        message: { type: 'identify', traits: { email: 'test@example.com' } },
        shouldThrow: false,
      },
      {
        name: 'should fail search event without search_term',
        payload: {
          event: 'search',
          properties: {},
        },
        message: { type: 'track' },
        shouldThrow: true,
      },
      {
        name: 'should fail purchase event without order_id',
        payload: {
          event: 'purchase',
          properties: { total: 100 },
        },
        message: { type: 'track' },
        shouldThrow: true,
      },
    ];

    testCases.forEach(({ name, payload, message, shouldThrow }) => {
      it(name, () => {
        if (shouldThrow) {
          expect(() => verifyPayload(payload, message)).toThrow(InstrumentationError);
        } else {
          expect(() => verifyPayload(payload, message)).not.toThrow();
        }
      });
    });
  });

  describe('isStandardBluecoreEvent', () => {
    const testCases = [
      {
        name: 'should handle standard event',
        eventName: 'search',
        expected: true,
      },
      {
        name: 'should handle non-standard event',
        eventName: 'someEvent',
        expected: false,
      },
      {
        name: 'should handle null event',
        eventName: null,
        expected: false,
      },
      {
        name: 'should handle undefined event',
        eventName: undefined,
        expected: false,
      },
      {
        name: 'should handle non-string event',
        eventName: 123,
        expected: false,
      },
      {
        name: 'should handle empty string event',
        eventName: '',
        expected: false,
      },
    ];

    testCases.forEach(({ name, eventName, expected }) => {
      it(name, () => {
        const result = isStandardBluecoreEvent(eventName as string);
        expect(result).toBe(expected);
      });
    });
  });

  describe('populateAccurateDistinctId', () => {
    const testCases = [
      {
        name: 'should use email for non-identify event',
        payload: { event: 'event' },
        message: {
          type: 'identify',
          userId: '123',
          context: {
            traits: { email: 'test@example.com' },
          },
        },
        expected: 'test@example.com',
        shouldThrow: false,
      },
      {
        name: 'should use userId for identify event',
        payload: { event: 'identify' },
        message: {
          type: 'identify',
          userId: '123',
          context: {
            traits: { email: 'test@example.com' },
          },
        },
        expected: '123',
        shouldThrow: false,
      },
      {
        name: 'should use bluecoreExternalId when available',
        payload: { event: 'event' },
        message: {
          type: 'identify',
          userId: '123',
          context: {
            traits: { email: 'test@example.com' },
            externalId: [{ type: 'bluecoreExternalId', id: '54321' }],
          },
        },
        expected: '54321',
        shouldThrow: false,
      },
      {
        name: 'should throw error for malformed message',
        payload: { event: 'event' },
        message: { type: 'identify', email: 'test@example.com', userId: '' },
        expected: null,
        shouldThrow: true,
      },
    ];

    testCases.forEach(({ name, payload, message, expected, shouldThrow }) => {
      it(name, () => {
        if (shouldThrow) {
          expect(() => populateAccurateDistinctId(payload, message)).toThrow(InstrumentationError);
        } else {
          const result = populateAccurateDistinctId(payload, message);
          expect(result).toBe(expected);
        }
      });
    });
  });

  describe('deduceTrackEventName', () => {
    // The function returns the trackEventName if no eventsMapping is provided and the trackEventName is not a standard Rudderstack ecommerce event.
    it('should return the trackEventName when no eventsMapping is provided and the trackEventName is not a standard Rudderstack ecommerce event', () => {
      const trackEventName = 'customEvent';
      const Config = {
        eventsMapping: [],
      };
      const result = deduceTrackEventName(trackEventName, Config);
      expect(result).toEqual([trackEventName]);
    });

    // The function returns the corresponding event name from eventsMapping if the trackEventName is mapped to a standard bluecore event.
    it('should return the corresponding event name from eventsMapping if the trackEventName is mapped to a standard bluecore event', () => {
      const trackEventName = 'customEvent';
      const Config = {
        eventsMapping: [{ from: 'customEvent', to: 'search' }],
      };
      const result = deduceTrackEventName(trackEventName, Config);
      expect(result).toEqual(['search']);
    });

    // The function returns the corresponding event name from eventsMapping if the trackEventName is mapped to a standard bluecore event.
    it('should return the corresponding event name array from eventsMapping if the trackEventName is mapped to more than one standard bluecore events', () => {
      const trackEventName = 'customEvent';
      const Config = {
        eventsMapping: [
          { from: 'customEvent', to: 'search' },
          { from: 'customEvent', to: 'purchase' },
        ],
      };
      const result = deduceTrackEventName(trackEventName, Config);
      expect(result).toEqual(['search', 'purchase']);
    });

    // The function returns the corresponding standard Rudderstack ecommerce event name if the trackEventName is a standard bluecore event.
    it('should return the corresponding standard Rudderstack ecommerce event name if the trackEventName is a standard bluecore event', () => {
      const trackEventName = 'Product Added to Wishlist';
      const Config = {
        eventsMapping: [],
      };
      const result = deduceTrackEventName(trackEventName, Config);
      expect(result).toEqual(['wishlist']);
    });

    // The function throws an error if the trackEventName is not a string.
    it('should throw an error if the trackEventName is not a string', () => {
      const trackEventName = 123 as any;
      const Config = {
        eventsMapping: [],
      };
      expect(() => deduceTrackEventName(trackEventName, Config)).toThrow();
    });

    // The function throws an error if the trackEventName is an empty string.
    it('should throw an error if the trackEventName is an empty string', () => {
      const trackEventName = '';
      const Config = {
        eventsMapping: [],
      };
      expect(() => deduceTrackEventName(trackEventName, Config)).toThrow();
    });
  });

  describe('createProductForStandardEcommEvent', () => {
    const testCases = [
      {
        name: "should return null when event is a standard Bluecore event and not 'search'",
        message: {
          type: 'track',
          event: 'some event',
          properties: { name: 'product 1' },
        },
        eventName: 'some event',
        expected: null,
        shouldThrow: false,
      },
      {
        name: "should return null when event is 'search'",
        message: {
          type: 'track',
          event: 'search',
          properties: { name: 'product 1' },
        },
        eventName: 'search',
        expected: null,
        shouldThrow: false,
      },
      {
        name: "should throw when event is 'order completed' and eventName is 'purchase'",
        message: {
          type: 'track',
          event: 'order completed',
          properties: { name: 'product 1' },
        },
        eventName: 'purchase',
        expected: null,
        shouldThrow: true,
      },
      {
        name: 'should return null when eventName is not a standard Bluecore event',
        message: {
          type: 'track',
          event: 'some event',
          properties: { name: 'product 1', products: [{ product_id: 1, name: 'prod1' }] },
        },
        eventName: 'non-standard',
        expected: null,
        shouldThrow: false,
      },
      {
        name: 'should return null when eventName is not provided',
        message: {
          type: 'track',
          event: 'some event',
          properties: { name: 'product 1' },
        },
        eventName: undefined,
        expected: null,
        shouldThrow: false,
      },
      {
        name: 'should return null when properties are not provided',
        message: {
          type: 'track',
          event: 'some event',
        },
        eventName: 'some event',
        expected: null,
        shouldThrow: false,
      },
    ];

    testCases.forEach(({ name, message, eventName, expected, shouldThrow }) => {
      it(name, () => {
        if (shouldThrow) {
          expect(() => createProductForStandardEcommEvent(message, eventName)).toThrow(
            InstrumentationError,
          );
        } else {
          const result = createProductForStandardEcommEvent(message, eventName);
          expect(result).toEqual(expected);
        }
      });
    });
  });
});
