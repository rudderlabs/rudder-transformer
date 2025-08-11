const { productsToContentsMapping } = require('./utilsV3');

describe('productsToContentsMapping', () => {
  const testCases = [
    {
      description: 'should return an empty array if products is null',
      input: { properties: { products: null } },
      expected: [],
    },
    {
      description: 'should return an empty array if products is undefined',
      input: { properties: { products: undefined } },
      expected: [],
    },
    {
      description: 'should return an empty array if products is not an array',
      input: { properties: { products: {} } },
      expected: [],
    },
    {
      description: 'should return an empty array if message is empty',
      input: {},
      expected: [],
    },
    {
      description: 'should return an empty array if products array is empty',
      input: { properties: { products: [] } },
      expected: [],
    },
    {
      description: 'should map products with product_id',
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
      description: 'should map products with sku if product_id is missing',
      input: {
        properties: {
          products: [{ sku: 'sku-1', quantity: 1, price: 5, delivery_category: 'cat2' }],
        },
      },
      expected: [
        {
          id: 'sku-1',
          quantity: 1,
          item_price: 5,
          delivery_category: 'cat2',
        },
      ],
    },
    {
      description: 'should map products with id if product_id and sku are missing',
      input: {
        properties: {
          products: [{ id: 'id-1', quantity: 3, price: 15, delivery_category: 'cat3' }],
        },
      },
      expected: [
        {
          id: 'id-1',
          quantity: 3,
          item_price: 15,
          delivery_category: 'cat3',
        },
      ],
    },
    {
      description: 'should map multiple products correctly',
      input: {
        properties: {
          products: [
            { product_id: 'p1', quantity: 1, price: 10, delivery_category: 'c1' },
            { sku: 's2', quantity: 2, price: 20, delivery_category: 'c2' },
            { id: 'i3', quantity: 3, price: 30, delivery_category: 'c3' },
          ],
        },
      },
      expected: [
        { id: 'p1', quantity: 1, item_price: 10, delivery_category: 'c1' },
        { id: 's2', quantity: 2, item_price: 20, delivery_category: 'c2' },
        { id: 'i3', quantity: 3, item_price: 30, delivery_category: 'c3' },
      ],
    },
    {
      description: 'should handle missing quantity, price, or category gracefully',
      input: {
        properties: {
          products: [{ product_id: 'p1' }],
        },
      },
      expected: [
        { id: 'p1', quantity: undefined, item_price: undefined, delivery_category: undefined },
      ],
    },
  ];

  testCases.forEach(({ description, input, expected }) => {
    it(description, () => {
      expect(productsToContentsMapping(input)).toEqual(expected);
    });
  });
});
