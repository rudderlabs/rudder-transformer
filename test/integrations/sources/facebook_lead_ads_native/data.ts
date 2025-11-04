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
                    id: '112464600187556',
                    time: 1758794733,
                    changes: [
                      {
                        field: 'leadgen',
                        value: {
                          created_time: 1758794728,
                          leadgen_id: '1459076748710713',
                          page_id: '112464600187556',
                          form_id: '1616801872291121',
                        },
                      },
                      {
                        field: 'leadgen',
                        value: {
                          created_time: 1758794730,
                          leadgen_id: '1459076748710714',
                          page_id: '112464600187556',
                          form_id: '1616801872291122',
                        },
                      },
                      {
                        field: 'leadgen',
                      }
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
                      page_id: '112464600187556',
                      form_id: '1616801872291121',
                    },
                  },
                  anonymousId: '1459076748710713',
                  messageId: '112464600187556-1616801872291121-1459076748710713',
                  originalTimestamp: '2025-09-25T10:05:28.000Z',
                  sentAt: '2025-09-25T10:05:33.000Z',
                },
                {
                  type: 'identify',
                  context: {
                    traits: {
                      page_id: '112464600187556',
                      form_id: '1616801872291122',
                    },
                  },
                  anonymousId: '1459076748710714',
                  messageId: '112464600187556-1616801872291122-1459076748710714',
                  originalTimestamp: '2025-09-25T10:05:30.000Z',
                  sentAt: '2025-09-25T10:05:33.000Z',
                },
                {
                  type: 'identify',
                  context: {
                    traits: {
                      page_id: '112464600187557',
                      form_id: '1616801872291123',
                    },
                  },
                  anonymousId: '1459076748710715',
                  messageId: '112464600187557-1616801872291123-1459076748710715',
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
                    id: '112464600187556',
                    time: 1758794733,
                    changes: [
                      {
                        field: 'leadgen',
                        value: {
                          created_time: 1758794728,
                          leadgen_id: '1459076748710713',
                          page_id: '112464600187556',
                          form_id: '1616801872291121',
                        },
                      },
                    ],
                  },
                ],
              }),
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
                    id: '112464600187556',
                    time: 1758794733,
                    changes: [
                      {
                        field: 'leadgen',
                        value: {
                          created_time: 1758794728,
                          leadgen_id: '1459076748710713',
                          page_id: '112464600187556',
                          // Missing form_id
                        },
                      },
                      {
                        field: 'leadgen',
                        value: {
                          created_time: 1758794730,
                          leadgen_id: '1459076748710714',
                          page_id: '112464600187556',
                          form_id: '1616801872291122',
                        },
                      },
                    ],
                  },
                ],
              }),
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
                      page_id: '112464600187556',
                      form_id: '1616801872291122',
                    },
                  },
                  anonymousId: '1459076748710714',
                  messageId: '112464600187556-1616801872291122-1459076748710714',
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
                    id: '112464600187556',
                    time: 1758794733,
                    changes: [],
                  },
                ],
              }),
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
                    id: '112464600187556',
                    time: 1758794733,
                  },
                ],
              }),
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
                    id: '112464600187556',
                    time: 1758794733,
                    changes: [
                      {
                        field: 'leadgen',
                        value: {
                          created_time: 1758794728,
                          page_id: '112464600187556',
                          form_id: '1616801872291121',
                          // Missing leadgen_id
                        },
                      },
                      {
                        field: 'leadgen',
                        value: {
                          created_time: 1758794730,
                          leadgen_id: '1459076748710714',
                          page_id: '112464600187556',
                          form_id: '1616801872291122',
                        },
                      },
                    ],
                  },
                ],
              }),
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
                      page_id: '112464600187556',
                      form_id: '1616801872291122',
                    },
                  },
                  anonymousId: '1459076748710714',
                  messageId: '112464600187556-1616801872291122-1459076748710714',
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
                    id: '112464600187556',
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
                          page_id: '112464600187556',
                          form_id: '1616801872291122',
                        },
                      },
                    ],
                  },
                ],
              }),
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
                      page_id: '112464600187556',
                      form_id: '1616801872291122',
                    },
                  },
                  anonymousId: '1459076748710714',
                  messageId: '112464600187556-1616801872291122-1459076748710714',
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
                    id: '112464600187556',
                    time: 1758794733,
                    changes: [
                      {
                        field: 'leadgen',
                        value: {
                          leadgen_id: '1459076748710713',
                          page_id: '112464600187556',
                          form_id: '1616801872291121',
                          // Missing created_time
                        },
                      },
                    ],
                  },
                ],
              }),
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
                      page_id: '112464600187556',
                      form_id: '1616801872291121',
                    },
                  },
                  anonymousId: '1459076748710713',
                  messageId: '112464600187556-1616801872291121-1459076748710713',
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
                    id: '112464600187556',
                    // Missing time field
                    changes: [
                      {
                        field: 'leadgen',
                        value: {
                          created_time: 1758794728,
                          leadgen_id: '1459076748710713',
                          page_id: '112464600187556',
                          form_id: '1616801872291121',
                        },
                      },
                    ],
                  },
                ],
              }),
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
                      page_id: '112464600187556',
                      form_id: '1616801872291121',
                    },
                  },
                  anonymousId: '1459076748710713',
                  messageId: '112464600187556-1616801872291121-1459076748710713',
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
];
