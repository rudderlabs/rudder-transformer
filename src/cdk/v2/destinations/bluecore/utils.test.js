const {
  normalizeProductArray,
  verifyPayload,
  isStandardBluecoreEvent,
  deduceTrackEventName,
  populateAccurateDistinctId,
  createProductForStandardEcommEvent,
  constructSubscriptionEventPayload,
} = require('./utils');
const { InstrumentationError } = require('@rudderstack/integrations-lib');

describe('normalizeProductArray', () => {
  // Adds an array of products to a message when products array is defined and not null.
  it('should add an array of products to a message when products array is defined and not null', () => {
    const products = [
      { product_id: 1, name: 'Product 1' },
      { product_id: 2, name: 'Product 2' },
    ];
    const eventName = 'purchase';

    const result = normalizeProductArray(products, eventName);

    expect(result).toEqual([
      { id: 1, name: 'Product 1' },
      { id: 2, name: 'Product 2' },
    ]);
  });

  // Adds a single product object to a message when a single product object is passed.
  it('should add a single product object to a message when a single product object is passed', () => {
    const product = { product_id: 1, name: 'Product 1' };
    const eventName = 'add_to_cart';

    const result = normalizeProductArray(product, eventName);
    expect(result).toEqual([{ id: 1, name: 'Product 1' }]);
  });

  it('should not throw an InstrumentationError for a custom event when products array is null', () => {
    const message = {};
    const products = null;
    const eventName = 'custom';

    expect(() => {
      normalizeProductArray(message, products, eventName);
    }).toBeNull;
  });
});

describe('verifyPayload', () => {
  // Verify payload for search event with search_term property.
  it('should verify payload for search event with search_term property', () => {
    const payload = {
      event: 'search',
      properties: {
        search_term: 'example',
      },
    };
    expect(() => verifyPayload(payload, {})).not.toThrow();
  });

  // Verify payload for purchase event with order_id and total properties.
  it('should verify payload for purchase event with order_id and total and customer properties', () => {
    const payload = {
      event: 'purchase',
      properties: {
        order_id: '123',
        total: 100,
      },
    };
    expect(() => verifyPayload(payload, {})).toThrow(InstrumentationError);
  });

  // Verify payload for identify event with email property.
  it('should verify payload for identify event with email property', () => {
    const payload = {
      event: 'identify',
      properties: {
        customer: {
          first_name: 'John',
        },
      },
    };
    const message = {
      traits: {
        email: 'test@example.com',
      },
    };
    expect(() => verifyPayload(payload, message)).not.toThrow();
  });

  // Verify payload for search event without search_term property, should throw an InstrumentationError.
  it('should throw an InstrumentationError when verifying payload for search event without search_term property', () => {
    const payload = {
      event: 'search',
      properties: {},
    };
    expect(() => verifyPayload(payload, {})).toThrow(InstrumentationError);
  });

  // Verify payload for purchase event without order_id property, should throw an InstrumentationError.
  it('should throw an InstrumentationError when verifying payload for purchase event without order_id property', () => {
    const payload = {
      event: 'purchase',
      properties: {
        total: 100,
      },
    };
    expect(() => verifyPayload(payload, {})).toThrow(InstrumentationError);
  });

  // Verify payload for purchase event without total property, should throw an InstrumentationError.
  it('should throw an InstrumentationError when verifying payload for purchase event without total property', () => {
    const payload = {
      event: 'purchase',
      properties: {
        order_id: '123',
      },
    };
    expect(() => verifyPayload(payload, {})).toThrow(InstrumentationError);
  });

  // Verify payload for purchase event without total property, should throw an InstrumentationError.
  it('should throw an InstrumentationError when verifying payload for identify event with action field other than identify', () => {
    const payload = {
      event: 'random',
      properties: {
        email: 'abc@gmail.com',
      },
    };
    expect(() =>
      verifyPayload(payload, { type: 'identify', traits: { action: 'random' } }),
    ).toThrow(InstrumentationError);
  });

  it('should throw an InstrumentationError when verifying payload for optin event without email property', () => {
    const payload = {
      event: 'optin',
      properties: {
        order_id: '123',
      },
    };
    expect(() => verifyPayload(payload, {})).toThrow(InstrumentationError);
  });

  it('should throw an InstrumentationError when verifying payload for unsubscribe event without email property', () => {
    const payload = {
      event: 'unsubscribe',
      properties: {
        order_id: '123',
      },
    };
    expect(() => verifyPayload(payload, {})).toThrow(InstrumentationError);
  });
});

