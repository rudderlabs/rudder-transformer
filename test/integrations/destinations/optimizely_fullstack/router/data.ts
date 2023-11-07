import { FEATURES } from '../../../../../src/v0/util/tags';
import { mockFns } from '../processor/data';

export const data = [
  {
    name: 'optimizely_fullstack',
    description: 'Test 0',
    feature: FEATURES.ROUTER,
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'identify',
                channel: 'web',
                properties: {},
                context: {
                  traits: {
                    organization: 'RudderStack',
                    fullName: 'John Doe',
                    country: 'US',
                  },
                  sessionId: 1685626914716,
                },
                rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
                messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
                anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
                timestamp: '2023-02-10T12:16:07.251Z',
                userId: 'userId123',
                integrations: {
                  All: true,
                  optimizely_fullstack: {
                    variationId: 'test_variation_id_1',
                  },
                },
              },
              destination: {
                DestinationDefinition: {
                  Config: {
                    cdkV2Enabled: true,
                  },
                },
                Config: {
                  dataFileUrl: 'https://cdn.optimizely.com/datafiles/abc.json',
                  accountId: 'test_account_id',
                  campaignId: 'test_campaign_id',
                  experimentId: 'test_experiment_id',
                  trackKnownUsers: true,
                  attributeMapping: [
                    {
                      from: 'organization',
                      to: 'company',
                    },
                    {
                      from: 'fullName',
                      to: 'name',
                    },
                  ],
                },
              },
              metadata: {
                jobId: 1,
              },
            },
            {
              message: {
                type: 'track',
                event: 'product_added',
                userId: 'userId123',
                channel: 'web',
                context: {
                  traits: {
                    organization: 'RudderStack',
                    fullName: 'John Doe',
                  },
                  sessionId: 1685626914716,
                },
                rudderId: '5354b3f2-cb72-4355-a2b5-a298c3837c7d',
                messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
                timestamp: '2023-02-10T12:16:07.251Z',
                properties: {
                  foo: 'bar',
                  revenue: 123,
                  quantity: 2,
                },
                anonymousId: '856365b8-da4b-4c13-9098-84df18559446',
                integrations: {
                  All: true,
                  optimizely_fullstack: {
                    variationId: 'test_variation_id_2',
                  },
                },
              },
              destination: {
                DestinationDefinition: {
                  Config: {
                    cdkV2Enabled: true,
                  },
                },
                Config: {
                  dataFileUrl: 'https://cdn.optimizely.com/datafiles/abc.json',
                  accountId: 'test_account_id',
                  campaignId: 'test_campaign_id',
                  experimentId: 'test_experiment_id',
                  trackKnownUsers: true,
                  anonymizeIp: true,
                  eventMapping: [
                    {
                      from: 'Product Searched',
                      to: 'Searched',
                    },
                    {
                      from: 'product_added',
                      to: 'Product Added',
                    },
                  ],
                  attributeMapping: [
                    {
                      from: 'organization',
                      to: 'company',
                    },
                    {
                      from: 'fullName',
                      to: 'name',
                    },
                  ],
                },
              },
              metadata: {
                jobId: 2,
              },
            },
            {
              message: {
                type: 'page',
                userId: 'userId123',
                channel: 'web',
                context: {
                  traits: {
                    organization: 'RudderStack',
                    fullName: 'John Doe',
                  },
                  sessionId: 1685626914716,
                },
                rudderId: '5354b3f2-cb72-4355-a2b5-a298c3837c7d',
                messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
                timestamp: '2023-02-10T12:16:07.251Z',
                properties: {
                  foo: 'bar',
                  category: 'food',
                },
                anonymousId: '856365b8-da4b-4c13-9098-84df18559446',
                integrations: {
                  All: true,
                  optimizely_fullstack: {
                    variationId: 'test_variation_id_1',
                  },
                },
              },
              destination: {
                DestinationDefinition: {
                  Config: {
                    cdkV2Enabled: true,
                  },
                },
                Config: {
                  dataFileUrl: 'https://cdn.optimizely.com/datafiles/abc.json',
                  accountId: 'test_account_id',
                  campaignId: 'test_campaign_id',
                  experimentId: 'test_experiment_id',
                  trackKnownUsers: true,
                  anonymizeIp: true,
                  trackCategorizedPages: true,
                  trackNamedPages: false,
                  pageMapping: [
                    {
                      from: 'meal',
                      to: 'Viewed Meal Page',
                    },
                    {
                      from: 'food',
                      to: 'Product Added',
                    },
                  ],
                },
              },
              metadata: {
                jobId: 3,
              },
            },
            {
              message: {
                type: 'page',
                channel: 'web',
                name: 'Home',
                properties: {},
                context: {},
                rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
                messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
                anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
                integrations: {
                  All: true,
                  optimizely_fullstack: {
                    variationId: '123',
                  },
                },
              },
              destination: {
                DestinationDefinition: {
                  Config: {
                    cdkV2Enabled: true,
                  },
                },
                Config: {
                  dataFileUrl: 'https://cdn.optimizely.com/datafiles/abc.json',
                  accountId: 'test_account_id',
                  campaignId: 'test_campagin_id',
                  experimentId: 'test_experiment_id',
                  trackCategorizedPages: false,
                  trackNamedPages: false,
                },
              },
              metadata: {
                jobId: 4,
              },
            },
          ],
          destType: 'optimizely_fullstack',
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
              batched: false,
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://logx.optimizely.com/v1/events',
                headers: {
                  'Content-Type': 'application/json',
                },
                params: {},
                body: {
                  JSON: {
                    account_id: 'test_account_id',
                    anonymize_ip: false,
                    enrich_decisions: true,
                    client_name: 'RudderStack',
                    client_version: '1.0.0',
                    visitors: [
                      {
                        visitor_id: 'userId123',
                        attributes: [
                          {
                            entity_id: 'test_attribute_id_5',
                            key: 'company',
                            type: 'custom',
                            value: 'RudderStack',
                          },
                          {
                            entity_id: 'test_attribute_id_2',
                            key: 'name',
                            type: 'custom',
                            value: 'John Doe',
                          },
                        ],
                        snapshots: [
                          {
                            decisions: [
                              {
                                campaign_id: 'test_campaign_id',
                                experiment_id: 'test_experiment_id',
                                variation_id: 'test_variation_id_1',
                              },
                            ],
                            events: [
                              {
                                entity_id: 'test_campaign_id',
                                type: 'campaign_activated',
                                timestamp: 1676031367251,
                                uuid: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
                              },
                            ],
                          },
                        ],
                        session_id: '1685626914716',
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              destination: {
                DestinationDefinition: {
                  Config: {
                    cdkV2Enabled: true,
                  },
                },
                Config: {
                  dataFileUrl: 'https://cdn.optimizely.com/datafiles/abc.json',
                  accountId: 'test_account_id',
                  campaignId: 'test_campaign_id',
                  experimentId: 'test_experiment_id',
                  trackKnownUsers: true,
                  attributeMapping: [
                    {
                      from: 'organization',
                      to: 'company',
                    },
                    {
                      from: 'fullName',
                      to: 'name',
                    },
                  ],
                },
              },
              metadata: [
                {
                  jobId: 1,
                },
              ],
              statusCode: 200,
            },
            {
              batched: false,
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://logx.optimizely.com/v1/events',
                headers: {
                  'Content-Type': 'application/json',
                },
                params: {},
                body: {
                  JSON: {
                    account_id: 'test_account_id',
                    anonymize_ip: true,
                    enrich_decisions: true,
                    client_name: 'RudderStack',
                    client_version: '1.0.0',
                    visitors: [
                      {
                        visitor_id: 'userId123',
                        attributes: [
                          {
                            entity_id: 'test_attribute_id_5',
                            key: 'company',
                            type: 'custom',
                            value: 'RudderStack',
                          },
                          {
                            entity_id: 'test_attribute_id_2',
                            key: 'name',
                            type: 'custom',
                            value: 'John Doe',
                          },
                        ],
                        snapshots: [
                          {
                            decisions: [],
                            events: [
                              {
                                entity_id: 'test_event_id_1',
                                key: 'Product Added',
                                timestamp: 1676031367251,
                                uuid: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
                                quantity: 2,
                                revenue: 12300,
                                tags: {
                                  foo: 'bar',
                                },
                              },
                            ],
                          },
                        ],
                        session_id: '1685626914716',
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              destination: {
                DestinationDefinition: {
                  Config: {
                    cdkV2Enabled: true,
                  },
                },
                Config: {
                  dataFileUrl: 'https://cdn.optimizely.com/datafiles/abc.json',
                  accountId: 'test_account_id',
                  campaignId: 'test_campaign_id',
                  experimentId: 'test_experiment_id',
                  trackKnownUsers: true,
                  anonymizeIp: true,
                  eventMapping: [
                    {
                      from: 'Product Searched',
                      to: 'Searched',
                    },
                    {
                      from: 'product_added',
                      to: 'Product Added',
                    },
                  ],
                  attributeMapping: [
                    {
                      from: 'organization',
                      to: 'company',
                    },
                    {
                      from: 'fullName',
                      to: 'name',
                    },
                  ],
                },
              },
              metadata: [
                {
                  jobId: 2,
                },
              ],
              statusCode: 200,
            },
            {
              batched: false,
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'POST',
                endpoint: 'https://logx.optimizely.com/v1/events',
                headers: {
                  'Content-Type': 'application/json',
                },
                params: {},
                body: {
                  JSON: {
                    account_id: 'test_account_id',
                    anonymize_ip: true,
                    enrich_decisions: true,
                    client_name: 'RudderStack',
                    client_version: '1.0.0',
                    visitors: [
                      {
                        visitor_id: 'userId123',
                        snapshots: [
                          {
                            decisions: [],
                            events: [
                              {
                                entity_id: 'test_event_id_1',
                                key: 'Product Added',
                                timestamp: 1676031367251,
                                uuid: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
                                tags: {
                                  foo: 'bar',
                                  category: 'food',
                                },
                              },
                            ],
                          },
                        ],
                        session_id: '1685626914716',
                      },
                    ],
                  },
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              destination: {
                DestinationDefinition: {
                  Config: {
                    cdkV2Enabled: true,
                  },
                },
                Config: {
                  dataFileUrl: 'https://cdn.optimizely.com/datafiles/abc.json',
                  accountId: 'test_account_id',
                  campaignId: 'test_campaign_id',
                  experimentId: 'test_experiment_id',
                  trackKnownUsers: true,
                  anonymizeIp: true,
                  trackCategorizedPages: true,
                  trackNamedPages: false,
                  pageMapping: [
                    {
                      from: 'meal',
                      to: 'Viewed Meal Page',
                    },
                    {
                      from: 'food',
                      to: 'Product Added',
                    },
                  ],
                },
              },
              metadata: [
                {
                  jobId: 3,
                },
              ],
              statusCode: 200,
            },
            {
              batched: false,
              destination: {
                DestinationDefinition: {
                  Config: {
                    cdkV2Enabled: true,
                  },
                },
                Config: {
                  accountId: 'test_account_id',
                  campaignId: 'test_campagin_id',
                  dataFileUrl: 'https://cdn.optimizely.com/datafiles/abc.json',
                  experimentId: 'test_experiment_id',
                  trackCategorizedPages: false,
                  trackNamedPages: false,
                },
              },
              error:
                "Both 'Track Categorized Pages' and 'Track Named Pages' toggles are disabled in webapp. Please enable at one of them to send page/screen events to Optimizely.",
              metadata: [
                {
                  jobId: 4,
                },
              ],
              statTags: {
                destType: 'OPTIMIZELY_FULLSTACK',
                errorCategory: 'dataValidation',
                errorType: 'configuration',
                feature: 'router',
                implementation: 'cdkV2',
                module: 'destination',
              },
              statusCode: 400,
            },
          ],
        },
      },
    },
    mockFns,
  },
];
