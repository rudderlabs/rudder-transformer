const { getShopifyTopic,
    getAnonymousIdFromDb,
    getAnonymousId, } = require('./util');

describe('Shopify Utils Test', () => {
    describe('Fetching Shopify Topic Test Cases', () => {
        it('Invalid Topic Test', () => {
            const input = {
                query_parameters: {
                }
            };
            const expectedOutput = {
                error: "Invalid topic in query_parameters"
            }
            try {
                getShopifyTopic(input);
            } catch (error) {
                expect(error.message).toEqual(expectedOutput.error);
            }
        });

        it('No Topic Found Test', () => {
            const input = {
                query_parameters: {
                    topic: [],
                }
            };
            const expectedOutput = {
                error: 'Topic not found',
            };
            try {
                getShopifyTopic(input);
            } catch (error) {
                expect(error.message).toEqual(expectedOutput.error);
            }
        });

        it('Successfully fetched topic Test', () => {
            const input = {
                query_parameters: {
                    topic: ['<shopify_topic>'],
                }
            };
            const expectedOutput = '<shopify_topic>';
            const actualOutput = getShopifyTopic(input);
            expect(actualOutput).toEqual(expectedOutput);
        });

        it('Empty Query Params Test', () => {
            const input = {
                randomKey: 'randomValue',
            };
            const expectedOutput = {
                error: 'Query_parameters is missing',
            };
            try {
                getShopifyTopic(input);
            } catch (error) {
                expect(error.message).toEqual(expectedOutput.error);
            }
        });
    });

    describe('set AnonymousId without using Redis Test Cases', () => {
        it('Properties containing cartToken', () => {
            const input = {
                event: 'Order Updated',
                properties: {
                    cart_token: '123',
                }
            };
            const expectedOutput = 'a665a45920422f9d417e4867efdc4fb8a04a';
            const output = getAnonymousId(input);
            expect(output).toEqual(expectedOutput);
        });

        it('Properties contain id for cart event', () => {
            const input = {
                event: 'Cart Update',
                properties: {
                    id: '123',
                }
            };

            const expectedOutput = 'a665a45920422f9d417e4867efdc4fb8a04a';
            const output = getAnonymousId(input);
            expect(output).toEqual(expectedOutput);
        });

        it('Customer event -> random AnonymousId', () => {
            const input = {
                event: 'Customer Enabled',
                properties: {
                    cart_token: '123',
                }
            };
            const output = getAnonymousId(input);
            expect(output).toEqual(output); // since it will be random
        });

        it('Order Delete -> No anonymousId is there', () => {
            const input = {
                event: 'Order Deleted',
                properties: {
                    cart_token: '123',
                }
            };
            const expectedOutput = null; 
            const output = getAnonymousId(input);
            expect(output).toEqual(expectedOutput);
        });
    });
    
});