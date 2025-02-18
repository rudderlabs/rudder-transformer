jest.mock('./config', () => ({
  maxBatchSize: 2, // Mock maxBatchSize to 2 for testing
}));

import {
  batchEventChunks,
  batchEvents,
  calculateDefaultRevenue,
  populateRevenueField,
} from './utils';

describe('reddit utils', () => {
  describe('calculateDefaultRevenue', () => {
    test.each([
      {
        name: 'single product with defined price and quantity',
        properties: { price: 10, quantity: 2 },
        expected: 20,
      },
      {
        name: 'undefined price parameter',
        properties: { products: [{ quantity: 1 }] },
        expected: null,
      },
      {
        name: 'single product with defined price and default quantity',
        properties: { price: 10 },
        expected: 10,
      },
      {
        name: 'multiple products with defined prices and quantities',
        properties: { products: [{ price: 10, quantity: 2 }, { quantity: 3 }] },
        expected: 20,
      },
      {
        name: 'multiple products with defined prices and default quantities',
        properties: { products: [{ price: 10 }, { price: 5 }] },
        expected: 15,
      },
    ])('should calculate revenue for $name', ({ properties, expected }) => {
      const result = calculateDefaultRevenue(properties);
      expect(result).toBe(expected);
    });
  });

  describe('populateRevenueField', () => {
    test.each([
      {
        name: 'Purchase event with valid revenue property',
        eventType: 'Purchase',
        properties: { revenue: 10.5 },
        expected: 1050,
      },
      {
        name: 'Purchase event with non-numeric revenue',
        eventType: 'Purchase',
        properties: { revenue: NaN },
        expected: null,
      },
      {
        name: 'AddToCart event with valid price and quantity',
        eventType: 'AddToCart',
        properties: { price: 10.5, quantity: 2 },
        expected: 2100,
      },
      {
        name: 'ViewContent event with multiple products',
        eventType: 'ViewContent',
        properties: {
          products: [
            { price: 10.5, quantity: 2 },
            { price: 5.25, quantity: 3 },
          ],
        },
        expected: 3675,
      },
      {
        name: 'AddToCart event with NaN price',
        eventType: 'AddToCart',
        properties: { price: NaN, quantity: 2 },
        expected: null,
      },
      {
        name: 'ViewContent event with NaN calculation result',
        eventType: 'ViewContent',
        properties: {
          products: [
            { price: NaN, quantity: 2 },
            { price: NaN, quantity: 3 },
          ],
        },
        expected: null,
      },
      {
        name: 'Purchase event with NaN result after calculation',
        eventType: 'Custom',
        properties: { revenue: Number.NaN },
        expected: null,
      },
      {
        name: 'AddToCart event with valid price and no quantity (defaults to 1)',
        eventType: 'AddToCart',
        properties: { price: 10.5 },
        expected: 1050,
      },
      {
        name: 'AddToCart event with valid price and undefined quantity',
        eventType: 'AddToCart',
        properties: { price: 10.5, quantity: undefined },
        expected: 1050,
      },
      {
        name: 'AddToCart event with valid price and null quantity',
        eventType: 'AddToCart',
        properties: { price: 10.5, quantity: null },
        expected: 1050,
      },
      {
        name: 'AddToCart event with undefined price',
        eventType: 'AddToCart',
        properties: { quantity: 2 },
        expected: null,
      },
      {
        name: 'AddToCart event with null price',
        eventType: 'AddToCart',
        properties: { quantity: 2 },
        expected: null,
      },
    ])('should handle $name', ({ eventType, properties, expected }) => {
      const result = populateRevenueField(eventType, properties);
      expect(result).toBe(expected);
    });
  });

  describe('batchEventChunks', () => {
    test.each([
      {
        name: 'empty array input',
        input: [],
        expected: [],
      },
      {
        name: 'non-array input',
        input: null,
        expected: [],
      },
      {
        name: 'multiple events',
        input: [
          [
            {
              destination: 'reddit',
              metadata: { meta1: 'data1' },
              message: [
                {
                  body: {
                    JSON: {
                      events: ['event1'],
                    },
                  },
                },
              ],
            },
            {
              destination: 'reddit',
              metadata: { meta2: 'data2' },
              message: [
                {
                  body: {
                    JSON: {
                      events: ['event2'],
                    },
                  },
                },
              ],
            },
          ],
        ],
        expected: [
          {
            destination: 'reddit',
            metadata: [{ meta1: 'data1' }, { meta2: 'data2' }],
            message: {
              body: {
                JSON: {
                  events: ['event1', 'event2'],
                },
              },
            },
          },
        ],
      },
    ])('should $name', ({ input, expected }) => {
      // @ts-expect-error testing invalid input for non-array test case
      const result = batchEventChunks(input);
      expect(result).toEqual(expected);
    });
  });

  describe('batchEvents', () => {
    test.each([
      {
        name: 'should batch events according to maxBatchSize of 2',
        input: [
          {
            destination: 'reddit',
            metadata: { meta1: 'data1' },
            message: [
              {
                body: {
                  JSON: {
                    events: ['event1'],
                  },
                },
              },
            ],
          },
          {
            destination: 'reddit',
            metadata: { meta2: 'data2' },
            message: [
              {
                body: {
                  JSON: {
                    events: ['event2'],
                  },
                },
              },
            ],
          },
          {
            destination: 'reddit',
            metadata: { meta3: 'data3' },
            message: [
              {
                body: {
                  JSON: {
                    events: ['event3'],
                  },
                },
              },
            ],
          },
        ],
        expected: [
          {
            destination: 'reddit',
            metadata: [{ meta1: 'data1' }, { meta2: 'data2' }],
            message: {
              body: {
                JSON: {
                  events: ['event1', 'event2'],
                },
              },
            },
          },
          {
            destination: 'reddit',
            metadata: [{ meta3: 'data3' }],
            message: {
              body: {
                JSON: {
                  events: ['event3'],
                },
              },
            },
          },
        ],
      },
      {
        name: 'should return empty array for empty input',
        input: [],
        expected: [],
      },
    ])('$name', ({ input, expected }) => {
      const result = batchEvents(input);
      expect(result).toEqual(expected);
    });
  });
});
