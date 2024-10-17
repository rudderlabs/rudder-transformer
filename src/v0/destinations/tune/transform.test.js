const { InstrumentationError } = require('@rudderstack/integrations-lib');
const { responseBuilder, processEvent } = require('./transform');

describe('responseBuilder', () => {
  // Correctly maps properties to params using standard, advSubId, and advUniqueId mappings
  it('should construct response with default config when tune event found', () => {
    const message = {
      properties: { key1: 'value1', key2: 'value2' },
      event: 'testEvent',
    };
    const Config = {
      tuneEvents: [
        {
          eventName: 'testEvent',
          standardMapping: [{ from: 'key1', to: 'mappedKey1' }],
          advSubIdMapping: [{ from: 'key2', to: 'mappedKey2' }],
          advUniqueIdMapping: [{ from: 'key3', to: 'mappedKey3' }],
          url: 'https://example.com/api',
        },
      ],
    };

    const response = responseBuilder(message, { Config });

    expect(response).toEqual({
      version: '1',
      type: 'REST',
      method: 'POST',
      endpoint: 'https://example.com/api',
      headers: {},
      params: { mappedKey1: 'value1', mappedKey2: 'value2' },
      body: {
        JSON: {},
        JSON_ARRAY: {},
        XML: {},
        FORM: {},
      },
      files: {},
      event: 'testEvent',
    });
  });

  it('should extract and use tuneEvents from Config', () => {
    const message = {
      properties: { key1: 'value1', key2: 'value2' },
      event: 'testEvent',
    };
    const Config = {
      tuneEvents: [
        {
          eventName: 'testEvent',
          standardMapping: [{ from: 'key1', to: 'mappedKey1' }],
          advSubIdMapping: [{ from: 'key2', to: 'mappedKey2' }],
          advUniqueIdMapping: [{ from: 'key3', to: 'mappedKey3' }],
          url: 'https://example.com/api',
        },
      ],
    };

    const response = responseBuilder(message, { Config });

    expect(response).toBeDefined();
  });

  it('should extract parameters from the provided URL', () => {
    const message = {
      event: 'testEvent',
    };
    const Config = {
      tuneEvents: [
        {
          eventName: 'testEvent',
          standardMapping: [{ from: 'key1', to: 'mappedKey1' }],
          advSubIdMapping: [{ from: 'key2', to: 'mappedKey2' }],
          advUniqueIdMapping: [{ from: 'key3', to: 'mappedKey3' }],
          url: 'https://demo.go2cloud.org/aff_l?offer_id=45&aff_id=1029',
        },
      ],
    };

    const response = responseBuilder(message, { Config });

    expect(response).toBeDefined();
    expect(response.endpoint).toEqual('https://demo.go2cloud.org/aff_l?offer_id=45&aff_id=1029');
    expect(response.params).toEqual({
      offer_id: '45',
      aff_id: '1029',
    });
  });
});

describe('processEvent', () => {
  // Processes 'track' messages correctly using responseBuilder
  it('should process "track" messages correctly using responseBuilder', () => {
    const message = {
      type: 'track',
      event: 'product list viewed',
      properties: {
        platform: 'meta',
        conversions: 1,
        ad_unit_id: 221187,
        ad_interaction_time: '1652826278',
      },
    };
    const destination = {
      Config: {
        tuneEvents: [
          {
            eventName: 'product list viewed',
            url: 'https://example.com/track',
            eventsMapping: [
              { from: 'platform', to: 'platform_key' },
              { from: 'conversions', to: 'conversions_key' },
            ],
          },
        ],
      },
    };
    const expectedResponse = {
      body: {
        FORM: {},
        JSON: {},
        JSON_ARRAY: {},
        XML: {},
      },
      params: {},
      endpoint: 'https://example.com/track',
      event: 'product list viewed',
      files: {},
      headers: {},
      method: 'POST',
      type: 'REST',
      version: '1',
    };
    const response = processEvent(message, destination);
    expect(response).toEqual(expectedResponse);
  });

  // Throws an error if message type is missing
  it('should throw an error if message type is missing', () => {
    const message = {
      event: 'product list viewed',
      properties: {
        platform: 'meta',
        conversions: 1,
      },
    };
    const destination = {
      Config: {
        tuneEvents: [],
      },
    };
    expect(() => processEvent(message, destination)).toThrowError(
      new InstrumentationError('Message Type is not present. Aborting message.', 400),
    );
  });

  it('should throw an error when message type is not "track"', () => {
    const message = {
      type: 'identify',
      event: 'product list viewed',
      properties: {
        platform: 'meta',
        conversions: 1,
      },
    };
    const destination = {
      Config: {
        tuneEvents: [],
      },
    };

    expect(() => processEvent(message, destination)).toThrowError(
      new InstrumentationError('Message type not supported. Only "track" is allowed.', 400),
    );
  });
});
