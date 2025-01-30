export const data = [
  {
    name: 'sfmc_v2',
    description: 'Test 0',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
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
                destinationId: 'default-destination',
              },
              destination: {
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
              },
            },
            {
              message: {
                type: 'record',
                action: 'delete',
                fields: {
                  Key2: 'Test Name 1',
                  Key3: 'test1@mail.com',
                  Key4: '9876543210',
                  Key5: 'delhi',
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
                  Key1: 'user1',
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
                    objectType: 'dataExtension',
                    dataExtensionKey: '123',
                    fieldMappings: [
                      {
                        to: 'Key2',
                        from: 'name',
                      },
                      {
                        to: 'Key3',
                        from: 'email',
                      },
                      {
                        to: 'Key4',
                        from: 'phone',
                      },
                      {
                        to: 'Key5',
                        from: 'city',
                      },
                    ],
                    schemaVersion: '1.1',
                    identifierMappings: [
                      {
                        to: 'key1',
                        from: 'userId',
                      },
                    ],
                  },
                },
                processorEnabled: false,
              },
              metadata: {
                jobId: 2,
                destinationId: 'default-destination',
              },
              destination: {
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
              },
            },
          ],
          destType: 'sfmc_v2',
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
                version: '1',
              },
              destination: {
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
              },
              metadata: [
                {
                  destinationId: 'default-destination',
                  jobId: 1,
                },
              ],
              statusCode: 200,
            },
            {
              batched: false,
              batchedRequest: {
                body: {
                  FORM: {},
                  JSON: {},
                  JSON_ARRAY: {},
                  XML: {
                    payload:
                      '<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"><s:Header><fueloauth>yourAuthToken</fueloauth></s:Header><s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"><DeleteRequest xmlns="http://exacttarget.com/wsdl/partnerAPI"><Objects xsi:type="DataExtensionObject"><CustomerKey>123</CustomerKey><Keys><Key><Name>Key1</Name><Value>user1</Value></Key></Keys></Objects></DeleteRequest></s:Body></s:Envelope>',
                  },
                },
                endpoint: 'https://validSubDomain.soap.marketingcloudapis.com/Service.asmx',
                files: {},
                headers: {
                  'Content-Type': 'text/xml; charset="UTF-8"',
                  soapaction: 'Delete',
                },
                method: 'POST',
                params: {},
                type: 'REST',
                version: '1',
              },
              destination: {
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
              },
              metadata: [
                {
                  destinationId: 'default-destination',
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
