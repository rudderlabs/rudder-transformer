import { overrideDestination } from '../../../testUtils';
import {
  destType,
  destTypeInUpperCase,
  advertiserId,
  trackerId,
  sampleDestination,
  sampleContextForConversion,
  integrationObject,
} from '../common';

export const data = [
  {
    name: destType,
    description: 'Missing advertiser ID in the config',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'custom event abc',
              properties: {
                key1: 'value1',
                value: 25,
                product_id: 'prd123',
                key2: true,
                test: 'test123',
              },
            },
            destination: overrideDestination(sampleDestination, { advertiserId: '' }),
            metadata: {
              jobId: 1,
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error:
              'Advertiser ID is not present. Aborting: Workflow: procWorkflow, Step: validateConfig, ChildStep: undefined, OriginalError: Advertiser ID is not present. Aborting',
            statTags: {
              destType: destTypeInUpperCase,
              implementation: 'cdkV2',
              feature: 'processor',
              module: 'destination',
              errorCategory: 'dataValidation',
              errorType: 'configuration',
            },
            metadata: {
              jobId: 1,
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: destType,
    description: 'Tracker id is not present',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'custom event abc',
              properties: {
                key1: 'value1',
                value: 25,
                product_id: 'prd123',
                key2: true,
                test: 'test123',
              },
            },
            destination: overrideDestination(sampleDestination, { trackerId: '' }),
            metadata: {
              jobId: 1,
            },
          },
        ],
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error:
              'Tracking Tag ID is not present. Aborting: Workflow: procWorkflow, Step: validateConfig, ChildStep: undefined, OriginalError: Tracking Tag ID is not present. Aborting',
            statTags: {
              destType: destTypeInUpperCase,
              implementation: 'cdkV2',
              feature: 'processor',
              module: 'destination',
              errorCategory: 'dataValidation',
              errorType: 'configuration',
            },
            metadata: {
              jobId: 1,
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: destType,
    description: 'Unsupported event type',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'identify',
              context: {
                traits: {
                  name: 'John Doe',
                  email: 'johndoe@gmail.com',
                  age: 25,
                },
              },
            },
            destination: sampleDestination,
            metadata: {
              jobId: 1,
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error:
              'Event type identify is not supported: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: Event type identify is not supported',
            statTags: {
              destType: destTypeInUpperCase,
              implementation: 'cdkV2',
              feature: 'processor',
              module: 'destination',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
            },
            metadata: {
              jobId: 1,
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: destType,
    description: 'Product Added',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'Product Added',
              messageId: 'messageId123',
              context: sampleContextForConversion,
              properties: {
                product_id: '622c6f5d5cf86a4c77358033',
                sku: '8472-998-0112',
                category: 'Games',
                name: 'Cones of Dunshire',
                brand: 'Wyatt Games',
                variant: 'expansion pack',
                price: 49.99,
                quantity: 5,
                coupon: 'PREORDER15',
                position: 1,
                url: 'https://www.website.com/product/path',
                image_url: 'https://www.website.com/product/path.webp',
                key1: 'value1',
              },
              integrations: integrationObject,
            },
            destination: overrideDestination(sampleDestination, {
              customProperties: [
                {
                  rudderProperty: 'properties.key1',
                  tradeDeskProperty: 'td1',
                },
                {
                  rudderProperty: 'properties.key2',
                  tradeDeskProperty: 'td2',
                },
              ],
            }),
            metadata: {
              jobId: 1,
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://insight.adsrvr.org/track/realtimeconversion',
              headers: { 'Content-Type': 'application/json' },
              params: {},
              body: {
                JSON: {
                  data: [
                    {
                      tracker_id: trackerId,
                      adv: advertiserId,
                      event_name: 'addtocart',
                      value: 249.95000000000002,
                      adid: 'test-daid',
                      adid_type: 'DAID',
                      client_ip: '0.0.0.0',
                      referrer_url: 'https://docs.rudderstack.com/destinations/trade_desk',
                      imp: 'messageId123',
                      items: [
                        {
                          item_code: '622c6f5d5cf86a4c77358033',
                          name: 'Cones of Dunshire',
                          qty: 5,
                          price: 49.99,
                        },
                      ],
                      td1: 'value1',
                      category: 'Games',
                      brand: 'Wyatt Games',
                      variant: 'expansion pack',
                      coupon: 'PREORDER15',
                      position: 1,
                      url: 'https://www.website.com/product/path',
                      image_url: 'https://www.website.com/product/path.webp',
                      data_processing_option: {
                        policies: ['LDU'],
                        region: 'US-CA',
                      },
                      privacy_settings: [
                        {
                          privacy_type: 'GDPR',
                          is_applicable: 1,
                          consent_string: 'ok',
                        },
                      ],
                    },
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              jobId: 1,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: destType,
    description: 'Product Viewed',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'Product Viewed',
              properties: {
                product_id: '622c6f5d5cf86a4c77358033',
                sku: '8472-998-0112',
                category: 'Games',
                name: 'Cones of Dunshire',
                brand: 'Wyatt Games',
                variant: 'expansion pack',
                price: 49.99,
                quantity: 5,
                coupon: 'PREORDER15',
                currency: 'USD',
                position: 1,
                url: 'https://www.website.com/product/path',
                image_url: 'https://www.website.com/product/path.webp',
              },
            },
            destination: sampleDestination,
            metadata: {
              jobId: 1,
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://insight.adsrvr.org/track/realtimeconversion',
              headers: { 'Content-Type': 'application/json' },
              params: {},
              body: {
                JSON: {
                  data: [
                    {
                      tracker_id: trackerId,
                      adv: advertiserId,
                      currency: 'USD',
                      event_name: 'viewitem',
                      value: 249.95000000000002,
                      items: [
                        {
                          item_code: '622c6f5d5cf86a4c77358033',
                          name: 'Cones of Dunshire',
                          qty: 5,
                          price: 49.99,
                        },
                      ],
                      category: 'Games',
                      brand: 'Wyatt Games',
                      variant: 'expansion pack',
                      coupon: 'PREORDER15',
                      position: 1,
                      url: 'https://www.website.com/product/path',
                      image_url: 'https://www.website.com/product/path.webp',
                    },
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              jobId: 1,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: destType,
    description: 'Product Added to Wishlist',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'Product Added to Wishlist',
              properties: {
                wishlist_id: '74fkdjfl0jfdkdj29j030',
                wishlist_name: 'New Games',
                product_id: '622c6f5d5cf86a4c77358033',
                sku: '8472-998-0112',
                category: 'Games',
                name: 'Cones of Dunshire',
                brand: 'Wyatt Games',
                variant: 'expansion pack',
                price: 49.99,
                quantity: 1,
                coupon: 'PREORDER15',
                position: 1,
                url: 'https://www.site.com/product/path',
                image_url: 'https://www.site.com/product/path.jpg',
              },
            },
            destination: sampleDestination,
            metadata: {
              jobId: 1,
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://insight.adsrvr.org/track/realtimeconversion',
              headers: { 'Content-Type': 'application/json' },
              params: {},
              body: {
                JSON: {
                  data: [
                    {
                      tracker_id: trackerId,
                      adv: advertiserId,
                      event_name: 'wishlistitem',
                      value: 49.99,
                      items: [
                        {
                          item_code: '622c6f5d5cf86a4c77358033',
                          name: 'Cones of Dunshire',
                          qty: 1,
                          price: 49.99,
                        },
                      ],
                      wishlist_id: '74fkdjfl0jfdkdj29j030',
                      wishlist_name: 'New Games',
                      category: 'Games',
                      brand: 'Wyatt Games',
                      variant: 'expansion pack',
                      coupon: 'PREORDER15',
                      position: 1,
                      url: 'https://www.site.com/product/path',
                      image_url: 'https://www.site.com/product/path.jpg',
                    },
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              jobId: 1,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: destType,
    description: 'Cart Viewed',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'Cart Viewed',
              properties: {
                cart_id: '6b2c6f5aecf86a4ae77358ae3',
                products: [
                  {
                    product_id: '622c6f5d5cf86a4c77358033',
                    sku: '8472-998-0112',
                    name: 'Cones of Dunshire',
                    price: 49.99,
                    position: 5,
                    category: 'Games',
                    url: 'https://www.website.com/product/path',
                    image_url: 'https://www.website.com/product/path.jpg',
                  },
                  {
                    product_id: '577c6f5d5cf86a4c7735ba03',
                    sku: '3309-483-2201',
                    name: 'Five Crowns',
                    price: 5.99,
                    position: 2,
                    category: 'Games',
                  },
                ],
              },
            },
            destination: sampleDestination,
            metadata: {
              jobId: 1,
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://insight.adsrvr.org/track/realtimeconversion',
              headers: { 'Content-Type': 'application/json' },
              params: {},
              body: {
                JSON: {
                  data: [
                    {
                      tracker_id: trackerId,
                      adv: advertiserId,
                      event_name: 'viewcart',
                      items: [
                        {
                          item_code: '622c6f5d5cf86a4c77358033',
                          name: 'Cones of Dunshire',
                          price: 49.99,
                          position: 5,
                          category: 'Games',
                          url: 'https://www.website.com/product/path',
                          image_url: 'https://www.website.com/product/path.jpg',
                        },
                        {
                          item_code: '577c6f5d5cf86a4c7735ba03',
                          name: 'Five Crowns',
                          price: 5.99,
                          position: 2,
                          category: 'Games',
                        },
                      ],
                      cart_id: '6b2c6f5aecf86a4ae77358ae3',
                    },
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              jobId: 1,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: destType,
    description: 'Checkout Started',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'Checkout Started',
              properties: {
                order_id: '40684e8f0eaf000000000000',
                affiliation: 'Vandelay Games',
                value: 52,
                revenue: 50.0,
                shipping: 4,
                tax: 3,
                discount: 5,
                coupon: 'NEWCUST5',
                currency: 'USD',
                products: [
                  {
                    product_id: '622c6f5d5cf86a4c77358033',
                    sku: '8472-998-0112',
                    name: 'Cones of Dunshire',
                    price: 40,
                    position: 1,
                    category: 'Games',
                    url: 'https://www.website.com/product/path',
                    image_url: 'https://www.website.com/product/path.jpg',
                  },
                  {
                    product_id: '577c6f5d5cf86a4c7735ba03',
                    sku: '3309-483-2201',
                    name: 'Five Crowns',
                    price: 5,
                    position: 2,
                    category: 'Games',
                  },
                ],
              },
            },
            destination: sampleDestination,
            metadata: {
              jobId: 1,
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://insight.adsrvr.org/track/realtimeconversion',
              headers: { 'Content-Type': 'application/json' },
              params: {},
              body: {
                JSON: {
                  data: [
                    {
                      tracker_id: trackerId,
                      adv: advertiserId,
                      currency: 'USD',
                      order_id: '40684e8f0eaf000000000000',
                      event_name: 'startcheckout',
                      value: 50,
                      items: [
                        {
                          item_code: '622c6f5d5cf86a4c77358033',
                          name: 'Cones of Dunshire',
                          price: 40,
                          position: 1,
                          category: 'Games',
                          url: 'https://www.website.com/product/path',
                          image_url: 'https://www.website.com/product/path.jpg',
                        },
                        {
                          item_code: '577c6f5d5cf86a4c7735ba03',
                          name: 'Five Crowns',
                          price: 5,
                          position: 2,
                          category: 'Games',
                        },
                      ],
                      affiliation: 'Vandelay Games',
                      shipping: 4,
                      tax: 3,
                      discount: 5,
                      coupon: 'NEWCUST5',
                    },
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              jobId: 1,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: destType,
    description: 'Order Completed',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'Order Completed',
              properties: {
                checkout_id: '70324a1f0eaf000000000000',
                order_id: '40684e8f0eaf000000000000',
                affiliation: 'Vandelay Games',
                total: 52.0,
                subtotal: 45.0,
                revenue: 50.0,
                shipping: 4.0,
                tax: 3.0,
                discount: 5.0,
                coupon: 'NEWCUST5',
                currency: 'USD',
                products: [
                  {
                    product_id: '622c6f5d5cf86a4c77358033',
                    sku: '8472-998-0112',
                    name: 'Cones of Dunshire',
                    price: 40,
                    position: 1,
                    category: 'Games',
                    url: 'https://www.website.com/product/path',
                    image_url: 'https://www.website.com/product/path.jpg',
                  },
                  {
                    product_id: '577c6f5d5cf86a4c7735ba03',
                    sku: '3309-483-2201',
                    name: 'Five Crowns',
                    price: 5,
                    position: 2,
                    category: 'Games',
                  },
                ],
              },
            },
            destination: sampleDestination,
            metadata: {
              jobId: 1,
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://insight.adsrvr.org/track/realtimeconversion',
              headers: { 'Content-Type': 'application/json' },
              params: {},
              body: {
                JSON: {
                  data: [
                    {
                      tracker_id: trackerId,
                      adv: advertiserId,
                      currency: 'USD',
                      order_id: '40684e8f0eaf000000000000',
                      event_name: 'purchase',
                      value: 50,
                      items: [
                        {
                          item_code: '622c6f5d5cf86a4c77358033',
                          name: 'Cones of Dunshire',
                          price: 40,
                          position: 1,
                          category: 'Games',
                          url: 'https://www.website.com/product/path',
                          image_url: 'https://www.website.com/product/path.jpg',
                        },
                        {
                          item_code: '577c6f5d5cf86a4c7735ba03',
                          name: 'Five Crowns',
                          price: 5,
                          position: 2,
                          category: 'Games',
                        },
                      ],
                      checkout_id: '70324a1f0eaf000000000000',
                      affiliation: 'Vandelay Games',
                      total: 52.0,
                      subtotal: 45.0,
                      shipping: 4.0,
                      tax: 3.0,
                      discount: 5.0,
                      coupon: 'NEWCUST5',
                    },
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              jobId: 1,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: destType,
    description: 'Custom event',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'custom event abc',
              properties: {
                key1: 'value1',
                value: 25,
                product_id: 'prd123',
                key2: true,
                test: 'test123',
              },
            },
            destination: overrideDestination(sampleDestination, {
              customProperties: [
                {
                  rudderProperty: 'properties.key1',
                  tradeDeskProperty: 'td1',
                },
                {
                  rudderProperty: 'properties.key2',
                  tradeDeskProperty: 'td2',
                },
              ],
            }),
            metadata: {
              jobId: 1,
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://insight.adsrvr.org/track/realtimeconversion',
              headers: { 'Content-Type': 'application/json' },
              params: {},
              body: {
                JSON: {
                  data: [
                    {
                      tracker_id: trackerId,
                      adv: advertiserId,
                      event_name: 'custom event abc',
                      value: 25,
                      product_id: 'prd123',
                      test: 'test123',
                      td1: 'value1',
                      td2: true,
                    },
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              jobId: 1,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: destType,
    description: 'Mapped standard trade desk event',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              event: 'custom event abc',
              properties: {
                key1: 'value1',
                value: 25,
                product_id: 'prd123',
                key2: true,
                test: 'test123',
              },
            },
            destination: overrideDestination(sampleDestination, {
              eventsMapping: [
                {
                  from: 'custom event abc',
                  to: 'direction',
                },
              ],
            }),
            metadata: {
              jobId: 1,
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://insight.adsrvr.org/track/realtimeconversion',
              headers: { 'Content-Type': 'application/json' },
              params: {},
              body: {
                JSON: {
                  data: [
                    {
                      tracker_id: trackerId,
                      adv: advertiserId,
                      event_name: 'direction',
                      value: 25,
                      product_id: 'prd123',
                      test: 'test123',
                      key1: 'value1',
                      key2: true,
                    },
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              jobId: 1,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
];
