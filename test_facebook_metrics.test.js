// Proper test for Facebook Conversions metrics
const FacebookConversionsMetrics = require('./src/v0/destinations/facebook_conversions/metricsUtils');

// Mock the stats module to capture calls
jest.mock('./src/util/stats', () => ({
  increment: jest.fn(),
}));

const stats = require('./src/util/stats');
const mockIncrement = stats.increment;
const {
  ALLOWED_EVENTS,
  ALL_ALLOWED_PROPERTIES,
} = require('./src/v0/destinations/facebook_conversions/metricsConfig');

describe('FacebookConversionsMetrics', () => {
  let metrics;

  beforeEach(() => {
    metrics = new FacebookConversionsMetrics();
    mockIncrement.mockClear();
  });

  test('trackTotalEvents should call stats.increment with correct parameters for allowed events', () => {
    const rudderEventName = 'Product Viewed';
    const destID = 'test_dest_123';

    metrics.trackTotalEvents(rudderEventName, destID);

    expect(mockIncrement).toHaveBeenCalledWith('facebook_conversions_total_events', {
      event_name: 'ViewContent', // Should map to Facebook event name
      destID: destID,
    });
  });

  test('should not track events that are not in allowlist', () => {
    const nonAllowedEvent = 'Random Custom Event';
    const destID = 'test_dest_123';

    metrics.trackTotalEvents(nonAllowedEvent, destID);

    expect(mockIncrement).not.toHaveBeenCalled();
  });

  test('trackPropertyUsage should only track allowlisted properties', () => {
    const testPayload = {
      event_name: 'Purchase', // Allowed
      event_time: 1234567890, // Allowed
      user_data: {
        em: 'user@example.com', // Allowed
        ph: '1234567890', // Allowed
        random_field: 'not_allowed', // Not allowed
      },
      custom_data: {
        value: 100.5, // Allowed
        currency: 'USD', // Allowed
        secret_data: 'private', // Not allowed
      },
      action_source: 'website', // Allowed
      unknown_property: 'test', // Not allowed
    };

    const rudderEventName = 'Order Completed';
    const destID = 'test_dest_123';

    metrics.trackPropertyUsage(testPayload, rudderEventName, destID);

    // Only allowlisted properties should be tracked (not container objects)
    const expectedCalls = [
      'facebook_conversions_property_event_name',
      'facebook_conversions_property_event_time',
      'facebook_conversions_property_user_data_em',
      'facebook_conversions_property_user_data_ph',
      'facebook_conversions_property_custom_data_value',
      'facebook_conversions_property_custom_data_currency',
      'facebook_conversions_property_action_source',
    ];

    expectedCalls.forEach((expectedMetric) => {
      expect(mockIncrement).toHaveBeenCalledWith(expectedMetric, {
        event_name: 'Purchase', // Should map to Facebook event name
        destID: destID,
      });
    });

    // Verify non-allowlisted properties are not tracked
    expect(mockIncrement).not.toHaveBeenCalledWith(
      'facebook_conversions_property_user_data_random_field',
      expect.any(Object),
    );
    expect(mockIncrement).not.toHaveBeenCalledWith(
      'facebook_conversions_property_custom_data_secret_data',
      expect.any(Object),
    );
    expect(mockIncrement).not.toHaveBeenCalledWith(
      'facebook_conversions_property_unknown_property',
      expect.any(Object),
    );

    // Verify total number of calls matches expected
    expect(mockIncrement).toHaveBeenCalledTimes(expectedCalls.length);
  });

  test('should handle event mapping correctly', () => {
    const rudderEventName = 'Product Added';
    const destID = 'test_dest_123';

    metrics.trackTotalEvents(rudderEventName, destID);

    expect(mockIncrement).toHaveBeenCalledWith('facebook_conversions_total_events', {
      event_name: 'AddToCart', // Should map from Product Added to AddToCart
      destID: destID,
    });
  });

  test('should handle nested allowlisted objects correctly', () => {
    const testPayload = {
      user_data: {
        em: 'user@example.com', // Allowed
        fbc: 'fb.1.123456789.123456789', // Allowed
        secret: 'not_allowed', // Not allowed
      },
    };

    const rudderEventName = 'Product Viewed';
    const destID = 'test_dest_123';

    metrics.trackPropertyUsage(testPayload, rudderEventName, destID);

    // Should track allowlisted nested properties
    expect(mockIncrement).toHaveBeenCalledWith('facebook_conversions_property_user_data_em', {
      event_name: 'ViewContent',
      destID: destID,
    });

    expect(mockIncrement).toHaveBeenCalledWith('facebook_conversions_property_user_data_fbc', {
      event_name: 'ViewContent',
      destID: destID,
    });

    // Should not track non-allowlisted properties
    expect(mockIncrement).not.toHaveBeenCalledWith(
      'facebook_conversions_property_user_data_secret',
      expect.any(Object),
    );
  });

  test('should handle null and undefined values gracefully', () => {
    const testPayload = {
      event_name: 'Purchase', // Allowed field
      null_field: null,
      undefined_field: undefined,
    };

    const rudderEventName = 'Order Completed';
    const destID = 'test_dest_123';

    metrics.trackPropertyUsage(testPayload, rudderEventName, destID);

    // Should only track allowlisted field
    expect(mockIncrement).toHaveBeenCalledWith('facebook_conversions_property_event_name', {
      event_name: 'Purchase',
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

  // Test all allowlisted Rudder events and their Facebook mappings
  describe('Event mapping tests', () => {
    const testCases = [
      {
        rudderEvent: 'Product Viewed',
        expectedFacebookEvent: 'ViewContent',
        description: 'Product Viewed → ViewContent',
      },
      {
        rudderEvent: 'Product List Viewed',
        expectedFacebookEvent: 'ViewContent',
        description: 'Product List Viewed → ViewContent',
      },
      {
        rudderEvent: 'Product Added',
        expectedFacebookEvent: 'AddToCart',
        description: 'Product Added → AddToCart',
      },
      {
        rudderEvent: 'Order Completed',
        expectedFacebookEvent: 'Purchase',
        description: 'Order Completed → Purchase',
      },
      {
        rudderEvent: 'Products Searched',
        expectedFacebookEvent: 'Search',
        description: 'Products Searched → Search',
      },
      {
        rudderEvent: 'Checkout Started',
        expectedFacebookEvent: 'InitiateCheckout',
        description: 'Checkout Started → InitiateCheckout',
      },
      {
        rudderEvent: 'Payment Info Entered',
        expectedFacebookEvent: 'AddPaymentInfo',
        description: 'Payment Info Entered → AddPaymentInfo',
      },
      {
        rudderEvent: 'Product Added to Wishlist',
        expectedFacebookEvent: 'AddToWishlist',
        description: 'Product Added to Wishlist → AddToWishlist',
      },
      {
        rudderEvent: 'Page',
        expectedFacebookEvent: 'PageView',
        description: 'Page → PageView',
      },
      {
        rudderEvent: 'Screen',
        expectedFacebookEvent: 'PageView',
        description: 'Screen → PageView',
      },
    ];

    testCases.forEach(({ rudderEvent, expectedFacebookEvent, description }) => {
      test(`should map ${description}`, () => {
        const destID = 'test_dest_123';

        metrics.trackTotalEvents(rudderEvent, destID);

        expect(mockIncrement).toHaveBeenCalledWith('facebook_conversions_total_events', {
          event_name: expectedFacebookEvent,
          destID: destID,
        });
      });
    });
  });

  // Test all allowlisted properties by category
  describe('Property allowlist tests', () => {
    test('should track USER_DATA properties', () => {
      const testPayload = {
        user_data: {
          external_id: '12345',
          em: 'user@example.com',
          ph: '1234567890',
          fn: 'John',
          ln: 'Doe',
          fbc: 'fb.1.123456789.123456789',
          fbp: 'fb.1.123456789.123456789',
          client_ip_address: '192.168.1.1',
          client_user_agent: 'Mozilla/5.0',
          ge: 'm',
          db: '1990-01-01',
          ct: 'New York',
          st: 'NY',
          zp: '10001',
          country: 'US',
        },
      };

      const rudderEventName = 'Product Viewed';
      const destID = 'test_dest_123';

      metrics.trackPropertyUsage(testPayload, rudderEventName, destID);

      // Should track all USER_DATA properties
      const expectedUserDataProperties = [
        'external_id',
        'em',
        'ph',
        'fn',
        'ln',
        'fbc',
        'fbp',
        'client_ip_address',
        'client_user_agent',
        'ge',
        'db',
        'ct',
        'st',
        'zp',
        'country',
      ];

      expectedUserDataProperties.forEach((prop) => {
        expect(mockIncrement).toHaveBeenCalledWith(
          `facebook_conversions_property_user_data_${prop}`,
          {
            event_name: 'ViewContent',
            destID: destID,
          },
        );
      });
    });

    test('should track EVENT_DATA properties', () => {
      const testPayload = {
        event_name: 'Purchase',
        event_time: 1234567890,
        event_source_url: 'https://example.com',
        event_id: 'evt_123',
        action_source: 'website',
      };

      const rudderEventName = 'Order Completed';
      const destID = 'test_dest_123';

      metrics.trackPropertyUsage(testPayload, rudderEventName, destID);

      // Should track all EVENT_DATA properties
      const expectedEventDataProperties = [
        'event_name',
        'event_time',
        'event_source_url',
        'event_id',
        'action_source',
      ];

      expectedEventDataProperties.forEach((prop) => {
        expect(mockIncrement).toHaveBeenCalledWith(`facebook_conversions_property_${prop}`, {
          event_name: 'Purchase',
          destID: destID,
        });
      });
    });

    test('should track CUSTOM_DATA properties', () => {
      const testPayload = {
        custom_data: {
          content_ids: ['prod_123', 'prod_456'],
          value: 99.99,
          currency: 'USD',
          content_type: 'product',
          content_category: 'electronics',
          content_name: 'iPhone 15',
          num_items: 2,
          search_string: 'smartphone',
          contents: [
            {
              id: 'prod_123',
              quantity: 1,
              price: 49.99,
            },
          ],
        },
      };

      const rudderEventName = 'Order Completed';
      const destID = 'test_dest_123';

      metrics.trackPropertyUsage(testPayload, rudderEventName, destID);

      // Should track all CUSTOM_DATA properties
      const expectedCustomDataProperties = [
        'content_ids',
        'value',
        'currency',
        'content_type',
        'content_category',
        'content_name',
        'num_items',
        'search_string',
        'contents',
      ];

      expectedCustomDataProperties.forEach((prop) => {
        expect(mockIncrement).toHaveBeenCalledWith(
          `facebook_conversions_property_custom_data_${prop}`,
          {
            event_name: 'Purchase',
            destID: destID,
          },
        );
      });
    });

    test('should track APP_DATA properties', () => {
      const testPayload = {
        advertiser_tracking_enabled: true,
        application_tracking_enabled: true,
        extinfo: {
          app_name: 'MyApp',
          app_version: '1.0.0',
          device_model: 'iPhone 15',
          os_version: 'iOS 17.0',
        },
      };

      const rudderEventName = 'Product Viewed';
      const destID = 'test_dest_123';

      metrics.trackPropertyUsage(testPayload, rudderEventName, destID);

      // Should track all APP_DATA properties
      const expectedAppDataProperties = [
        'advertiser_tracking_enabled',
        'application_tracking_enabled',
        'extinfo',
      ];

      expectedAppDataProperties.forEach((prop) => {
        expect(mockIncrement).toHaveBeenCalledWith(`facebook_conversions_property_${prop}`, {
          event_name: 'ViewContent',
          destID: destID,
        });
      });
    });

    test('should track COMPLIANCE properties', () => {
      const testPayload = {
        data_processing_options: ['LDU'],
        data_processing_options_country: 1,
        data_processing_options_state: 1002,
        opt_out: false,
      };

      const rudderEventName = 'Product Viewed';
      const destID = 'test_dest_123';

      metrics.trackPropertyUsage(testPayload, rudderEventName, destID);

      // Should track all COMPLIANCE properties
      const expectedComplianceProperties = [
        'data_processing_options',
        'data_processing_options_country',
        'data_processing_options_state',
        'opt_out',
      ];

      expectedComplianceProperties.forEach((prop) => {
        expect(mockIncrement).toHaveBeenCalledWith(`facebook_conversions_property_${prop}`, {
          event_name: 'ViewContent',
          destID: destID,
        });
      });
    });
  });

  // Test non-allowlisted events and properties
  describe('Non-allowlisted tests', () => {
    test('should not track non-allowlisted events', () => {
      const nonAllowedEvents = [
        'Random Custom Event',
        'Unknown Event',
        'Test Event',
        'Custom Purchase',
        'Product Clicked',
      ];

      const destID = 'test_dest_123';

      nonAllowedEvents.forEach((event) => {
        mockIncrement.mockClear();
        metrics.trackTotalEvents(event, destID);
        expect(mockIncrement).not.toHaveBeenCalled();
      });
    });

    test('should not track non-allowlisted properties', () => {
      const testPayload = {
        user_data: {
          em: 'user@example.com', // Allowed
          secret_field: 'private', // Not allowed
          internal_id: '12345', // Not allowed
        },
        custom_data: {
          value: 100.5, // Allowed
          secret_revenue: 5000, // Not allowed
          internal_category: 'premium', // Not allowed
        },
        unknown_property: 'test', // Not allowed
      };

      const rudderEventName = 'Product Viewed';
      const destID = 'test_dest_123';

      metrics.trackPropertyUsage(testPayload, rudderEventName, destID);

      // Should only track allowlisted properties
      expect(mockIncrement).toHaveBeenCalledWith('facebook_conversions_property_user_data_em', {
        event_name: 'ViewContent',
        destID: destID,
      });

      expect(mockIncrement).toHaveBeenCalledWith(
        'facebook_conversions_property_custom_data_value',
        {
          event_name: 'ViewContent',
          destID: destID,
        },
      );

      // Should not track non-allowlisted properties
      expect(mockIncrement).not.toHaveBeenCalledWith(
        'facebook_conversions_property_user_data_secret_field',
        expect.any(Object),
      );
      expect(mockIncrement).not.toHaveBeenCalledWith(
        'facebook_conversions_property_user_data_internal_id',
        expect.any(Object),
      );
      expect(mockIncrement).not.toHaveBeenCalledWith(
        'facebook_conversions_property_custom_data_secret_revenue',
        expect.any(Object),
      );
      expect(mockIncrement).not.toHaveBeenCalledWith(
        'facebook_conversions_property_custom_data_internal_category',
        expect.any(Object),
      );
      expect(mockIncrement).not.toHaveBeenCalledWith(
        'facebook_conversions_property_unknown_property',
        expect.any(Object),
      );
    });
  });
});
