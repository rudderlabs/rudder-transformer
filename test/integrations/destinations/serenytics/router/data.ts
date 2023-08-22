export const data = [
  {
    name: 'serenytics',
    description: 'Successfull Track Call ',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination: {
                Config: {
                  storageUrlAlias:
                    'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                  storageUrlGroup:
                    'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                  storageUrlIdentify:
                    'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                  storageUrlPage:
                    'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                  storageUrlScreen:
                    'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                  storageUrlTrack:
                    'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                },
              },
              metadata: {
                jobId: 1,
              },
              message: {
                event: 'New Alert',
                type: 'track',
                sentAt: '2021-01-03T17:02:53.195Z',
                channel: 'web',
                properties: {
                  message: 'Please check the alert',
                  brand: 'Zara',
                  price: '12000',
                },
                context: {
                  os: {
                    name: '',
                    version: '',
                  },
                  app: {
                    name: 'RudderLabs JavaScript SDK',
                    build: '1.0.0',
                    version: '1.1.11',
                    namespace: 'com.rudderlabs.javascript',
                  },
                  locale: 'en-US',
                  screen: {
                    density: 2,
                  },
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.1.11',
                  },
                  campaign: {},
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
                },
                rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
                messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
                anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
                originalTimestamp: '2021-01-03T17:02:53.193Z',
              },
            },
          ],
          destType: 'serenytics',
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint:
                    'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                  headers: {},
                  params: {},
                  body: {
                    JSON: {
                      id: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
                      anonymous_id: '97c46c81-3140-456d-b2a9-690d70aaca35',
                      event: 'New Alert',
                      sent_at: '2021-01-03T17:02:53.195Z',
                      original_timestamp: '2021-01-03T17:02:53.193Z',
                      timestamp: '2021-01-03T17:02:53.193Z',
                      price: '12000',
                      property_message: 'Please check the alert',
                      property_brand: 'Zara',
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
              ],
              metadata: [
                {
                  jobId: 1,
                },
              ],
              batched: false,
              statusCode: 200,
              destination: {
                Config: {
                  storageUrlAlias:
                    'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                  storageUrlGroup:
                    'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                  storageUrlIdentify:
                    'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                  storageUrlPage:
                    'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                  storageUrlScreen:
                    'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                  storageUrlTrack:
                    'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                },
              },
            },
          ],
        },
      },
    },
  },
  {
    name: 'serenytics',
    description: 'Succesfull Track Call with eventToStorageUrlMap from Config',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination: {
                Config: {
                  storageUrlAlias:
                    'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                  storageUrlGroup:
                    'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                  storageUrlIdentify:
                    'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                  storageUrlPage:
                    'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                  storageUrlScreen:
                    'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                  storageUrlTrack:
                    'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                  eventToStorageUrlMap: [
                    {
                      from: 'Order Completed',
                      to: 'https://api.serenytics.com/api/data_source/b646…/push/ad051d45f10a0c11a50f5c20af838e39ea9dcf12',
                    },
                    {
                      from: 'Order Completed',
                      to: 'https://api.serenytics.com/api/data_source/0714…/push/f48540d9b51fd5c88dffaad4e34cd0b56a525981',
                    },
                    {
                      from: 'Add to Cart',
                      to: 'https://api.serenytics.com/api/data_source/f62c…/push/75c48822ca582a1322aa1d7586ce374a4736c313',
                    },
                  ],
                },
              },
              metadata: {
                jobId: 2,
              },
              message: {
                event: 'Order Completed',
                type: 'track',
                sentAt: '2021-01-03T17:02:53.195Z',
                channel: 'web',
                properties: {
                  message: 'Please check the alert',
                  brand: 'Zara',
                  price: '12000',
                },
                context: {
                  os: {
                    name: '',
                    version: '',
                  },
                  app: {
                    name: 'RudderLabs JavaScript SDK',
                    build: '1.0.0',
                    version: '1.1.11',
                    namespace: 'com.rudderlabs.javascript',
                  },
                  locale: 'en-US',
                  screen: {
                    density: 2,
                  },
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.1.11',
                  },
                  campaign: {},
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
                },
                rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
                messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
                anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
                originalTimestamp: '2021-01-03T17:02:53.193Z',
              },
            },
          ],
          destType: 'serenytics',
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint:
                    'https://api.serenytics.com/api/data_source/b646…/push/ad051d45f10a0c11a50f5c20af838e39ea9dcf12',
                  headers: {},
                  params: {},
                  body: {
                    JSON: {
                      id: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
                      anonymous_id: '97c46c81-3140-456d-b2a9-690d70aaca35',
                      event: 'Order Completed',
                      sent_at: '2021-01-03T17:02:53.195Z',
                      original_timestamp: '2021-01-03T17:02:53.193Z',
                      timestamp: '2021-01-03T17:02:53.193Z',
                      price: '12000',
                      property_message: 'Please check the alert',
                      property_brand: 'Zara',
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint:
                    'https://api.serenytics.com/api/data_source/0714…/push/f48540d9b51fd5c88dffaad4e34cd0b56a525981',
                  headers: {},
                  params: {},
                  body: {
                    JSON: {
                      id: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
                      anonymous_id: '97c46c81-3140-456d-b2a9-690d70aaca35',
                      event: 'Order Completed',
                      sent_at: '2021-01-03T17:02:53.195Z',
                      original_timestamp: '2021-01-03T17:02:53.193Z',
                      timestamp: '2021-01-03T17:02:53.193Z',
                      price: '12000',
                      property_message: 'Please check the alert',
                      property_brand: 'Zara',
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint:
                    'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                  headers: {},
                  params: {},
                  body: {
                    JSON: {
                      id: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
                      anonymous_id: '97c46c81-3140-456d-b2a9-690d70aaca35',
                      event: 'Order Completed',
                      sent_at: '2021-01-03T17:02:53.195Z',
                      original_timestamp: '2021-01-03T17:02:53.193Z',
                      timestamp: '2021-01-03T17:02:53.193Z',
                      price: '12000',
                      property_message: 'Please check the alert',
                      property_brand: 'Zara',
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
              ],
              metadata: [
                {
                  jobId: 2,
                },
              ],
              batched: false,
              statusCode: 200,
              destination: {
                Config: {
                  storageUrlAlias:
                    'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                  storageUrlGroup:
                    'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                  storageUrlIdentify:
                    'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                  storageUrlPage:
                    'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                  storageUrlScreen:
                    'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                  storageUrlTrack:
                    'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                  eventToStorageUrlMap: [
                    {
                      from: 'Order Completed',
                      to: 'https://api.serenytics.com/api/data_source/b646…/push/ad051d45f10a0c11a50f5c20af838e39ea9dcf12',
                    },
                    {
                      from: 'Order Completed',
                      to: 'https://api.serenytics.com/api/data_source/0714…/push/f48540d9b51fd5c88dffaad4e34cd0b56a525981',
                    },
                    {
                      from: 'Add to Cart',
                      to: 'https://api.serenytics.com/api/data_source/f62c…/push/75c48822ca582a1322aa1d7586ce374a4736c313',
                    },
                  ],
                },
              },
            },
          ],
        },
      },
    },
  },
  {
    name: 'serenytics',
    description: 'Succesfull Identify Call with eventToStorageUrlMap from Config',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination: {
                Config: {
                  storageUrlAlias:
                    'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                  storageUrlGroup:
                    'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                  storageUrlIdentify:
                    'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                  storageUrlPage:
                    'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                  storageUrlScreen:
                    'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                  storageUrlTrack:
                    'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                  eventToStorageUrlMap: [
                    {
                      from: 'Order Completed',
                      to: 'https://api.serenytics.com/api/data_source/b646…/push/ad051d45f10a0c11a50f5c20af838e39ea9dcf12',
                    },
                    {
                      from: 'Order Completed',
                      to: 'https://api.serenytics.com/api/data_source/0714…/push/f48540d9b51fd5c88dffaad4e34cd0b56a525981',
                    },
                    {
                      from: 'Add to Cart',
                      to: 'https://api.serenytics.com/api/data_source/f62c…/push/75c48822ca582a1322aa1d7586ce374a4736c313',
                    },
                  ],
                },
              },
              metadata: {
                jobId: 3,
              },
              message: {
                messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
                originalTimestamp: '2022-06-22T10:57:58Z',
                anonymousId: 'ea5cfab2-3961-4d8a-8187-3d1858c99099',
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.0',
                  },
                  device: {
                    advertisingId: 'T0T0T072-5e28-45a1-9eda-ce22a3e36d1a',
                    id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
                    manufacturer: 'Google',
                    model: 'AOSP on IA Emulator',
                    name: 'generic_x86_arm',
                    type: 'ios',
                    attTrackingStatus: 3,
                  },
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.0.0',
                  },
                  locale: 'en-US',
                  os: {
                    name: 'iOS',
                    version: '14.4.1',
                  },
                  screen: {
                    density: 2,
                  },
                },
                traits: {
                  email: 'testuser@google.com',
                  first_name: 'Rk',
                  last_name: 'Mishra',
                  mobileNumber: '1-926-555-9504',
                  lifecycleStageId: 71010794467,
                  phone: '9988776655',
                  owner_id: '70000090119',
                },
                type: 'identify',
                sentAt: '2022-04-22T10:57:58Z',
              },
            },
          ],
          destType: 'serenytics',
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: {
                body: {
                  XML: {},
                  FORM: {},
                  JSON: {
                    email: 'testuser@google.com',
                    sent_at: '2022-04-22T10:57:58Z',
                    user_id: 'ea5cfab2-3961-4d8a-8187-3d1858c99099',
                    last_name: 'Mishra',
                    timestamp: '2022-06-22T10:57:58Z',
                    first_name: 'Rk',
                    trait_phone: '9988776655',
                    trait_owner_id: '70000090119',
                    original_timestamp: '2022-06-22T10:57:58Z',
                    trait_mobileNumber: '1-926-555-9504',
                    trait_lifecycleStageId: 71010794467,
                  },
                  JSON_ARRAY: {},
                },
                type: 'REST',
                files: {},
                method: 'POST',
                params: {},
                headers: {},
                version: '1',
                endpoint:
                  'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
              },
              metadata: [
                {
                  jobId: 3,
                },
              ],
              batched: false,
              statusCode: 200,
              destination: {
                Config: {
                  storageUrlAlias:
                    'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                  storageUrlGroup:
                    'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                  storageUrlIdentify:
                    'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                  storageUrlPage:
                    'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                  storageUrlScreen:
                    'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                  storageUrlTrack:
                    'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                  eventToStorageUrlMap: [
                    {
                      from: 'Order Completed',
                      to: 'https://api.serenytics.com/api/data_source/b646…/push/ad051d45f10a0c11a50f5c20af838e39ea9dcf12',
                    },
                    {
                      from: 'Order Completed',
                      to: 'https://api.serenytics.com/api/data_source/0714…/push/f48540d9b51fd5c88dffaad4e34cd0b56a525981',
                    },
                    {
                      from: 'Add to Cart',
                      to: 'https://api.serenytics.com/api/data_source/f62c…/push/75c48822ca582a1322aa1d7586ce374a4736c313',
                    },
                  ],
                },
              },
            },
          ],
        },
      },
    },
  },
];
