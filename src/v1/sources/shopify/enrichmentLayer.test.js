const { enrichPayload } = require('./enrichmentLayer');
const { products, ordersCancelledWebhook } = require('./__mocks__/data');
describe('Enrichment Layer Tests', () => {
  describe('setExtraNonEcomProperties() unit test cases', () => {
    it('Non ecom event passed', () => {
      const output = enrichPayload.setExtraNonEcomProperties({}, {}, 'non_ecom_event');
      expect(output).toEqual({}); // empty object as input would be returned as it is
    });

    it('Valid Ecom Event -> Order Cancelled', () => {
      const message = {
        event: 'Order Cancelled',
        properties: {
          order_id: '1234',
          total: 100,
          revenue: 70,
          tax: 30,
          shipping: 10.2,
          discount: 5,
          coupon: 'code1, code2',
          currency: 'USD',
          products,
        },
      };

      const expectedOutput = {
        event: 'Order Cancelled',
        properties: {
          order_id: '1234',
          total: 100,
          revenue: 70,
          tax: 30,
          shipping_lines: [
            { id: 1, price: 7 },
            { id: 2, price: 3.2 },
          ],
          shipping: 10.2,
          discount: 5,
          discount_codes: [{ code: 'code1' }, { code: 'code2' }],
          coupon: 'code1, code2',
          currency: 'USD',
          extra_property: 'ExtraValue',
          products,
        },
      };

      const output = enrichPayload.setExtraNonEcomProperties(
        message,
        ordersCancelledWebhook,
        'orders_cancelled',
      );
      expect(output).toEqual(expectedOutput);
    });

    // The specified shopifyTopic does not exist in the RUDDER_ECOM_MAP, and the function returns the original message.
    it('should return original message when shopifyTopic does not exist in RUDDER_ECOM_MAP', () => {
      const message = { properties: { existingKey: 'existingValue' } };
      const event = { key1: 'value1', key2: 'value2', key3: 'value3' };
      const shopifyTopic = 'checkout_step_viewed';
      const result = enrichPayload.setExtraNonEcomProperties(message, event, shopifyTopic);
      expect(result.properties).toBe(message.properties);
    });

    // The specified shopifyTopic is not an ecom event or does not have a mapping JSON file, and the function returns the updated message without any added properties.
    it('should return updated message without added properties when shopifyTopic is not an ecom event or does not have mapping JSON file', () => {
      const message = { properties: { existingKey: 'existingValue' } };
      const event = { key1: 'value1', key2: 'value2', key3: 'value3' };
      const shopifyTopic = 'orders_fulfilled';
      const result = enrichPayload.setExtraNonEcomProperties(message, event, shopifyTopic);

      expect(result.properties).toBe(message.properties);
    });

    // The function returns the updated message with the added properties.
    it('should return updated message with added properties', () => {
      const message = { properties: { existingKey: 'existingValue' } };
      const event = { key1: 'value1', key2: 'value2', key3: 'value3' };
      const shopifyTopic = 'checkouts_create';
      const result = enrichPayload.setExtraNonEcomProperties(message, event, shopifyTopic);

      expect(result).toEqual({
        properties: {
          existingKey: 'existingValue',
          key1: 'value1',
          key2: 'value2',
          key3: 'value3',
        },
      });
    });
  });
});
