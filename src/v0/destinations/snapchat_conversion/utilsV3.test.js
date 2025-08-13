const { productsToContentsMapping } = require('./utilsV3');

describe('productsToContentsMapping', () => {
  const testCases = [
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
            'invalid-string', // invalid
          ],
        },
      },
      expected: [
        { id: 'p1', quantity: 0, item_price: 10 },
        { id: 'p1', quantity: 34, item_price: 10 },
      ],
    },
  ];

  testCases.forEach(({ description, input, expected }) => {
    it(description, () => {
      expect(productsToContentsMapping(input)).toEqual(expected);
    });
  });
});
