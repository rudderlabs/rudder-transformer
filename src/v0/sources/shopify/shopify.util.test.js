const { getShopifyTopic,
  getAnonymousId,
  checkAndUpdateCartItems,
} = require('./util');
jest.mock('ioredis', () => require('../../../../test/__mocks__/redis'));
describe('Shopify Utils Test', () => {
  describe('Fetching Shopify Topic Test Cases', () => {
    it('Invalid Topic Test', () => {
      const input = {
        query_parameters: {},
      };
      const expectedOutput = {
        error: 'Invalid topic in query_parameters',
      };
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
        },
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
        },
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
  });

  describe(' Test Cases -> set AnonymousId without using Redis', () => {
    it('Properties containing cartToken', async () => {
      const input = {
        event: 'Order Updated',
        properties: {
          cart_token: '123',
        },
      };
      const expectedOutput = 'b9b6607d-6974-594f-8e99-ac3de71c4d89';
      const output = await getAnonymousId(input);
      expect(output).toEqual(expectedOutput);
    });

    it('Properties contain id for cart event', async () => {
      const input = {
        event: 'Cart Update',
        properties: {
          id: '123',
        },
      };

      const expectedOutput = 'b9b6607d-6974-594f-8e99-ac3de71c4d89';
      const output = await getAnonymousId(input);
      expect(output).toEqual(expectedOutput);
    });

    it('Customer event -> random AnonymousId', async () => {
      const input = {
        event: 'Customer Enabled',
        properties: {},
      };
      const output = await getAnonymousId(input);
      expect(output).toEqual(output); // since it will be random
    });

    it('Order Delete -> No anonymousId is there', async () => {
      const input = {
        event: 'Order Deleted',
        properties: {
          order_id: 'Order_ID',
        },
      };
      const expectedOutput = null;
      const output = await getAnonymousId(input);
      expect(output).toEqual(expectedOutput);
    });

    it('Checkout Create -> rudderAnonymousId present in note_attributes', async () => {
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
              "name": "rudderUpdatedAt",
              "value": "TIMESTAMP"
            }
          ],
        },
      };
      const expectedOutput = "RUDDER_ANONYMOUSID";
      const output = await getAnonymousId(input);
      expect(output).toEqual(expectedOutput);
    });
  });

  describe('set AnonymousId with Redis Test Cases', () => {
    // Doing the following to enable redis mid test case file execution
    process.env.USE_REDIS_DB = true;
    jest.resetModules();
    const { getAnonymousId } = require('./util');
    it('Properties containing cartToken but failed due redisError', async () => {
      const input = {
        event: 'Order Paid',
        properties: {
          cart_token: 'shopify_test2',
        },
      };
      const expectedOutput = 'bcaf0473-fb11-562f-80a1-c83a35f053bc'; // cartToken hash
      const output = await getAnonymousId(input);
      expect(output).toEqual(expectedOutput);
    });

    it('Properties containing cartToken and fetched anonymousId successfully', async () => {
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
      const expectedOutput = 'anon_shopify_test2'; // fetched succesfully from redis
      const output = await getAnonymousId(input);
      expect(output).toEqual(expectedOutput);
    });

    it('Properties contain id for cart event and fetched anonymousId successfully', async () => {
      const input = {
        event: 'Cart Update',
        properties: {
          id: 'shopify_test2',
        },
      };

      const expectedOutput = 'anon_shopify_test2';
      const output = await getAnonymousId(input);
      expect(output).toEqual(expectedOutput);
    });

    it('No mapping not present in DB for given cartToken', async () => {
      const input = {
        event: 'Cart Update',
        properties: {
          id: 'unstored_id',
        },
      };

      const expectedOutput = '281a3e25-e603-5870-9cda-281c22940970';
      const output = await getAnonymousId(input);
      expect(output).toEqual(expectedOutput);
    });

    it('No cartToken for SHOPIFY_ADMIN_ONLY_EVENTS', async () => {
      const input = {
        event: 'Fulfillments Update',
        properties: {
          id: 'unstored_id',
        },
      };
      const expectedOutput = null;
      const output = await getAnonymousId(input);
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
      const output = await getAnonymousId(input);
      expect('RANDOM_ANONYMOUS_ID').toEqual(expectedOutput);
    });

    it('anonymousId fethced from note_attributes', async () => {
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
      const expectedOutput = 'RUDDER_ANON_ID'; // fetched succesfully from redis
      const output = await getAnonymousId(input);
      expect(output).toEqual(expectedOutput);
    });
  });

});
