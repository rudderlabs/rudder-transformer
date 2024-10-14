import { InstrumentationError } from '@rudderstack/integrations-lib';
import { responseBuilder, processEvent } from './transform';
describe('responseBuilder', () => {
  // Correctly maps properties to destination keys based on eventsMapping
  it('should map properties to destination keys when eventsMapping is provided', () => {
    const message = {
      event: 'product list viewed',
      properties: {
        platform: 'meta',
        conversions: 1,
        ad_unit_id: 221187,
        ad_interaction_time: '1652826278',
      },
    };
    const Config = {
      tuneEvents: [
        {
          eventName: 'product list viewed',
          eventsMapping: [
            { from: 'platform', to: 'destinationPlatform' },
            { from: 'conversions', to: 'destinationConversions' },
          ],
          url: 'https://example.com/event',
        },
      ],
    };
    const expectedParams = {
      destinationPlatform: 'meta',
      destinationConversions: 1,
    };
    const response = responseBuilder(message, { Config });
    expect(response.params).toEqual(expectedParams);
    expect(response.endpoint).toBe('https://example.com/event');
  });

  // Handles empty properties object without errors
  it('should handle empty properties object without throwing errors', () => {
    const message = {
      event: 'product list viewed',
      properties: {},
    };
    const Config = {
      tuneEvents: [
        {
          eventName: 'product list viewed',
          eventsMapping: [
            { from: 'platform', to: 'destinationPlatform' },
            { from: 'conversions', to: 'destinationConversions' },
          ],
          url: 'https://example.com/event',
        },
      ],
    };
    const response = responseBuilder(message, { Config });
    expect(response.params).toEqual({});
    expect(response.endpoint).toBe('https://example.com/event');
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
      params: {
        platform_key: 'meta',
        conversions_key: 1,
      },
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
