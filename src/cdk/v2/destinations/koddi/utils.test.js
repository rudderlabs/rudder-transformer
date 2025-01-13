const {
  getEndpoint,
  validateBidders,
  constructFullPayload,
  constructResponse,
} = require('./utils');
const { InstrumentationError } = require('@rudderstack/integrations-lib');

describe('getEndpoint', () => {
  it('returns the correct endpoint for IMPRESSIONS event', () => {
    const eventType = 'impressions';
    const Config = {
      apiBaseUrl: 'https://www.test-client.com/',
      clientName: 'test-client',
    };
    const result = getEndpoint(eventType, Config);
    expect(result).toEqual('https://www.test-client.com?action=impression');
  });

  it('returns the correct endpoint for CLICKS event', () => {
    const eventType = 'clicks';
    const Config = {
      apiBaseUrl: 'https://www.test-client.com',
      clientName: 'test-client',
    };
    const result = getEndpoint(eventType, Config);
    expect(result).toEqual('https://www.test-client.com?action=click');
  });

  it('returns the correct endpoint for IMPRESSIONS event', () => {
    const eventType = 'conversions';
    const Config = {
      apiBaseUrl: 'https://www.test-client.com',
      clientName: 'test-client',
    };
    const result = getEndpoint(eventType, Config);
    expect(result).toEqual('https://www.test-client.com/conversion');
  });

  it('should throw error for unsupported event', () => {
    const eventType = 'test';
    const Config = {
      apiBaseUrl: 'https://www.test-client.com',
      clientName: 'test-client',
    };
    expect(() => getEndpoint(eventType, Config)).toThrow(InstrumentationError);
    expect(() => getEndpoint(eventType, Config)).toThrow('event type test is not supported.');
  });
});

describe('validateBidders', () => {
  it('should throw error if bidders is not an array', () => {
    const bidders = {};
    expect(() => validateBidders(bidders)).toThrow(InstrumentationError);
    expect(() => validateBidders(bidders)).toThrow(
      'properties.bidders should be an array of objects. Aborting.',
    );
  });

  it('should throw error if bidders is an empty array', () => {
    const bidders = [];
    expect(() => validateBidders(bidders)).toThrow(InstrumentationError);
    expect(() => validateBidders(bidders)).toThrow(
      'properties.bidders should contains at least one bidder. Aborting.',
    );
  });

  it('should throw error if bidder or alternate_bidder is not present', () => {
    const bidders = [
      { count: 1, base_price: 100 },
      { bidder: 'bidder1', count: 2, base_price: 200 },
      { alternate_bidder: 'alternate1', count: 3, base_price: 300 },
    ];
    expect(() => validateBidders(bidders)).toThrow(InstrumentationError);
    expect(() => validateBidders(bidders)).toThrow(
      'bidder or alternate_bidder is not present. Aborting.',
    );
  });

  it('should throw error if count is not present', () => {
    const bidders = [{ bidder: 'bidder1', alternate_bidder: 'alternate1', base_price: 100 }];
    expect(() => validateBidders(bidders)).toThrow(InstrumentationError);
    expect(() => validateBidders(bidders)).toThrow('count is not present. Aborting.');
  });

  it('should throw error if base_price is not present', () => {
    const bidders = [{ bidder: 'bidder1', alternate_bidder: 'alternate1', count: 1 }];
    expect(() => validateBidders(bidders)).toThrow(InstrumentationError);
    expect(() => validateBidders(bidders)).toThrow('base_price is not present. Aborting.');
  });

  it('should not throw error if all required fields are present for all bidders', () => {
    const bidders = [
      { bidder: 'bidder1', alternate_bidder: 'alternate1', count: 1, base_price: 100 },
      { bidder: 'bidder2', alternate_bidder: 'alternate2', count: 2, base_price: 200 },
    ];
    expect(() => validateBidders(bidders)).not.toThrow();
  });
});

