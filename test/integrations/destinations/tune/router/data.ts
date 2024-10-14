export const data = [
  {
    name: 'tune',
    description: 'Track call',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                type: 'track',
                event: 'Product added',
                context: {
                  traits: {
                    customProperty1: 'customValue',
                    firstName: 'David',
                    logins: 2,
                  },
                },
                anonymousId: 'david_bowie_anonId',
                rudderId: '27e0a4fc-db65-47b7-ab3e-692e4e3c6b6b',
                messageId: '7359e92b-b2d9-4147-9c8c-c0e7f060cbcc',
              },
              metadata: { jobId: 1, userId: 'u1' },
              destination: {
                secretConfig: {},
                Config: {
                  blacklistedEvents: [
                    {
                      eventName: '',
                    },
                  ],
                  whitelistedEvents: [
                    {
                      eventName: '',
                    },
                  ],
                  eventFilteringOption: 'disable',
                  connectionMode: {
                    web: 'cloud',
                  },
                  consentManagement: {},
                  tuneEvents: [
                    {
                      url: 'https://demo.go2cloud.org/aff_l?offer_id=45&aff_id=1029',
                      eventName: 'Product added',
                      eventsMapping: [
                        {
                          to: 'adv_sub',
                          from: 'advSub',
                        },
                        {
                          to: 'aff_id',
                          from: 'affId',
                        },
                        {
                          to: 'goal_id',
                          from: 'goalId',
                        },
                        {
                          to: 'revenue',
                          from: 'revenue',
                        },
                        {
                          to: 'security_token',
                          from: 'securityToken',
                        },
                        {
                          to: 'status',
                          from: 'status',
                        },
                        {
                          to: 'transaction_id',
                          from: 'transactionId',
                        },
                      ],
                    },
                  ],
                },
              },
            },
          ],
          destType: 'tune',
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
                endpoint: 'https://demo.go2cloud.org/aff_l?offer_id=45&aff_id=1029',
                event: 'Product added',
                headers: {},
                params: {
                  offer_id: '45',
                  aff_id: '1029',
                },
                body: {
                  JSON: {},
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
                secretConfig: {},
                Config: {
                  blacklistedEvents: [
                    {
                      eventName: '',
                    },
                  ],
                  whitelistedEvents: [
                    {
                      eventName: '',
                    },
                  ],
                  eventFilteringOption: 'disable',
                  connectionMode: {
                    web: 'cloud',
                  },
                  consentManagement: {},
                  tuneEvents: [
                    {
                      url: 'https://demo.go2cloud.org/aff_l?offer_id=45&aff_id=1029',
                      eventName: 'Product added',
                      eventsMapping: [
                        {
                          to: 'adv_sub',
                          from: 'advSub',
                        },
                        {
                          to: 'aff_id',
                          from: 'affId',
                        },
                        {
                          to: 'goal_id',
                          from: 'goalId',
                        },
                        {
                          to: 'revenue',
                          from: 'revenue',
                        },
                        {
                          to: 'security_token',
                          from: 'securityToken',
                        },
                        {
                          to: 'status',
                          from: 'status',
                        },
                        {
                          to: 'transaction_id',
                          from: 'transactionId',
                        },
                      ],
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
