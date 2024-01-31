const { constructLineItems } = require('./utils');
describe('constructLineItems', () => {
  it('should return a non-empty object when given a valid properties object with at least one product', () => {
    const properties = {
      products: [
        {
          name: 'Product 1',
          price: 10,
          quantity: 2,
          amount: 20,
        },
      ],
    };
    const result = constructLineItems(properties);
    const expectedObj = {
      namelist: 'Product 1',
      qlist: '2',
      amtlist: '2000',
    };
    expect(result).toEqual(expectedObj);
  });

  it('should include all mapped properties in the returned object when present in at least one product', () => {
    const properties = {
      products: [
        {
          name: 'Product 1',
          category: 'Category 1',
          brand: 'Brand 1',
          price: 10,
          quantity: 2,
          amount: 20,
        },
      ],
    };

    const result = constructLineItems(properties);

    const expectedObj = {
      namelist: 'Product 1',
      catlist: 'Category 1',
      brandlist: 'Brand 1',
      qlist: '2',
      amtlist: '2000',
    };
    expect(result).toEqual(expectedObj);
  });

  it('should include amtlist property in the returned object with calculated values', () => {
    const properties = {
      products: [
        {
          name: 'Product 1',
          price: 10,
          quantity: 2,
        },
        {
          name: 'Product 2',
          price: 5,
          quantity: 3,
        },
      ],
    };

    const result = constructLineItems(properties);

    expect(result).toHaveProperty('amtlist');
    expect(result.amtlist).toBe('2000|1500');
  });

  it('should throw an InstrumentationError when properties object is missing or has an empty products array', () => {
    const properties = {};

    expect(() => constructLineItems(properties)).toThrow(
      'Either properties.product is not an array or is empty',
    );

    properties.products = [];

    expect(() => constructLineItems(properties)).toThrow(
      'Either properties.product is not an array or is empty',
    );
  });

  it('should throw an InstrumentationError when a product is missing both amount and price/quantity properties', () => {
    const properties = {
      products: [
        {
          name: 'Product 1',
        },
      ],
    };

    expect(() => constructLineItems(properties)).toThrow(
      'Either amount or price is required for every product',
    );
  });
});
