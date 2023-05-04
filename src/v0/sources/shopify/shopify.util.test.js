const { getShopifyTopic,
    getAnonymousIdFromDb,
    getAnonymousId,
    checkAndUpdateCartItems } = require('./util');

jest.mock('ioredis', () => require('../../../../test/__mocks__/redis'));
process.env.USE_REDIS_DB = 'true';
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
            const expectedOutput = 'b9b6607d-6974-594f-8e99-ac3de71c4d89';
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

            const expectedOutput = 'b9b6607d-6974-594f-8e99-ac3de71c4d89';
            const output = getAnonymousId(input);
            expect(output).toEqual(expectedOutput);
        });

        it('Customer event -> random AnonymousId', () => {
            const input = {
                event: 'Customer Enabled',
                properties: {
                }
            };
            const output = getAnonymousId(input);
            expect(output).toEqual(output); // since it will be random
        });

        it('Order Delete -> No anonymousId is there', () => {
            const input = {
                event: 'Order Deleted',
                properties: {
                    order_id: 'Order_ID'
                }
            };
            const expectedOutput = null;
            const output = getAnonymousId(input);
            expect(output).toEqual(expectedOutput);
        });
    });

    describe('set AnonymousId with Redis Test Cases', () => {
        it('Properties containing cartToken but due some redisError it failed', async () => {
            const input = {
                event: 'Order Paid',
                properties: {
                    cart_token: 'shopify_test2',
                }
            };
            const expectedOutput = 'bcaf0473-fb11-562f-80a1-c83a35f053bc'
            const output = await getAnonymousIdFromDb(input);
            expect(output).toEqual(expectedOutput);
        });

        it('Properties containing cartToken', async () => {
            const input = {
                event: 'Order Paid',
                properties: {
                    cart_token: 'shopify_test2',
                }
            };
            const expectedOutput = 'anon_shopify_test2'
            const output = await getAnonymousIdFromDb(input);
            expect(output).toEqual(expectedOutput);
        });

        it('Properties contain id for cart event', async () => {
            const input = {
                event: 'Cart Update',
                properties: {
                    id: 'shopify_test2',
                }
            };

            const expectedOutput = 'anon_shopify_test2';
            const output = await getAnonymousIdFromDb(input);
            expect(output).toEqual(expectedOutput);
        });

        it('Properties contain id for cart event but it is not present in DB', async () => {
            const input = {
                event: 'Cart Update',
                properties: {
                    id: 'unstored_id',
                }
            };

            const expectedOutput = '281a3e25-e603-5870-9cda-281c22940970';
            const output = await getAnonymousIdFromDb(input);
            expect(output).toEqual(expectedOutput);
        });
    });
    describe('Check for valid cart update event test cases', () => {
        it('Event containing token and nothing is retreived from redis', async () => {
            const input = {
                token: "token_not_in_redis",
                line_items: [
                    {
                        prod_id: "prod_1",
                        quantity: 1,
                    }
                ]
            };
            const expectedOutput = false
            const output = await checkAndUpdateCartItems(input);
            expect(output).toEqual(expectedOutput);
        });

        it('Event contain id for cart_update event and isValid', async () => {
            const input = {
                id: "shopify_test2",
                line_items: [
                    {
                        prod_id: "prod_1",
                        quantity: 1,
                    }
                ]
            };

            const expectedOutput = true;
            const output = await checkAndUpdateCartItems(input);
            expect(output).toEqual(expectedOutput);
        });

        it('Event contain id for cart_update event and isInValid', async () => {
            const input = {
                id: "shopify_test_duplicate_cart",
                line_items: [
                    {
                        prod_id: "prod_1",
                        quantity: 1,
                    }
                ]
            };

            const expectedOutput = false;
            const output = await checkAndUpdateCartItems(input);
            expect(output).toEqual(expectedOutput);
        });
    });

});
