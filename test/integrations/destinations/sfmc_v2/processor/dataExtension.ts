import { generateMetadata, generateRecordPayload } from '../../../testUtils';
import { commonDestination } from './contact';

export const dataExtensionTests = [
  {
    name: 'sfmc_v2',
    description: 'We are testing valid scenario for data extension insert',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: generateRecordPayload({
              fields: {
                Key2: 'Test Name 1',
                Key3: 'test1@mail.com',
                Key4: '9876543210',
                Key5: 'delhi',
              },
              identifiers: {
                Key1: 'user1',
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
                  values: {
                    Key2: 'Test Name 1',
                    Key3: 'test1@mail.com',
                    Key4: '9876543210',
                    Key5: 'delhi',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
              },
              endpoint:
                'https://validSubDomain.rest.marketingcloudapis.com/hub/v1/dataevents/key:123/rows/Key1:user1',
              files: {},
              headers: {
                Authorization: 'Bearer yourAuthToken',
                'Content-Type': 'application/json',
              },
              method: 'PUT',
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
    description: 'We are testing valid scenario for data extension delete',
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
                Key2: 'Test Name 1',
                Key3: 'test1@mail.com',
                Key4: '9876543210',
                Key5: 'delhi',
              },
              identifiers: {
                Key1: 'user1',
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
    description: 'We are testing valid scenario for data extension update',
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
                Key2: 'Test Name 1',
                Key3: 'test1@mail.com',
                Key4: '9876543210',
                Key5: 'delhi',
              },
              identifiers: {
                Key1: 'user1',
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
                  values: {
                    Key2: 'Test Name 1',
                    Key3: 'test1@mail.com',
                    Key4: '9876543210',
                    Key5: 'delhi',
                  },
                },
                JSON_ARRAY: {},
                XML: {},
              },
              endpoint:
                'https://validSubDomain.rest.marketingcloudapis.com/hub/v1/dataevents/key:123/rows/Key1:user1',
              files: {},
              headers: {
                Authorization: 'Bearer yourAuthToken',
                'Content-Type': 'application/json',
              },
              method: 'PUT',
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
