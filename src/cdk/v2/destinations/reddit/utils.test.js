const {
  calculateDefaultRevenue,
  populateRevenueField,
  decideVersion,
  batchEventChunks,
  removeUnsupportedFields,
  convertToUpperSnakeCase,
  generateAndValidateTimestamp,
  prepareBatches,
} = require('./utils');

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

  // Returns null for AddToCart event type with invalid price
  it('should return null when AddToCart event type has invalid price', () => {
    const eventType = 'AddToCart';
    const properties = {
      price: 'invalid',
      quantity: 2,
    };

    const result = populateRevenueField(eventType, properties);

    expect(result).toBeNull();
  });

  // Returns null for ViewContent event type when all products have undefined price
  it('should return null when ViewContent event type has all products with undefined price', () => {
    const eventType = 'ViewContent';
    const properties = {
      products: [
        {
          quantity: 2,
        },
        {
          quantity: 3,
        },
      ],
    };

    const result = populateRevenueField(eventType, properties);

    expect(result).toBeNull();
  });

  // Returns revenue for PURCHASE event type (uppercase)
  it('should return revenue in cents when PURCHASE event type has valid revenue property', () => {
    const eventType = 'PURCHASE';
    const properties = {
      revenue: 25.99,
    };

    const result = populateRevenueField(eventType, properties);

    expect(result).toBe(2599);
  });

  // Returns revenue for ADD_TO_CART event type (uppercase)
  it('should return revenue in cents when ADD_TO_CART event type has valid price', () => {
    const eventType = 'ADD_TO_CART';
    const properties = {
      price: 15.5,
      quantity: 3,
    };

    const result = populateRevenueField(eventType, properties);

    expect(result).toBe(4650);
  });

  // Returns null when revenue calculation results in NaN
  it('should return null when revenue calculation results in NaN', () => {
    const eventType = 'Purchase';
    const properties = {
      revenue: NaN,
    };

    const result = populateRevenueField(eventType, properties);

    expect(result).toBeNull();
  });
});

describe('decideVersion', () => {
  // Returns 'v3' when Config.version is 'v3'
  it('should return v3 when Config.version is v3', () => {
    const input = {
      Config: {
        version: 'v3',
      },
    };

    const result = decideVersion(input);

    expect(result).toBe('v3');
  });

  // Returns 'v2' when Config.version is not defined
  it('should return v2 when Config.version is not defined', () => {
    const input = {
      Config: {},
    };

    const result = decideVersion(input);

    expect(result).toBe('v2');
  });

  // Returns 'v2' when Config.version is null
  it('should return v2 when Config.version is null', () => {
    const input = {
      Config: {
        version: null,
      },
    };

    const result = decideVersion(input);

    expect(result).toBe('v2');
  });

  // Returns 'v2' when Config.version is 'v2'
  it('should return v2 when Config.version is v2', () => {
    const input = {
      Config: {
        version: 'v2',
      },
    };

    const result = decideVersion(input);

    expect(result).toBe('v2');
  });

  // Returns 'v2' when Config.version is any other value
  it('should return v2 when Config.version is any other value', () => {
    const input = {
      Config: {
        version: 'v1',
      },
    };

    const result = decideVersion(input);

    expect(result).toBe('v2');
  });
});

