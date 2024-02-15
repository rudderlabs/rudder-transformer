const {
  addProductArray,
  verifyPayload,
  isStandardBluecoreEvent,
  deduceTrackEventName,
  populateAccurateDistinctId,
  deepMerge,
} = require('./utils');
const { InstrumentationError } = require('@rudderstack/integrations-lib');

describe('addProductArray', () => {
  // Adds an array of products to a message when products array is defined and not null.
  it('should add an array of products to a message when products array is defined and not null', () => {
    const products = [
      { product_id: 1, name: 'Product 1' },
      { product_id: 2, name: 'Product 2' },
    ];
    const eventName = 'purchase';

    const result = addProductArray(products, eventName);

    expect(result).toEqual([
      { id: 1, name: 'Product 1' },
      { id: 2, name: 'Product 2' },
    ]);
  });

  // Adds a single product object to a message when a single product object is passed.
  it('should add a single product object to a message when a single product object is passed', () => {
    const product = { product_id: 1, name: 'Product 1' };
    const eventName = 'add_to_cart';

    const result = addProductArray(product, eventName);
    expect(result).toEqual([{ id: 1, name: 'Product 1' }]);
  });

  it('should not throw an InstrumentationError for a custom event when products array is null', () => {
    const message = {};
    const products = null;
    const eventName = 'custom';

    expect(() => {
      addProductArray(message, products, eventName);
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
  it('should verify payload for purchase event with order_id and total properties', () => {
    const payload = {
      event: 'purchase',
      properties: {
        order_id: '123',
        total: 100,
      },
    };
    expect(() => verifyPayload(payload, {})).not.toThrow();
  });

  // Verify payload for identify event with email property.
  it('should verify payload for identify event with email property', () => {
    const payload = {
      event: 'identify',
      properties: {},
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

  describe('deepMerge', () => {
    // Should merge two objects with non-overlapping properties
    it('should merge two objects with non-overlapping properties', () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { c: 3, d: 4 };
      const result = deepMerge(obj1, obj2);
      expect(result).toEqual({ a: 1, b: 2, c: 3, d: 4 });
    });

    // Should merge two objects with overlapping properties
    it('should merge two objects with overlapping properties', () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { b: 3, c: 4 };
      const result = deepMerge(obj1, obj2);
      expect(result).toEqual({ a: 1, b: 3, c: 4 });
    });

    // Should merge multiple objects with non-overlapping properties
    it('should merge multiple objects with non-overlapping properties', () => {
      const obj1 = { a: 1 };
      const obj2 = { b: 2 };
      const obj3 = { c: 3 };
      const result = deepMerge(obj1, obj2, obj3);
      expect(result).toEqual({ a: 1, b: 2, c: 3 });
    });

    // Should return an empty object when no arguments are passed
    it('should return an empty object when no arguments are passed', () => {
      const result = deepMerge();
      expect(result).toEqual(undefined);
    });

    // Should return the target object when no sources are passed
    it('should return the target object when no sources are passed', () => {
      const obj = { a: 1, b: 2 };
      const result = deepMerge(obj);
      expect(result).toBe(obj);
    });

    // Should handle non-object values as the target object
    it('target must be an object', () => {
      const target = 'hello';
      const obj = { a: 1, b: 2 };
      const result = deepMerge(target, obj);
      expect(result).not.toBe({ a: 1, b: 2 });
      expect(result).toBe('hello');
    });
  });
});
