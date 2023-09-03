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
          extra_property: 'extra value',
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
  });
});