describe('isStandardBluecoreEvent', () => {
  // Returns true if the given event name is in the list of standard Bluecore events.
  it('should return true when the given event name is in the list of standard Bluecore events', () => {
    const eventName = 'search';
    const result = isStandardBluecoreEvent(eventName);
    expect(result).toBe(true);
  });

  // Returns false if the given event name is not in the list of standard Bluecore events.
  it('should return false when the given event name is not in the list of standard Bluecore events', () => {
    const eventName = 'someEvent';
    const result = isStandardBluecoreEvent(eventName);
    expect(result).toBe(false);
  });

  // Returns false if the given event name is null.
  it('should return false when the given event name is null', () => {
    const eventName = null;
    const result = isStandardBluecoreEvent(eventName);
    expect(result).toBe(false);
  });

  // Returns false if the given event name is undefined.
  it('should return false when the given event name is undefined', () => {
    const eventName = undefined;
    const result = isStandardBluecoreEvent(eventName);
    expect(result).toBe(false);
  });

  // Returns false if the given event name is not a string.
  it('should return false when the given event name is not a string', () => {
    const eventName = 123;
    const result = isStandardBluecoreEvent(eventName);
    expect(result).toBe(false);
  });

  // Returns false if the given event name is an empty string.
  it('should return false when the given event name is an empty string', () => {
    const eventName = '';
    const result = isStandardBluecoreEvent(eventName);
    expect(result).toBe(false);
  });
});

describe('deduceTrackEventName', () => {
  // The function returns the trackEventName if no eventsMapping is provided and the trackEventName is not a standard Rudderstack ecommerce event.
  it('should return the trackEventName when no eventsMapping is provided and the trackEventName is not a standard Rudderstack ecommerce event', () => {
    const trackEventName = 'customEvent';
    const Config = {
      eventsMapping: [],
    };
    const result = deduceTrackEventName(trackEventName, Config);
    expect(result).toEqual([trackEventName]);
  });

  // The function returns the corresponding event name from eventsMapping if the trackEventName is mapped to a standard bluecore event.
  it('should return the corresponding event name from eventsMapping if the trackEventName is mapped to a standard bluecore event', () => {
    const trackEventName = 'customEvent';
    const Config = {
      eventsMapping: [{ from: 'customEvent', to: 'search' }],
    };
    const result = deduceTrackEventName(trackEventName, Config);
    expect(result).toEqual(['search']);
  });

  // The function returns the corresponding event name from eventsMapping if the trackEventName is mapped to a standard bluecore event.
  it('should return the corresponding event name array from eventsMapping if the trackEventName is mapped to more than one standard bluecore events', () => {
    const trackEventName = 'customEvent';
    const Config = {
      eventsMapping: [
        { from: 'customEvent', to: 'search' },
        { from: 'customEvent', to: 'purchase' },
      ],
    };
    const result = deduceTrackEventName(trackEventName, Config);
    expect(result).toEqual(['search', 'purchase']);
  });

  // The function returns the corresponding standard Rudderstack ecommerce event name if the trackEventName is a standard bluecore event.
  it('should return the corresponding standard Rudderstack ecommerce event name if the trackEventName is a standard bluecore event', () => {
    const trackEventName = 'Product Added to Wishlist';
    const Config = {
      eventsMapping: [],
    };
    const result = deduceTrackEventName(trackEventName, Config);
    expect(result).toEqual(['wishlist']);
  });

  // The function throws an error if the trackEventName is not a string.
  it('should throw an error if the trackEventName is not a string', () => {
    const trackEventName = 123;
    const Config = {
      eventsMapping: [],
    };
    expect(() => deduceTrackEventName(trackEventName, Config)).toThrow();
  });

  // The function throws an error if the trackEventName is an empty string.
  it('should throw an error if the trackEventName is an empty string', () => {
    const trackEventName = '';
    const Config = {
      eventsMapping: [],
    };
    expect(() => deduceTrackEventName(trackEventName, Config)).toThrow();
  });
});

