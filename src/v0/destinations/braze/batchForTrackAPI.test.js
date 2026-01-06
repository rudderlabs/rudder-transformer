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

    it('should handle null/undefined items in arrays by filtering them out', () => {
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

  describe('Batching by total request count', () => {
    it('should create chunks based on total combined count, not per-type count', () => {
      const attributes = [];
      const events = [];
      const purchases = [];

      // Create 30 attributes, 30 events, 30 purchases for the same user
      // Total = 90 items (exceeds TRACK_BRAZE_MAX_REQ_COUNT = 75)
      for (let i = 1; i <= 30; i++) {
        attributes.push(createTestAttribute('user1', `attr${i}`));
        events.push(createTestEvent('user1', `event${i}`));
        purchases.push(createTestPurchase('user1', `product${i}`));
      }

      const result = batchForTrackAPI(attributes, events, purchases);

      // Should split into 2 chunks
      expect(result).toHaveLength(2);

      // First chunk should have 75 items total
      const chunk1Size =
        result[0].attributes.length + result[0].events.length + result[0].purchases.length;
      expect(chunk1Size).toBe(75);

      // Second chunk should have 15 items total (90 - 75)
      const chunk2Size =
        result[1].attributes.length + result[1].events.length + result[1].purchases.length;
      expect(chunk2Size).toBe(15);
    });

    it('should split when total count exceeds 75 even with mixed types', () => {
      const attributes = [];
      const events = [];
      const purchases = [];

      // 25 attributes + 25 events + 26 purchases = 76 items (exceeds 75)
      for (let i = 1; i <= 25; i++) {
        attributes.push(createTestAttribute('user1', `attr${i}`));
        events.push(createTestEvent('user1', `event${i}`));
      }
      for (let i = 1; i <= 26; i++) {
        purchases.push(createTestPurchase('user1', `product${i}`));
      }

      const result = batchForTrackAPI(attributes, events, purchases);

      expect(result).toHaveLength(2);

      const chunk1Size =
        result[0].attributes.length + result[0].events.length + result[0].purchases.length;
      expect(chunk1Size).toBe(75);

      const chunk2Size =
        result[1].attributes.length + result[1].events.length + result[1].purchases.length;
      expect(chunk2Size).toBe(1);
    });

    it('should handle edge case with exactly 75 total items', () => {
      const attributes = [];
      const events = [];
      const purchases = [];

      // Create exactly 75 items total (25 of each type)
      for (let i = 1; i <= 25; i++) {
        attributes.push(createTestAttribute('user1', `attr${i}`));
        events.push(createTestEvent('user1', `event${i}`));
        purchases.push(createTestPurchase('user1', `product${i}`));
      }

      const result = batchForTrackAPI(attributes, events, purchases);

      expect(result).toHaveLength(1);
      expect(result[0].attributes).toHaveLength(25);
      expect(result[0].events).toHaveLength(25);
      expect(result[0].purchases).toHaveLength(25);
    });

    it('should create multiple chunks when only attributes exceed 75', () => {
      const attributes = [];
      const events = [];
      const purchases = [];

      // Create 76 attributes for the same user
      for (let i = 1; i <= 76; i++) {
        attributes.push(createTestAttribute('user1', `attr${i}`));
      }

      const result = batchForTrackAPI(attributes, events, purchases);

      expect(result).toHaveLength(2);
      expect(result[0].attributes).toHaveLength(75);
      expect(result[1].attributes).toHaveLength(1);
    });
  });

  describe('Complex scenarios', () => {
    it('should handle mixed batching with multiple users and total size limit', () => {
      const attributes = [];
      const events = [];
      const purchases = [];

      // Create 38 users with 1 attribute and 1 event each = 76 total items
      for (let i = 1; i <= 38; i++) {
        attributes.push(createTestAttribute(`user${i}`));
        events.push(createTestEvent(`user${i}`));
      }

      const result = batchForTrackAPI(attributes, events, purchases);

      expect(result).toHaveLength(2);

      // First chunk should have 75 items total
      const chunk1Size =
        result[0].attributes.length + result[0].events.length + result[0].purchases.length;
      expect(chunk1Size).toBe(75);

      // Second chunk should have 1 item
      const chunk2Size =
        result[1].attributes.length + result[1].events.length + result[1].purchases.length;
      expect(chunk2Size).toBe(1);
    });

    it('should sort items by external ID before batching', () => {
      const attributes = [
        createTestAttribute('user3', 'attr1'),
        createTestAttribute('user1', 'attr1'),
        createTestAttribute('user2', 'attr1'),
      ];
      const events = [createTestEvent('user3', 'event1'), createTestEvent('user1', 'event1')];
      const purchases = [];

      const result = batchForTrackAPI(attributes, events, purchases);

      expect(result).toHaveLength(1);
      // Items should be sorted by external ID, so user1 items come first
      expect(result[0].attributes[0].external_id).toBe('user1');
      expect(result[0].events[0].external_id).toBe('user1');
    });

    it('should handle large datasets requiring multiple chunks', () => {
      const attributes = [];
      const events = [];
      const purchases = [];

      // Create 200 total items (should create 3 chunks: 75 + 75 + 50)
      for (let i = 1; i <= 200; i++) {
        attributes.push(createTestAttribute('user1', `attr${i}`));
      }

      const result = batchForTrackAPI(attributes, events, purchases);

      expect(result).toHaveLength(3);
      expect(result[0].attributes).toHaveLength(75);
      expect(result[1].attributes).toHaveLength(75);
      expect(result[2].attributes).toHaveLength(50);
    });
  });
});
