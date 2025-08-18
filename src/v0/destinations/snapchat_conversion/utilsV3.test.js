const { productsToContentsMapping } = require('./utilsV3');

describe('productsToContentsMapping', () => {
  const testCases = [
    {
      description: 'should return an empty array for null input',
      input: null,
      expected: [],
    },
    {
      description: 'should return an empty array for undefined input',
      input: undefined,
      expected: [],
    },
    {
      description: 'should return an empty array for invalid input',
      input: { properties: { products: null } },
      expected: [],
    },
    {
      description: 'should return an empty array for empty products array',
      input: { properties: { products: [] } },
      expected: [],
    },
    {
      description: 'should map products with product_id correctly',
      input: {
        properties: {
          products: [{ product_id: '123', quantity: 2, price: 10, delivery_category: 'cat1' }],
        },
      },
      expected: [
        {
          id: '123',
          quantity: 2,
          item_price: 10,
          delivery_category: 'cat1',
        },
      ],
    },
    {
      description: 'should prioritize product_id over sku and id',
      input: {
        properties: {
          products: [
            {
              product_id: 'product-123',
              sku: 'sku-456',
              id: 'id-789',
              quantity: 1,
              price: 10,
            },
          ],
        },
      },
      expected: [{ id: 'product-123', quantity: 1, item_price: 10 }],
    },
    {
      description: 'should handle missing fields and remove undefined values',
      input: {
        properties: {
          products: [{ sku: 'p1', quantity: null, price: undefined }],
        },
      },
      expected: [
        { id: 'p1' }, // removeUndefinedAndNullValues removes null/undefined fields
      ],
    },
    {
      description: 'should filter out invalid products and products without identifiers',
      input: {
        properties: {
          products: [
            null, // invalid
            { product_id: 'p1', quantity: 0, price: 10 }, // valid
            { id: 'p1', quantity: 34, price: 10 }, // valid
            { quantity: 2, price: 20 }, // invalid (no id)
            { foo: 'bar' }, // invalid
            'invalid-string', // invalid
          ],
        },
      },
      expected: [
        { id: 'p1', quantity: 0, item_price: 10 },
        { id: 'p1', quantity: 34, item_price: 10 },
        { quantity: 2, item_price: 20 },
      ],
    },
    {
      description: 'should handle fallback to properties when products array is empty',
      input: {
        properties: {
          products: [],
          product_id: 'fallback-123',
          quantity: 5,
          price: 25.99,
          delivery_category: 'electronics',
        },
      },
      expected: [
        {
          id: 'fallback-123',
          quantity: 5,
          item_price: 25.99,
          delivery_category: 'electronics',
        },
      ],
    },
    {
      description: 'should handle fallback to properties when products is null',
      input: {
        properties: {
          products: null,
          sku: 'fallback-sku-456',
          quantity: 3,
          price: 15.5,
        },
      },
      expected: [
        {
          id: 'fallback-sku-456',
          quantity: 3,
          item_price: 15.5,
        },
      ],
    },
    {
      description: 'should handle fallback to properties when products is undefined',
      input: {
        properties: {
          id: 'fallback-id-789',
          quantity: 1,
          price: 99.99,
          delivery_category: 'premium',
        },
      },
      expected: [
        {
          id: 'fallback-id-789',
          quantity: 1,
          item_price: 99.99,
          delivery_category: 'premium',
        },
      ],
    },
    {
      description: 'should handle fallback with only partial data',
      input: {
        properties: {
          products: null,
          product_id: 'partial-123',
          // Only id field, missing other properties
        },
      },
      expected: [
        {
          id: 'partial-123',
        },
      ],
    },
    {
      description: 'should prioritize product_id over sku and id in fallback scenario',
      input: {
        properties: {
          products: [],
          product_id: 'priority-product',
          sku: 'priority-sku',
          id: 'priority-id',
          quantity: 7,
          price: 42.0,
        },
      },
      expected: [
        {
          id: 'priority-product',
          quantity: 7,
          item_price: 42.0,
        },
      ],
    },
  ];

  testCases.forEach(({ description, input, expected }) => {
    it(description, () => {
      expect(productsToContentsMapping(input)).toEqual(expected);
    });
  });
});