describe('constructFullPayload', () => {
  it('should construct payload for IMPRESSIONS event', () => {
    const eventType = 'impressions';
    const message = {
      type: 'track',
      event: 'Impressions Event',
      properties: {
        tracking_data: 'dummy-tracking-data',
        rank: 1,
        beacon_issued: '2024-03-04T15:32:56.409Z',
      },
      timestamp: '2024-03-03T00:29:12.117+05:30',
    };
    const Config = {
      apiBaseUrl: 'https://www.test-client.com',
      clientName: 'test-client',
    };
    const expectedPayload = {
      beaconIssued: '2024-03-04T15:32:56.409Z',
      clientName: 'test-client',
      rank: 1,
      trackingData: 'dummy-tracking-data',
      ts: '2024-03-03T00:29:12.117+05:30',
    };
    const payload = constructFullPayload(eventType, message, Config);
    expect(payload).toEqual(expectedPayload);
  });
  it('should throw error if required value is missing for IMPRESSIONS event', () => {
    const eventType = 'impressions';
    const message = {
      type: 'track',
      event: 'Impressions Event',
      properties: {
        tracking_data: '',
        rank: 1,
        beacon_issued: '2024-03-04T15:32:56.409Z',
      },
      timestamp: '2024-03-03T00:29:12.117+05:30',
    };
    const Config = {
      apiBaseUrl: 'https://www.test-client.com',
      clientName: 'test-client',
    };
    try {
      const payload = constructFullPayload(eventType, message, Config);
    } catch (error) {
      expect(error.message).toEqual('Missing required value from "properties.tracking_data"');
    }
  });

  it('should construct payload for CLICKS event', () => {
    const eventType = 'clicks';
    const message = {
      type: 'track',
      event: 'Clicks Event',
      properties: {
        tracking_data: 'dummy-tracking-data',
        rank: 1,
        beacon_issued: '2024-03-04T15:32:56.409Z',
      },
      anonymousId: '1234',
    };
    const Config = {
      apiBaseUrl: 'https://www.test-client.com',
      clientName: 'test-client',
    };
    const expectedPayload = {
      beaconIssued: '2024-03-04T15:32:56.409Z',
      clientName: 'test-client',
      rank: 1,
      trackingData: 'dummy-tracking-data',
      userGuid: '1234',
      overrides: null,
      testVersionOverride: null,
    };
    const payload = constructFullPayload(eventType, message, Config);
    expect(payload).toEqual(expectedPayload);
  });
  it('should construct payload with non-null value if overrides and testVersionOverride are enable and values for these are provided for CLICKS event ', () => {
    const eventType = 'clicks';
    const message = {
      type: 'track',
      event: 'Clicks Event',
      properties: {
        tracking_data: 'dummy-tracking-data',
        rank: 1,
        beacon_issued: '2024-03-04T15:32:56.409Z',
        overrides: 'overridden-value',
        testVersionOverride: 1,
      },
      anonymousId: '1234',
    };
    const Config = {
      apiBaseUrl: 'https://www.test-client.com',
      clientName: 'test-client',
      overrides: true,
      testVersionOverride: false,
    };
    const expectedPayload = {
      beaconIssued: '2024-03-04T15:32:56.409Z',
      clientName: 'test-client',
      rank: 1,
      trackingData: 'dummy-tracking-data',
      userGuid: '1234',
      overrides: 'overridden-value',
      testVersionOverride: null,
    };
    const payload = constructFullPayload(eventType, message, Config);
    expect(payload).toEqual(expectedPayload);
  });
  it('should throw error if required value is missing for CLICKS event', () => {
    const eventType = 'clicks';
    const message = {
      type: 'track',
      event: 'Clicks Event',
      properties: {
        tracking_data: 'dummy-tracking-data',
        rank: 1,
        beacon_issued: '2024-03-04T15:32:56.409Z',
      },
    };
    const Config = {
      apiBaseUrl: 'https://www.test-client.com',
      clientName: 'test-client',
    };
    try {
      const payload = constructFullPayload(eventType, message, Config);
    } catch (error) {
      expect(error.message).toEqual('Missing required value from "userId"');
    }
  });

  it('should construct payload for CONVERSIONS event', () => {
    const eventType = 'conversions';
    const message = {
      type: 'track',
      event: 'Conversions Event',
      properties: {
        currency: 'USD',
        order_id: '123',
        bidders: [
          {
            bidder: 'dummy-bidder-id',
            count: 1,
            base_price: 100.1,
          },
        ],
      },
      context: {
        locale: 'en-US',
        ip: '127.0.0.1',
      },
      timestamp: '2024-03-03T00:29:12.117+05:30',
      anonymousId: '1234',
    };
    const Config = {
      apiBaseUrl: 'https://www.test-client.com',
      clientName: 'test-client',
    };
    const expectedPayload = {
      client_name: 'test-client',
      culture: 'en-US',
      currency: 'USD',
      transaction_id: '123',
      unixtime: 1709405952,
      user_guid: '1234',
      user_ip: '127.0.0.1',
      bidders: [
        {
          bidder: 'dummy-bidder-id',
          count: 1,
          base_price: 100.1,
        },
      ],
    };
    const payload = constructFullPayload(eventType, message, Config);
    expect(payload).toEqual(expectedPayload);
  });
  it('should throw error if required value is missing for CONVERSIONS event', () => {
    const eventType = 'conversions';
    const message = {
      type: 'track',
      event: 'Conversions Event',
      properties: {
        currency: 'USD',
        order_id: '123',
        bidders: [
          {
            bidder: 'dummy-bidder-id',
            count: 1,
            base_price: 100.1,
          },
        ],
      },
      context: {
        ip: '127.0.0.1',
      },
      timestamp: '2024-03-03T00:29:12.117+05:30',
      anonymousId: '1234',
    };
    const Config = {
      apiBaseUrl: 'https://www.test-client.com',
      clientName: 'test-client',
    };
    try {
      const payload = constructFullPayload(eventType, message, Config);
    } catch (error) {
      expect(error.message).toEqual('Missing required value from "context.locale"');
    }
  });

  it('should throw error for unsupported event', () => {
    const eventType = 'test';
    const message = {};
    const Config = {};
    expect(() => constructFullPayload(eventType, message, Config)).toThrow(InstrumentationError);
    expect(() => constructFullPayload(eventType, message, Config)).toThrow(
      'event type test is not supported.',
    );
  });
});

