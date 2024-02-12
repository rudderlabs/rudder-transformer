const { trackResponseBuilder } = require('./transform')
describe('trackResponseBuilder', () => {

    // Given a valid message, category, destination config, and event name, the function should construct a payload with the correct event name and token
    it('should construct a payload with the correct event name and token', () => {
        const message = { type: 'track', event: 'purchase', properties: { total: 20, order_id: 123, products: [{ product_id: 12, name: "new prod" }] } };
        const category = {
            name: 'bluecoreTrackConfig',
            type: 'track',
        };
        const destination = { Config: { bluecoreNamespace: 'namespace' } };
        const eventName = 'purchase';

        const expectedPayload = {
            event: 'purchase',
            token: 'namespace',
            properties: {
                    "order_id": 123,
                    "products": [
                        {
                            "id": 12,
                            "name": "new prod",
                        },
                    ],
                    "total": 20,
                },
        };

        const result = trackResponseBuilder(message, category, destination, eventName);

        expect(result).toEqual(expectedPayload);
    });

    // When the event name is 'optin', 'unsubscribe', or 'search', the function should not add a product array to the payload
    it('need not add a product array to the payload when the event name is "optin"', () => {
        const message = { type: 'track', event: 'optin', properties: { total: 20, order_id: 123, } };
        const category = {
            name: 'bluecoreTrackConfig',
            type: 'track',
        };
        const destination = { Config: { bluecoreNamespace: 'namespace' } };
        const eventName = 'optin';

        const expectedPayload = {
            event: 'optin',
            token: 'namespace',
            properties:  {
                     order_id: 123,
                     total: 20,
                   },
        };

        const result = trackResponseBuilder(message, category, destination, eventName);

        expect(result).toEqual(expectedPayload);
    });

    // When the event name is not 'optin', 'unsubscribe', or 'search', the function should add a product array to the payload
    it('should add a product array to the payload when the event name is not "optin", "unsubscribe", or "search"', () => {
        const message = { type: 'track', event: 'purchase', properties: {order_id:123, total: 20 , products: [{ id: '1', name: 'product' }]} };
        const category =  {
            name: 'bluecoreTrackConfig',
            type: 'track',
        };
        const destination = { Config: { bluecoreNamespace: 'namespace' } };
        const eventName = 'purchase';

        const expectedPayload = {
            event: 'purchase',
            token: 'namespace',
            properties: {
                order_id: 123,
                total: 20,
                products: [{ id: '1', name: 'product' }]
            }
        };

        const result = trackResponseBuilder(message, category, destination, eventName);

        expect(result).toEqual(expectedPayload);
    });
});

