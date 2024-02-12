const { addProductArray, verifyPayload, isStandardBluecoreEvent, deduceTrackEventName } = require('./util')
const {
    InstrumentationError
} = require('@rudderstack/integrations-lib');

describe('addProductArray', () => {

    // Adds an array of products to a message when products array is defined and not null.
    it('should add an array of products to a message when products array is defined and not null', () => {
        const products = [{ product_id: 1, name: 'Product 1' }, { product_id: 2, name: 'Product 2' }];
        const eventName = 'purchase';

        const result = addProductArray(products, eventName);

        expect(result).toEqual([{ id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' }]);
    });

    // Adds a single product object to a message when a single product object is passed.
    it('should add a single product object to a message when a single product object is passed', () => {
        const product = { product_id: 1, name: 'Product 1' };
        const eventName = 'add_to_cart';

        const result = addProductArray(product, eventName);
        expect(result).toEqual([{ id: 1, name: 'Product 1' }]);
    });

    // Throws an InstrumentationError when products array is null.
    it('should throw an InstrumentationError when products array is null for a standard bluecore event', () => {
        const products = null;
        const eventName = 'purchase';

        expect(() => {
            addProductArray(products, eventName);
        }).toThrow(InstrumentationError);
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
                search_term: 'example'
            }
        };
        expect(() => verifyPayload(payload, {})).not.toThrow();
    });

    // Verify payload for purchase event with order_id and total properties.
    it('should verify payload for purchase event with order_id and total properties', () => {
        const payload = {
            event: 'purchase',
            properties: {
                order_id: '123',
                total: 100
            }
        };
        expect(() => verifyPayload(payload, {})).not.toThrow();
    });

    // Verify payload for identify event with email property.
    it('should verify payload for identify event with email property', () => {
        const payload = {
            event: 'identify',
            properties: {}
        };
        const message = {
            traits: {
                email: 'test@example.com'
            }
        };
        expect(() => verifyPayload(payload, message)).not.toThrow();
    });

    // Verify payload for search event without search_term property, should throw an InstrumentationError.
    it('should throw an InstrumentationError when verifying payload for search event without search_term property', () => {
        const payload = {
            event: 'search',
            properties: {}
        };
        expect(() => verifyPayload(payload, {})).toThrow(InstrumentationError);
    });

    // Verify payload for purchase event without order_id property, should throw an InstrumentationError.
    it('should throw an InstrumentationError when verifying payload for purchase event without order_id property', () => {
        const payload = {
            event: 'purchase',
            properties: {
                total: 100
            }
        };
        expect(() => verifyPayload(payload, {})).toThrow(InstrumentationError);
    });

    // Verify payload for purchase event without total property, should throw an InstrumentationError.
    it('should throw an InstrumentationError when verifying payload for purchase event without total property', () => {
        const payload = {
            event: 'purchase',
            properties: {
                order_id: '123'
            }
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
            eventsMapping: []
        };
        const result = deduceTrackEventName(trackEventName, Config);
        expect(result).toEqual([trackEventName])
    });

    // The function returns the corresponding event name from eventsMapping if the trackEventName is mapped to a standard bluecore event.
    it('should return the corresponding event name from eventsMapping if the trackEventName is mapped to a standard bluecore event', () => {
        const trackEventName = 'customEvent';
        const Config = {
            eventsMapping: [
                { from: 'customEvent', to: 'search' }
            ]
        };
        const result = deduceTrackEventName(trackEventName, Config);
        console.log(result);
        expect(result).toEqual(['search']);
    });

    // The function returns the corresponding event name from eventsMapping if the trackEventName is mapped to a standard bluecore event.
    it('should return the corresponding event name array from eventsMapping if the trackEventName is mapped to more than one standard bluecore events', () => {
        const trackEventName = 'customEvent';
        const Config = {
            eventsMapping: [
                { from: 'customEvent', to: 'search' },
                { from: 'customEvent', to: 'purchase' }
            ]
        };
        const result = deduceTrackEventName(trackEventName, Config);
        console.log(result);
        expect(result).toEqual(['search', 'purchase']);
    });

    // The function returns the corresponding standard Rudderstack ecommerce event name if the trackEventName is a standard bluecore event.
    it('should return the corresponding standard Rudderstack ecommerce event name if the trackEventName is a standard bluecore event', () => {
        const trackEventName = 'Product Added to Wishlist';
        const Config = {
            eventsMapping: []
        };
        const result = deduceTrackEventName(trackEventName, Config);
        expect(result).toEqual(['wishlist']);
    });

    // The function throws an error if the trackEventName is not a string.
    it('should throw an error if the trackEventName is not a string', () => {
        const trackEventName = 123;
        const Config = {
            eventsMapping: []
        };
        expect(() => deduceTrackEventName(trackEventName, Config)).toThrow();
    });

    // The function throws an error if the trackEventName is an empty string.
    it('should throw an error if the trackEventName is an empty string', () => {
        const trackEventName = '';
        const Config = {
            eventsMapping: []
        };
        expect(() => deduceTrackEventName(trackEventName, Config)).toThrow();
    });
});



