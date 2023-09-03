const { trackLayer } = require('./trackEventsLayer');
const {
  lineItems,
  products,
  checkoutsCreateWebhook,
  checkoutsUpdateWebhook,
  ordersUpdatedWebhook,
  ordersPaidWebhook,
  ordersCancelledWebhook,
} = require('./__mocks__/data');
describe('Track Event Layer Tests', () => {
  describe('getProductsListFromLineItems() unit test cases', () => {
    it('Line items is empty/null', () => {
      expect(trackLayer.getProductsListFromLineItems(null)).toEqual([]); // empty object as input would be returned as it is
    });

    it('Line items is non empty', () => {
      const expectedOutput = [
        {
          product_id: 'prd1',
          variant_name: 'Shirt 1 - LARGE',
          name: 'Shirt 1',
          price: 5,
          brand: 'vendor1',
          quantity: 2,
          variant: 'LARGE',
          extra_property1: 'extra value1',
        },
        {
          product_id: 'prd2',
          variant_name: 'Shirt 2 - SMALL',
          name: 'Shirt 2',
          price: 4,
          brand: 'vendor2',
          quantity: 1,
          variant: 'SMALL',
          extra_property2: 'extra value2',
        },
      ];
      expect(trackLayer.getProductsListFromLineItems(lineItems)).toEqual(expectedOutput);
    });
  });

  describe('createPropertiesForEcomEvent() unit test cases', () => {
    it('Checkout Started event', () => {
      const expectedOutput = {
        checkout_id: '1234',
        value: 100,
        revenue: 70,
        tax: 30,
        shipping: 10.2,
        discount: 5,
        coupon: 'code1, code2',
        currency: 'USD',
        products,
      };
      expect(
        trackLayer.createPropertiesForEcomEvent(checkoutsCreateWebhook, 'checkouts_create'),
      ).toEqual(expectedOutput);
    });

    it('Checkout Step Viewed event', () => {
      const shopifyTopic = 'checkout_step_viewed';
      const expectedOutput = {
        checkout_id: '1234',
        shipping_method: 'Standard',
      };

      expect(
        trackLayer.createPropertiesForEcomEvent(checkoutsUpdateWebhook[shopifyTopic], shopifyTopic),
      ).toEqual(expectedOutput);
    });

    it('Checkout Step Completed event', () => {
      const shopifyTopic = 'checkout_step_completed';
      const expectedOutput = {
        checkout_id: '1234',
        shipping_method: 'Standard',
        payment_method: 'cash',
      };

      expect(
        trackLayer.createPropertiesForEcomEvent(checkoutsUpdateWebhook[shopifyTopic], shopifyTopic),
      ).toEqual(expectedOutput);
    });

    it('Payment Info Entered event', () => {
      const shopifyTopic = 'payment_info_entered';
      const expectedOutput = {
        checkout_id: '1234',
        shipping_method: 'Standard',
        payment_method: 'cash',
      };

      expect(
        trackLayer.createPropertiesForEcomEvent(checkoutsUpdateWebhook[shopifyTopic], shopifyTopic),
      ).toEqual(expectedOutput);
    });

    it('Order Updated event', () => {
      const expectedOutput = {
        checkout_id: '1234',
        order_id: '3456',
        total: 100,
        revenue: 70,
        tax: 30,
        shipping: 10.2,
        discount: 5,
        coupon: 'code1, code2',
        currency: 'USD',
        products,
      };

      expect(
        trackLayer.createPropertiesForEcomEvent(ordersUpdatedWebhook, 'orders_updated'),
      ).toEqual(expectedOutput);
    });

    it('Order Completed event', () => {
      const expectedOutput = {
        checkout_id: '1234',
        order_id: '3456',
        total: 100,
        subtotal: 70,
        tax: 30,
        shipping: 10.2,
        discount: 5,
        coupon: 'code1, code2',
        currency: 'USD',
        products,
      };

      expect(trackLayer.createPropertiesForEcomEvent(ordersPaidWebhook, 'orders_paid')).toEqual(
        expectedOutput,
      );
    });

    it('Order Cancelled event', () => {
      const expectedOutput = {
        checkout_id: '1234',
        order_id: '3456',
        total: 100,
        revenue: 70,
        tax: 30,
        shipping: 10.2,
        discount: 5,
        coupon: 'code1, code2',
        currency: 'USD',
        products,
      };

      expect(
        trackLayer.createPropertiesForEcomEvent(ordersCancelledWebhook, 'orders_cancelled'),
      ).toEqual(expectedOutput);
    });
  });
});
