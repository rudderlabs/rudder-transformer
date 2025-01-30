export const accessTokenTests = [
  {
    name: 'sfmc_v2',
    description: 'We are testing failure scenario when clientId is wrong',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'record',
              action: 'insert',
              fields: {
                'Subscription.Modified_Date': 21,
                'MobilePush Demographics.City': 'delhi',
                'MobilePush Demographics.Is Honor DST': 'Test Name 1',
              },
              userId: '95582e9e-38fe-447f-9e4b-817d6e4d0c2e',
              channel: 'sources',
              context: {
                sources: {
                  job_id: '2rtFmdkX7aFXgKXqMkp97kqSzia',
                  version: 'local',
                  job_run_id: 'cubrc3j2i731fpi60mv0',
                  task_run_id: 'cubrc3r2i731fpi60mvg',
                },
              },
              recordId: '5',
              rudderId: '46466a83-cd49-4b17-b101-5447a5f5bd05',
              messageId: '2bc221ea-6046-4fd4-9dff-74b5ea389f4d',
              receivedAt: '2025-01-27T16:37:51.735Z',
              request_ip: '[::1]',
              identifiers: {
                contactKey: 'test1@mail.com',
              },
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
            metadata: {
              jobId: 1,
              destinationId: 'default-destination1',
            },
            destination: {
              Config: {
                clientId: 'inValidClientId',
                clientSecret: 'validClientSecret',
                subDomain: 'inValidSubDomain',
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
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
              '{"message":"{\\"message\\":\\"Could not retrieve access token: Workflow: procWorkflow, Step: getAccessToken, ChildStep: undefined, OriginalError: Could not retrieve access token\\",\\"destinationResponse\\":{\\"error\\":\\"invalid_client\\",\\"error_description\\":\\"Invalid client ID. Use the client ID in Marketing Cloud Installed Packages.\\",\\"error_uri\\":\\"https://developer.salesforce.com/docs\\"}}","destinationResponse":{"error":"invalid_client","error_description":"Invalid client ID. Use the client ID in Marketing Cloud Installed Packages.","error_uri":"https://developer.salesforce.com/docs"}}',
            metadata: {
              destinationId: 'default-destination1',
              jobId: 1,
            },
            statTags: {
              destType: 'SFMC_V2',
              destinationId: 'default-destination1',
              errorCategory: 'network',
              errorType: 'aborted',
              feature: 'processor',
              implementation: 'cdkV2',
              module: 'destination',
            },
            statusCode: 401,
          },
        ],
      },
    },
  },
];