describe('batchEventChunks', () => {
  // Batches multiple event chunks correctly for v2
  it('should batch multiple event chunks correctly for v2', () => {
    const eventChunks = [
      [
        {
          destination: { Config: { version: 'v2' } },
          message: [
            {
              body: {
                JSON: {
                  events: [{ event_type: 'Purchase', event_at: 123456 }],
                },
              },
            },
          ],
          metadata: { jobId: 1 },
        },
        {
          destination: { Config: { version: 'v2' } },
          message: [
            {
              body: {
                JSON: {
                  events: [{ event_type: 'AddToCart', event_at: 123457 }],
                },
              },
            },
          ],
          metadata: { jobId: 2 },
        },
      ],
    ];

    const result = batchEventChunks(eventChunks);

    expect(result).toHaveLength(1);
    expect(result[0].message.body.JSON.events).toHaveLength(2);
    expect(result[0].metadata).toHaveLength(2);
    expect(result[0].metadata[0].jobId).toBe(1);
    expect(result[0].metadata[1].jobId).toBe(2);
  });

  // Batches multiple event chunks correctly for v3
  it('should batch multiple event chunks correctly for v3', () => {
    const eventChunks = [
      [
        {
          destination: { Config: { version: 'v3' } },
          message: [
            {
              body: {
                JSON: {
                  data: {
                    events: [{ event_type: 'PURCHASE', event_at: 123456 }],
                  },
                },
              },
            },
          ],
          metadata: { jobId: 1 },
        },
        {
          destination: { Config: { version: 'v3' } },
          message: [
            {
              body: {
                JSON: {
                  data: {
                    events: [{ event_type: 'ADD_TO_CART', event_at: 123457 }],
                  },
                },
              },
            },
          ],
          metadata: { jobId: 2 },
        },
      ],
    ];

    const result = batchEventChunks(eventChunks);

    expect(result).toHaveLength(1);
    expect(result[0].message.body.JSON.data.events).toHaveLength(2);
    expect(result[0].metadata).toHaveLength(2);
    expect(result[0].metadata[0].jobId).toBe(1);
    expect(result[0].metadata[1].jobId).toBe(2);
  });

  // Returns empty array for empty input
  it('should return empty array for empty input', () => {
    const eventChunks = [];

    const result = batchEventChunks(eventChunks);

    expect(result).toEqual([]);
  });

  // Handles single event chunk correctly
  it('should handle single event chunk correctly', () => {
    const eventChunks = [
      [
        {
          destination: { Config: { version: 'v2' } },
          message: [
            {
              body: {
                JSON: {
                  events: [{ event_type: 'Purchase', event_at: 123456 }],
                },
              },
            },
          ],
          metadata: { jobId: 1 },
        },
      ],
    ];

    const result = batchEventChunks(eventChunks);

    expect(result).toHaveLength(1);
    expect(result[0].message.body.JSON.events).toHaveLength(1);
    expect(result[0].metadata).toHaveLength(1);
  });

  // Handles multiple chunks correctly
  it('should handle multiple chunks correctly', () => {
    const eventChunks = [
      [
        {
          destination: { Config: { version: 'v2' } },
          message: [
            {
              body: {
                JSON: {
                  events: [{ event_type: 'Purchase', event_at: 123456 }],
                },
              },
            },
          ],
          metadata: { jobId: 1 },
        },
      ],
      [
        {
          destination: { Config: { version: 'v2' } },
          message: [
            {
              body: {
                JSON: {
                  events: [{ event_type: 'AddToCart', event_at: 123457 }],
                },
              },
            },
          ],
          metadata: { jobId: 2 },
        },
      ],
    ];

    const result = batchEventChunks(eventChunks);

    expect(result).toHaveLength(2);
  });

  // Returns empty array for non-array input
  it('should return empty array for non-array input', () => {
    const eventChunks = null;

    const result = batchEventChunks(eventChunks);

    expect(result).toEqual([]);
  });
});

