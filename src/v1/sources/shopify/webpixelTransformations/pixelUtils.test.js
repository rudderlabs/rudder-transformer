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
const Message = require('../../../../v0/sources/message');
jest.mock('ioredis', () => require('../../../../test/__mocks__/redis'));
jest.mock('../../../../v0/sources/message');

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
              {
                price: {
                  amount: 10,
                  currencyCode: 'USD',
                },
                product: {
                  title: 'Gift Card',
                  vendor: 'Snowboard Vendor',
                  id: '7234590605425',
                  untranslatedTitle: 'Gift Card',
                  url: '/products/gift-card',
                  type: 'giftcard',
                },
                id: '41327142895729',
                image: {
                  src: '//store.myshopify.com/cdn/shop/files/gift_card.png?v=1724736596',
                },
                sku: '',
                title: '$10',
                untranslatedTitle: '$10',
              },
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
          {
            brand: 'Snowboard Vendor',
            category: 'giftcard',
            image_url: '//store.myshopify.com/cdn/shop/files/gift_card.png?v=1724736596',
            name: '$10',
            price: 10,
            product_id: '7234590605425',
            sku: '',
            url: '/products/gift-card',
            variant: 'Gift Card',
          },
        ],
      });
      expect(message.context).toEqual({ userAgent: 'Mozilla/5.0' });
    });
  });

  describe('productViewedEventBuilder', () => {
    it('should build a product viewed event message', () => {
      const inputEvent = {
        data: {
          productVariant: {
            price: {
              amount: 749.95,
              currencyCode: 'USD',
            },
            product: {
              title: 'The Collection Snowboard: Liquid',
              vendor: 'Hydrogen Vendor',
              id: '7234590834801',
              untranslatedTitle: 'The Collection Snowboard: Liquid',
              url: '/products/the-collection-snowboard-liquid',
              type: 'snowboard',
            },
            id: '41327143321713',
            image: {
              src: '//store.myshopify.com/cdn/shop/files/Main_b13ad453-477c-4ed1-9b43-81f3345adfd6.jpg?v=1724736600',
            },
            sku: '',
            title: 'Default Title',
            untranslatedTitle: 'Default Title',
          },
        },
        context: { userAgent: 'Mozilla/5.0' },
      };
      const message = productViewedEventBuilder(inputEvent);
      expect(message).toBeInstanceOf(Message);
      expect(message.properties).toEqual({
        brand: 'Hydrogen Vendor',
        category: 'snowboard',
        currency: 'USD',
        name: 'The Collection Snowboard: Liquid',
        price: 749.95,
        product_id: '7234590834801',
        url: '/products/the-collection-snowboard-liquid',
        variant: 'The Collection Snowboard: Liquid',
      });
      expect(message.context).toEqual({ userAgent: 'Mozilla/5.0' });
    });
  });

  describe('productToCartEventBuilder', () => {
    it('should build a product to cart event message', () => {
      const inputEvent = {
        data: {
          cartLine: {
            cost: {
              totalAmount: {
                amount: 749.95,
                currencyCode: 'USD',
              },
            },
            merchandise: {
              id: '41327143321713',
              image: {
                src: 'https://cdn.shopify.com/s/files/1/0590/2696/4593/files/Main_b13ad453-477c-4ed1-9b43-81f3345adfd6.jpg?v=1724736600',
              },
              price: {
                amount: 749.95,
                currencyCode: 'USD',
              },
              product: {
                id: '7234590834801',
                title: 'The Collection Snowboard: Liquid',
                vendor: 'Hydrogen Vendor',
                type: 'snowboard',
                untranslatedTitle: 'The Collection Snowboard: Liquid',
                url: '/products/the-collection-snowboard-liquid?variant=41327143321713',
              },
              sku: '',
              title: null,
              untranslatedTitle: null,
            },
            quantity: 1,
          },
        },
        context: { userAgent: 'Mozilla/5.0' },
        name: 'add_to_cart',
      };
      const message = productToCartEventBuilder(inputEvent);
      expect(message).toBeInstanceOf(Message);
      expect(message.properties).toEqual({
        brand: 'Hydrogen Vendor',
        category: 'snowboard',
        image_url:
          'https://cdn.shopify.com/s/files/1/0590/2696/4593/files/Main_b13ad453-477c-4ed1-9b43-81f3345adfd6.jpg?v=1724736600',
        name: null,
        price: 749.95,
        product_id: '7234590834801',
        quantity: 1,
        sku: '',
        url: '/products/the-collection-snowboard-liquid?variant=41327143321713',
        variant: 'The Collection Snowboard: Liquid',
      });
      expect(message.context).toEqual({ userAgent: 'Mozilla/5.0' });
    });
  });

  describe('checkoutEventBuilder', () => {
    it('should build a checkout event message', () => {
      const inputEvent = {
        data: {
          checkout: {
            buyerAcceptsEmailMarketing: false,
            buyerAcceptsSmsMarketing: false,
            attributes: [],
            token: '5f7028e0bd5225c17b24bdaa0c09f914',
            currencyCode: 'USD',
            discountApplications: [],
            discountsAmount: {
              amount: 0,
              currencyCode: 'USD',
            },
            email: '',
            phone: '',
            lineItems: [
              {
                discountAllocations: [],
                id: '41327143321713',
                quantity: 2,
                title: 'The Collection Snowboard: Liquid',
                variant: {
                  id: '41327143321713',
                  image: {
                    src: 'https://cdn.shopify.com/s/files/1/0590/2696/4593/files/Main_b13ad453-477c-4ed1-9b43-81f3345adfd6_64x64.jpg?v=1724736600',
                  },
                  price: {
                    amount: 749.95,
                    currencyCode: 'USD',
                  },
                  product: {
                    id: '7234590834801',
                    title: 'The Collection Snowboard: Liquid',
                    vendor: 'Hydrogen Vendor',
                    type: 'snowboard',
                    untranslatedTitle: 'The Collection Snowboard: Liquid',
                    url: '/products/the-collection-snowboard-liquid',
                  },
                  sku: null,
                  title: null,
                  untranslatedTitle: null,
                },
                finalLinePrice: {
                  amount: 1499.9,
                  currencyCode: 'USD',
                },
                sellingPlanAllocation: null,
                properties: [],
              },
              {
                discountAllocations: [],
                id: '41327143157873',
                quantity: 2,
                title: 'The Multi-managed Snowboard',
                variant: {
                  id: '41327143157873',
                  image: {
                    src: 'https://cdn.shopify.com/s/files/1/0590/2696/4593/files/Main_9129b69a-0c7b-4f66-b6cf-c4222f18028a_64x64.jpg?v=1724736597',
                  },
                  price: {
                    amount: 629.95,
                    currencyCode: 'USD',
                  },
                  product: {
                    id: '7234590736497',
                    title: 'The Multi-managed Snowboard',
                    vendor: 'Multi-managed Vendor',
                    type: 'snowboard',
                    untranslatedTitle: 'The Multi-managed Snowboard',
                    url: '/products/the-multi-managed-snowboard',
                  },
                  sku: 'sku-managed-1',
                  title: null,
                  untranslatedTitle: null,
                },
                finalLinePrice: {
                  amount: 1259.9,
                  currencyCode: 'USD',
                },
                sellingPlanAllocation: null,
                properties: [],
              },
            ],
            localization: {
              country: {
                isoCode: 'US',
              },
              language: {
                isoCode: 'en-US',
              },
              market: {
                id: 'gid://shopify/Market/23505895537',
                handle: 'us',
              },
            },
            order: {
              id: null,
              customer: {
                id: null,
                isFirstOrder: null,
              },
            },
            delivery: {
              selectedDeliveryOptions: [],
            },
            subtotalPrice: {
              amount: 2759.8,
              currencyCode: 'USD',
            },
            shippingLine: {
              price: {
                amount: 0,
                currencyCode: 'USD',
              },
            },
            smsMarketingPhone: null,
            totalTax: {
              amount: 0,
              currencyCode: 'USD',
            },
            totalPrice: {
              amount: 2759.8,
              currencyCode: 'USD',
            },
            transactions: [],
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
          {
            brand: 'Hydrogen Vendor',
            category: 'snowboard',
            image_url:
              'https://cdn.shopify.com/s/files/1/0590/2696/4593/files/Main_b13ad453-477c-4ed1-9b43-81f3345adfd6_64x64.jpg?v=1724736600',
            name: 'The Collection Snowboard: Liquid',
            price: 749.95,
            product_id: '7234590834801',
            quantity: 2,
            sku: null,
            url: '/products/the-collection-snowboard-liquid',
            variant: 'The Collection Snowboard: Liquid',
          },
          {
            brand: 'Multi-managed Vendor',
            category: 'snowboard',
            image_url:
              'https://cdn.shopify.com/s/files/1/0590/2696/4593/files/Main_9129b69a-0c7b-4f66-b6cf-c4222f18028a_64x64.jpg?v=1724736597',
            name: 'The Multi-managed Snowboard',
            price: 629.95,
            product_id: '7234590736497',
            quantity: 2,
            sku: 'sku-managed-1',
            url: '/products/the-multi-managed-snowboard',
            variant: 'The Multi-managed Snowboard',
          },
        ],
        order_id: null,
        checkout_id: '5f7028e0bd5225c17b24bdaa0c09f914',
        total: 2759.8,
        currency: 'USD',
        discount: 0,
        shipping: 0,
        revenue: 2759.8,
        value: 2759.8,
        tax: 0,
      });
      expect(message.context).toEqual({ userAgent: 'Mozilla/5.0' });
    });
  });

  describe('checkoutStepEventBuilder', () => {
    it('should build a checkout step event message', () => {
      const inputEvent = {
        data: {
          checkout: {
            buyerAcceptsEmailMarketing: false,
            buyerAcceptsSmsMarketing: false,
            attributes: [],
            billingAddress: {
              address1: null,
              address2: null,
              city: null,
              country: 'US',
              countryCode: 'US',
              firstName: null,
              lastName: null,
              phone: null,
              province: null,
              provinceCode: null,
              zip: null,
            },
            token: '5f7028e0bd5225c17b24bdaa0c09f914',
            currencyCode: 'USD',
            discountApplications: [],
            discountsAmount: {
              amount: 0,
              currencyCode: 'USD',
            },
            email: 'test-user@sampleemail.com',
            phone: '',
            lineItems: [
              {
                discountAllocations: [],
                id: '41327143321713',
                quantity: 2,
                title: 'The Collection Snowboard: Liquid',
                variant: {
                  id: '41327143321713',
                  image: {
                    src: 'https://cdn.shopify.com/s/files/1/0590/2696/4593/files/Main_b13ad453-477c-4ed1-9b43-81f3345adfd6_64x64.jpg?v=1724736600',
                  },
                  price: {
                    amount: 749.95,
                    currencyCode: 'USD',
                  },
                  product: {
                    id: '7234590834801',
                    title: 'The Collection Snowboard: Liquid',
                    vendor: 'Hydrogen Vendor',
                    type: 'snowboard',
                    untranslatedTitle: 'The Collection Snowboard: Liquid',
                    url: '/products/the-collection-snowboard-liquid',
                  },
                  sku: null,
                  title: null,
                  untranslatedTitle: null,
                },
                finalLinePrice: {
                  amount: 1499.9,
                  currencyCode: 'USD',
                },
                sellingPlanAllocation: null,
                properties: [],
              },
              {
                discountAllocations: [],
                id: '41327143157873',
                quantity: 2,
                title: 'The Multi-managed Snowboard',
                variant: {
                  id: '41327143157873',
                  image: {
                    src: 'https://cdn.shopify.com/s/files/1/0590/2696/4593/files/Main_9129b69a-0c7b-4f66-b6cf-c4222f18028a_64x64.jpg?v=1724736597',
                  },
                  price: {
                    amount: 629.95,
                    currencyCode: 'USD',
                  },
                  product: {
                    id: '7234590736497',
                    title: 'The Multi-managed Snowboard',
                    vendor: 'Multi-managed Vendor',
                    type: 'snowboard',
                    untranslatedTitle: 'The Multi-managed Snowboard',
                    url: '/products/the-multi-managed-snowboard',
                  },
                  sku: 'sku-managed-1',
                  title: null,
                  untranslatedTitle: null,
                },
                finalLinePrice: {
                  amount: 1259.9,
                  currencyCode: 'USD',
                },
                sellingPlanAllocation: null,
                properties: [],
              },
            ],
            localization: {
              country: {
                isoCode: 'US',
              },
              language: {
                isoCode: 'en-US',
              },
              market: {
                id: 'gid://shopify/Market/23505895537',
                handle: 'us',
              },
            },
            order: {
              id: null,
              customer: {
                id: null,
                isFirstOrder: null,
              },
            },
            delivery: {
              selectedDeliveryOptions: [
                {
                  cost: {
                    amount: 0,
                    currencyCode: 'USD',
                  },
                  costAfterDiscounts: {
                    amount: 0,
                    currencyCode: 'USD',
                  },
                  description: null,
                  handle: '5f7028e0bd5225c17b24bdaa0c09f914-8388085074acab7e91de633521be86f0',
                  title: 'Economy',
                  type: 'shipping',
                },
              ],
            },
            shippingAddress: {
              address1: 'Queens Center',
              address2: null,
              city: 'Elmhurst',
              country: 'US',
              countryCode: 'US',
              firstName: 'test',
              lastName: 'user',
              phone: null,
              province: 'NY',
              provinceCode: 'NY',
              zip: '11373',
            },
            subtotalPrice: {
              amount: 2759.8,
              currencyCode: 'USD',
            },
            shippingLine: {
              price: {
                amount: 0,
                currencyCode: 'USD',
              },
            },
            smsMarketingPhone: null,
            totalTax: {
              amount: 0,
              currencyCode: 'USD',
            },
            totalPrice: {
              amount: 2759.8,
              currencyCode: 'USD',
            },
            transactions: [],
          },
        },
        context: { userAgent: 'Mozilla/5.0' },
        name: 'checkout_step',
      };
      const message = checkoutStepEventBuilder(inputEvent);
      expect(message).toBeInstanceOf(Message);
      expect(message.properties).toEqual({
        attributes: [],
        billingAddress: {
          address1: null,
          address2: null,
          city: null,
          country: 'US',
          countryCode: 'US',
          firstName: null,
          lastName: null,
          phone: null,
          province: null,
          provinceCode: null,
          zip: null,
        },
        buyerAcceptsEmailMarketing: false,
        buyerAcceptsSmsMarketing: false,
        currencyCode: 'USD',
        delivery: {
          selectedDeliveryOptions: [
            {
              cost: {
                amount: 0,
                currencyCode: 'USD',
              },
              costAfterDiscounts: {
                amount: 0,
                currencyCode: 'USD',
              },
              description: null,
              handle: '5f7028e0bd5225c17b24bdaa0c09f914-8388085074acab7e91de633521be86f0',
              title: 'Economy',
              type: 'shipping',
            },
          ],
        },
        discountApplications: [],
        discountsAmount: {
          amount: 0,
          currencyCode: 'USD',
        },
        email: 'test-user@sampleemail.com',
        lineItems: [
          {
            discountAllocations: [],
            finalLinePrice: {
              amount: 1499.9,
              currencyCode: 'USD',
            },
            id: '41327143321713',
            properties: [],
            quantity: 2,
            sellingPlanAllocation: null,
            title: 'The Collection Snowboard: Liquid',
            variant: {
              id: '41327143321713',
              image: {
                src: 'https://cdn.shopify.com/s/files/1/0590/2696/4593/files/Main_b13ad453-477c-4ed1-9b43-81f3345adfd6_64x64.jpg?v=1724736600',
              },
              price: {
                amount: 749.95,
                currencyCode: 'USD',
              },
              product: {
                id: '7234590834801',
                title: 'The Collection Snowboard: Liquid',
                type: 'snowboard',
                untranslatedTitle: 'The Collection Snowboard: Liquid',
                url: '/products/the-collection-snowboard-liquid',
                vendor: 'Hydrogen Vendor',
              },
              sku: null,
              title: null,
              untranslatedTitle: null,
            },
          },
          {
            discountAllocations: [],
            finalLinePrice: {
              amount: 1259.9,
              currencyCode: 'USD',
            },
            id: '41327143157873',
            properties: [],
            quantity: 2,
            sellingPlanAllocation: null,
            title: 'The Multi-managed Snowboard',
            variant: {
              id: '41327143157873',
              image: {
                src: 'https://cdn.shopify.com/s/files/1/0590/2696/4593/files/Main_9129b69a-0c7b-4f66-b6cf-c4222f18028a_64x64.jpg?v=1724736597',
              },
              price: {
                amount: 629.95,
                currencyCode: 'USD',
              },
              product: {
                id: '7234590736497',
                title: 'The Multi-managed Snowboard',
                type: 'snowboard',
                untranslatedTitle: 'The Multi-managed Snowboard',
                url: '/products/the-multi-managed-snowboard',
                vendor: 'Multi-managed Vendor',
              },
              sku: 'sku-managed-1',
              title: null,
              untranslatedTitle: null,
            },
          },
        ],
        localization: {
          country: {
            isoCode: 'US',
          },
          language: {
            isoCode: 'en-US',
          },
          market: {
            handle: 'us',
            id: 'gid://shopify/Market/23505895537',
          },
        },
        order: {
          customer: {
            id: null,
            isFirstOrder: null,
          },
          id: null,
        },
        phone: '',
        shippingAddress: {
          address1: 'Queens Center',
          address2: null,
          city: 'Elmhurst',
          country: 'US',
          countryCode: 'US',
          firstName: 'test',
          lastName: 'user',
          phone: null,
          province: 'NY',
          provinceCode: 'NY',
          zip: '11373',
        },
        shippingLine: {
          price: {
            amount: 0,
            currencyCode: 'USD',
          },
        },
        smsMarketingPhone: null,
        subtotalPrice: {
          amount: 2759.8,
          currencyCode: 'USD',
        },
        token: '5f7028e0bd5225c17b24bdaa0c09f914',
        totalPrice: {
          amount: 2759.8,
          currencyCode: 'USD',
        },
        totalTax: {
          amount: 0,
          currencyCode: 'USD',
        },
        transactions: [],
      });
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
