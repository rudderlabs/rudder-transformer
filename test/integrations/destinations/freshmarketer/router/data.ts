export const data = [
  {
    name: 'freshmarketer',
    description: 'Test 0',
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
                  apiKey: 'dummyApiKey',
                  domain: 'rudderstack-476952domain3105.myfreshworks.com',
                },
              },
              metadata: { jobId: 1, userId: 'u1' },
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
            },
            {
              destination: {
                Config: {
                  apiKey: 'dummyApiKey',
                  domain: 'rudderstack-476952domain3105.myfreshworks.com',
                },
              },
              metadata: { jobId: 2, userId: 'u1' },
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
            },
            {
              destination: {
                Config: { apiKey: 'dummyApiKey', domain: 'domain-rudder.myfreshworks.com' },
              },
              metadata: { jobId: 3, userId: 'u1' },
              message: {
                messageId: 'sadjb-1e2r3fhgb-12bvbbj',
                originalTimestamp: '2022-06-22T10:57:58Z',
                anonymousId: 'ea5cfab2-3961-4d8a-8187-3d1858c99090',
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
                traits: {
                  groupType: 'accounts',
                  name: 'Mark Twain',
                  phone: '919191919191',
                  numberOfEmployees: 51,
                  annualRevenue: 1000,
                  address: 'Red Colony',
                  city: 'Colony',
                  state: 'Haryana',
                },
                type: 'group',
                sentAt: '2022-04-22T10:57:58Z',
              },
            },
          ],
          destType: 'freshmarketer',
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
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint:
                  'https://rudderstack-476952domain3105.myfreshworks.com/crm/sales/api/contacts/upsert',
                headers: {
                  Authorization: 'Token token=dummyApiKey',
                  'Content-Type': 'application/json',
                },
                params: {},
                body: {
                  JSON: {
                    contact: {
                      emails: 'testuser@google.com',
                      first_name: 'Rk',
                      last_name: 'Mishra',
                      work_number: '9988776655',
                      external_id: 'ea5cfab2-3961-4d8a-8187-3d1858c99099',
                      mobile_number: '1-926-555-9504',
                      created_at: '2022-06-22T10:57:58Z',
                      updated_at: '2022-06-22T10:57:58Z',
                      lifecycle_stage_id: 71010794467,
                    },
                    unique_identifier: { emails: 'testuser@google.com' },
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [{ jobId: 1, userId: 'u1' }],
              batched: false,
              statusCode: 200,
              destination: {
                Config: {
                  apiKey: 'dummyApiKey',
                  domain: 'rudderstack-476952domain3105.myfreshworks.com',
                },
              },
            },
            {
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint:
                  'https://rudderstack-476952domain3105.myfreshworks.com/crm/sales/api/contacts/upsert',
                headers: {
                  Authorization: 'Token token=dummyApiKey',
                  'Content-Type': 'application/json',
                },
                params: {},
                body: {
                  JSON: {
                    contact: {
                      emails: 'testuser@google.com',
                      first_name: 'Rk',
                      last_name: 'Mishra',
                      work_number: '9988776655',
                      external_id: 'ea5cfab2-3961-4d8a-8187-3d1858c99099',
                      mobile_number: '1-926-555-9504',
                      created_at: '2022-06-22T10:57:58Z',
                      updated_at: '2022-06-22T10:57:58Z',
                      lifecycle_stage_id: 71010794467,
                    },
                    unique_identifier: { emails: 'testuser@google.com' },
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [{ jobId: 2, userId: 'u1' }],
              batched: false,
              statusCode: 200,
              destination: {
                Config: {
                  apiKey: 'dummyApiKey',
                  domain: 'rudderstack-476952domain3105.myfreshworks.com',
                },
              },
            },
            {
              batchedRequest: {
                body: {
                  XML: {},
                  FORM: {},
                  JSON: {
                    contact: {
                      sales_accounts: [
                        {
                          id: 70003771198,
                          name: 'div-quer',
                          avatar: null,
                          partial: true,
                          website: null,
                          is_primary: true,
                          last_contacted: null,
                          record_type_id: '71010794477',
                        },
                        {
                          id: 70003825177,
                          name: 'BisleriGroup',
                          avatar: null,
                          partial: true,
                          website: null,
                          is_primary: false,
                          last_contacted: null,
                          record_type_id: '71010794477',
                        },
                        { id: 70003771396, is_primary: false },
                      ],
                    },
                    unique_identifier: { emails: 'testuser@google.com' },
                  },
                  JSON_ARRAY: {},
                },
                type: 'REST',
                files: {},
                method: 'POST',
                params: {},
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Token token=dummyApiKey',
                },
                version: '1',
                endpoint: 'https://domain-rudder.myfreshworks.com/crm/sales/api/contacts/upsert',
              },
              metadata: [{ jobId: 3, userId: 'u1' }],
              batched: false,
              statusCode: 200,
              destination: {
                Config: { apiKey: 'dummyApiKey', domain: 'domain-rudder.myfreshworks.com' },
              },
            },
          ],
        },
      },
    },
  },
];