describe('removeUnsupportedFields', () => {
  // Removes item_count for non-supported event types
  it('should remove item_count for non-supported event types', () => {
    const eventType = 'Search';
    const eventMetadata = {
      item_count: 5,
      other_field: 'keep',
    };

    const result = removeUnsupportedFields(eventType, eventMetadata);

    expect(result).not.toHaveProperty('item_count');
    expect(result.other_field).toBe('keep');
  });

  // Keeps item_count for Purchase event
  it('should keep item_count for Purchase event', () => {
    const eventType = 'Purchase';
    const eventMetadata = {
      item_count: 5,
      value: 100,
      currency: 'USD',
    };

    const result = removeUnsupportedFields(eventType, eventMetadata);

    expect(result.item_count).toBe(5);
    expect(result.value).toBe(100);
    expect(result.currency).toBe('USD');
  });

  // Keeps item_count for AddToCart event
  it('should keep item_count for AddToCart event', () => {
    const eventType = 'AddToCart';
    const eventMetadata = {
      item_count: 3,
      value: 50,
      currency: 'EUR',
    };

    const result = removeUnsupportedFields(eventType, eventMetadata);

    expect(result.item_count).toBe(3);
    expect(result.value).toBe(50);
    expect(result.currency).toBe('EUR');
  });

  // Keeps item_count for AddToWishlist event
  it('should keep item_count for AddToWishlist event', () => {
    const eventType = 'AddToWishlist';
    const eventMetadata = {
      item_count: 2,
      value: 75,
      currency: 'GBP',
    };

    const result = removeUnsupportedFields(eventType, eventMetadata);

    expect(result.item_count).toBe(2);
    expect(result.value).toBe(75);
    expect(result.currency).toBe('GBP');
  });

  // Keeps item_count for Custom event
  it('should keep item_count for Custom event', () => {
    const eventType = 'Custom';
    const eventMetadata = {
      item_count: 10,
      value: 200,
      currency: 'USD',
    };

    const result = removeUnsupportedFields(eventType, eventMetadata);

    expect(result.item_count).toBe(10);
    expect(result.value).toBe(200);
    expect(result.currency).toBe('USD');
  });

  // Removes value, value_decimal, and currency for non-supported event types
  it('should remove value, value_decimal, and currency for non-supported event types', () => {
    const eventType = 'ViewContent';
    const eventMetadata = {
      value: 100,
      value_decimal: '100.50',
      currency: 'USD',
      other_field: 'keep',
    };

    const result = removeUnsupportedFields(eventType, eventMetadata);

    expect(result).not.toHaveProperty('value');
    expect(result).not.toHaveProperty('value_decimal');
    expect(result).not.toHaveProperty('currency');
    expect(result.other_field).toBe('keep');
  });

  // Keeps value and currency for Lead event
  it('should keep value and currency for Lead event', () => {
    const eventType = 'Lead';
    const eventMetadata = {
      value: 50,
      currency: 'USD',
      item_count: 1,
    };

    const result = removeUnsupportedFields(eventType, eventMetadata);

    expect(result.value).toBe(50);
    expect(result.currency).toBe('USD');
    expect(result).not.toHaveProperty('item_count');
  });

  // Keeps value and currency for SignUp event
  it('should keep value and currency for SignUp event', () => {
    const eventType = 'SignUp';
    const eventMetadata = {
      value: 25,
      currency: 'EUR',
      item_count: 1,
    };

    const result = removeUnsupportedFields(eventType, eventMetadata);

    expect(result.value).toBe(25);
    expect(result.currency).toBe('EUR');
    expect(result).not.toHaveProperty('item_count');
  });

  // Removes all unsupported fields for PageVisit event
  it('should remove all unsupported fields for PageVisit event', () => {
    const eventType = 'PageVisit';
    const eventMetadata = {
      item_count: 5,
      value: 100,
      value_decimal: '100.50',
      currency: 'USD',
      other_field: 'keep',
    };

    const result = removeUnsupportedFields(eventType, eventMetadata);

    expect(result).not.toHaveProperty('item_count');
    expect(result).not.toHaveProperty('value');
    expect(result).not.toHaveProperty('value_decimal');
    expect(result).not.toHaveProperty('currency');
    expect(result.other_field).toBe('keep');
  });

  // Does not mutate original eventMetadata object
  it('should not mutate original eventMetadata object', () => {
    const eventType = 'ViewContent';
    const eventMetadata = {
      item_count: 5,
      value: 100,
      currency: 'USD',
    };
    const originalMetadata = { ...eventMetadata };

    removeUnsupportedFields(eventType, eventMetadata);

    expect(eventMetadata).toEqual(originalMetadata);
  });
});