describe('populateAccurateDistinctId', () => {
  // Returns the distinctId based on the email field when it exists in the message object and the event is not an identify event.
  it('should return the distinctId based on the email field when it exists in the message object and the event is not an identify event', () => {
    const payload = { event: 'event' };
    const message = { userId: '123', context: { traits: { email: 'test@example.com' } } };
    const distinctId = populateAccurateDistinctId(payload, message);
    expect(distinctId).toBe('test@example.com');
  });

  // Returns the distinctId based on the userId field when it exists in the message object and the event is an identify event.
  it('should return the distinctId based on the userId field when it exists in the message object and the event is an identify event', () => {
    const payload = { event: 'identify' };
    const message = { userId: '123', context: { traits: { email: 'test@example.com' } } };
    const distinctId = populateAccurateDistinctId(payload, message);
    expect(distinctId).toBe('123');
  });

  // Returns the distinctId based on the userId field when it exists in the message object and the email field does not exist and the event is not an identify event.
  it('should return the distinctId based on the userId field when it exists in the message object and the email field does not exist and the event is not an identify event', () => {
    const payload = { event: 'event' };
    const message = { userId: '123' };
    const distinctId = populateAccurateDistinctId(payload, message);
    expect(distinctId).toBe('123');
  });

  // Returns the distinctId based on the email field when it exists in the message object and the userId field is empty and the event is not an identify event.
  it('should throw instrumenatation error as the message is malformed where email is at the root level', () => {
    const payload = { event: 'event' };
    const message = { email: 'test@example.com', userId: '' };
    const testFn = () => populateAccurateDistinctId(payload, message);
    expect(testFn).toThrow(InstrumentationError);
  });

  // Returns the distinctId based on the userId field when it exists in the message object and the email field is empty and the event is not an identify event.
  it('should return the distinctId based on the userId field when it exists in the message object and the email field is empty and the event is not an identify event', () => {
    const payload = { event: 'event' };
    const message = { email: '', userId: '123' };
    const distinctId = populateAccurateDistinctId(payload, message);
    expect(distinctId).toBe('123');
  });

  // Returns the distinctId based on the anonymousId field when it exists in the message object and the email and userId fields are empty and the event is not an identify event.
  it('should return the distinctId based on the anonymousId field when it exists in the message object and the email and userId fields are empty and the event is not an identify event', () => {
    const payload = { event: 'event' };
    const message = { anonymousId: 'abc' };
    const distinctId = populateAccurateDistinctId(payload, message);
    expect(distinctId).toBe('abc');
  });

  it('should return the distinctId based on the externalId field when it exists in the context object and the event is not an identify event', () => {
    const payload = { event: 'event' };
    const message = {
      userId: '123',
      context: {
        traits: { email: 'test@example.com' },
        externalId: [{ type: 'bluecoreExternalId', id: '54321' }],
      },
    };
    const distinctId = populateAccurateDistinctId(payload, message);
    expect(distinctId).toBe('54321');
  });

  it('should return the distinctId based on the externalId field when it exists in the context object and the event is an identify event', () => {
    const payload = { event: 'identify' };
    const message = {
      userId: '123',
      context: {
        traits: { email: 'test@example.com' },
        externalId: [{ type: 'bluecoreExternalId', id: '54321' }],
      },
    };
    const distinctId = populateAccurateDistinctId(payload, message);
    expect(distinctId).toBe('54321');
  });
});

