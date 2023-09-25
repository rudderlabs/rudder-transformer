export const data = [
  {
    name: 'optimizely_fullstack',
    description: 'Missing Data File URL',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'identify',
              channel: 'web',
              properties: {},
              context: {},
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              integrations: {
                All: true,
              },
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                accountId: 'test_account_id',
                campaignId: 'test_campaign_id',
                experimentId: 'test_experiment_id',
              },
            },
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
              'Data File Url is not present. Aborting: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: Data File Url is not present. Aborting',
            statTags: {
              destType: 'OPTIMIZELY_FULLSTACK',
              errorCategory: 'platform',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
            },
            statusCode: 400,
            metadata: {
              jobId: 1,
            },
          },
        ],
      },
    },
  },
  {
    name: 'optimizely_fullstack',
    description: 'Identify call: Missing Variation ID in integration object',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'identify',
              channel: 'web',
              properties: {},
              context: {},
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              integrations: {
                All: true,
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
              },
            },
            metadata: {
              jobId: 2,
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
              'Variation ID is not present in the integrations object: Workflow: procWorkflow, Step: validateInputForIdentify, ChildStep: undefined, OriginalError: Variation ID is not present in the integrations object',
            statTags: {
              destType: 'OPTIMIZELY_FULLSTACK',
              errorCategory: 'platform',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
            },
            statusCode: 400,
            metadata: {
              jobId: 2,
            },
          },
        ],
      },
    },
  },
  {
    name: 'optimizely_fullstack',
    description: 'Missing Account ID',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'identify',
              channel: 'web',
              properties: {},
              context: {},
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              integrations: {
                All: true,
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
                campaignId: 'test_campagin_id',
                experimentId: 'test_experiment_id',
              },
            },
            metadata: {
              jobId: 3,
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
              'Account ID is not present. Aborting: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: Account ID is not present. Aborting',
            statTags: {
              destType: 'OPTIMIZELY_FULLSTACK',
              errorCategory: 'platform',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
            },
            statusCode: 400,
            metadata: {
              jobId: 3,
            },
          },
        ],
      },
    },
  },
  {
    name: 'optimizely_fullstack',
    description: 'Missing Campaign ID',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'identify',
              channel: 'web',
              properties: {},
              context: {},
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              integrations: {
                All: true,
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
                experimentId: 'test_experiment_id',
              },
            },
            metadata: {
              jobId: 4,
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
              'Campaign ID is not present. Aborting: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: Campaign ID is not present. Aborting',
            statTags: {
              destType: 'OPTIMIZELY_FULLSTACK',
              errorCategory: 'platform',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
            },
            statusCode: 400,
            metadata: {
              jobId: 4,
            },
          },
        ],
      },
    },
  },
  {
    name: 'optimizely_fullstack',
    description: 'Missing Experiment ID',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'identify',
              channel: 'web',
              properties: {},
              context: {},
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              integrations: {
                All: true,
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
              },
            },
            metadata: {
              jobId: 5,
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
              'Experiment ID is not present. Aborting: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: Experiment ID is not present. Aborting',
            statTags: {
              destType: 'OPTIMIZELY_FULLSTACK',
              errorCategory: 'platform',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
            },
            statusCode: 400,
            metadata: {
              jobId: 5,
            },
          },
        ],
      },
    },
  },
  {
    name: 'optimizely_fullstack',
    description: 'Page: Track Categorized Page and Track Named Pages toggle are disabled',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
              jobId: 6,
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
              "Both 'Track Categorized Pages' and 'Track Named Pages' toggles are disabled in webapp. Please enable at one of them to send page/screen events to Optimizely.: Workflow: procWorkflow, Step: validateInputForPageAndScreen, ChildStep: undefined, OriginalError: Both 'Track Categorized Pages' and 'Track Named Pages' toggles are disabled in webapp. Please enable at one of them to send page/screen events to Optimizely.",
            statTags: {
              destType: 'OPTIMIZELY_FULLSTACK',
              errorCategory: 'platform',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
            },
            statusCode: 400,
            metadata: {
              jobId: 6,
            },
          },
        ],
      },
    },
  },
  {
    name: 'optimizely_fullstack',
    description:
      'Invalid Configuration (Track known users toggle is on and userId is missing in request)',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              channel: 'web',
              event: 'Product Added',
              properties: {
                price: 999,
                quantity: 1,
              },
              context: {
                traits: {
                  firstName: 'John',
                  age: 27,
                },
              },
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
              optimizely_fullstack: {
                variationId: '123',
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
                trackKnownUsers: true,
              },
            },
            metadata: {
              jobId: 7,
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
              "UserId is required for event tracking when the 'Track Known Users' setting is enabled. Please include a 'userId' in your event payload: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: UserId is required for event tracking when the 'Track Known Users' setting is enabled. Please include a 'userId' in your event payload",
            statTags: {
              destType: 'OPTIMIZELY_FULLSTACK',
              errorCategory: 'platform',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
            },
            statusCode: 400,
            metadata: {
              jobId: 7,
            },
          },
        ],
      },
    },
  },
  {
    name: 'optimizely_fullstack',
    description: 'Track call without event',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              channel: 'web',
              properties: {},
              context: {},
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
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
              },
            },
            metadata: {
              jobId: 9,
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
              'Event is not present. Aborting.: Workflow: procWorkflow, Step: validateInputForTrack, ChildStep: undefined, OriginalError: Event is not present. Aborting.',
            statTags: {
              destType: 'OPTIMIZELY_FULLSTACK',
              errorCategory: 'platform',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
            },
            statusCode: 400,
            metadata: {
              jobId: 9,
            },
          },
        ],
      },
    },
  },
  {
    name: 'optimizely_fullstack',
    description: 'Invalid data file url',
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
              channel: 'web',
              properties: {},
              context: {},
              rudderId: '8f8fa6b5-8e24-489c-8e22-61f23f2e364f',
              messageId: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
              anonymousId: '97c46c81-3140-456d-b2a9-690d70aaca35',
            },
            destination: {
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
              Config: {
                dataFileUrl: 'https://cdn.optimizely.com/datafiles/wrong_cdn.json',
                accountId: 'test_account_id',
                campaignId: 'test_campagin_id',
                experimentId: 'test_experiment_id',
              },
            },
            metadata: {
              jobId: 10,
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
              'Data File Lookup Failed due to {"code":"document_not_found","message":"document_not_found"}: Workflow: procWorkflow, Step: dataFile, ChildStep: undefined, OriginalError: Data File Lookup Failed due to {"code":"document_not_found","message":"document_not_found"}',
            statTags: {
              destType: 'OPTIMIZELY_FULLSTACK',
              errorCategory: 'platform',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
            },
            statusCode: 400,
            metadata: {
              jobId: 10,
            },
          },
        ],
      },
    },
  },
  {
    name: 'optimizely_fullstack',
    description: 'Event not present in data-file',
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
              channel: 'web',
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
                eventMapping: [
                  {
                    from: 'Product Added',
                    to: 'product_added',
                  },
                ],
              },
            },
            metadata: {
              jobId: 11,
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
              "Event 'product_added' is not present in data file. Make sure event exists in Optimizely.: Workflow: procWorkflow, Step: prepareTrackPayload, ChildStep: optimizelyEvent, OriginalError: Event 'product_added' is not present in data file. Make sure event exists in Optimizely.",
            statTags: {
              destType: 'OPTIMIZELY_FULLSTACK',
              errorCategory: 'platform',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
            },
            statusCode: 400,
            metadata: {
              jobId: 11,
            },
          },
        ],
      },
    },
  },
  {
    name: 'optimizely_fullstack',
    description: 'Identify call (Decision Event) with userId',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
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
              jobId: 12,
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
            metadata: { jobId: 12 },
            output: {
              body: {
                FORM: {},
                JSON: {
                  account_id: 'test_account_id',
                  anonymize_ip: false,
                  client_name: 'RudderStack',
                  client_version: '1.0.0',
                  enrich_decisions: true,
                  visitors: [
                    {
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
                      session_id: '1685626914716',
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
                              timestamp: 1676031367251,
                              type: 'campaign_activated',
                              uuid: '2116ef8c-efc3-4ca4-851b-02ee60dad6ff',
                            },
                          ],
                        },
                      ],
                      visitor_id: 'userId123',
                    },
                  ],
                },
                JSON_ARRAY: {},
                XML: {},
              },
              endpoint: 'https://logx.optimizely.com/v1/events',
              files: {},
              headers: { 'Content-Type': 'application/json' },
              method: 'POST',
              params: {},
              type: 'REST',
              userId: '',
              version: '1',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
];
