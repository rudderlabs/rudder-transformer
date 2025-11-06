const { batchForTrackAPI } = require('./util');

describe('batchForTrackAPI', () => {
  // Helper function to create test data
  const createTestAttribute = (externalId, name = 'test_attr') => ({
    external_id: externalId,
    [name]: 'test_value',
  });

  const createTestEvent = (externalId, name = 'test_event') => ({
    external_id: externalId,
    name,
    time: '2023-01-01T00:00:00Z',
  });

  const createTestPurchase = (externalId, productId = 'test_product') => ({
    external_id: externalId,
    product_id: productId,
    currency: 'USD',
    price: 10.99,
    time: '2023-01-01T00:00:00Z',
  });

  describe('Basic functionality', () => {
    it('should handle empty arrays', () => {
      const result = batchForTrackAPI([], [], []);
      expect(result).toEqual([]);
    });

    it('should handle single items in each array', () => {
      const attributes = [createTestAttribute('user1')];
      const events = [createTestEvent('user1')];
      const purchases = [createTestPurchase('user1')];

      const result = batchForTrackAPI(attributes, events, purchases);

      expect(result).toHaveLength(1);
      expect(result[0].attributes).toHaveLength(1);
      expect(result[0].events).toHaveLength(1);
      expect(result[0].purchases).toHaveLength(1);
      expect(result[0].externalIds.has('user1')).toBe(true);
    });

    it('should handle arrays with different lengths', () => {
      const attributes = [createTestAttribute('user1'), createTestAttribute('user2')];
      const events = [createTestEvent('user1')];
      const purchases = [];

      const result = batchForTrackAPI(attributes, events, purchases);

      expect(result).toHaveLength(1);
      expect(result[0].attributes).toHaveLength(2);
      expect(result[0].events).toHaveLength(1);
      expect(result[0].purchases).toHaveLength(0);
    });

    it('should handle null/undefined items in arrays', () => {
      const attributes = [createTestAttribute('user1'), null, undefined];
      const events = [null, createTestEvent('user2')];
      const purchases = [undefined];

      const result = batchForTrackAPI(attributes, events, purchases);

      expect(result).toHaveLength(1);
      expect(result[0].attributes).toHaveLength(1);
      expect(result[0].events).toHaveLength(1);
      expect(result[0].purchases).toHaveLength(0);
    });
  });

  describe('Batching by external ID count', () => {
    it('should create multiple chunks when external ID count exceeds 75', () => {
      const attributes = [];
      const events = [];
      const purchases = [];

      // Create 76 different external IDs (exceeds TRACK_BRAZE_MAX_EXTERNAL_ID_COUNT = 75)
      for (let i = 1; i <= 76; i++) {
        attributes.push(createTestAttribute(`user${i}`));
      }

      const result = batchForTrackAPI(attributes, events, purchases);

      expect(result).toHaveLength(2);
      expect(result[0].externalIds.size).toBe(75);
      expect(result[1].externalIds.size).toBe(1);
      expect(result[0].attributes).toHaveLength(75);
      expect(result[1].attributes).toHaveLength(1);
    });

    it('should group items by external ID correctly', () => {
      const attributes = [
        createTestAttribute('user1', 'attr1'),
        createTestAttribute('user1', 'attr2'),
        createTestAttribute('user2', 'attr1'),
      ];
      const events = [createTestEvent('user1', 'event1'), createTestEvent('user2', 'event1')];
      const purchases = [createTestPurchase('user1')];

      const result = batchForTrackAPI(attributes, events, purchases);

      expect(result).toHaveLength(1);
      expect(result[0].externalIds.size).toBe(2);
      expect(result[0].attributes).toHaveLength(3);
      expect(result[0].events).toHaveLength(2);
      expect(result[0].purchases).toHaveLength(1);
    });
  });

  describe('Batching by request count per type', () => {
    it('should create multiple chunks when attributes count exceeds 75', () => {
      const attributes = [];
      const events = [];
      const purchases = [];

      // Create 76 attributes for the same user (exceeds TRACK_BRAZE_MAX_REQ_COUNT = 75)
      for (let i = 1; i <= 76; i++) {
        attributes.push(createTestAttribute('user1', `attr${i}`));
      }

      const result = batchForTrackAPI(attributes, events, purchases);

      expect(result).toHaveLength(2);
      expect(result[0].attributes).toHaveLength(75);
      expect(result[1].attributes).toHaveLength(1);
      expect(result[0].externalIds.has('user1')).toBe(true);
      expect(result[1].externalIds.has('user1')).toBe(true);
    });

    it('should create multiple chunks when events count exceeds 75', () => {
      const attributes = [];
      const events = [];
      const purchases = [];

      // Create 76 events for the same user
      for (let i = 1; i <= 76; i++) {
        events.push(createTestEvent('user1', `event${i}`));
      }

      const result = batchForTrackAPI(attributes, events, purchases);

      expect(result).toHaveLength(2);
      expect(result[0].events).toHaveLength(75);
      expect(result[1].events).toHaveLength(1);
    });

    it('should create multiple chunks when purchases count exceeds 75', () => {
      const attributes = [];
      const events = [];
      const purchases = [];

      // Create 76 purchases for the same user
      for (let i = 1; i <= 76; i++) {
        purchases.push(createTestPurchase('user1', `product${i}`));
      }

      const result = batchForTrackAPI(attributes, events, purchases);

      expect(result).toHaveLength(2);
      expect(result[0].purchases).toHaveLength(75);
      expect(result[1].purchases).toHaveLength(1);
    });
  });

  describe('Complex scenarios', () => {
    it('should handle mixed batching scenarios', () => {
      const attributes = [];
      const events = [];
      const purchases = [];

      // Create scenario where request count limit is hit first
      // 38 users with 2 attributes each = 76 attributes (exceeds 75 limit)
      // This will create a split based on request count, not external ID count
      for (let i = 1; i <= 38; i++) {
        attributes.push(createTestAttribute(`user${i}`, 'attr1'));
        attributes.push(createTestAttribute(`user${i}`, 'attr2'));
        events.push(createTestEvent(`user${i}`));
      }

      const result = batchForTrackAPI(attributes, events, purchases);

      expect(result).toHaveLength(2);
      // First chunk should have 75 attributes (hitting the request count limit)
      expect(result[0].attributes).toHaveLength(75);
      // Second chunk should have 1 attribute
      expect(result[1].attributes).toHaveLength(1);
      // External IDs should be distributed across chunks
      expect(result[0].externalIds.size).toBe(38); // 37 users with 2 attrs + 1 user with 1 attr
      expect(result[1].externalIds.size).toBe(1); // 1 user with 1 attr
    });

    it('should sort items by external ID', () => {
      const attributes = [
        createTestAttribute('user3'),
        createTestAttribute('user1'),
        createTestAttribute('user2'),
      ];
      const events = [];
      const purchases = [];

      const result = batchForTrackAPI(attributes, events, purchases);

      expect(result).toHaveLength(1);
      // Items should be sorted by external ID
      expect(result[0].attributes[0].external_id).toBe('user1');
      expect(result[0].attributes[1].external_id).toBe('user2');
      expect(result[0].attributes[2].external_id).toBe('user3');
    });

    it('should handle edge case with exactly 75 external IDs', () => {
      const attributes = [];
      const events = [];
      const purchases = [];

      // Create exactly 75 external IDs
      for (let i = 1; i <= 75; i++) {
        attributes.push(createTestAttribute(`user${i}`));
      }

      const result = batchForTrackAPI(attributes, events, purchases);

      expect(result).toHaveLength(1);
      expect(result[0].externalIds.size).toBe(75);
      expect(result[0].attributes).toHaveLength(75);
    });

    it('should handle edge case with exactly 75 items per type', () => {
      const attributes = [];
      const events = [];
      const purchases = [];

      // Create exactly 75 items of each type for the same user
      for (let i = 1; i <= 75; i++) {
        attributes.push(createTestAttribute('user1', `attr${i}`));
        events.push(createTestEvent('user1', `event${i}`));
        purchases.push(createTestPurchase('user1', `product${i}`));
      }

      const result = batchForTrackAPI(attributes, events, purchases);

      expect(result).toHaveLength(1);
      expect(result[0].attributes).toHaveLength(75);
      expect(result[0].events).toHaveLength(75);
      expect(result[0].purchases).toHaveLength(75);
      expect(result[0].externalIds.size).toBe(1);
    });
  });

  describe('Data structure validation', () => {
    it('should return chunks with correct structure', () => {
      const attributes = [createTestAttribute('user1')];
      const events = [createTestEvent('user1')];
      const purchases = [createTestPurchase('user1')];

      const result = batchForTrackAPI(attributes, events, purchases);

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('attributes');
      expect(result[0]).toHaveProperty('events');
      expect(result[0]).toHaveProperty('purchases');
      expect(result[0]).toHaveProperty('externalIds');
      expect(result[0].externalIds).toBeInstanceOf(Set);
    });

    it('should preserve original data structure in chunks', () => {
      const originalAttribute = createTestAttribute('user1', 'custom_attr');
      const originalEvent = createTestEvent('user1', 'custom_event');
      const originalPurchase = createTestPurchase('user1', 'custom_product');

      const result = batchForTrackAPI([originalAttribute], [originalEvent], [originalPurchase]);

      expect(result[0].attributes[0]).toEqual(originalAttribute);
      expect(result[0].events[0]).toEqual(originalEvent);
      expect(result[0].purchases[0]).toEqual(originalPurchase);
    });
  });
});
