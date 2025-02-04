import { generateMetadata, generateRecordPayload } from '../../../testUtils';

export const commonDestination = {
  Config: {
    clientId: 'validClientId',
    clientSecret: 'validClientSecret',
    subDomain: 'validSubDomain',
  },
  DestinationDefinition: {
    Config: {
      cdkV2Enabled: true,
    },
  },
};

export const contactTests = [
  {
    name: 'sfmc_v2',
    description: 'We are testing valid scenario for contact insert',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: generateRecordPayload({
              fields: {
                'Subscription.Modified_Date': 21,
                'MobilePush Demographics.City': 'delhi',
                'MobilePush Demographics.Is Honor DST': 'Test Name 1',
              },
              identifiers: {
                contactKey: 'test1@mail.com',
              },
            }),
            connection: {
              enabled: true,
              config: {
                source: {
                  schedule: {
                    type: 'manual',
                    unit: 'minutes',
                    every: 0,
                  },
                  syncSettings: {
                    syncLogsConfig: {
                      enabled: true,
                      snapshotsToRetain: 5,
                      logRetentionInDays: 30,
                    },
                    failedKeysConfig: {
                      enableFailedKeysRetry: true,
                    },
                  },
                },
                destination: {
                  syncMode: 'mirror',
                  eventType: 'record',
                  objectType: 'contact',
                  dataExtensionKey: '123',
                  fieldMappings: [
                    {
                      to: 'MobilePush Demographics.Last Name',
                      from: 'name',
                    },
                    {
                      to: 'MobilePush Demographics.First Name',
                      from: 'name',
                    },
                    {
                      to: 'Chat Message Subscriptions.OptInDate',
                      from: 'phone',
                    },
                    {
                      to: 'MobileConnect Subscriptions.Keyword',
                      from: 'phone',
                    },
                  ],
                  schemaVersion: '1.1',
                  identifierMappings: [
                    {
                      to: 'contactKey',
                      from: 'email',
                    },
                  ],
                },
              },
              processorEnabled: false,
            },
            metadata: generateMetadata(1),
            destination: commonDestination,
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
            metadata: generateMetadata(1),
            output: {
              body: {
                FORM: {},
                JSON: {
                  attributeSets: [
                    {
                      items: [
                        {
                          values: [
                            {
                              name: 'Modified_Date',
                              value: 21,
                            },
                          ],
                        },
                      ],
                      name: 'Subscription',
                    },
                    {
                      items: [
                        {
                          values: [
                            {
                              name: 'City',
                              value: 'delhi',
                            },
                            {
                              name: 'Is Honor DST',
                              value: 'Test Name 1',
                            },
                          ],
                        },
                      ],
                      name: 'MobilePush Demographics',
                    },
                  ],
                  contactKey: 'test1@mail.com',
                },
                JSON_ARRAY: {},
                XML: {},
              },
              endpoint: 'https://validSubDomain.rest.marketingcloudapis.com/contacts/v1/contacts',
              files: {},
              headers: {
                Authorization: 'Bearer yourAuthToken',
                'Content-Type': 'application/json',
              },
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
  {
    name: 'sfmc_v2',
    description: 'We are testing valid scenario for contact delete',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: generateRecordPayload({
              action: 'delete',
              fields: {
                'Subscription.Modified_Date': 21,
                'MobilePush Demographics.City': 'delhi',
                'MobilePush Demographics.Is Honor DST': 'Test Name 1',
              },
              identifiers: {
                contactKey: 'test1@mail.com',
              },
            }),
            connection: {
              enabled: true,
              config: {
                source: {
                  schedule: {
                    type: 'manual',
                    unit: 'minutes',
                    every: 0,
                  },
                  syncSettings: {
                    syncLogsConfig: {
                      enabled: true,
                      snapshotsToRetain: 5,
                      logRetentionInDays: 30,
                    },
                    failedKeysConfig: {
                      enableFailedKeysRetry: true,
                    },
                  },
                },
                destination: {
                  syncMode: 'mirror',
                  eventType: 'record',
                  objectType: 'contact',
                  dataExtensionKey: '123',
                  fieldMappings: [
                    {
                      to: 'MobilePush Demographics.Last Name',
                      from: 'name',
                    },
                    {
                      to: 'MobilePush Demographics.First Name',
                      from: 'name',
                    },
                    {
                      to: 'Chat Message Subscriptions.OptInDate',
                      from: 'phone',
                    },
                    {
                      to: 'MobileConnect Subscriptions.Keyword',
                      from: 'phone',
                    },
                  ],
                  schemaVersion: '1.1',
                  identifierMappings: [
                    {
                      to: 'contactKey',
                      from: 'email',
                    },
                  ],
                },
              },
              processorEnabled: false,
            },
            metadata: generateMetadata(1),
            destination: commonDestination,
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
            metadata: generateMetadata(1),
            output: {
              body: {
                FORM: {},
                JSON: {
                  DeleteOperationType: 'ContactAndAttributes',
                  values: ['test1@mail.com'],
                },
                JSON_ARRAY: {},
                XML: {},
              },
              endpoint:
                'https://validSubDomain.rest.marketingcloudapis.com/contacts/v1/contacts/actions/delete?type=keys',
              files: {},
              headers: {
                Authorization: 'Bearer yourAuthToken',
                'Content-Type': 'application/json',
              },
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
  {
    name: 'sfmc_v2',
    description: 'We are testing valid scenario for contact update',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: generateRecordPayload({
              action: 'update',
              fields: {
                'Subscription.Modified_Date': 21,
                'MobilePush Demographics.City': 'delhi',
                'MobilePush Demographics.Is Honor DST': 'Test Name 1',
              },
              identifiers: {
                contactKey: 'test1@mail.com',
              },
            }),
            connection: {
              enabled: true,
              config: {
                source: {
                  schedule: {
                    type: 'manual',
                    unit: 'minutes',
                    every: 0,
                  },
                  syncSettings: {
                    syncLogsConfig: {
                      enabled: true,
                      snapshotsToRetain: 5,
                      logRetentionInDays: 30,
                    },
                    failedKeysConfig: {
                      enableFailedKeysRetry: true,
                    },
                  },
                },
                destination: {
                  syncMode: 'mirror',
                  eventType: 'record',
                  objectType: 'contact',
                  dataExtensionKey: '123',
                  fieldMappings: [
                    {
                      to: 'MobilePush Demographics.Last Name',
                      from: 'name',
                    },
                    {
                      to: 'MobilePush Demographics.First Name',
                      from: 'name',
                    },
                    {
                      to: 'Chat Message Subscriptions.OptInDate',
                      from: 'phone',
                    },
                    {
                      to: 'MobileConnect Subscriptions.Keyword',
                      from: 'phone',
                    },
                  ],
                  schemaVersion: '1.1',
                  identifierMappings: [
                    {
                      to: 'contactKey',
                      from: 'email',
                    },
                  ],
                },
              },
              processorEnabled: false,
            },
            metadata: generateMetadata(1),
            destination: commonDestination,
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
            metadata: generateMetadata(1),
            output: {
              body: {
                FORM: {},
                JSON: {
                  attributeSets: [
                    {
                      items: [
                        {
                          values: [
                            {
                              name: 'Modified_Date',
                              value: 21,
                            },
                          ],
                        },
                      ],
                      name: 'Subscription',
                    },
                    {
                      items: [
                        {
                          values: [
                            {
                              name: 'City',
                              value: 'delhi',
                            },
                            {
                              name: 'Is Honor DST',
                              value: 'Test Name 1',
                            },
                          ],
                        },
                      ],
                      name: 'MobilePush Demographics',
                    },
                  ],
                  contactKey: 'test1@mail.com',
                },
                JSON_ARRAY: {},
                XML: {},
              },
              endpoint: 'https://validSubDomain.rest.marketingcloudapis.com/contacts/v1/contacts',
              files: {},
              headers: {
                Authorization: 'Bearer yourAuthToken',
                'Content-Type': 'application/json',
              },
              method: 'PATCH',
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
  {
    name: 'sfmc_v2',
    description: 'We are testing failure scenario for contact for wrong eventType',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'identify',
              action: 'update',
            },
            connection: {
              enabled: true,
              config: {
                source: {
                  schedule: {
                    type: 'manual',
                    unit: 'minutes',
                    every: 0,
                  },
                  syncSettings: {
                    syncLogsConfig: {
                      enabled: true,
                      snapshotsToRetain: 5,
                      logRetentionInDays: 30,
                    },
                    failedKeysConfig: {
                      enableFailedKeysRetry: true,
                    },
                  },
                },
                destination: {
                  syncMode: 'mirror',
                  eventType: 'record',
                  objectType: 'contact',
                  dataExtensionKey: '123',
                  fieldMappings: [
                    {
                      to: 'MobilePush Demographics.Last Name',
                      from: 'name',
                    },
                    {
                      to: 'MobilePush Demographics.First Name',
                      from: 'name',
                    },
                    {
                      to: 'Chat Message Subscriptions.OptInDate',
                      from: 'phone',
                    },
                    {
                      to: 'MobileConnect Subscriptions.Keyword',
                      from: 'phone',
                    },
                  ],
                  schemaVersion: '1.1',
                  identifierMappings: [
                    {
                      to: 'contactKey',
                      from: 'email',
                    },
                  ],
                },
              },
              processorEnabled: false,
            },
            metadata: generateMetadata(1),
            destination: commonDestination,
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
              'Event type identify is not supported. Aborting message.: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: Event type identify is not supported. Aborting message.',
            metadata: generateMetadata(1),
            statTags: {
              destType: 'SFMC_V2',
              destinationId: 'default-destinationId',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
              workspaceId: 'default-workspaceId',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
];
