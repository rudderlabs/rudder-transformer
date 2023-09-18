const { getContents } = require('./util');

describe('getContents utility test', () => {
  it('product id sent as number', () => {
    const message = {
      properties: {
        products: [
          {
            product_id: 123,
            sku: 'G-32',
            name: 'Monopoly',
            price: 14,
            quantity: 1,
            category: 'Games',
            url: 'https://www.website.com/product/path',
            image_url: 'https://www.website.com/product/path.jpg',
          },
          {
            product_id: 345,
            sku: 'F-32',
            name: 'UNO',
            price: 3.45,
            quantity: 2,
            category: 'Games',
          },
        ],
      },
    };
    const expectedOutput = [
      {
        content_type: 'product',
        content_id: '123',
        content_category: 'Games',
        content_name: 'Monopoly',
        price: 14,
        quantity: 1,
      },
      {
        content_type: 'product',
        content_id: '345',
        content_category: 'Games',
        content_name: 'UNO',
        price: 3.45,
        quantity: 2,
      },
    ];

    expect(expectedOutput).toEqual(getContents(message));
  });

  it('product id sent as string', () => {
    const message = {
      properties: {
        products: [
          {
            product_id: '123',
            sku: 'G-32',
            name: 'Monopoly',
            price: 14,
            quantity: 1,
            category: 'Games',
            url: 'https://www.website.com/product/path',
            image_url: 'https://www.website.com/product/path.jpg',
          },
          {
            product_id: '345',
            sku: 'F-32',
            name: 'UNO',
            price: 3.45,
            quantity: 2,
            category: 'Games',
          },
        ],
      },
    };
    const expectedOutput = [
      {
        content_type: 'product',
        content_id: '123',
        content_category: 'Games',
        content_name: 'Monopoly',
        price: 14,
        quantity: 1,
      },
      {
        content_type: 'product',
        content_id: '345',
        content_category: 'Games',
        content_name: 'UNO',
        price: 3.45,
        quantity: 2,
      },
    ];

    expect(expectedOutput).toEqual(getContents(message));
  });
});
