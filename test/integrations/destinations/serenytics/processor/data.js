const data = [
  {
    name: 'serenytics',
    description: 'Track call',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
            message: {
              event: 'New Alert',
              type: 'track',
              sentAt: '2021-01-03T17:02:53.195Z',
              channel: 'web',
              properties: { message: 'Please check the alert', brand: 'Zara', price: '12000' },
              context: {
                os: { name: '', version: '' },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.11',
                  namespace: 'com.rudderlabs.javascript',
                },
                locale: 'en-US',
                screen: { density: 2 },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.1.11' },
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
        method: 'POST',
      },
      pathSuffix: '',
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
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'serenytics',
    description: 'Track call with multiple same event name',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              event: 'Order Completed',
              type: 'track',
              sentAt: '2021-01-03T17:02:53.195Z',
              channel: 'web',
              properties: { message: 'Please check the alert', brand: 'Zara', price: '12000' },
              context: {
                os: { name: '', version: '' },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.11',
                  namespace: 'com.rudderlabs.javascript',
                },
                locale: 'en-US',
                screen: { density: 2 },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.1.11' },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
              },
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              originalTimestamp: '2021-01-03T17:02:53.193Z',
            },
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
        method: 'POST',
      },
      pathSuffix: '',
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
              userId: '',
            },
            statusCode: 200,
          },
          {
            output: {
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
              userId: '',
            },
            statusCode: 200,
          },
          {
            output: {
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
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'serenytics',
    description: 'Identify call',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
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
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                locale: 'en-US',
                os: { name: 'iOS', version: '14.4.1' },
                screen: { density: 2 },
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
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
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
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'serenytics',
    description: 'Identify call with missing identify storage url',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              messageId: 'ec5481b6-a926-4d2e-b293-0b3a77c4d3be',
              originalTimestamp: '2022-06-22T10:57:58Z',
              anonymousId: 'ea5cfab2-3961-4d8a-8187-3d1858c99099',
              context: {
                locale: 'en-US',
                os: { name: 'iOS', version: '14.4.1' },
                screen: { density: 2 },
              },
              traits: { email: 'testuser@google.com', first_name: 'Rk' },
              type: 'identify',
              sentAt: '2022-04-22T10:57:58Z',
            },
            destination: {
              Config: {
                storageUrlAlias:
                  'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                storageUrlGroup:
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
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            destination: {
              Config: {
                storageUrlAlias:
                  'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                storageUrlGroup:
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
            error: 'Storage url for "IDENTIFY" is missing. Aborting!',
            statTags: {
              destType: 'SERENYTICS',
              errorCategory: 'dataValidation',
              errorType: 'configuration',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'serenytics',
    description: 'Screen call',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'screen',
              sentAt: '2021-01-03T17:02:53.195Z',
              channel: 'web',
              properties: { message: 'Please check the alert', page: 'home Page' },
              context: {
                os: { name: '', version: '' },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.11',
                  namespace: 'com.rudderlabs.javascript',
                },
                locale: 'en-US',
                screen: { density: 2 },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.1.11' },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
              },
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              originalTimestamp: '2021-01-03T17:02:53.193Z',
            },
            destination: {
              Config: {
                storageUrlAlias:
                  'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                storageUrlGroup:
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
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              body: {
                XML: {},
                FORM: {},
                JSON: {
                  sent_at: '2021-01-03T17:02:53.195Z',
                  timestamp: '2021-01-03T17:02:53.193Z',
                  anonymous_id: '97c46c81-3140-456d-b2a9-690d70aaca35',
                  property_page: 'home Page',
                  property_message: 'Please check the alert',
                  original_timestamp: '2021-01-03T17:02:53.193Z',
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
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'serenytics',
    description: 'Page Call',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'page',
              sentAt: '2021-01-03T17:02:53.195Z',
              channel: 'web',
              properties: { message: 'Please check the alert', page: 'home Page' },
              context: {
                os: { name: '', version: '' },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.11',
                  namespace: 'com.rudderlabs.javascript',
                },
                locale: 'en-US',
                screen: { density: 2 },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.1.11' },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
              },
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              originalTimestamp: '2021-01-03T17:02:53.193Z',
            },
            destination: {
              Config: {
                storageUrlAlias:
                  'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                storageUrlGroup:
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
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              body: {
                XML: {},
                FORM: {},
                JSON: {
                  sent_at: '2021-01-03T17:02:53.195Z',
                  timestamp: '2021-01-03T17:02:53.193Z',
                  anonymous_id: '97c46c81-3140-456d-b2a9-690d70aaca35',
                  property_page: 'home Page',
                  property_message: 'Please check the alert',
                  original_timestamp: '2021-01-03T17:02:53.193Z',
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
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'serenytics',
    description: 'Page call, storage url for page call is missing.',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'page',
              sentAt: '2021-01-03T17:02:53.195Z',
              channel: 'web',
              properties: { message: 'Please check the alert', page: 'home Page' },
              context: {
                os: { name: '', version: '' },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.11',
                  namespace: 'com.rudderlabs.javascript',
                },
                locale: 'en-US',
                screen: { density: 2 },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.1.11' },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
              },
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              originalTimestamp: '2021-01-03T17:02:53.193Z',
            },
            destination: {
              Config: {
                storageUrlAlias:
                  'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                storageUrlGroup:
                  'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                storageUrlScreen:
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
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            destination: {
              Config: {
                storageUrlAlias:
                  'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                storageUrlGroup:
                  'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                storageUrlScreen:
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
            error: 'Storage url for "PAGE" is missing. Aborting!',
            statTags: {
              destType: 'SERENYTICS',
              errorCategory: 'dataValidation',
              errorType: 'configuration',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'serenytics',
    description: 'Track call: event name is missing.',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
            message: {
              type: 'track',
              sentAt: '2021-01-03T17:02:53.195Z',
              channel: 'web',
              properties: { message: 'Please check the alert', brand: 'Zara', price: '12000' },
              context: {
                os: { name: '', version: '' },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.11',
                  namespace: 'com.rudderlabs.javascript',
                },
                locale: 'en-US',
                screen: { density: 2 },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.1.11' },
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
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
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
            error: 'Missing required value from "event"',
            statTags: {
              destType: 'SERENYTICS',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'serenytics',
    description: 'Track call: storage url is required for track call.',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
              },
            },
            message: {
              event: 'New Alert',
              type: 'track',
              sentAt: '2021-01-03T17:02:53.195Z',
              channel: 'web',
              properties: { message: 'Please check the alert', brand: 'Zara', price: '12000' },
              context: {
                os: { name: '', version: '' },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.11',
                  namespace: 'com.rudderlabs.javascript',
                },
                locale: 'en-US',
                screen: { density: 2 },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.1.11' },
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
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
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
              },
            },
            error: 'Storage url for "TRACK" is missing. Aborting!',
            statTags: {
              destType: 'SERENYTICS',
              errorCategory: 'dataValidation',
              errorType: 'configuration',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'serenytics',
    description: 'Track call: if storage url is not present for track call, only present for event',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
            message: {
              event: 'Order Completed',
              type: 'track',
              sentAt: '2021-01-03T17:02:53.195Z',
              channel: 'web',
              properties: { message: 'Please check the alert', brand: 'Zara', price: '12000' },
              context: {
                os: { name: '', version: '' },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.11',
                  namespace: 'com.rudderlabs.javascript',
                },
                locale: 'en-US',
                screen: { density: 2 },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.1.11' },
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
        method: 'POST',
      },
      pathSuffix: '',
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
              userId: '',
            },
            statusCode: 200,
          },
          {
            output: {
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
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'serenytics',
    description: 'Message type is not present',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
            message: {
              event: 'Order Completed',
              sentAt: '2021-01-03T17:02:53.195Z',
              channel: 'web',
              properties: { message: 'Please check the alert', brand: 'Zara', price: '12000' },
              context: {
                os: { name: '', version: '' },
                app: {
                  name: 'RudderLabs JavaScript SDK',
                  build: '1.0.0',
                  version: '1.1.11',
                  namespace: 'com.rudderlabs.javascript',
                },
                locale: 'en-US',
                screen: { density: 2 },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.1.11' },
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
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
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
            error: 'Event type is required',
            statTags: {
              destType: 'SERENYTICS',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'serenytics',
    description: 'Screen call: storage url is missing for storage call',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'screen',
              sentAt: '2021-01-03T17:02:53.195Z',
              channel: 'web',
              properties: { message: 'Please check the alert', page: 'home Page' },
              context: {
                library: { name: 'RudderLabs JavaScript SDK', version: '1.1.11' },
                campaign: {},
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
              },
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              originalTimestamp: '2021-01-03T17:02:53.193Z',
            },
            destination: {
              Config: {
                storageUrlAlias:
                  'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                storageUrlGroup:
                  'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                storageUrlPage:
                  'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                storageUrlTrack:
                  'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
              },
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            destination: {
              Config: {
                storageUrlAlias:
                  'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                storageUrlGroup:
                  'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                storageUrlPage:
                  'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                storageUrlTrack:
                  'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
              },
            },
            error: 'Storage url for "SCREEN" is missing. Aborting!',
            statTags: {
              destType: 'SERENYTICS',
              errorCategory: 'dataValidation',
              errorType: 'configuration',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'serenytics',
    description: 'Group call',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'group',
              sentAt: '2021-01-03T17:02:53.195Z',
              channel: 'web',
              groupId: 'rudder-123',
              traits: {
                name: 'Mark Twain',
                phone: '919191919191',
                numberOfEmployees: 51,
                annualRevenue: 1000,
                address: 'Red Colony',
                city: 'Colony',
                state: 'Haryana',
              },
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
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                locale: 'en-US',
                os: { name: 'iOS', version: '14.4.1' },
                screen: { density: 2 },
                traits: { email: 'testuser@google.com' },
              },
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              originalTimestamp: '2021-01-03T17:02:53.193Z',
            },
            destination: {
              Config: {
                storageUrlAlias:
                  'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                storageUrlGroup:
                  'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                storageUrlPage:
                  'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                storageUrlTrack:
                  'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
              },
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              body: {
                XML: {},
                FORM: {},
                JSON: {
                  id: 'rudder-123',
                  sent_at: '2021-01-03T17:02:53.195Z',
                  timestamp: '2021-01-03T17:02:53.193Z',
                  trait_city: 'Colony',
                  trait_name: 'Mark Twain',
                  trait_email: 'testuser@google.com',
                  trait_phone: '919191919191',
                  trait_state: 'Haryana',
                  trait_address: 'Red Colony',
                  original_timestamp: '2021-01-03T17:02:53.193Z',
                  trait_annualRevenue: 1000,
                  trait_numberOfEmployees: 51,
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
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'serenytics',
    description: 'Group call: its check custom payload',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'group',
              sentAt: '2021-01-03T17:02:53.195Z',
              channel: 'web',
              groupId: 'rudder-123',
              traits: {},
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
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                locale: 'en-US',
                os: { name: 'iOS', version: '14.4.1' },
                screen: { density: 2 },
                traits: { email: 'testuser@google.com' },
              },
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              originalTimestamp: '2021-01-03T17:02:53.193Z',
            },
            destination: {
              Config: {
                storageUrlAlias:
                  'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                storageUrlGroup:
                  'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                storageUrlPage:
                  'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                storageUrlTrack:
                  'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
              },
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
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
              endpoint:
                'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
              headers: {},
              params: {},
              body: {
                JSON: {
                  id: 'rudder-123',
                  sent_at: '2021-01-03T17:02:53.195Z',
                  original_timestamp: '2021-01-03T17:02:53.193Z',
                  timestamp: '2021-01-03T17:02:53.193Z',
                  trait_email: 'testuser@google.com',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'serenytics',
    description: 'Group call misiing storage url',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'group',
              sentAt: '2021-01-03T17:02:53.195Z',
              channel: 'web',
              groupId: 'rudder-123',
              traits: {},
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
                library: { name: 'RudderLabs JavaScript SDK', version: '1.0.0' },
                locale: 'en-US',
                os: { name: 'iOS', version: '14.4.1' },
                screen: { density: 2 },
                traits: { email: 'testuser@google.com' },
              },
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              originalTimestamp: '2021-01-03T17:02:53.193Z',
            },
            destination: {
              Config: {
                storageUrlAlias:
                  'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                storageUrlPage:
                  'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                storageUrlTrack:
                  'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
              },
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            destination: {
              Config: {
                storageUrlAlias:
                  'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                storageUrlPage:
                  'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                storageUrlTrack:
                  'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
              },
            },
            error: 'Storage url for "GROUP" is missing. Aborting!',
            statTags: {
              destType: 'SERENYTICS',
              errorCategory: 'dataValidation',
              errorType: 'configuration',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'serenytics',
    description: 'Alias call: storage data url is missing',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.1.5',
                },
                traits: {
                  name: 'Shehan Study',
                  category: 'SampleIdentify',
                  email: 'chandra+r@rudderlabs.com',
                  plan: 'Open source',
                  logins: 5,
                  createdAt: 1599264000,
                },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.1.5' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36',
                locale: 'en-US',
                os: { name: '', version: '' },
                screen: { density: 0.8999999761581421 },
                campaign: {
                  source: 'google',
                  medium: 'medium',
                  term: 'keyword',
                  content: 'some content',
                  name: 'some campaign',
                  test: 'other value',
                },
                page: {
                  path: '/destinations/amplitude',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/amplitude',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
              },
              type: 'alias',
              messageId: 'dd46338d-5f83-493b-bd28-3b48f55d0be8',
              originalTimestamp: '2020-10-20T08:14:28.778Z',
              anonymousId: 'my-anonymous-id-new',
              userId: 'newUserIdAlias',
              integrations: { All: true },
              previousId: 'sampleusrRudder3',
              sentAt: '2020-10-20T08:14:28.778Z',
            },
            destination: {
              Config: {
                storageUrlPage:
                  'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                storageUrlTrack:
                  'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
              },
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            destination: {
              Config: {
                storageUrlPage:
                  'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                storageUrlTrack:
                  'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
              },
            },
            error: 'Storage url for "ALIAS" is missing. Aborting!',
            statTags: {
              destType: 'SERENYTICS',
              errorCategory: 'dataValidation',
              errorType: 'configuration',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'serenytics',
    description: 'Alias call',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              channel: 'web',
              context: {
                app: {
                  build: '1.0.0',
                  name: 'RudderLabs JavaScript SDK',
                  namespace: 'com.rudderlabs.javascript',
                  version: '1.1.5',
                },
                traits: {
                  name: 'Shehan Study',
                  category: 'SampleIdentify',
                  email: 'chandra+r@rudderlabs.com',
                  plan: 'Open source',
                  logins: 5,
                  createdAt: 1599264000,
                },
                library: { name: 'RudderLabs JavaScript SDK', version: '1.1.5' },
                userAgent:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36',
                locale: 'en-US',
                os: { name: '', version: '' },
                screen: { density: 0.8999999761581421 },
                campaign: {
                  source: 'google',
                  medium: 'medium',
                  term: 'keyword',
                  content: 'some content',
                  name: 'some campaign',
                  test: 'other value',
                },
                page: {
                  path: '/destinations/amplitude',
                  referrer: '',
                  search: '',
                  title: '',
                  url: 'https://docs.rudderstack.com/destinations/amplitude',
                  category: 'destination',
                  initial_referrer: 'https://docs.rudderstack.com',
                  initial_referring_domain: 'docs.rudderstack.com',
                },
              },
              type: 'alias',
              messageId: 'dd46338d-5f83-493b-bd28-3b48f55d0be8',
              originalTimestamp: '2020-10-20T08:14:28.778Z',
              anonymousId: 'my-anonymous-id-new',
              userId: 'newUserIdAlias',
              integrations: { All: true },
              traits: {
                city: 'Disney',
                country: 'USA',
                email: 'mickey@disney.com',
                firstname: 'Mickey',
              },
              previousId: 'sampleusrRudder3',
              sentAt: '2020-10-20T08:14:28.778Z',
            },
            destination: {
              Config: {
                storageUrlAlias:
                  'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                storageUrlPage:
                  'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
                storageUrlTrack:
                  'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
              },
            },
          },
        ],
        method: 'POST',
      },
      pathSuffix: '',
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
              endpoint:
                'https://api.serenytics.com/api/data_source/5dc8508e-0946-47fc-8ed8-f67307c407f1/push/997877c6358621beb1f86dc320ac822b9f069760',
              headers: {},
              params: {},
              body: {
                JSON: {
                  user_id: 'newUserIdAlias',
                  previous_id: 'sampleusrRudder3',
                  sent_at: '2020-10-20T08:14:28.778Z',
                  original_timestamp: '2020-10-20T08:14:28.778Z',
                  timestamp: '2020-10-20T08:14:28.778Z',
                  trait_city: 'Disney',
                  trait_country: 'USA',
                  trait_email: 'chandra+r@rudderlabs.com',
                  trait_firstname: 'Mickey',
                  trait_name: 'Shehan Study',
                  trait_category: 'SampleIdentify',
                  trait_plan: 'Open source',
                  trait_logins: 5,
                  trait_createdAt: 1599264000,
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
];
module.exports = {
  data,
};
