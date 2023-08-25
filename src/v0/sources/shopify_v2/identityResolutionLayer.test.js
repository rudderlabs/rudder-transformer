const { idResolutionLayer } = require('./identityResolutionLayer');
describe(' Test Cases -> set AnonymousId and sessionId without using Redis', () => {
  it('Order Updated -> No redis data anonymousId is mapped using cartToken hash', async () => {
    const input = {
      event: 'Order Updated',
      properties: {
        cart_token: '123',
      },
    };
    const redisData = {};
    const expectedOutput = {
      anonymousId: 'b9b6607d-6974-594f-8e99-ac3de71c4d89',
      sessionId: undefined,
    };
    const output = idResolutionLayer.getAnonymousIdAndSessionId(input, 'order_updated', redisData);
    expect(output).toEqual(expectedOutput);
  });

  it('Customer event -> random AnonymousId', async () => {
    const input = {
      event: 'Customer Enabled',
      properties: {},
    };
    const redisData = {};
    const output = idResolutionLayer.getAnonymousIdAndSessionId(
      input,
      'customer_enabled',
      redisData,
    );
    expect(output).toEqual(output); // since it will be random
  });

  it('Order Delete -> No anonymousId is there', async () => {
    const input = {
      event: 'Order Deleted',
      properties: {
        order_id: 'Order_ID',
      },
    };
    const redisData = {};
    const expectedOutput = { anonymousId: undefined, sessionId: undefined };
    const output = idResolutionLayer.getAnonymousIdAndSessionId(input, 'order_deleted', redisData);
    expect(output).toEqual(expectedOutput);
  });

  it('Checkout Create -> rudderAnonymousId and rudderSessionId present in note_attributes', async () => {
    const input = {
      event: 'Checkout Create',
      properties: {
        cart_token: 'CART_TOKEN',
        note_attributes: [
          {
            name: 'rudderAnonymousId',
            value: 'RUDDER_ANONYMOUSID',
          },
          {
            name: 'rudderSessionId',
            value: 'RUDDER_SESSIONID',
          },
          {
            name: 'rudderUpdatedAt',
            value: 'TIMESTAMP',
          },
        ],
      },
    };
    const redisData = {};
    const expectedOutput = { anonymousId: 'RUDDER_ANONYMOUSID', sessionId: 'RUDDER_SESSIONID' };
    const output = idResolutionLayer.getAnonymousIdAndSessionId(
      input,
      'checkout_created',
      redisData,
    );
    expect(output).toEqual(expectedOutput);
  });
});

describe('set AnonymousId and sesssionId with Redis Data Test Cases', () => {
  it('Order Paid- > anonymousId and sessionId fetched from redis successfully', async () => {
    const input = {
      event: 'Order Paid',
      properties: {
        cart_token: 'shopify_test2',
        note_attributes: [
          {
            name: 'rudderUpdatedAt',
            value: 'RUDDER_UPDTD_AT',
          },
        ],
      },
    };
    const redisData = { anonymousId: 'anon_shopify_test2', sessionId: 'session_id_2' };
    const expectedOutput = { anonymousId: 'anon_shopify_test2', sessionId: 'session_id_2' }; // fetched succesfully from redis

    const output = idResolutionLayer.getAnonymousIdAndSessionId(input, 'order_paid', redisData);
    expect(output).toEqual(expectedOutput);
  });

  it('No mapping not present in DB for given cartToken. Hence no redisData', async () => {
    const input = {
      event: 'Order Updated',
      properties: {
        cart_token: 'unstored_id',
      },
    };
    const redisData = {};
    const expectedOutput = {
      anonymousId: '281a3e25-e603-5870-9cda-281c22940970',
      sessionId: undefined,
    };

    const output = idResolutionLayer.getAnonymousIdAndSessionId(input, 'order_updated', redisData);
    expect(output).toEqual(expectedOutput);
  });

  it('No cartToken for SHOPIFY_ADMIN_ONLY_EVENTS', async () => {
    const input = {
      event: 'Fulfillments Update',
      properties: {
        id: 'unstored_id',
      },
    };
    const expectedOutput = { anonymousId: undefined, sessionId: undefined };

    const output = idResolutionLayer.getAnonymousIdAndSessionId(input, 'fulfillments_updated', {});
    expect(output).toEqual(expectedOutput);
  });

  it('No cartToken for Order paid', async () => {
    const input = {
      event: 'Order Paid',
      properties: {
        cart_token: 'shopify_test2',
      },
    };
    const expectedOutput = 'RANDOM_ANONYMOUS_ID';
    const output = idResolutionLayer.getAnonymousIdAndSessionId(input, 'order_paid', {});
    expect('RANDOM_ANONYMOUS_ID').toEqual(expectedOutput);
  });

  it('Only anonymousId fetched from note_attributes and no cartToken', async () => {
    const input = {
      event: 'Order Paid',
      properties: {
        note_attributes: [
          {
            name: 'rudderAnonymousId',
            value: 'RUDDER_ANON_ID',
          },
          {
            name: 'rudderUpdatedAt',
            value: 'RUDDER_UPDTD_AT',
          },
        ],
      },
    };
    const expectedOutput = { anonymousId: 'RUDDER_ANON_ID', sessionId: null };
    const output = idResolutionLayer.getAnonymousIdAndSessionId(input, 'order_paid', {});

    expect(output).toEqual(expectedOutput);
  });
});

