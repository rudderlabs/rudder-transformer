const {
  buildProductPayloadString,
  trackProduct,
  populateCustomTransactionProperties,
} = require('./utils');

describe('buildProductPayloadString', () => {
  // Should correctly build the payload string with all fields provided
  it('should correctly build the payload string with all fields provided', () => {
    const payload = {
      advertiserId: '123',
      orderReference: 'order123',
      productId: 'prod123',
      productName: 'Product 1',
      productItemPrice: '10.99',
      productQuantity: '2',
      productSku: 'sku123',
      commissionGroupCode: 'DEFAULT',
      productCategory: 'Category 1',
    };

    const expected = 'AW:P|123|order123|prod123|Product%201|10.99|2|sku123|DEFAULT|Category%201';
    const result = buildProductPayloadString(payload);

    expect(result).toBe(expected);
  });

  // Should correctly handle extremely long string values for all fields
  it('should correctly handle extremely long string values for all fields', () => {
    const payload = {
      advertiserId: '123',
      orderReference: 'order123',
      productId: 'prod123',
      productName: 'Product 1'.repeat(100000),
      productItemPrice: '10.99'.repeat(100000),
      productQuantity: '2'.repeat(100000),
      productSku: 'sku123'.repeat(100000),
      commissionGroupCode: 'DEFAULT',
      productCategory: 'Category 1'.repeat(100000),
    };

    const expected = `AW:P|123|order123|prod123|${encodeURIComponent('Product 1'.repeat(100000))}|${encodeURIComponent('10.99'.repeat(100000))}|${encodeURIComponent('2'.repeat(100000))}|${encodeURIComponent('sku123'.repeat(100000))}|DEFAULT|${encodeURIComponent('Category 1'.repeat(100000))}`;
    const result = buildProductPayloadString(payload);

    expect(result).toBe(expected);
  });
});

describe('trackProduct', () => {
  // Given a valid 'properties' object with a non-empty 'products' array, it should transform each product into a valid payload string and return an object with the transformed products.
  it("should transform each product into a valid payload string and return an object with the transformed products when given a valid 'properties' object with a non-empty 'products' array", () => {
    // Arrange
    const properties = {
      products: [
        {
          product_id: '123',
          name: 'Product 1',
          price: 10,
          quantity: 1,
          sku: 'SKU123',
          category: 'Category 1',
        },
        {
          product_id: '456',
          name: 'Product 2',
          price: 20,
          quantity: 2,
          sku: 'SKU456',
          category: 'Category 2',
        },
      ],
      order_id: 'order123',
    };
    const advertiserId = 'advertiser123';
    const commissionParts = 'COMMISSION';

    // Act
    const result = trackProduct(properties, advertiserId, commissionParts);

    // Assert
    expect(result).toEqual({
      'bd[0]': 'AW:P|advertiser123|order123|123|Product%201|10|1|SKU123|COMMISSION|Category%201',
      'bd[1]': 'AW:P|advertiser123|order123|456|Product%202|20|2|SKU456|COMMISSION|Category%202',
    });
  });

  // Given an invalid 'properties' object, it should return an empty object.
  it("should return an empty object when given an invalid 'properties' object", () => {
    // Arrange
    const properties = {};
    const advertiserId = 'advertiser123';
    const commissionParts = 'COMMISSION';

    // Act
    const result = trackProduct(properties, advertiserId, commissionParts);

    // Assert
    expect(result).toEqual({});
  });

  it('should ignore the product which has missing properties', () => {
    // Arrange
    const properties = {
      products: [
        {
          price: 10,
          quantity: 1,
          sku: 'SKU123',
          category: 'Category 1',
        },
        {
          product_id: '456',
          name: 'Product 2',
          price: 20,
          quantity: 2,
          sku: 'SKU456',
          category: 'Category 2',
        },
      ],
      order_id: 'order123',
    };
    const advertiserId = 'advertiser123';
    const commissionParts = 'COMMISSION';

    // Act
    const result = trackProduct(properties, advertiserId, commissionParts);

    // Assert
    expect(result).toEqual({
      'bd[0]': 'AW:P|advertiser123|order123|456|Product%202|20|2|SKU456|COMMISSION|Category%202',
    });
  });

  it('category and sku if undefined we put blank', () => {
    // Arrange
    const properties = {
      products: [
        {
          product_id: '123',
          name: 'Product 1',
          price: 10,
          quantity: 1,
          sku: undefined,
          category: 'Category 1',
        },
        {
          product_id: '456',
          name: 'Product 2',
          price: 20,
          quantity: 2,
          sku: 'SKU456',
          category: undefined,
        },
      ],
      order_id: 'order123',
    };
    const advertiserId = 'advertiser123';
    const commissionParts = 'COMMISSION';

    // Act
    const result = trackProduct(properties, advertiserId, commissionParts);

    // Assert
    expect(result).toEqual({
      'bd[0]': 'AW:P|advertiser123|order123|123|Product%201|10|1||COMMISSION|Category%201',
      'bd[1]': 'AW:P|advertiser123|order123|456|Product%202|20|2|SKU456|COMMISSION|',
    });
  });
});

describe('populateCustomTransactionProperties', () => {
  // The function should correctly map properties from the input object to the output object based on the customFieldMap.
  it('should correctly map properties from the input object to the output object based on the customFieldMap', () => {
    const properties = {
      rudderProperty1: 'value1',
      rudderProperty2: 123,
      rudderProperty3: 'value3',
      rudderProperty4: 234,
    };
    const customFieldMap = [
      { from: 'rudderProperty1', to: 'p1' },
      { from: 'rudderProperty2', to: 'p2' },
      { from: 'rudderProperty4', to: 'anotherp2' },
    ];
    const expectedOutput = {
      p1: 'value1',
      p2: 123,
    };

    const result = populateCustomTransactionProperties(properties, customFieldMap);

    expect(result).toEqual(expectedOutput);
  });
});
