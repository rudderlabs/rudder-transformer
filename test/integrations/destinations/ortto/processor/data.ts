export const data = [
  {
    name: 'ortto',
    description: 'Identify call for creatig/updating person',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              ID: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
              Name: 'ORTTO',
              Config: {
                privateApiKey: 'dummyApiKey',
                instanceRegion: 'other',
                orttoEventsMapping: [
                  {
                    rsEventName: 'RudderEvent',
                    orttoEventName: 'Ortto Event',
                    eventProperties: [
                      {
                        rudderProperty: 'RudderProp',
                        orttoProperty: 'OrttoProp',
                        type: 'text',
                      },
                      {
                        rudderProperty: 'RudderProp',
                        orttoProperty: 'OrttoProp',
                        type: 'longText',
                      },
                    ],
                  },
                ],
                orttoPersonAttributes: [
                  {
                    rudderTraits: 'ruddertrait0',
                    orttoAttribute: 'ortto attirbute0',
                    type: 'email',
                  },
                  {
                    rudderTraits: 'ruddertrait1',
                    orttoAttribute: 'ortto attirbute1',
                    type: 'email',
                  },
                ],
              },
              Enabled: true,
              Transformations: [],
            },
            metadata: { destintionId: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq', jobId: 1 },
            message: {
              anonymousId: '8d872292709c6fbe',
              channel: 'mobile',
              context: {
                app: {
                  build: '1',
                  name: 'AMTestProject',
                  namespace: 'com.rudderstack.android.rudderstack.sampleAndroidApp',
                  version: '1.0',
                },
                device: {
                  id: '8d872292709c6fbe',
                  manufacturer: 'Google',
                  model: 'AOSPonIAEmulator',
                  name: 'generic_x86_arm',
                  type: 'android',
                },
                library: {
                  name: 'com.rudderstack.android.sdk.core',
                  version: '1.0.2',
                },
                locale: 'en-US',
                network: {
                  carrier: 'Android',
                  bluetooth: false,
                  cellular: true,
                  wifi: true,
                },
                os: {
                  name: 'Android',
                  version: '9',
                },
                screen: {
                  density: 420,
                  height: 1794,
                  width: 1080,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  ruddertrait0: 'abc',
                  ruddertrait1: 'def',
                  tags: ['tag1', 'tag2'],
                  unset_tags: ['tag3', 'tag4'],
                  emailConsent: true,
                  smsConsent: true,
                  address: {
                    city: 'Kolkata',
                    country: 'India',
                    postalcode: '700096',
                    state: 'West bengal',
                    street: 'Park Street',
                  },
                  age: '30',
                  anonymousId: '8d872292709c6fbe',
                  birthday: 'wrongValue',
                  createDate: '18th March 2020',
                  description: 'Premium User for 3 years',
                  email: 'identify@test.com',
                  firstname: 'John',
                  userId: 'sample_user_id',
                  lastname: 'Sparrow',
                  name: 'John Sparrow',
                  id: 'sample_user_id',
                  phone: '9112340345',
                  username: 'john_sparrow',
                },
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 9; AOSP on IA Emulator Build/PSR1.180720.117)',
              },
              integrations: {
                All: true,
              },
              messageId: '1590431830915-73bed370-5889-436d-9a9e-0c0e0c809d06',
              originalTimestamp: '2020-05-25T18:37:10.917Z',
              type: 'identify',
              userId: 'sample_user_id',
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
              endpoint: 'https://api.ap3api.com/v1/person/merge',
              headers: {
                'X-Api-Key': 'dummyApiKey',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  people: [
                    {
                      fields: {
                        'str::first': 'John',
                        'str::last': 'Sparrow',
                        'str::email': 'identify@test.com',
                        'geo::city': {
                          name: 'Kolkata',
                        },
                        'geo::country': {},
                        'geo::region': {},
                        'str::postal': '700096',
                        'str::ei': 'sample_user_id',
                        'str::language': 'en-US',
                        'phn::phone': {
                          n: '9112340345',
                        },
                        'bol::gdpr': true,
                        'bol::p': true,
                        'bol::sp': true,
                        'str:cm:ortto-attirbute0': 'abc',
                        'str:cm:ortto-attirbute1': 'def',
                      },
                      tags: ['tag1', 'tag2'],
                      unset_tags: ['tag3', 'tag4'],
                    },
                  ],
                  merge_by: ['str::ei', 'str::email'],
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              destintionId: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
              jobId: 1,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'ortto',
    description: 'Unsupported messageType group',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              ID: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
              Name: 'ORTTO',
              Config: {
                privateApiKey: 'dummyApiKey',
                instanceRegion: 'other',
                orttoEventsMapping: [
                  {
                    rsEventName: 'RudderEvent',
                    orttoEventName: 'Ortto Event',
                    eventProperties: [
                      {
                        rudderProperty: 'RudderProp',
                        orttoProperty: 'OrttoProp',
                        type: 'text',
                      },
                      {
                        rudderProperty: 'RudderProp',
                        orttoProperty: 'OrttoProp',
                        type: 'longText',
                      },
                    ],
                  },
                ],
                orttoPersonAttributes: [
                  {
                    rudderTraits: 'ruddertrait0',
                    orttoAttribute: 'ortto attirbute0',
                    type: 'email',
                  },
                  {
                    rudderTraits: 'ruddertrait1',
                    orttoAttribute: 'ortto attirbute1',
                    type: 'email',
                  },
                ],
              },
              Enabled: true,
              Transformations: [],
            },
            metadata: { destintionId: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq', jobId: 1 },
            message: {
              anonymousId: '8d872292709c6fbe',
              channel: 'mobile',
              context: {
                app: {
                  build: '1',
                  name: 'AMTestProject',
                  namespace: 'com.rudderstack.android.rudderstack.sampleAndroidApp',
                  version: '1.0',
                },
                device: {
                  id: '8d872292709c6fbe',
                  manufacturer: 'Google',
                  model: 'AOSPonIAEmulator',
                  name: 'generic_x86_arm',
                  type: 'android',
                },
                library: {
                  name: 'com.rudderstack.android.sdk.core',
                  version: '1.0.2',
                },
                locale: 'en-US',
                network: {
                  carrier: 'Android',
                  bluetooth: false,
                  cellular: true,
                  wifi: true,
                },
                os: {
                  name: 'Android',
                  version: '9',
                },
                screen: {
                  density: 420,
                  height: 1794,
                  width: 1080,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  ruddertrait0: 'abc',
                  ruddertrait1: 'def',
                  tags: ['tag1', 'tag2'],
                  unset_tags: ['tag3', 'tag4'],
                  emailConsent: true,
                  smsConsent: true,
                  address: {
                    city: 'Kolkata',
                    country: 'India',
                    postalcode: '700096',
                    state: 'West bengal',
                    street: 'Park Street',
                  },
                  age: '30',
                  anonymousId: '8d872292709c6fbe',
                  birthday: '2020-05-26',
                  createDate: '18th March 2020',
                  description: 'Premium User for 3 years',
                  email: 'identify@test.com',
                  firstname: 'John',
                  userId: 'sample_user_id',
                  lastname: 'Sparrow',
                  name: 'John Sparrow',
                  id: 'sample_user_id',
                  phone: '9112340345',
                  username: 'john_sparrow',
                },
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 9; AOSP on IA Emulator Build/PSR1.180720.117)',
              },
              integrations: {
                All: true,
              },
              messageId: '1590431830915-73bed370-5889-436d-9a9e-0c0e0c809d06',
              originalTimestamp: '2020-05-25T18:37:10.917Z',
              type: 'group',
              userId: 'sample_user_id',
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
            statTags: {
              destType: 'ORTTO',
              errorCategory: 'platform',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
            },
            error:
              'message type group is not supported: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: message type group is not supported',
            metadata: {
              destintionId: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
              jobId: 1,
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'ortto',
    description: 'email or userId is not present',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              ID: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
              Name: 'ORTTO',
              Config: {
                privateApiKey: 'dummyApiKey',
                instanceRegion: 'other',
                orttoEventsMapping: [
                  {
                    rsEventName: 'RudderEvent',
                    orttoEventName: 'Ortto Event',
                    eventProperties: [
                      {
                        rudderProperty: 'RudderProp',
                        orttoProperty: 'OrttoProp',
                        type: 'text',
                      },
                      {
                        rudderProperty: 'RudderProp',
                        orttoProperty: 'OrttoProp',
                        type: 'longText',
                      },
                    ],
                  },
                ],
                orttoPersonAttributes: [
                  {
                    rudderTraits: 'ruddertrait0',
                    orttoAttribute: 'ortto attirbute0',
                    type: 'email',
                  },
                  {
                    rudderTraits: 'ruddertrait1',
                    orttoAttribute: 'ortto attirbute1',
                    type: 'email',
                  },
                ],
              },
              Enabled: true,
              Transformations: [],
            },
            metadata: { destintionId: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq', jobId: 1 },
            message: {
              channel: 'mobile',
              context: {
                app: {
                  build: '1',
                  name: 'AMTestProject',
                  namespace: 'com.rudderstack.android.rudderstack.sampleAndroidApp',
                  version: '1.0',
                },
                device: {
                  id: '8d872292709c6fbe',
                  manufacturer: 'Google',
                  model: 'AOSPonIAEmulator',
                  name: 'generic_x86_arm',
                  type: 'android',
                },
                library: {
                  name: 'com.rudderstack.android.sdk.core',
                  version: '1.0.2',
                },
                locale: 'en-US',
                network: {
                  carrier: 'Android',
                  bluetooth: false,
                  cellular: true,
                  wifi: true,
                },
                os: {
                  name: 'Android',
                  version: '9',
                },
                screen: {
                  density: 420,
                  height: 1794,
                  width: 1080,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  ruddertrait0: 'abc',
                  ruddertrait1: 'def',
                  tags: ['tag1', 'tag2'],
                  unset_tags: ['tag3', 'tag4'],
                  emailConsent: true,
                  smsConsent: true,
                  address: {
                    city: 'Kolkata',
                    country: 'India',
                    postalcode: '700096',
                    state: 'West bengal',
                    street: 'Park Street',
                  },
                  age: '30',
                  anonymousId: '8d872292709c6fbe',
                  birthday: '2020-05-26',
                  createDate: '18th March 2020',
                  description: 'Premium User for 3 years',
                  firstname: 'John',
                  lastname: 'Sparrow',
                  name: 'John Sparrow',
                  phone: '9112340345',
                  username: 'john_sparrow',
                },
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 9; AOSP on IA Emulator Build/PSR1.180720.117)',
              },
              integrations: {
                All: true,
              },
              messageId: '1590431830915-73bed370-5889-436d-9a9e-0c0e0c809d06',
              originalTimestamp: '2020-05-25T18:37:10.917Z',
              type: 'identify',
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
            statTags: {
              destType: 'ORTTO',
              errorCategory: 'platform',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
            },
            error:
              'Either of email  or userId is required. Aborting message.: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: Either of email  or userId is required. Aborting message.',
            metadata: {
              destintionId: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
              jobId: 1,
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'ortto',
    description: 'instance region is not present',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              ID: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
              Name: 'ORTTO',
              Config: {
                privateApiKey: 'dummyApiKey',
                orttoEventsMapping: [
                  {
                    rsEventName: 'RudderEvent',
                    orttoEventName: 'Ortto Event',
                    eventProperties: [
                      {
                        rudderProperty: 'RudderProp',
                        orttoProperty: 'OrttoProp',
                        type: 'text',
                      },
                      {
                        rudderProperty: 'RudderProp',
                        orttoProperty: 'OrttoProp',
                        type: 'longText',
                      },
                    ],
                  },
                ],
                orttoPersonAttributes: [
                  {
                    rudderTraits: 'ruddertrait0',
                    orttoAttribute: 'ortto attirbute0',
                    type: 'email',
                  },
                  {
                    rudderTraits: 'ruddertrait1',
                    orttoAttribute: 'ortto attirbute1',
                    type: 'email',
                  },
                ],
              },
              Enabled: true,
              Transformations: [],
            },
            metadata: { destintionId: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq', jobId: 1 },
            message: {
              anonymousId: '8d872292709c6fbe',
              channel: 'mobile',
              context: {
                app: {
                  build: '1',
                  name: 'AMTestProject',
                  namespace: 'com.rudderstack.android.rudderstack.sampleAndroidApp',
                  version: '1.0',
                },
                device: {
                  id: '8d872292709c6fbe',
                  manufacturer: 'Google',
                  model: 'AOSPonIAEmulator',
                  name: 'generic_x86_arm',
                  type: 'android',
                },
                library: {
                  name: 'com.rudderstack.android.sdk.core',
                  version: '1.0.2',
                },
                locale: 'en-US',
                network: {
                  carrier: 'Android',
                  bluetooth: false,
                  cellular: true,
                  wifi: true,
                },
                os: {
                  name: 'Android',
                  version: '9',
                },
                screen: {
                  density: 420,
                  height: 1794,
                  width: 1080,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  ruddertrait0: 'abc',
                  ruddertrait1: 'def',
                  tags: ['tag1', 'tag2'],
                  unset_tags: ['tag3', 'tag4'],
                  emailConsent: true,
                  smsConsent: true,
                  address: {
                    city: 'Kolkata',
                    country: 'India',
                    postalcode: '700096',
                    state: 'West bengal',
                    street: 'Park Street',
                  },
                  age: '30',
                  anonymousId: '8d872292709c6fbe',
                  birthday: '2020-05-26',
                  createDate: '18th March 2020',
                  description: 'Premium User for 3 years',
                  email: 'identify@test.com',
                  firstname: 'John',
                  userId: 'sample_user_id',
                  lastname: 'Sparrow',
                  name: 'John Sparrow',
                  id: 'sample_user_id',
                  phone: '9112340345',
                  username: 'john_sparrow',
                },
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 9; AOSP on IA Emulator Build/PSR1.180720.117)',
              },
              integrations: {
                All: true,
              },
              messageId: '1590431830915-73bed370-5889-436d-9a9e-0c0e0c809d06',
              originalTimestamp: '2020-05-25T18:37:10.917Z',
              type: 'identify',
              userId: 'sample_user_id',
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
            statTags: {
              destType: 'ORTTO',
              errorCategory: 'platform',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
            },
            error:
              'Instance Region is not present: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: Instance Region is not present',
            metadata: {
              destintionId: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
              jobId: 1,
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'ortto',
    description: 'privateApi Key is not present',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              ID: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
              Name: 'ORTTO',
              Config: {
                instanceRegion: 'other',
                orttoEventsMapping: [
                  {
                    rsEventName: 'RudderEvent',
                    orttoEventName: 'Ortto Event',
                    eventProperties: [
                      {
                        rudderProperty: 'RudderProp',
                        orttoProperty: 'OrttoProp',
                        type: 'text',
                      },
                      {
                        rudderProperty: 'RudderProp',
                        orttoProperty: 'OrttoProp',
                        type: 'longText',
                      },
                    ],
                  },
                ],
                orttoPersonAttributes: [
                  {
                    rudderTraits: 'ruddertrait0',
                    orttoAttribute: 'ortto attirbute0',
                    type: 'email',
                  },
                  {
                    rudderTraits: 'ruddertrait1',
                    orttoAttribute: 'ortto attirbute1',
                    type: 'email',
                  },
                ],
              },
              Enabled: true,
              Transformations: [],
            },
            metadata: { destintionId: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq', jobId: 1 },
            message: {
              anonymousId: '8d872292709c6fbe',
              channel: 'mobile',
              context: {
                app: {
                  build: '1',
                  name: 'AMTestProject',
                  namespace: 'com.rudderstack.android.rudderstack.sampleAndroidApp',
                  version: '1.0',
                },
                device: {
                  id: '8d872292709c6fbe',
                  manufacturer: 'Google',
                  model: 'AOSPonIAEmulator',
                  name: 'generic_x86_arm',
                  type: 'android',
                },
                library: {
                  name: 'com.rudderstack.android.sdk.core',
                  version: '1.0.2',
                },
                locale: 'en-US',
                network: {
                  carrier: 'Android',
                  bluetooth: false,
                  cellular: true,
                  wifi: true,
                },
                os: {
                  name: 'Android',
                  version: '9',
                },
                screen: {
                  density: 420,
                  height: 1794,
                  width: 1080,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  ruddertrait0: 'abc',
                  ruddertrait1: 'def',
                  tags: ['tag1', 'tag2'],
                  unset_tags: ['tag3', 'tag4'],
                  emailConsent: true,
                  smsConsent: true,
                  address: {
                    city: 'Kolkata',
                    country: 'India',
                    postalcode: '700096',
                    state: 'West bengal',
                    street: 'Park Street',
                  },
                  age: '30',
                  anonymousId: '8d872292709c6fbe',
                  birthday: '2020-05-26',
                  createDate: '18th March 2020',
                  description: 'Premium User for 3 years',
                  email: 'identify@test.com',
                  firstname: 'John',
                  userId: 'sample_user_id',
                  lastname: 'Sparrow',
                  name: 'John Sparrow',
                  id: 'sample_user_id',
                  phone: '9112340345',
                  username: 'john_sparrow',
                },
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 9; AOSP on IA Emulator Build/PSR1.180720.117)',
              },
              integrations: {
                All: true,
              },
              messageId: '1590431830915-73bed370-5889-436d-9a9e-0c0e0c809d06',
              originalTimestamp: '2020-05-25T18:37:10.917Z',
              type: 'identify',
              userId: 'sample_user_id',
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
            statTags: {
              destType: 'ORTTO',
              errorCategory: 'platform',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
            },
            error:
              'Private Api Key is not present: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: Private Api Key is not present',
            metadata: {
              destintionId: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
              jobId: 1,
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'ortto',
    description: 'Track call for updating activities',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              ID: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
              Name: 'ORTTO',
              Config: {
                privateApiKey: 'dummyApiKey',
                instanceRegion: 'other',
                orttoEventsMapping: [
                  {
                    rsEventName: 'RudderEvent',
                    orttoEventName: 'Ortto Event',
                    eventProperties: [
                      {
                        rudderProperty: 'RudderProp',
                        orttoProperty: 'OrttoProp',
                        type: 'text',
                      },
                      {
                        rudderProperty: 'RudderProp',
                        orttoProperty: 'OrttoProp',
                        type: 'longText',
                      },
                    ],
                  },
                ],
                orttoPersonAttributes: [
                  {
                    rudderTraits: 'ruddertrait0',
                    orttoAttribute: 'ortto attirbute0',
                    type: 'email',
                  },
                  {
                    rudderTraits: 'ruddertrait1',
                    orttoAttribute: 'ortto attirbute1',
                    type: 'email',
                  },
                ],
              },
              Enabled: true,
              Transformations: [],
            },
            metadata: { destintionId: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq', jobId: 2 },
            message: {
              anonymousId: '8d872292709c6fbe',
              channel: 'mobile',
              context: {
                app: {
                  build: '1',
                  name: 'AMTestProject',
                  namespace: 'com.rudderstack.android.rudderstack.sampleAndroidApp',
                  version: '1.0',
                },
                device: {
                  id: '8d872292709c6fbe',
                  manufacturer: 'Google',
                  model: 'AOSPonIAEmulator',
                  name: 'generic_x86_arm',
                  type: 'android',
                },
                library: {
                  name: 'com.rudderstack.android.sdk.core',
                  version: '1.0.2',
                },
                locale: 'en-US',
                network: {
                  carrier: 'Android',
                  bluetooth: false,
                  cellular: true,
                  wifi: true,
                },
                os: {
                  name: 'Android',
                  version: '9',
                },
                screen: {
                  density: 420,
                  height: 1794,
                  width: 1080,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  ruddertrait0: 'abc',
                  ruddertrait1: 'def',
                  address: {
                    city: 'Kolkata',
                    country: 'India',
                    postalcode: '700096',
                    state: 'West bengal',
                    street: 'Park Street',
                  },
                  age: '30',
                  anonymousId: '8d872292709c6fbe',
                  birthday: '2020-05-26',
                  createDate: '18th March 2020',
                  description: 'Premium User for 3 years',
                  email: 'identify@test.com',
                  firstname: 'John',
                  gdpr: false,
                  userId: 'sample_user_id',
                  lastname: 'Sparrow',
                  name: 'John Sparrow',
                  id: 'sample_user_id',
                  phone: '9112340345',
                  username: 'john_sparrow',
                },
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 9; AOSP on IA Emulator Build/PSR1.180720.117)',
              },
              event: 'RudderEvent',
              integrations: {
                All: true,
              },
              messageId: '1590431830915-73bed370-5889-436d-9a9e-0c0e0c809d06',
              properties: {
                revenue: '30',
                RudderProp: 'USD',
                quantity: '5',
                test_key_2: {
                  test_child_key_1: 'test_child_value_1',
                },
                price: '58.0',
              },
              originalTimestamp: '2020-05-25T18:37:10.917Z',
              type: 'track',
              userId: 'sample_user_id',
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
              endpoint: 'https://api.ap3api.com/v1/activities/create',
              headers: {
                'X-Api-Key': 'dummyApiKey',
                'Content-Type': 'application/json',
              },
              params: {},
              body: {
                JSON: {
                  activities: [
                    {
                      fields: {
                        'str::first': 'John',
                        'str::last': 'Sparrow',
                        'str::email': 'identify@test.com',
                        'geo::city': {
                          name: 'Kolkata',
                        },
                        'geo::country': {},
                        'geo::region': {},
                        'dtz::b': {
                          day: 26,
                          month: 5,
                          year: 2020,
                        },
                        'str::postal': '700096',
                        'str::language': 'en-US',
                        'str::ei': 'sample_user_id',
                        'phn::phone': {
                          n: '9112340345',
                        },
                        'bol::gdpr': false,
                        'bol::p': false,
                        'bol::sp': false,
                        'str:cm:ortto-attirbute0': 'abc',
                        'str:cm:ortto-attirbute1': 'def',
                      },
                      activity_id: 'act:cm:ortto-event',
                      attributes: {
                        'str:cm:orttoprop': 'USD',
                        'txt:cm:orttoprop': 'USD',
                      },
                      location: {},
                    },
                  ],
                  merge_by: ['str::ei', 'str::email'],
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              files: {},
              userId: '',
            },
            metadata: {
              destintionId: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
              jobId: 2,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'ortto',
    description: 'Track call for updating activities',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              ID: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
              Name: 'ORTTO',
              Config: {
                privateApiKey: 'dummyApiKey',
                instanceRegion: 'other',
                orttoEventsMapping: [
                  {
                    rsEventName: 'RudderEvent',
                    orttoEventName: 'Ortto Event',
                    eventProperties: [
                      {
                        rudderProperty: 'RudderProp',
                        orttoProperty: 'OrttoProp',
                        type: 'text',
                      },
                      {
                        rudderProperty: 'RudderProp',
                        orttoProperty: 'OrttoProp',
                        type: 'longText',
                      },
                    ],
                  },
                ],
                orttoPersonAttributes: [
                  {
                    rudderTraits: 'ruddertrait0',
                    orttoAttribute: 'ortto attirbute0',
                    type: 'email',
                  },
                  {
                    rudderTraits: 'ruddertrait1',
                    orttoAttribute: 'ortto attirbute1',
                    type: 'email',
                  },
                ],
              },
              Enabled: true,
              Transformations: [],
            },
            metadata: { destintionId: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq', jobId: 2 },
            message: {
              anonymousId: '8d872292709c6fbe',
              channel: 'mobile',
              context: {
                app: {
                  build: '1',
                  name: 'AMTestProject',
                  namespace: 'com.rudderstack.android.rudderstack.sampleAndroidApp',
                  version: '1.0',
                },
                device: {
                  id: '8d872292709c6fbe',
                  manufacturer: 'Google',
                  model: 'AOSPonIAEmulator',
                  name: 'generic_x86_arm',
                  type: 'android',
                },
                library: {
                  name: 'com.rudderstack.android.sdk.core',
                  version: '1.0.2',
                },
                locale: 'en-US',
                network: {
                  carrier: 'Android',
                  bluetooth: false,
                  cellular: true,
                  wifi: true,
                },
                os: {
                  name: 'Android',
                  version: '9',
                },
                screen: {
                  density: 420,
                  height: 1794,
                  width: 1080,
                },
                timezone: 'Asia/Kolkata',
                traits: {
                  ruddertrait0: 'abc',
                  ruddertrait1: 'def',
                  address: {
                    city: 'Kolkata',
                    country: 'India',
                    postalcode: '700096',
                    state: 'West bengal',
                    street: 'Park Street',
                  },
                  age: '30',
                  anonymousId: '8d872292709c6fbe',
                  birthday: '2020-05-26',
                  createDate: '18th March 2020',
                  description: 'Premium User for 3 years',
                  email: 'identify@test.com',
                  firstname: 'John',
                  gdpr: false,
                  userId: 'sample_user_id',
                  lastname: 'Sparrow',
                  name: 'John Sparrow',
                  id: 'sample_user_id',
                  phone: '9112340345',
                  username: 'john_sparrow',
                },
                userAgent:
                  'Dalvik/2.1.0 (Linux; U; Android 9; AOSP on IA Emulator Build/PSR1.180720.117)',
              },
              integrations: {
                All: true,
              },
              messageId: '1590431830915-73bed370-5889-436d-9a9e-0c0e0c809d06',
              properties: {
                revenue: '30',
                RudderProp: 'USD',
                quantity: '5',
                test_key_2: {
                  test_child_key_1: 'test_child_value_1',
                },
                price: '58.0',
              },
              originalTimestamp: '2020-05-25T18:37:10.917Z',
              type: 'track',
              userId: 'sample_user_id',
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
            statTags: {
              destType: 'ORTTO',
              errorCategory: 'platform',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
            },
            error:
              'event is not present. Aborting.: Workflow: procWorkflow, Step: validateInputForTrack, ChildStep: undefined, OriginalError: event is not present. Aborting.',
            metadata: {
              destintionId: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
              jobId: 2,
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
];
