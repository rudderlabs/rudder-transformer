const {
  pageViewedEventBuilder,
  cartViewedEventBuilder,
  productListViewedEventBuilder,
  productViewedEventBuilder,
  productToCartEventBuilder,
  checkoutEventBuilder,
  checkoutStepEventBuilder,
  searchEventBuilder,
} = require('./pixelUtils');
const { EventType } = require('../../../constants');
const Message = require('../../../v0/sources/message');
jest.mock('ioredis', () => require('../../../../test/__mocks__/redis'));
jest.mock('../../../v0/sources/message');

describe('utilV2.js', () => {
  beforeEach(() => {
    Message.mockClear();
  });

  describe('pageViewedEventBuilder', () => {
    it('should build a page viewed event message', () => {
      const inputEvent = {
        data: { url: 'https://example.com' },
        context: { userAgent: 'Mozilla/5.0' },
      };
      const message = pageViewedEventBuilder(inputEvent);
      expect(message).toBeInstanceOf(Message);
      expect(message.name).toBe('Page View');
      expect(message.properties).toEqual(inputEvent.data);
      expect(message.context).toEqual({ userAgent: 'Mozilla/5.0' });
    });
  });

  describe('cartViewedEventBuilder', () => {
    it('should build a cart viewed event message', () => {
      const inputEvent = {
        data: {
          cart: {
            cost: {
              totalAmount: {
                amount: 1259.9,
                currencyCode: 'USD',
              },
            },
            lines: [
              {
                cost: {
                  totalAmount: {
                    amount: 1259.9,
                    currencyCode: 'USD',
                  },
                },
                merchandise: {
                  price: {
                    amount: 629.95,
                    currencyCode: 'USD',
                  },
                  product: {
                    title: 'The Multi-managed Snowboard',
                  },
                  id: '41327143157873',
                  title: 'Default Title',
                  untranslatedTitle: 'Default Title',
                },
                quantity: 2,
              },
            ],
            totalQuantity: 2,
            attributes: [],
            id: '123',
          },
        },
        context: { userAgent: 'Mozilla/5.0' },
      };
      const message = cartViewedEventBuilder(inputEvent);
      expect(message).toBeInstanceOf(Message);
      expect(message.properties).toEqual({
        products: [
          {
            name: 'Default Title',
            price: 629.95,
            quantity: 2,
            variant: 'The Multi-managed Snowboard',
            merchandise: {
              id: '41327143157873',
              price: {
                amount: 629.95,
                currencyCode: 'USD',
              },
              product: {
                title: 'The Multi-managed Snowboard',
              },
              title: 'Default Title',
              untranslatedTitle: 'Default Title',
            },
            cost: {
              totalAmount: { amount: 1259.9, currencyCode: 'USD' },
            },
          },
        ],
        cart_id: '123',
        total: 1259.9,
      });
      expect(message.context).toEqual({ userAgent: 'Mozilla/5.0' });
    });
  });

  describe('productListViewedEventBuilder', () => {
    it('should build a product list viewed event message', () => {
      const inputEvent = {
        data: {
          collection: {
            productVariants: [
              { id: 'product123', name: 'Product 123' },
              { id: 'product456', name: 'Product 456' },
            ],
          },
        },
        clientId: 'client123',
        id: 'list123',
        context: { userAgent: 'Mozilla/5.0' },
      };
      const message = productListViewedEventBuilder(inputEvent);
      expect(message).toBeInstanceOf(Message);
      expect(message.properties).toEqual({
        cart_id: 'client123',
        list_id: 'list123',
        products: [
          { id: 'product123', name: 'Product 123' },
          { id: 'product456', name: 'Product 456' },
        ],
      });
      expect(message.context).toEqual({ userAgent: 'Mozilla/5.0' });
    });
  });

  describe('productViewedEventBuilder', () => {
    it('should build a product viewed event message', () => {
      const inputEvent = {
        data: { id: 'product123', name: 'Product 123' },
        context: { userAgent: 'Mozilla/5.0' },
      };
      const message = productViewedEventBuilder(inputEvent);
      expect(message).toBeInstanceOf(Message);
      expect(message.properties).toEqual({ id: 'product123', name: 'Product 123' });
      expect(message.context).toEqual({ userAgent: 'Mozilla/5.0' });
    });
  });

  describe('productToCartEventBuilder', () => {
    it('should build a product to cart event message', () => {
      const inputEvent = {
        data: { id: 'product123', name: 'Product 123' },
        context: { userAgent: 'Mozilla/5.0' },
        name: 'add_to_cart',
      };
      const message = productToCartEventBuilder(inputEvent);
      expect(message).toBeInstanceOf(Message);
      expect(message.properties).toEqual({ id: 'product123', name: 'Product 123' });
      expect(message.context).toEqual({ userAgent: 'Mozilla/5.0' });
    });
  });

  describe('checkoutEventBuilder', () => {
    it('should build a checkout event message', () => {
      const inputEvent = {
        data: {
          checkout: {
            lineItems: [
              { id: 'product123', name: 'Product 123' },
              { id: 'product456', name: 'Product 456' },
            ],
            order: {
              id: 'order123',
            },
            token: 'checkout123',
            totalPrice: { amount: 200 },
            currencyCode: 'USD',
            discountsAmount: { amount: 10 },
            shippingLine: { price: { amount: 5 } },
            subtotalPrice: { amount: 185 },
            totalTax: { amount: 15 },
          },
        },
        id: 'order123',
        context: { userAgent: 'Mozilla/5.0' },
        name: 'checkout_started',
      };
      const message = checkoutEventBuilder(inputEvent);
      expect(message).toBeInstanceOf(Message);
      expect(message.properties).toEqual({
        products: [
          { id: 'product123', name: 'Product 123' },
          { id: 'product456', name: 'Product 456' },
        ],
        order_id: 'order123',
        checkout_id: 'checkout123',
        total: 200,
        currency: 'USD',
        discount: 10,
        shipping: 5,
        revenue: 185,
        value: 200,
        tax: 15,
      });
      expect(message.context).toEqual({ userAgent: 'Mozilla/5.0' });
    });
  });

  describe('checkoutStepEventBuilder', () => {
    it('should build a checkout step event message', () => {
      const inputEvent = {
        data: {
          checkout: {
            step: 1,
            action: 'shipping_info_submitted',
          },
        },
        context: { userAgent: 'Mozilla/5.0' },
        name: 'checkout_step',
      };
      const message = checkoutStepEventBuilder(inputEvent);
      expect(message).toBeInstanceOf(Message);
      expect(message.properties).toEqual({ step: 1, action: 'shipping_info_submitted' });
      expect(message.context).toEqual({ userAgent: 'Mozilla/5.0' });
    });
  });

  describe('searchEventBuilder', () => {
    it('should build a search event message', () => {
      const inputEvent = {
        data: {
          searchResult: {
            query: 'test query',
          },
        },
        context: { userAgent: 'Mozilla/5.0' },
        name: 'search_submitted',
      };
      const message = searchEventBuilder(inputEvent);
      expect(message).toBeInstanceOf(Message);
      expect(message.properties).toEqual({ query: 'test query' });
      expect(message.context).toEqual({ userAgent: 'Mozilla/5.0' });
    });
  });
});
