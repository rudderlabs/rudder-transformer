const { TrackLayer } = require('./trackEventsLayer');
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
      expect(TrackLayer.getProductsListFromLineItems(null)).toEqual([]); // empty object as input would be returned as it is
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
      expect(TrackLayer.getProductsListFromLineItems(lineItems)).toEqual(expectedOutput);
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
        TrackLayer.createPropertiesForEcomEvent(checkoutsCreateWebhook, 'checkouts_create'),
      ).toEqual(expectedOutput);
    });

    it('Checkout Step Viewed event', () => {
      const shopifyTopic = 'checkout_step_viewed';
      const expectedOutput = {
        checkout_id: '1234',
        shipping_method: 'Standard',
      };

      expect(
        TrackLayer.createPropertiesForEcomEvent(checkoutsUpdateWebhook[shopifyTopic], shopifyTopic),
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
        TrackLayer.createPropertiesForEcomEvent(checkoutsUpdateWebhook[shopifyTopic], shopifyTopic),
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
        TrackLayer.createPropertiesForEcomEvent(checkoutsUpdateWebhook[shopifyTopic], shopifyTopic),
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
        TrackLayer.createPropertiesForEcomEvent(ordersUpdatedWebhook, 'orders_updated'),
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

      expect(TrackLayer.createPropertiesForEcomEvent(ordersPaidWebhook, 'orders_paid')).toEqual(
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
        TrackLayer.createPropertiesForEcomEvent(ordersCancelledWebhook, 'orders_cancelled'),
      ).toEqual(expectedOutput);
    });
  });

  describe('generateProductAddedAndRemovedEvents() unit test cases', () => {
    it('Product Added event with no prev_cart', async () => {
      const input = {
        id: 'cart_id',
        line_items: [
          {
            id: 123456,
            properties: null,
            quantity: 5,
            variant_id: 123456,
            key: '123456:7891112',
            discounted_price: '30.00',
            discounts: [],
            gift_card: false,
            grams: 0,
            line_price: '60.00',
            original_line_price: '60.00',
            original_price: '30.00',
            price: '30.00',
            product_id: 9876543,
            sku: '',
            taxable: true,
            title: 'Shirt 2 - LARGE',
            total_discount: '0.00',
            vendor: 'example',
            discounted_price_set: {
              shop_money: {
                amount: '30.0',
                currency_code: 'GBP',
              },
              presentment_money: {
                amount: '30.0',
                currency_code: 'GBP',
              },
            },
            line_price_set: {
              shop_money: {
                amount: '60.0',
                currency_code: 'GBP',
              },
              presentment_money: {
                amount: '60.0',
                currency_code: 'GBP',
              },
            },
            original_line_price_set: {
              shop_money: {
                amount: '60.0',
                currency_code: 'GBP',
              },
              presentment_money: {
                amount: '60.0',
                currency_code: 'GBP',
              },
            },
            price_set: {
              shop_money: {
                amount: '30.0',
                currency_code: 'GBP',
              },
              presentment_money: {
                amount: '30.0',
                currency_code: 'GBP',
              },
            },
            total_discount_set: {
              shop_money: {
                amount: '0.0',
                currency_code: 'GBP',
              },
              presentment_money: {
                amount: '0.0',
                currency_code: 'GBP',
              },
            },
          },
        ],
        note: null,
        updated_at: '2023-02-10T12:05:07.251Z',
        created_at: '2023-02-10T12:04:04.402Z',
      };
      const expectedOutput = [
        {
          context: {
            integration: {
              name: 'SHOPIFY',
            },
            library: {
              name: 'unknown',
              version: 'unknown',
            },
          },
          integrations: {
            SHOPIFY: false,
          },
          type: 'track',
          event: 'Product Added',
          properties: {
            cart_id: 'cart_id',
            variant_id: 123456,
            product_id: '9876543',
            name: 'Shirt 2 - LARGE',
            brand: 'example',
            price: 30,
            quantity: 5,
            id: 123456,
            properties: null,
            key: '123456:7891112',
            discounted_price: '30.00',
            discounts: [],
            gift_card: false,
            grams: 0,
            line_price: '60.00',
            original_line_price: '60.00',
            original_price: '30.00',
            taxable: true,
            total_discount: '0.00',
            discounted_price_set: {
              shop_money: {
                amount: '30.0',
                currency_code: 'GBP',
              },
              presentment_money: {
                amount: '30.0',
                currency_code: 'GBP',
              },
            },
            line_price_set: {
              shop_money: {
                amount: '60.0',
                currency_code: 'GBP',
              },
              presentment_money: {
                amount: '60.0',
                currency_code: 'GBP',
              },
            },
            original_line_price_set: {
              shop_money: {
                amount: '60.0',
                currency_code: 'GBP',
              },
              presentment_money: {
                amount: '60.0',
                currency_code: 'GBP',
              },
            },
            price_set: {
              shop_money: {
                amount: '30.0',
                currency_code: 'GBP',
              },
              presentment_money: {
                amount: '30.0',
                currency_code: 'GBP',
              },
            },
            total_discount_set: {
              shop_money: {
                amount: '0.0',
                currency_code: 'GBP',
              },
              presentment_money: {
                amount: '0.0',
                currency_code: 'GBP',
              },
            },
          },
        },
      ];
      expect(await TrackLayer.generateProductAddedAndRemovedEvents(input, {})).toEqual(
        expectedOutput,
      );
    });

    it('Multiple Product Added event with no prev_cart', async () => {
      const input = {
        id: 'cart_id',
        line_items: [
          {
            id: 123456,
            properties: null,
            quantity: 5,
            variant_id: 123456,
            key: '123456:7891112',
            discounted_price: '30.00',
            discounts: [],
            gift_card: false,
            grams: 0,
            line_price: '60.00',
            original_line_price: '60.00',
            original_price: '30.00',
            price: '30.00',
            product_id: 9876543,
            sku: '',
            taxable: true,
            title: 'Shirt 2 - LARGE',
            total_discount: '0.00',
            vendor: 'example',
          },
          {
            id: 'id2',
            properties: null,
            quantity: 5,
            variant_id: 'variant_id',
            key: 'some:key',
            discounted_price: '30.00',
            discounts: [],
            gift_card: false,
            grams: 0,
            line_price: '60.00',
            original_line_price: '60.00',
            original_price: '30.00',
            price: '30.00',
            product_id: 9876543,
            sku: '',
            taxable: true,
            title: 'Shirt 2 - LARGE',
            total_discount: '0.00',
            vendor: 'example',
          },
        ],
        note: null,
        updated_at: '2023-02-10T12:05:07.251Z',
        created_at: '2023-02-10T12:04:04.402Z',
      };
      const expectedOutput = [
        {
          context: {
            integration: {
              name: 'SHOPIFY',
            },
            library: {
              name: 'unknown',
              version: 'unknown',
            },
          },
          integrations: {
            SHOPIFY: false,
          },
          type: 'track',
          event: 'Product Added',
          properties: {
            cart_id: 'cart_id',
            variant_id: 123456,
            product_id: '9876543',
            name: 'Shirt 2 - LARGE',
            brand: 'example',
            price: 30,
            quantity: 5,
            id: 123456,
            properties: null,
            key: '123456:7891112',
            discounted_price: '30.00',
            discounts: [],
            gift_card: false,
            grams: 0,
            line_price: '60.00',
            original_line_price: '60.00',
            original_price: '30.00',
            taxable: true,
            total_discount: '0.00',
          },
        },
        {
          context: {
            integration: {
              name: 'SHOPIFY',
            },
            library: {
              name: 'unknown',
              version: 'unknown',
            },
          },
          integrations: {
            SHOPIFY: false,
          },
          type: 'track',
          event: 'Product Added',
          properties: {
            cart_id: 'cart_id',
            variant_id: 'variant_id',
            product_id: '9876543',
            name: 'Shirt 2 - LARGE',
            brand: 'example',
            price: 30,
            quantity: 5,
            id: 'id2',
            properties: null,
            key: 'some:key',
            discounted_price: '30.00',
            discounts: [],
            gift_card: false,
            grams: 0,
            line_price: '60.00',
            original_line_price: '60.00',
            original_price: '30.00',
            taxable: true,
            total_discount: '0.00',
          },
        },
      ];
      expect(await TrackLayer.generateProductAddedAndRemovedEvents(input, {})).toEqual(
        expectedOutput,
      );
    });

    it('Multiple Product Removed event with lesser quantity and no quantity', async () => {
      const dbData = {
        lineItems: {
          123456: {
            quantity: 7,
            variant_id: 123456,
            price: '30.00',
            product_id: 9876543,
            sku: '',
            title: 'Shirt 2 - LARGE',
            vendor: 'example',
          },
          2: {
            quantity: 2,
            variant_id: 321,
            price: '10.00',
            product_id: 3476,
            sku: '',
            title: 'Shirt 2 - Medium',
            vendor: 'example',
          },
        },
      };
      const input = {
        id: 'cart_id',
        line_items: [
          {
            id: '123456',
            properties: null,
            quantity: 5,
            variant_id: 123456,
            price: '30.00',
            product_id: 9876543,
            sku: '',
            title: 'Shirt 2 - LARGE',
            vendor: 'example',
          },
        ],
        note: null,
        updated_at: '2023-02-10T12:05:07.251Z',
        created_at: '2023-02-10T12:04:04.402Z',
      };
      const expectedOutput = [
        {
          context: {
            integration: {
              name: 'SHOPIFY',
            },
            library: {
              name: 'unknown',
              version: 'unknown',
            },
          },
          integrations: {
            SHOPIFY: false,
          },
          type: 'track',
          event: 'Product Removed',
          properties: {
            cart_id: 'cart_id',
            variant_id: 123456,
            product_id: '9876543',
            name: 'Shirt 2 - LARGE',
            brand: 'example',
            properties: null,
            price: 30,
            quantity: 2,
            id: '123456',
          },
        },
        {
          context: {
            integration: {
              name: 'SHOPIFY',
            },
            library: {
              name: 'unknown',
              version: 'unknown',
            },
          },
          integrations: {
            SHOPIFY: false,
          },
          type: 'track',
          event: 'Product Removed',
          properties: {
            id: '2',
            cart_id: 'cart_id',
            variant_id: 321,
            product_id: '3476',
            name: 'Shirt 2 - Medium',
            brand: 'example',
            price: 10,
            quantity: 2,
          },
        },
      ];
      expect(await TrackLayer.generateProductAddedAndRemovedEvents(input, dbData, {})).toEqual(
        expectedOutput,
      );
    });

    it('Checkout Step Completed event', () => {
      const shopifyTopic = 'checkout_step_completed';
      const expectedOutput = {
        checkout_id: '1234',
        shipping_method: 'Standard',
        payment_method: 'cash',
      };

      expect(
        TrackLayer.createPropertiesForEcomEvent(checkoutsUpdateWebhook[shopifyTopic], shopifyTopic),
      ).toEqual(expectedOutput);
    });
  });
});
