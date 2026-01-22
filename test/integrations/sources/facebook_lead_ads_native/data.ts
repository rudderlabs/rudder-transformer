const defaultMockFns = () => {};

export const data = [
  {
    name: 'facebook_lead_ads_native',
    description: 'Multiple entries with multiple changes',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                object: 'page',
                entry: [
                  {
                    id: '134587',
                    time: 1758794733,
                    changes: [
                      {
                        field: 'leadgen',
                        value: {
                          created_time: 1758794728,
                          leadgen_id: '1459076748710713',
                          page_id: '134587',
                          form_id: '1616801872291121',
                        },
                      },
                      {
                        field: 'leadgen',
                        value: {
                          created_time: 1758794730,
                          leadgen_id: '1459076748710714',
                          page_id: '134587',
                          form_id: '1616801872291122',
                        },
                      },
                      {
                        field: 'leadgen',
                      },
                    ],
                  },
                  {
                    id: '112464600187557',
                    time: 1758794735,
                    changes: [
                      {
                        field: 'leadgen',
                        value: {
                          created_time: 1758794732,
                          leadgen_id: '1459076748710715',
                          page_id: '112464600187557',
                          form_id: '1616801872291123',
                        },
                      },
                    ],
                  },
                ],
              }),
            },
            source: {
              ID: 'test-source-id',
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
              batch: [
                {
                  type: 'identify',
                  context: {
                    traits: {
                      pageId: '134587',
                      formId: '1616801872291121',
                    },
                  },
                  anonymousId: '1459076748710713',
                  messageId: 'test-source-id-1459076748710713',
                  originalTimestamp: '2025-09-25T10:05:28.000Z',
                  sentAt: '2025-09-25T10:05:33.000Z',
                },
                {
                  type: 'identify',
                  context: {
                    traits: {
                      pageId: '134587',
                      formId: '1616801872291122',
                    },
                  },
                  anonymousId: '1459076748710714',
                  messageId: 'test-source-id-1459076748710714',
                  originalTimestamp: '2025-09-25T10:05:30.000Z',
                  sentAt: '2025-09-25T10:05:33.000Z',
                },
                {
                  type: 'identify',
                  context: {
                    traits: {
                      pageId: '112464600187557',
                      formId: '1616801872291123',
                    },
                  },
                  anonymousId: '1459076748710715',
                  messageId: 'test-source-id-1459076748710715',
                  originalTimestamp: '2025-09-25T10:05:32.000Z',
                  sentAt: '2025-09-25T10:05:35.000Z',
                },
              ],
            },
          },
        ],
      },
    },
    mockFns: defaultMockFns,
  },
  {
    name: 'facebook_lead_ads_native',
    description: 'Error case - object field is not "page"',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                object: 'user',
                entry: [
                  {
                    id: '134587',
                    time: 1758794733,
                    changes: [
                      {
                        field: 'leadgen',
                        value: {
                          created_time: 1758794728,
                          leadgen_id: '1459076748710713',
                          page_id: '134587',
                          form_id: '1616801872291121',
                        },
                      },
                    ],
                  },
                ],
              }),
            },
            source: {
              ID: 'test-source-id',
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
            error: 'object field must be "page"',
            statTags: {
              errorCategory: 'transformation',
              module: 'source',
              srcType: 'facebook_lead_ads_native',
              implementation: 'native',
              destinationId: 'Non determinable',
              workspaceId: 'Non determinable',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'facebook_lead_ads_native',
    description: 'Skip changes with missing form_id field',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                object: 'page',
                entry: [
                  {
                    id: '134587',
                    time: 1758794733,
                    changes: [
                      {
                        field: 'leadgen',
                        value: {
                          created_time: 1758794728,
                          leadgen_id: '1459076748710713',
                          page_id: '134587',
                          // Missing form_id
                        },
                      },
                      {
                        field: 'leadgen',
                        value: {
                          created_time: 1758794730,
                          leadgen_id: '1459076748710714',
                          page_id: '134587',
                          form_id: '1616801872291122',
                        },
                      },
                    ],
                  },
                ],
              }),
            },
            source: {
              ID: 'test-source-id',
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
              batch: [
                {
                  type: 'identify',
                  context: {
                    traits: {
                      pageId: '134587',
                      formId: '1616801872291122',
                    },
                  },
                  anonymousId: '1459076748710714',
                  messageId: 'test-source-id-1459076748710714',
                  originalTimestamp: '2025-09-25T10:05:30.000Z',
                  sentAt: '2025-09-25T10:05:33.000Z',
                },
              ],
            },
          },
        ],
      },
    },
    mockFns: defaultMockFns,
  },
  {
    name: 'facebook_lead_ads_native',
    description: 'Error case - empty entry array',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                object: 'page',
                entry: [],
              }),
            },
            source: {
              ID: 'test-source-id',
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
            error: 'entry field is required',
            statTags: {
              errorCategory: 'transformation',
              module: 'source',
              srcType: 'facebook_lead_ads_native',
              implementation: 'native',
              destinationId: 'Non determinable',
              workspaceId: 'Non determinable',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'facebook_lead_ads_native',
    description: 'Error case - missing entry field',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                object: 'page',
              }),
            },
            source: {
              ID: 'test-source-id',
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
            error: 'entry field is required',
            statTags: {
              errorCategory: 'transformation',
              module: 'source',
              srcType: 'facebook_lead_ads_native',
              implementation: 'native',
              destinationId: 'Non determinable',
              workspaceId: 'Non determinable',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'facebook_lead_ads_native',
    description: 'Error case - Empty changes array',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                object: 'page',
                entry: [
                  {
                    id: '134587',
                    time: 1758794733,
                    changes: [],
                  },
                ],
              }),
            },
            source: {
              ID: 'test-source-id',
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
            error: 'No valid events found',
            statTags: {
              errorCategory: 'transformation',
              module: 'source',
              srcType: 'facebook_lead_ads_native',
              implementation: 'native',
              destinationId: 'Non determinable',
              workspaceId: 'Non determinable',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'facebook_lead_ads_native',
    description: 'Error case - Missing changes field',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                object: 'page',
                entry: [
                  {
                    id: '134587',
                    time: 1758794733,
                  },
                ],
              }),
            },
            source: {
              ID: 'test-source-id',
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
            error: 'No valid events found',
            statTags: {
              errorCategory: 'transformation',
              module: 'source',
              srcType: 'facebook_lead_ads_native',
              implementation: 'native',
              destinationId: 'Non determinable',
              workspaceId: 'Non determinable',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'facebook_lead_ads_native',
    description: 'Skip changes with missing leadgen_id',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                object: 'page',
                entry: [
                  {
                    id: '134587',
                    time: 1758794733,
                    changes: [
                      {
                        field: 'leadgen',
                        value: {
                          created_time: 1758794728,
                          page_id: '134587',
                          form_id: '1616801872291121',
                          // Missing leadgen_id
                        },
                      },
                      {
                        field: 'leadgen',
                        value: {
                          created_time: 1758794730,
                          leadgen_id: '1459076748710714',
                          page_id: '134587',
                          form_id: '1616801872291122',
                        },
                      },
                    ],
                  },
                ],
              }),
            },
            source: {
              ID: 'test-source-id',
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
              batch: [
                {
                  type: 'identify',
                  context: {
                    traits: {
                      pageId: '134587',
                      formId: '1616801872291122',
                    },
                  },
                  anonymousId: '1459076748710714',
                  messageId: 'test-source-id-1459076748710714',
                  originalTimestamp: '2025-09-25T10:05:30.000Z',
                  sentAt: '2025-09-25T10:05:33.000Z',
                },
              ],
            },
          },
        ],
      },
    },
    mockFns: defaultMockFns,
  },
  {
    name: 'facebook_lead_ads_native',
    description: 'Skip changes with missing page_id',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                object: 'page',
                entry: [
                  {
                    id: '134587',
                    time: 1758794733,
                    changes: [
                      {
                        field: 'leadgen',
                        value: {
                          created_time: 1758794728,
                          leadgen_id: '1459076748710713',
                          form_id: '1616801872291121',
                          // Missing page_id
                        },
                      },
                      {
                        field: 'leadgen',
                        value: {
                          created_time: 1758794730,
                          leadgen_id: '1459076748710714',
                          page_id: '134587',
                          form_id: '1616801872291122',
                        },
                      },
                    ],
                  },
                ],
              }),
            },
            source: {
              ID: 'test-source-id',
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
              batch: [
                {
                  type: 'identify',
                  context: {
                    traits: {
                      pageId: '134587',
                      formId: '1616801872291122',
                    },
                  },
                  anonymousId: '1459076748710714',
                  messageId: 'test-source-id-1459076748710714',
                  originalTimestamp: '2025-09-25T10:05:30.000Z',
                  sentAt: '2025-09-25T10:05:33.000Z',
                },
              ],
            },
          },
        ],
      },
    },
    mockFns: defaultMockFns,
  },
  {
    name: 'facebook_lead_ads_native',
    description: 'Handle missing created_time',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                object: 'page',
                entry: [
                  {
                    id: '134587',
                    time: 1758794733,
                    changes: [
                      {
                        field: 'leadgen',
                        value: {
                          leadgen_id: '1459076748710713',
                          page_id: '134587',
                          form_id: '1616801872291121',
                          // Missing created_time
                        },
                      },
                    ],
                  },
                ],
              }),
            },
            source: {
              ID: 'test-source-id',
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
              batch: [
                {
                  type: 'identify',
                  context: {
                    traits: {
                      pageId: '134587',
                      formId: '1616801872291121',
                    },
                  },
                  anonymousId: '1459076748710713',
                  messageId: 'test-source-id-1459076748710713',
                  sentAt: '2025-09-25T10:05:33.000Z',
                },
              ],
            },
          },
        ],
      },
    },
    mockFns: defaultMockFns,
  },
  {
    name: 'facebook_lead_ads_native',
    description: 'Handle missing time field',
    module: 'source',
    version: 'v2',
    input: {
      request: {
        body: [
          {
            request: {
              body: JSON.stringify({
                object: 'page',
                entry: [
                  {
                    id: '134587',
                    // Missing time field
                    changes: [
                      {
                        field: 'leadgen',
                        value: {
                          created_time: 1758794728,
                          leadgen_id: '1459076748710713',
                          page_id: '134587',
                          form_id: '1616801872291121',
                        },
                      },
                    ],
                  },
                ],
              }),
            },
            source: {
              ID: 'test-source-id',
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
              batch: [
                {
                  type: 'identify',
                  context: {
                    traits: {
                      pageId: '134587',
                      formId: '1616801872291121',
                    },
                  },
                  anonymousId: '1459076748710713',
                  messageId: 'test-source-id-1459076748710713',
                  originalTimestamp: '2025-09-25T10:05:28.000Z',
                },
              ],
            },
          },
        ],
      },
    },
    mockFns: defaultMockFns,
  },
  {
    name: 'facebook_lead_ads_native',
    description: 'Hydration - Multiple leads with successful API responses',
    module: 'source',
    version: 'v2',
    input: {
      pathSuffix: '/hydrate',
      request: {
        method: 'POST',
        body: {
          batch: [
            {
              id: '1234',
              event: {
                anonymousId: '1459076748710713',
                context: {},
              },
            },
            {
              event: {
                anonymousId: '1459076748710714',
                context: {},
              },
            },
            {
              event: {
                anonymousId: '1459076748710715',
                context: {},
              },
            },
          ],
          source: {
            internalSecret: {
              pageAccessToken: 'test_access_token_123',
            },
          },
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          batch: [
            {
              id: '1234',
              event: {
                anonymousId: '1459076748710713',
                context: {
                  traits: {
                    email: 'test@example.com',
                    full_name: 'John Doe',
                    phone_number: '+1234567890',
                  },
                },
              },
              statusCode: 200,
            },
            {
              event: {
                anonymousId: '1459076748710714',
                context: {
                  traits: {
                    email: 'jane@example.com',
                    company_name: 'Acme Corp',
                  },
                },
              },
              statusCode: 200,
            },
            {
              event: {
                anonymousId: '1459076748710715',
                context: {
                  traits: {
                    email: 'bob@example.com',
                  },
                },
              },
              statusCode: 200,
            },
          ],
        },
      },
    },
    mockFns: (mock) => {
      // Mock successful Facebook API responses for lead data
      mock.onGet('https://graph.facebook.com/v24.0/1459076748710714').reply(200, {
        field_data: [
          { name: 'email', values: ['jane@example.com'] },
          { name: 'company_name', values: ['Acme Corp'] },
        ],
      });

      mock.onGet('https://graph.facebook.com/v24.0/1459076748710715').reply(200, {
        field_data: [{ name: 'email', values: ['bob@example.com'] }],
      });

      mock.onGet('https://graph.facebook.com/v24.0/1459076748710713').reply(200, {
        field_data: [
          { name: 'email', values: ['test@example.com'] },
          { name: 'full_name', values: ['John Doe'] },
          { name: 'phone_number', values: ['+1234567890'] },
        ],
      });
    },
  },
];
