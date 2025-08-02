// Proper test for Facebook Conversions metrics
const FacebookConversionsMetrics = require('./src/v0/destinations/facebook_conversions/metricsUtils');

// Mock the stats module to capture calls
jest.mock('./src/util/stats', () => ({
  increment: jest.fn(),
}));

const stats = require('./src/util/stats');
const mockIncrement = stats.increment;

describe('FacebookConversionsMetrics', () => {
  let metrics;

  beforeEach(() => {
    metrics = new FacebookConversionsMetrics();
    mockIncrement.mockClear();
  });

  test('trackTotalEvents should call stats.increment with correct parameters', () => {
    const eventName = 'Purchase';
    const destID = 'test_dest_123';

    metrics.trackTotalEvents(eventName, destID);

    expect(mockIncrement).toHaveBeenCalledWith('facebook_conversions_total_events', {
      event_name: eventName,
      destID: destID,
    });
  });

  test('trackPropertyUsage should track all properties in payload', () => {
    const testPayload = {
      event_name: 'Purchase',
      event_time: 1234567890,
      user_data: {
        em: 'user@example.com',
        ph: '1234567890',
      },
      custom_data: {
        value: 100.5,
        currency: 'USD',
      },
      action_source: 'website',
    };

    const eventName = 'Purchase';
    const destID = 'test_dest_123';

    metrics.trackPropertyUsage(testPayload, eventName, destID);

    // Verify all expected properties were tracked
    const expectedCalls = [
      'facebook_conversions_property_event_name',
      'facebook_conversions_property_event_time',
      'facebook_conversions_property_user_data',
      'facebook_conversions_property_user_data_em',
      'facebook_conversions_property_user_data_ph',
      'facebook_conversions_property_custom_data',
      'facebook_conversions_property_custom_data_value',
      'facebook_conversions_property_custom_data_currency',
      'facebook_conversions_property_action_source',
    ];

    expectedCalls.forEach((expectedMetric) => {
      expect(mockIncrement).toHaveBeenCalledWith(expectedMetric, {
        event_name: eventName,
        destID: destID,
      });
    });

    // Verify total number of calls
    expect(mockIncrement).toHaveBeenCalledTimes(expectedCalls.length);
  });

  test('should handle nested objects correctly', () => {
    const testPayload = {
      user_data: {
        em: 'user@example.com',
        fbc: 'fb.1.123456789.123456789',
      },
    };

    const eventName = 'Purchase';
    const destID = 'test_dest_123';

    metrics.trackPropertyUsage(testPayload, eventName, destID);

    expect(mockIncrement).toHaveBeenCalledWith('facebook_conversions_property_user_data_em', {
      event_name: eventName,
      destID: destID,
    });

    expect(mockIncrement).toHaveBeenCalledWith('facebook_conversions_property_user_data_fbc', {
      event_name: eventName,
      destID: destID,
    });
  });

  test('should handle null and undefined values gracefully', () => {
    const testPayload = {
      valid_field: 'value',
      null_field: null,
      undefined_field: undefined,
    };

    const eventName = 'Purchase';
    const destID = 'test_dest_123';

    metrics.trackPropertyUsage(testPayload, eventName, destID);

    // Should only track valid_field
    expect(mockIncrement).toHaveBeenCalledWith('facebook_conversions_property_valid_field', {
      event_name: eventName,
      destID: destID,
    });

    // Should not be called for null or undefined fields
    expect(mockIncrement).not.toHaveBeenCalledWith(
      'facebook_conversions_property_null_field',
      expect.any(Object),
    );
    expect(mockIncrement).not.toHaveBeenCalledWith(
      'facebook_conversions_property_undefined_field',
      expect.any(Object),
    );
  });

  test('should handle empty payload gracefully', () => {
    const testPayload = {};
    const eventName = 'Purchase';
    const destID = 'test_dest_123';

    metrics.trackPropertyUsage(testPayload, eventName, destID);

    // Should not call increment for empty payload
    expect(mockIncrement).not.toHaveBeenCalled();
  });

  test('should handle null payload gracefully', () => {
    const testPayload = null;
    const eventName = 'Purchase';
    const destID = 'test_dest_123';

    metrics.trackPropertyUsage(testPayload, eventName, destID);

    // Should not call increment for null payload
    expect(mockIncrement).not.toHaveBeenCalled();
  });
});
