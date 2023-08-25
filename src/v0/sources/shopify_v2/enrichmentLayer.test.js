const { enrichPayload } = require('./enrichmentLayer');
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
          tax: 30,
        },
      };
      const event = {
        order_id: '1234',
        total: 100,
        tax: 30,
        extra_property: 'extra value',
      };
      const expectedOutput = {
        event: 'Order Cancelled',
        properties: {
          order_id: '1234',
          total: 100,
          tax: 30,
          extra_property: 'extra value',
        },
      };
      const output = enrichPayload.setExtraNonEcomProperties(message, event, 'orders_cancelled');
      expect(output).toEqual(expectedOutput);
    });
  });
});