describe('convertToUpperSnakeCase', () => {
  // Converts Purchase to PURCHASE
  it('should convert Purchase to PURCHASE', () => {
    const result = convertToUpperSnakeCase('Purchase');
    expect(result).toBe('PURCHASE');
  });

  // Converts AddToCart to ADD_TO_CART
  it('should convert AddToCart to ADD_TO_CART', () => {
    const result = convertToUpperSnakeCase('AddToCart');
    expect(result).toBe('ADD_TO_CART');
  });

  // Converts ViewContent to VIEW_CONTENT
  it('should convert ViewContent to VIEW_CONTENT', () => {
    const result = convertToUpperSnakeCase('ViewContent');
    expect(result).toBe('VIEW_CONTENT');
  });

  // Converts AddToWishlist to ADD_TO_WISHLIST
  it('should convert AddToWishlist to ADD_TO_WISHLIST', () => {
    const result = convertToUpperSnakeCase('AddToWishlist');
    expect(result).toBe('ADD_TO_WISHLIST');
  });

  // Converts Search to SEARCH
  it('should convert Search to SEARCH', () => {
    const result = convertToUpperSnakeCase('Search');
    expect(result).toBe('SEARCH');
  });

  // Converts Lead to LEAD
  it('should convert Lead to LEAD', () => {
    const result = convertToUpperSnakeCase('Lead');
    expect(result).toBe('LEAD');
  });

  // Converts SignUp to SIGN_UP
  it('should convert SignUp to SIGN_UP', () => {
    const result = convertToUpperSnakeCase('SignUp');
    expect(result).toBe('SIGN_UP');
  });

  // Converts PageVisit to PAGE_VISIT
  it('should convert PageVisit to PAGE_VISIT', () => {
    const result = convertToUpperSnakeCase('PageVisit');
    expect(result).toBe('PAGE_VISIT');
  });

  // Returns undefined for unmapped event type
  it('should return undefined for unmapped event type', () => {
    const result = convertToUpperSnakeCase('UnknownEvent');
    expect(result).toBeUndefined();
  });
});

describe('generateAndValidateTimestamp', () => {
  // Returns valid timestamp in milliseconds for valid ISO date string
  it('should return valid timestamp in milliseconds for valid ISO date string', () => {
    const validDate = new Date().toISOString();
    const result = generateAndValidateTimestamp(validDate);

    expect(typeof result).toBe('number');
    expect(result).toBeGreaterThan(0);
  });

  // Throws error when timestamp is null or undefined
  it('should throw error when timestamp is null', () => {
    expect(() => {
      generateAndValidateTimestamp(null);
    }).toThrow('Required field "timestamp" or "originalTimestamp" is missing from the message.');
  });

  it('should throw error when timestamp is undefined', () => {
    expect(() => {
      generateAndValidateTimestamp(undefined);
    }).toThrow('Required field "timestamp" or "originalTimestamp" is missing from the message.');
  });

  // Throws error for invalid timestamp format
  it('should throw error for invalid timestamp format', () => {
    expect(() => {
      generateAndValidateTimestamp('invalid-date');
    }).toThrow('Invalid timestamp format.');
  });

  // Throws error when timestamp is more than 7 days old
  it('should throw error when timestamp is more than 7 days old', () => {
    const oldDate = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(); // 8 days ago

    expect(() => {
      generateAndValidateTimestamp(oldDate);
    }).toThrow('event_at timestamp must be less than 168 hours (7 days) old.');
  });

  // Throws error when timestamp is more than 5 minutes in the future
  it('should throw error when timestamp is more than 5 minutes in the future', () => {
    const futureDate = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes in future

    expect(() => {
      generateAndValidateTimestamp(futureDate);
    }).toThrow('event_at timestamp must not be more than 5 minutes in the future.');
  });

  // Accepts timestamp exactly 168 hours old
  it('should accept timestamp exactly 168 hours old', () => {
    const validOldDate = new Date(Date.now() - 168 * 60 * 60 * 1000).toISOString();
    const result = generateAndValidateTimestamp(validOldDate);

    expect(typeof result).toBe('number');
    expect(result).toBeGreaterThan(0);
  });

  // Accepts timestamp exactly 5 minutes in the future
  it('should accept timestamp exactly 5 minutes in the future', () => {
    const validFutureDate = new Date(Date.now() + 5 * 60 * 1000).toISOString();
    const result = generateAndValidateTimestamp(validFutureDate);

    expect(typeof result).toBe('number');
    expect(result).toBeGreaterThan(0);
  });

  // Accepts timestamp as Unix milliseconds
  it('should accept timestamp as Unix milliseconds', () => {
    const now = Date.now();
    const result = generateAndValidateTimestamp(now);

    expect(result).toBe(now);
  });

  // Accepts timestamp as Date object
  it('should accept timestamp as Date object', () => {
    const dateObj = new Date();
    const result = generateAndValidateTimestamp(dateObj);

    expect(typeof result).toBe('number');
    expect(result).toBe(dateObj.getTime());
  });
});