describe('constructResponse', () => {
  it('should construct response for IMPRESSIONS event', () => {
    const eventType = 'impressions';
    const Config = {
      apiBaseUrl: 'https://www.test-client.com',
      clientName: 'test-client',
    };
    const payload = {
      beaconIssued: '2024-03-04T15:32:56.409Z',
      clientName: 'test-client',
      rank: 1,
      trackingData: 'dummy-tracking-data',
      ts: '2024-03-03T00:29:12.117+05:30',
    };
    const expectedResponse = {
      endpoint: 'https://www.test-client.com?action=impression',
      headers: {
        accept: 'application/json',
      },
      method: 'GET',
      params: payload,
    };
    const response = constructResponse(eventType, Config, payload);
    expect(response).toMatchObject(expectedResponse);
  });

  it('should construct response for CLICKS event', () => {
    const eventType = 'clicks';
    const Config = {
      apiBaseUrl: 'https://www.test-client.com',
      clientName: 'test-client',
    };
    const payload = {
      beaconIssued: '2024-03-04T15:32:56.409Z',
      clientName: 'test-client',
      rank: 1,
      trackingData: 'dummy-tracking-data',
      userGuid: '1234',
    };
    const expectedResponse = {
      endpoint: 'https://www.test-client.com?action=click',
      headers: {
        accept: 'application/json',
      },
      method: 'GET',
      params: payload,
    };
    const response = constructResponse(eventType, Config, payload);
    expect(response).toMatchObject(expectedResponse);
  });

  it('should construct response for CONVERSIONS event', () => {
    const eventType = 'conversions';
    const Config = {
      apiBaseUrl: 'https://www.test-client.com',
      clientName: 'test-client',
    };
    const payload = {
      client_name: 'test-client',
      culture: 'en-US',
      currency: 'USD',
      transaction_id: '123',
      unixtime: 1709405952,
      userGuid: '1234',
      user_ip: '127.0.0.1',
      bidders: [
        {
          bidder: 'dummy-bidder-id',
          count: 1,
          base_price: 100.1,
        },
      ],
    };

    const expectedResponse = {
      endpoint: 'https://www.test-client.com/conversion',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      method: 'POST',
      body: {
        JSON: payload,
      },
    };
    const response = constructResponse(eventType, Config, payload);
    expect(response).toMatchObject(expectedResponse);
  });

  it('should throw error for unsupported event', () => {
    const eventType = 'test';
    const Config = {};
    const payload = {};
    expect(() => constructResponse(eventType, Config, payload)).toThrow(InstrumentationError);
    expect(() => constructResponse(eventType, Config, payload)).toThrow(
      'event type test is not supported.',
    );
  });
});
