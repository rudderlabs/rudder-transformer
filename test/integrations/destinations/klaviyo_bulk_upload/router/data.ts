export const data = [
  {
    name: 'klaviyo_bulk_upload',
    description: 'Multiple jobs with different metadata',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination: {
                ID: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
                Name: 'KLAVIYO_BULK_UPLOAD',
                DestinationDefinition: {
                  Config: {
                    cdkV2Enabled: true,
                  },
                },
                Config: {
                  privateApiKey: 'privateKey',
                },
                Enabled: true,
                Transformations: [],
              },
              metadata: {
                jobId: 1,
              },
              message: {
                channel: 'web',
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.3.4',
                  },
                  traits: {
                    email: 'slonefox2@gmail.com',
                    firstName: 'slone',
                    lastName: 'fox2',
                    leadSource: 'clone fox inc.2',
                    company: 'buggati baygon',
                  },
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.3.4',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36',
                  locale: 'en-IN',
                  os: {
                    name: '',
                    version: '',
                  },
                },
                traits: {
                  email: 'slonefox2@gmail.com',
                  firstName: 'slone',
                  lastName: 'fox2',
                  leadSource: 'clone fox inc.2',
                  company: 'buggati baygon',
                },
                type: 'identify',
                originalTimestamp: '2022-02-08T10:08:15.308Z',
                anonymousId: 'ec8ae2b4-1cdf-4bdb-ac6f-594bdg40c4bc',
                userId: 'li001tc',
                integrations: {
                  All: true,
                },
                sentAt: '2022-02-08T10:08:15.309Z',
              },
            },
            {
              destination: {
                ID: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
                Name: 'KLAVIYO_BULK_UPLOAD',
                DestinationDefinition: {
                  Config: {
                    cdkV2Enabled: true,
                  },
                },
                Config: {
                  privateApiKey: 'privateKey',
                },
                Enabled: true,
                Transformations: [],
              },
              metadata: {
                jobId: 2,
              },
              message: {
                channel: 'web',
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.3.4',
                  },
                  traits: {
                    email: 'slonefox2@gmail.com',
                    firstName: 'slone',
                    lastName: 'fox2',
                    leadSource: 'clone fox inc.2',
                    company: 'buggati baygon',
                  },
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.3.4',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36',
                  locale: 'en-IN',
                  os: {
                    name: '',
                    version: '',
                  },
                },
                traits: {
                  email: 'slonefox2@gmail.com',
                  firstName: 'slone',
                  lastName: 'fox3',
                  leadSource: 'clone fox inc.2',
                  company: 'buggati baygon',
                },
                type: 'identify',
                originalTimestamp: '2022-02-08T10:08:15.308Z',
                anonymousId: 'ec8ae2b4-1cdf-4bdb-ac6f-594bdg40c4bc',
                userId: 'li001tc',
                integrations: {
                  All: true,
                },
                sentAt: '2022-02-08T10:08:15.309Z',
              },
            },
          ],
          destType: 'klaviyo_bulk_upload',
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
                  data: {
                    type: 'profile-bulk-import-job',
                    attributes: {
                      profiles: [
                        {
                          type: 'profile',
                          attributes: {
                            email: 'slonefox2@gmail.com',
                            firstName: 'slone',
                            lastName: 'fox2',
                            leadSource: 'clone fox inc.2',
                            company: 'buggati baygon',
                            anonymous_id: 'li001tc',
                          },
                        },
                        {
                          type: 'profile',
                          attributes: {
                            email: 'slonefox2@gmail.com',
                            firstName: 'slone',
                            lastName: 'fox3',
                            leadSource: 'clone fox inc.2',
                            company: 'buggati baygon',
                            anonymous_id: 'li001tc',
                          },
                        },
                      ],
                    },
                  },
                },
              ],
              batched: true,
              destination: {
                ID: '1pYpzzvcn7AQ2W9GGIAZSsN6Mfq',
                Name: 'KLAVIYO_BULK_UPLOAD',
                DestinationDefinition: {
                  Config: {
                    cdkV2Enabled: true,
                  },
                },
                Config: {
                  privateApiKey: 'privateKey',
                },
                Enabled: true,
                Transformations: [],
              },
              metadata: [
                {
                  jobId: 1,
                },
                {
                  jobId: 2,
                },
              ],
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
];
