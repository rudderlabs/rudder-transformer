const {
  handleProductViewed,
  handleProductListViewed,
  handleProductAdded,
  handleCartViewed,
  handleOrderCompleted,
} = require('./utils');

const getTestMessage = () => {
  let message = {
    event: 'testEventName',
    anonymousId: 'anonId',
    properties: {
      product_id: 123,
      category: 'test',
      email: 'test@test.com',
      templateId: 1234,
      campaignId: 5678,
      name: 'pageName',
      countryCode: 'IN',
      zipCode: '700114',
      conversionDateTime: '2022-01-01 12:32:45-08:00',
      quantity: 2,
      price: 123,
      order_id: 1234,
    },
  };
  return message;
};

describe('Monetate utils unit test cases', () => {
  describe('handleProductViewed util test cases', () => {
    it('flow check', () => {
      let expectedOutput = {
        events: [
          {
            eventType: 'monetate:context:ProductDetailView',
            products: [{ productId: 123, sku: '' }],
          },
        ],
      };
      expect(handleProductViewed(getTestMessage().properties, { events: [] })).toEqual(
        expectedOutput,
      );
    });
  });

  describe('handleProductListViewed util test cases', () => {
    it('flow check', () => {
      let fittingPayload = { ...getTestMessage() };
      fittingPayload.properties.products = [
        {
          sku: 'sku 1 for order completed',
          price: 8900,
          currency: 'INR',
          quantity: 1,
          product_id: 'p2022222',
        },
        {
          sku: 'sku 2 for order completed',
          price: 90,
          quantity: 2,
          product_id: 'p201111',
        },
      ];
      let expectedOutput = {
        events: [
          { eventType: 'monetate:context:ProductThumbnailView', products: ['p2022222', 'p201111'] },
        ],
      };
      expect(handleProductListViewed(fittingPayload.properties, { events: [] })).toEqual(
        expectedOutput,
      );
    });
  });

  describe('handleProductViewed util test cases', () => {
    it('flow check', () => {
      const fittingPayload = { ...getTestMessage() };
      fittingPayload.properties.cart_value = 1234;
      let expectedOutput = {
        events: [
          {
            cartLines: [{ currency: 'USD', pid: '123', quantity: 2, sku: '', value: '1234' }],
            eventType: 'monetate:context:Cart',
          },
        ],
      };
      expect(handleProductAdded(fittingPayload.properties, { events: [] })).toEqual(expectedOutput);
    });
  });

  describe('handleCartViewed util test cases', () => {
    it('flow check', () => {
      let fittingPayload = { ...getTestMessage() };
      fittingPayload.properties.products = [
        {
          sku: 'sku 1 for order completed',
          price: 8900,
          currency: 'INR',
          quantity: 1,
          product_id: 'p2022222',
        },
        {
          sku: 'sku 2 for order completed',
          price: 90,
          quantity: 2,
          product_id: 'p201111',
        },
      ];
      let expectedOutput = {
        events: [
          {
            cartLines: [
              {
                currency: 'INR',
                pid: 'p2022222',
                quantity: 1,
                sku: 'sku 1 for order completed',
                value: '8900.00',
              },
              {
                currency: 'USD',
                pid: 'p201111',
                quantity: 2,
                sku: 'sku 2 for order completed',
                value: '180.00',
              },
            ],
            eventType: 'monetate:context:Cart',
          },
        ],
      };
      expect(handleCartViewed(fittingPayload.properties, { events: [] })).toEqual(expectedOutput);
    });
  });

  describe('handleOrderCompleted util test cases', () => {
    it('flow check', () => {
      let fittingPayload = { ...getTestMessage() };
      fittingPayload.properties.products = [
        {
          sku: 'sku 1 for order completed',
          price: 8900,
          currency: 'INR',
          quantity: 1,
          product_id: 'p2022222',
        },
        {
          sku: 'sku 2 for order completed',
          price: 90,
          quantity: 2,
          product_id: 'p201111',
        },
      ];
      let expectedOutput = {
        events: [
          {
            eventType: 'monetate:context:Purchase',
            purchaseId: 1234,
            purchaseLines: [
              {
                currency: 'INR',
                pid: 'p2022222',
                quantity: 1,
                sku: 'sku 1 for order completed',
                value: '8900.00',
              },
              {
                currency: 'USD',
                pid: 'p201111',
                quantity: 2,
                sku: 'sku 2 for order completed',
                value: '180.00',
              },
            ],
          },
        ],
      };
      expect(handleOrderCompleted(fittingPayload.properties, { events: [] })).toEqual(
        expectedOutput,
      );
    });
  });
});
