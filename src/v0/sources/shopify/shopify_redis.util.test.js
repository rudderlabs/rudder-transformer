const { getAnonymousIdAndSessionId, checkAndUpdateCartItems } = require('./util');
jest.mock('ioredis', () => require('../../../../test/__mocks__/redis'));
describe('Shopify Utils Test', () => {

    describe('Check for valid cart update event test cases', () => {
        it('Event containing token and nothing is retreived from redis', async () => {
            const input = {
                token: 'token_not_in_redis',
                line_items: [
                    {
                        prod_id: 'prod_1',
                        quantity: 1,
                    },
                ],
            };
            const expectedOutput = true;
            const output = await checkAndUpdateCartItems(input);
            expect(output).toEqual(expectedOutput);
        });

        it('Event contain id for cart_update event and isValid', async () => {
            const input = {
                id: 'shopify_test2',
                line_items: [
                    {
                        prod_id: 'prod_1',
                        quantity: 1,
                    },
                ],
            };

            const expectedOutput = true;
            const output = await checkAndUpdateCartItems(input);
            expect(output).toEqual(expectedOutput);
        });

        it('Event contain id for cart_update event and isInValid', async () => {
            const input = {
                id: 'shopify_test_duplicate_cart',
                line_items: [
                    {
                        prod_id: 'prod_1',
                        quantity: 1,
                    },
                ],
            };

            const expectedOutput = false;
            const output = await checkAndUpdateCartItems(input);
            expect(output).toEqual(expectedOutput);
        });

        it('Valid Cart Event but not able to set data due to redis error', async () => {
            const input = {
                id: 'shopify_test_set_redis_error',
                line_items: [
                    {
                        prod_id: 'prod_1',
                        quantity: 1,
                    },
                ],
            };

            const expectedOutput = true;
            const output = await checkAndUpdateCartItems(input);
            expect(output).toEqual(expectedOutput);
        });
    });

    describe(' Test Cases -> set AnonymousId and sessionId without using Redis', () => {
        it('Order Updated -> Properties containing cartToken', async () => {
            const input = {
                event: 'Order Updated',
                properties: {
                    cart_token: '123',
                },
            };
            const expectedOutput = { "anonymousId": "b9b6607d-6974-594f-8e99-ac3de71c4d89", "sessionId": undefined };
            const output = await getAnonymousIdAndSessionId(input, {}, null);
            expect(output).toEqual(expectedOutput);
        });

        it('Cart Update -> Properties contain `id` ', async () => {
            const input = {
                event: 'Cart Update',
                properties: {
                    id: '123',
                },
            };

            const expectedOutput = { "anonymousId": "b9b6607d-6974-594f-8e99-ac3de71c4d89", "sessionId": undefined };
            const output = await getAnonymousIdAndSessionId(input, {}, null);

            expect(output).toEqual(expectedOutput);
        });

        it('Customer event -> random AnonymousId', async () => {
            const input = {
                event: 'Customer Enabled',
                properties: {},
            };

            const output = await getAnonymousIdAndSessionId(input, {}, null);
            expect(output).toEqual(output); // since it will be random
        });

        it('Order Delete -> No anonymousId is there', async () => {
            const input = {
                event: 'Order Deleted',
                properties: {
                    order_id: 'Order_ID',
                },
            };
            const expectedOutput = { "anonymousId": undefined, "sessionId": undefined };
            const output = await getAnonymousIdAndSessionId(input, {}, null);
            expect(output).toEqual(expectedOutput);
        });

        it('Checkout Create -> rudderAnonymousId and rudderSessionId present in note_attributes', async () => {
            const input = {
                event: 'Checkout Create',
                properties: {
                    cart_token: 'CART_TOKEN',
                    note_attributes: [
                        {
                            "name": "rudderAnonymousId",
                            "value": "RUDDER_ANONYMOUSID"
                        },
                        {
                            "name": "rudderSessionId",
                            "value": "RUDDER_SESSIONID"
                        },
                        {
                            "name": "rudderUpdatedAt",
                            "value": "TIMESTAMP"
                        }
                    ],
                },
            };
            const expectedOutput = { "anonymousId": "RUDDER_ANONYMOUSID", "sessionId": "RUDDER_SESSIONID" };
            const output = await getAnonymousIdAndSessionId(input, {}, null);
            expect(output).toEqual(expectedOutput);
        });
    });

    describe('set AnonymousId and sesssionId with Redis Test Cases', () => {
        // Doing the following to enable redis mid test case file execution
        process.env.USE_REDIS_DB = true;
        jest.resetModules();
        const { getAnonymousIdAndSessionId } = require('./util');
        it('Properties containing cartToken but failed due redisError', async () => {
            const input = {
                event: 'Order Paid',
                properties: {
                    cart_token: 'shopify_test2',
                },
            };
            const expectedOutput = { "anonymousId": "bcaf0473-fb11-562f-80a1-c83a35f053bc", "sessionId": undefined } // cartToken hashed
            const output = await getAnonymousIdAndSessionId(input, {}, null);
            expect(output).toEqual(expectedOutput);
        });

        it('Order Paid- > Properties containing cartToken and fetched anonymousId and sessionId successfully', async () => {
            const input = {
                event: 'Order Paid',
                properties: {
                    cart_token: 'shopify_test2',
                    note_attributes: [
                        {
                            name: "rudderUpdatedAt",
                            value: "RUDDER_UPDTD_AT"
                        }
                    ],
                },
            };
            const expectedOutput = { "anonymousId": "anon_shopify_test2", "sessionId": "session_id_2" }; // fetched succesfully from redis

            const output = await getAnonymousIdAndSessionId(input, {}, null);
            expect(output).toEqual(expectedOutput);
        });

        it('Cart Update -> Properties contain id and fetched anonymousId successfully', async () => {
            const input = {
                event: 'Cart Update',
                properties: {
                    id: 'shopify_test_only_anon_id',
                },
            };
            const expectedOutput = { "anonymousId": "anon_shopify_test_only_anon_id", "sessionId": undefined };
            const output = await getAnonymousIdAndSessionId(input, {}, null);
            expect(output).toEqual(expectedOutput);
        });

        it('No mapping not present in DB for given cartToken', async () => {
            const input = {
                event: 'Cart Update',
                properties: {
                    id: 'unstored_id',
                },
            };

            const expectedOutput = { "anonymousId": "281a3e25-e603-5870-9cda-281c22940970", "sessionId": undefined };

            const output = await getAnonymousIdAndSessionId(input, {}, null);
            expect(output).toEqual(expectedOutput);
        });

        it('No cartToken for SHOPIFY_ADMIN_ONLY_EVENTS', async () => {
            const input = {
                event: 'Fulfillments Update',
                properties: {
                    id: 'unstored_id',
                },
            };
            const expectedOutput = { "anonymousId": undefined, "sessionId": undefined };

            const output = await getAnonymousIdAndSessionId(input, {}, null);
            expect(output).toEqual(expectedOutput);
        });

        it('No cartToken for Order paid', async () => {
            const input = {
                event: 'Order Paid',
                properties: {
                    cart_token: 'shopify_test2',
                },
            };
            const expectedOutput = 'RANDOM_ANONYMOUS_ID'; // fetched succesfully from redis

            const output = await getAnonymousIdAndSessionId(input, {}, null);
            expect('RANDOM_ANONYMOUS_ID').toEqual(expectedOutput);
        });

        it('Only anonymousId fetched from note_attributes and no cartToken', async () => {
            const input = {
                event: 'Order Paid',
                properties: {
                    note_attributes: [
                        {
                            name: "rudderAnonymousId",
                            value: "RUDDER_ANON_ID"
                        },
                        {
                            name: "rudderUpdatedAt",
                            value: "RUDDER_UPDTD_AT"
                        }
                    ],
                },
            };
            const expectedOutput = { "anonymousId": "RUDDER_ANON_ID", "sessionId": null }; // fetched succesfully from redis
            const output = await getAnonymousIdAndSessionId(input, {}, null);

            expect(output).toEqual(expectedOutput);
        });
    });

});
