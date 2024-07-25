const { ConfigurationError } = require('@rudderstack/integrations-lib');
const axios = require('axios');
const MockAxiosAdapter = require('axios-mock-adapter');
const { responseBuilderSimple, responseBuilderForMessageEvent } = require('./transform');
beforeAll(() => {
  const mock = new MockAxiosAdapter(axios);
  mock
    .onPost('https://yourSubDomain.auth.marketingcloudapis.com/v2/token')
    .reply(200, '{"access_token":"yourAuthToken"}');
});

describe('responseBuilderSimple', () => {
  const destination = {
    Config: {
      clientId: 'yourClientId',
      clientSecret: 'yourClientSecret',
      subDomain: 'yourSubDomain',
      createOrUpdateContacts: false,
      externalKey: 'yourExternalKey',
      eventToExternalKey: [{ from: 'purchase', to: 'purchaseKey' }],
      eventToPrimaryKey: [{ from: 'purchase', to: 'primaryKey' }],
      eventToUUID: [{ event: 'purchase', uuid: true }],
    },
  };
  it('should return an array of two payloads for identify calls when createOrUpdateContacts is false', async () => {
    const message = {
      type: 'identify',
      userId: '12345',
    };

    const category = {
      type: 'identify',
      name: 'Identify',
    };

    const response = await responseBuilderSimple({ message, destination }, category);

    expect(response).toHaveLength(2);
    expect(response[0]).toHaveProperty('endpoint');
    expect(response[0]).toHaveProperty('method');
    expect(response[0]).toHaveProperty('body.JSON');
    expect(response[0]).toHaveProperty('headers');
    expect(response[1]).toHaveProperty('endpoint');
    expect(response[1]).toHaveProperty('method');
    expect(response[1]).toHaveProperty('body.JSON');
    expect(response[1]).toHaveProperty('headers');
  });

  // Throws an error when event name is not provided for track calls
  it('should throw an error when event name is not provided for track calls', async () => {
    const message = {
      type: 'track',
    };

    const category = {
      type: 'track',
      name: 'Track',
    };

    try {
      await responseBuilderSimple({ message, destination }, category);
    } catch (e) {
      expect(e).toBeInstanceOf(ConfigurationError);
      expect(e.message).toBe('Event name is required for track events');
    }
  });

  // Throws an error when event is not mapped for track calls
  it('should throw an error when event is not mapped for track calls', async () => {
    const message = {
      type: 'track',
      event: 'unmappedEvent',
    };

    const category = {
      type: 'track',
      name: 'Track',
    };
    try {
      await responseBuilderSimple({ message, destination }, category);
    } catch (e) {
      expect(e).toBeInstanceOf(ConfigurationError);
      expect(e.message).toBe('Event not mapped for this track call');
    }
  });

  // Throws an error when event type is not supported
  it('should throw an error when event type is not supported', async () => {
    const message = {
      type: 'unsupported',
    };

    const category = {
      type: 'unsupported',
      name: 'Unsupported',
    };

    try {
      await responseBuilderSimple({ message, destination }, category);
    } catch (e) {
      expect(e).toBeInstanceOf(ConfigurationError);
      expect(e.message).toBe("Event type 'unsupported' not supported");
    }
  });

  // Returns a payload for track calls when event is mapped and event name is a string
  it('should return a payload for track calls when event is mapped and event name is a string', async () => {
    const message = {
      type: 'track',
      event: 'purchase',
      userId: '12345',
    };

    const category = {
      type: 'track',
      name: 'Track',
    };

    const response = await responseBuilderSimple({ message, destination }, category);
    expect(response).toHaveProperty('endpoint');
    expect(response).toHaveProperty('method');
    expect(response).toHaveProperty('body.JSON');
    expect(response).toHaveProperty('headers');
  });

  it('should build response object with correct details for message event', () => {
    const message = {
      userId: 'u123',
      event: 'testEvent',
      properties: {
        contactId: '12345',
        prop1: 'value1',
        prop2: 'value2',
      },
    };
    const subDomain = 'subdomain';
    const authToken = 'token';
    const hashMapEventDefinition = {
      testevent: 'eventDefinitionKey',
    };

    const response = responseBuilderForMessageEvent(
      message,
      subDomain,
      authToken,
      hashMapEventDefinition,
    );
    expect(response.method).toBe('POST');
    expect(response.endpoint).toBe(
      'https://subdomain.rest.marketingcloudapis.com/interaction/v1/events',
    );
    expect(response.headers).toEqual({
      'Content-Type': 'application/json',
      Authorization: 'Bearer token',
    });
    expect(response.body.JSON).toEqual({
      ContactKey: '12345',
      EventDefinitionKey: 'eventDefinitionKey',
      Data: {
        prop1: 'value1',
        prop2: 'value2',
      },
    });
  });
});
