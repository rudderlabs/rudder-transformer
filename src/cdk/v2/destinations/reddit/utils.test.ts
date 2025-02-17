import { calculateDefaultRevenue, populateRevenueField } from './utils';

describe('calculateDefaultRevenue', () => {
  const testCases = [
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
  ];

  testCases.forEach(({ name, properties, expected }) => {
    it(`should calculate revenue for ${name}`, () => {
      const result = calculateDefaultRevenue(properties);
      expect(result).toBe(expected);
    });
  });
});

describe('populateRevenueField', () => {
  const testCases = [
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
  ];

  testCases.forEach(({ name, eventType, properties, expected }) => {
    it(`should handle ${name}`, () => {
      const result = populateRevenueField(eventType, properties);
      expect(result).toBe(expected);
    });
  });
});