describe('createProductForStandardEcommEvent', () => {
  // Returns an array containing the properties if the event is a standard Bluecore event and not 'search'.
  it("should return an array containing the properties when the event is a standard Bluecore event and not 'search'", () => {
    const message = {
      event: 'some event',
      properties: { name: 'product 1' },
    };
    const eventName = 'some event';
    const result = createProductForStandardEcommEvent(message, eventName);
    expect(result).toEqual(null);
  });

  // Returns null if the event is 'search'.
  it("should return null when the event is 'search'", () => {
    const message = {
      event: 'search',
      properties: { name: 'product 1' },
    };
    const eventName = 'search';
    const result = createProductForStandardEcommEvent(message, eventName);
    expect(result).toBeNull();
  });

  // Throws an InstrumentationError if the event is 'order completed' and the eventName is 'purchase'.
  it("should throw an InstrumentationError when the event is 'order completed' and the eventName is 'purchase'", () => {
    const message = {
      event: 'order completed',
      properties: { name: 'product 1' },
    };
    const eventName = 'purchase';
    expect(() => {
      createProductForStandardEcommEvent(message, eventName);
    }).toThrow(InstrumentationError);
  });

  // Returns null if the eventName is not a standard Bluecore event.
  it('should return null when the eventName is not a standard Bluecore event', () => {
    const message = {
      event: 'some event',
      properties: { name: 'product 1', products: [{ product_id: 1, name: 'prod1' }] },
    };
    const eventName = 'non-standard';
    const result = createProductForStandardEcommEvent(message, eventName);
    expect(result).toBeNull();
  });

  // Returns null if the eventName is not provided.
  it('should return null when the eventName is not provided', () => {
    const message = {
      event: 'some event',
      properties: { name: 'product 1' },
    };
    const result = createProductForStandardEcommEvent(message);
    expect(result).toBeNull();
  });

  // Returns null if the properties are not provided.
  it('should return null when the properties are not provided', () => {
    const message = {
      event: 'some event',
    };
    const eventName = 'some event';
    const result = createProductForStandardEcommEvent(message, eventName);
    expect(result).toBeNull();
  });
});

describe('constructSubscriptionEventPayload', () => {
  const testCases = [
    {
      name: 'should return the subscription event payload when the event is a subscription event and the email consent is true',
      message: {
        event: 'subscription_event',
        type: 'track',
        properties: { channelConsents: { email: true } },
      },
      expected: { event: 'optin', properties: {} },
      errorMessage: '',
    },
    {
      name: 'should return the subscription event payload when the event is a subscription event and the email consent is false',
      message: {
        event: 'subscription_event',
        type: 'track',
        properties: { channelConsents: { email: false } },
      },
      expected: { event: 'unsubscribe', properties: {} },
      errorMessage: '',
    },
    {
      name: 'should return throw error when the event is a subscription event and the email consent is not provided',
      message: {
        event: 'subscription_event',
        type: 'track',
        properties: {},
      },
      errorMessage: '[Bluecore]:: email consent is required for subscription event',
    },
    {
      name: 'should return throw error when the event is a subscription event and the email consent is not a boolean',
      message: {
        event: 'subscription_event',
        type: 'track',
        properties: { channelConsents: { email: 'false' } },
      },
      errorMessage: '[Bluecore]:: email consent should be a boolean value for subscription event',
    },
  ];

  testCases.forEach(({ name, message, expected, errorMessage }) => {
    test(name, () => {
      if (errorMessage) {
        expect.assertions(2);
        try {
          constructSubscriptionEventPayload(message);
        } catch (e) {
          expect(e).toBeInstanceOf(InstrumentationError);
          expect(e.message).toEqual(errorMessage);
        }
      } else {
        const result = constructSubscriptionEventPayload(message);
        expect(result).toEqual(expected);
      }
    });
  });
});