describe('prepareBatches', () => {
  // Helper function to create a mock event
  const createMockEvent = (options = {}) => {
    const { dontBatch = false, testId = undefined, jobId = 1, version = 'v3' } = options;
    return {
      destination: {
        Config: { version },
      },
      message: [
        {
          body: {
            JSON: {
              data: {
                events: [{ event_type: 'PURCHASE', event_at: 123456 }],
                ...(testId && { test_id: testId }),
              },
            },
          },
        },
      ],
      metadata: {
        jobId,
        ...(dontBatch && { dontBatch: true }),
      },
    };
  };

  // Returns empty array for empty input
  it('should return empty array for empty input', () => {
    const successfulEvents = [];

    const result = prepareBatches(successfulEvents);

    expect(result).toEqual([]);
  });

  // Batches all batchable events correctly
  it('should batch all batchable events correctly', () => {
    const successfulEvents = [
      createMockEvent({ jobId: 1 }),
      createMockEvent({ jobId: 2 }),
      createMockEvent({ jobId: 3 }),
    ];

    const result = prepareBatches(successfulEvents);

    expect(result).toHaveLength(1);
    expect(result[0].metadata).toHaveLength(3);
    expect(result[0].metadata[0].jobId).toBe(1);
    expect(result[0].metadata[1].jobId).toBe(2);
    expect(result[0].metadata[2].jobId).toBe(3);
  });

  // Separates non-batchable events with dontBatch flag into individual batches
  it('should separate non-batchable events with dontBatch flag into individual batches', () => {
    const successfulEvents = [
      createMockEvent({ jobId: 1, dontBatch: true }),
      createMockEvent({ jobId: 2, dontBatch: true }),
      createMockEvent({ jobId: 3, dontBatch: true }),
    ];

    const result = prepareBatches(successfulEvents);

    expect(result).toHaveLength(3);
    expect(result[0].metadata).toHaveLength(1);
    expect(result[0].metadata[0].jobId).toBe(1);
    expect(result[1].metadata).toHaveLength(1);
    expect(result[1].metadata[0].jobId).toBe(2);
    expect(result[2].metadata).toHaveLength(1);
    expect(result[2].metadata[0].jobId).toBe(3);
  });

  // Separates non-batchable events with test_id into individual batches
  it('should separate non-batchable events with test_id into individual batches', () => {
    const successfulEvents = [
      createMockEvent({ jobId: 1, testId: 'test-123' }),
      createMockEvent({ jobId: 2, testId: 'test-456' }),
      createMockEvent({ jobId: 3, testId: 'test-789' }),
    ];

    const result = prepareBatches(successfulEvents);

    expect(result).toHaveLength(3);
    expect(result[0].metadata).toHaveLength(1);
    expect(result[0].metadata[0].jobId).toBe(1);
    expect(result[1].metadata).toHaveLength(1);
    expect(result[1].metadata[0].jobId).toBe(2);
    expect(result[2].metadata).toHaveLength(1);
    expect(result[2].metadata[0].jobId).toBe(3);
  });

  // Handles mixed batchable and non-batchable events correctly
  it('should handle mixed batchable and non-batchable events correctly', () => {
    const successfulEvents = [
      createMockEvent({ jobId: 1 }),
      createMockEvent({ jobId: 2, dontBatch: true }),
      createMockEvent({ jobId: 3 }),
      createMockEvent({ jobId: 4, testId: 'test-123' }),
      createMockEvent({ jobId: 5 }),
    ];

    const result = prepareBatches(successfulEvents);

    // Should have 3 batches: 1 for batchable events (jobIds 1, 3, 5), 2 for non-batchable (jobIds 2, 4)
    expect(result).toHaveLength(3);
    // First batch should contain batchable events
    const batchableBatch = result.find((batch) => batch.metadata.length > 1);
    expect(batchableBatch).toBeDefined();
    expect(batchableBatch.metadata).toHaveLength(3);
    expect(batchableBatch.metadata.map((m) => m.jobId).sort()).toEqual([1, 3, 5]);
    // Non-batchable events should be in separate batches
    const nonBatchableBatches = result.filter((batch) => batch.metadata.length === 1);
    expect(nonBatchableBatches).toHaveLength(2);
    expect(nonBatchableBatches.map((b) => b.metadata[0].jobId).sort()).toEqual([2, 4]);
  });

  // Chunks batchable events exceeding maxBatchSize correctly
  it('should chunk batchable events exceeding maxBatchSize correctly', () => {
    // Create 1500 batchable events (exceeding maxBatchSize of 1000)
    const successfulEvents = Array.from({ length: 1500 }, (_, i) =>
      createMockEvent({ jobId: i + 1 }),
    );

    const result = prepareBatches(successfulEvents);

    // Should create 2 batches: one with 1000 events, one with 500 events
    expect(result).toHaveLength(2);
    expect(result[0].metadata).toHaveLength(1000);
    expect(result[1].metadata).toHaveLength(500);
    expect(result[0].metadata[0].jobId).toBe(1);
    expect(result[1].metadata[0].jobId).toBe(1001);
  });

  // Handles events with both dontBatch and test_id correctly (should be non-batchable)
  it('should handle events with both dontBatch and test_id correctly', () => {
    const successfulEvents = [
      createMockEvent({ jobId: 1, dontBatch: true, testId: 'test-123' }),
      createMockEvent({ jobId: 2 }),
    ];

    const result = prepareBatches(successfulEvents);

    expect(result).toHaveLength(2);
    expect(result[0].metadata).toHaveLength(1);
    expect(result[0].metadata[0].jobId).toBe(1);
    expect(result[1].metadata).toHaveLength(1);
    expect(result[1].metadata[0].jobId).toBe(2);
  });

  // Handles single batchable event correctly
  it('should handle single batchable event correctly', () => {
    const successfulEvents = [createMockEvent({ jobId: 1 })];

    const result = prepareBatches(successfulEvents);

    expect(result).toHaveLength(1);
    expect(result[0].metadata).toHaveLength(1);
    expect(result[0].metadata[0].jobId).toBe(1);
  });

  // Handles single non-batchable event correctly
  it('should handle single non-batchable event correctly', () => {
    const successfulEvents = [createMockEvent({ jobId: 1, dontBatch: true })];

    const result = prepareBatches(successfulEvents);

    expect(result).toHaveLength(1);
    expect(result[0].metadata).toHaveLength(1);
    expect(result[0].metadata[0].jobId).toBe(1);
  });

  // Handles events with v2 version correctly
  it('should handle events with v2 version correctly', () => {
    const successfulEvents = [
      {
        destination: {
          Config: { version: 'v2' },
        },
        message: [
          {
            body: {
              JSON: {
                events: [{ event_type: 'Purchase', event_at: 123456 }],
              },
            },
          },
        ],
        metadata: { jobId: 1 },
      },
      {
        destination: {
          Config: { version: 'v2' },
        },
        message: [
          {
            body: {
              JSON: {
                events: [{ event_type: 'AddToCart', event_at: 123457 }],
              },
            },
          },
        ],
        metadata: { jobId: 2 },
      },
    ];

    const result = prepareBatches(successfulEvents);

    expect(result).toHaveLength(1);
    expect(result[0].metadata).toHaveLength(2);
    expect(result[0].message.body.JSON.events).toHaveLength(2);
  });

  // Handles events with missing metadata correctly
  it('should handle events with missing metadata correctly', () => {
    const successfulEvents = [
      {
        destination: {
          Config: { version: 'v3' },
        },
        message: [
          {
            body: {
              JSON: {
                data: {
                  events: [{ event_type: 'PURCHASE', event_at: 123456 }],
                },
              },
            },
          },
        ],
        metadata: undefined,
      },
      createMockEvent({ jobId: 2 }),
    ];

    const result = prepareBatches(successfulEvents);

    expect(result).toHaveLength(1);
    expect(result[0].metadata).toHaveLength(2);
  });

  // Handles events with missing test_id in body correctly
  it('should handle events with missing test_id in body correctly', () => {
    const successfulEvents = [
      {
        destination: {
          Config: { version: 'v3' },
        },
        message: [
          {
            body: {
              JSON: {
                data: {
                  events: [{ event_type: 'PURCHASE', event_at: 123456 }],
                },
              },
            },
          },
        ],
        metadata: { jobId: 1 },
      },
      createMockEvent({ jobId: 2 }),
    ];

    const result = prepareBatches(successfulEvents);

    expect(result).toHaveLength(1);
    expect(result[0].metadata).toHaveLength(2);
  });
});
