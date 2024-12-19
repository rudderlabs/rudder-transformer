const { InstrumentationError } = require('@rudderstack/integrations-lib');
const { constructLineItems, calculateProductAmount } = require('./utils');
describe('constructLineItems', () => {
  it('should return a non-empty object when given a valid properties object with at least one product', () => {
    const properties = {
      products: [
        {
          name: 'Product 1',
          sku: 'sku_1',
          price: 10,
          quantity: 2,
          amount: 20,
        },
      ],
    };
    const result = constructLineItems(properties);
    const expectedObj = {
      namelist: 'Product 1',
      skulist: 'sku_1',
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
          sku: 'sku_1',
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
      skulist: 'sku_1',
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
          sku: 'sku_1',
          price: 10,
          quantity: 2,
        },
        {
          name: 'Product 2',
          sku: 'sku_2',
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
  it('should throw an InstrumentationError when a product is missing quantity property', () => {
    const properties = {
      products: [
        {
          name: 'Product 1',
          sku: 'sku_1',
          amount: '1234',
        },
      ],
    };
    expect(() => constructLineItems(properties)).toThrow('quantity is a required field. Aborting');
  });
  it('should throw an InstrumentationError when a product is missing both amount and price properties', () => {
    const properties = {
      products: [
        {
          name: 'Product 1',
          sku: 'sku_1',
          quantity: 2,
        },
      ],
    };

    expect(() => constructLineItems(properties)).toThrow(
      'Either amount or price is required for every product',
    );
  });
});

describe('calculateProductAmount', () => {
  // Calculates product amount correctly when amount is defined
  it('should return the correct product amount when amount is defined', () => {
    const product = { amount: 5 };
    const result = calculateProductAmount(product);
    expect(result).toBe(500);
  });

  // Throws error when both amount and price are undefined or null
  it('should throw an error when both amount and price are undefined or null', () => {
    const product = {};
    expect(() => calculateProductAmount(product)).toThrow(InstrumentationError);
  });

  // Calculates product amount correctly when price and quantity are defined
  it('should calculate product amount correctly when price and quantity are defined', () => {
    const product = { amount: 10, price: 5, quantity: 2 };
    const result = calculateProductAmount(product);
    expect(result).toEqual(1000);
  });

  // Returns correct value when only price is defined and quantity defaults to 1
  it('should return correct value when only price is defined and quantity defaults to 1', () => {
    const product = { price: 20 };
    const result = calculateProductAmount(product);
    expect(result).toEqual(2000);
  });

  // Handles cases where amount is a floating-point number
  it('should handle cases where amount is a floating-point number', () => {
    const product = { amount: 5.5, price: 10, quantity: 2 };
    const result = calculateProductAmount(product);
    expect(result).toEqual(550);
  });

  it('should handle cases where amount is a floating-point number', () => {
    const product = { amount: 5.1, price: 10, quantity: 2 };
    const result = calculateProductAmount(product);
    expect(result).toEqual(510);
  });

  it('should handle cases where amount is a floating-point number', () => {
    const product = { amount: 5.19, price: 10, quantity: 2 };
    const result = calculateProductAmount(product);
    expect(result).toEqual(519);
  });

  it('should handle cases where amount is a floating-point number', () => {
    const product = { amount: 5.199, price: 10, quantity: 2 };
    const result = calculateProductAmount(product);
    expect(result).toEqual(520);
  });
  it('should handle cases where amount is a floating-point number', () => {
    const product = { amount: 5.479, price: 10, quantity: 2 };
    const result = calculateProductAmount(product);
    expect(result).toEqual(548);
  });
});
