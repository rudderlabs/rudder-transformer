const { calculateDefaultRevenue, populateRevenueField } = require('./utils');

describe('calculateDefaultRevenue', () => {
  // Calculates revenue for a single product with defined price and quantity
  it('should calculate revenue for a single product with defined price and quantity', () => {
    const properties = {
      price: 10,
      quantity: 2,
    };

    const result = calculateDefaultRevenue(properties);

    expect(result).toBe(20);
  });

  // Returns null for properties parameter being undefined
  it('should return null for price parameter being undefined', () => {
    const properties = { products: [{ quantity: 1 }] };

    const result = calculateDefaultRevenue(properties);

    expect(result).toBeNull();
  });

  // Calculates revenue for a single product with defined price and default quantity
  it('should calculate revenue for a single product with defined price and default quantity', () => {
    const properties = {
      price: 10,
    };

    const result = calculateDefaultRevenue(properties);

    expect(result).toBe(10);
  });

  // Calculates revenue for multiple products with defined prices and quantities
  it('should calculate revenue for multiple products with defined prices and quantities', () => {
    const properties = {
      products: [{ price: 10, quantity: 2 }, { quantity: 3 }],
    };

    const result = calculateDefaultRevenue(properties);

    expect(result).toBe(20);
  });

  // Calculates revenue for multiple products with defined prices and default quantities
  it('should calculate revenue for multiple products with defined prices and default quantities', () => {
    const properties = {
      products: [{ price: 10 }, { price: 5 }],
    };

    const result = calculateDefaultRevenue(properties);

    expect(result).toBe(15);
  });
});

describe('populateRevenueField', () => {
  // Returns revenue in cents for Purchase event type with valid revenue property
  it('should return revenue in cents when Purchase event type has valid revenue property', () => {
    const eventType = 'Purchase';
    const properties = {
      revenue: '10.50',
    };
    const expected = 1050;

    const result = populateRevenueField(eventType, properties);

    expect(result).toBe(expected);
  });

  // Returns null for Purchase event type with revenue property as non-numeric string
  it('should return null when Purchase event type has revenue property as non-numeric string', () => {
    const eventType = 'Purchase';
    const properties = {
      revenue: 'invalid',
    };
    const expected = null;

    const result = populateRevenueField(eventType, properties);

    expect(result).toBe(expected);
  });

  // Returns revenue in cents for AddToCart event type with valid price and quantity properties
  it('should return revenue in cents when AddToCart event type has valid price and quantity properties', () => {
    const eventType = 'AddToCart';
    const properties = {
      price: '10.50',
      quantity: 2,
    };
    const expected = 2100;

    const result = populateRevenueField(eventType, properties);

    expect(result).toBe(expected);
  });

  // Returns revenue in cents for ViewContent event type with valid properties
  it('should return revenue in cents when ViewContent event type has valid properties', () => {
    const eventType = 'ViewContent';
    const properties = {
      products: [
        {
          price: '10.50',
          quantity: 2,
        },
        {
          price: '5.25',
          quantity: 3,
        },
      ],
    };
    const expected = 3675;

    const result = populateRevenueField(eventType, properties);

    expect(result).toBe(expected);
  });
});
