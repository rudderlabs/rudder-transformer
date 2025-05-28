import { get } from 'lodash';
import { generateMetadata, generateRecordPayload } from '../../../testUtils';

const connection = {
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
};

const destination = {
  Config: {
    clientId: 'validClientId',
    clientSecret: 'validClientSecret',
    subDomain: 'validSubDomain',
  },
  DestinationDefinition: {
    Config: {},
  },
};

const insertDataExtesionInputs = Array.from({ length: 10 }, (_, i) => ({
  message: generateRecordPayload({
    identifiers: {
      Key1: `user${i}`,
    },
    fields: {
      Key2: `value${i}-1`,
      Key3: `value${i}-2`,
      Key4: `value${i}-3`,
      Key5: `value${i}-4`,
    },
    action: 'insert',
  }),
  metadata: generateMetadata(i),
  destination,
  connection,
}));

const updateDataExtesionInputs = Array.from({ length: 10 }, (_, i) => ({
  message: generateRecordPayload({
    identifiers: {
      Key1: `user${i}`,
    },
    fields: {
      Key2: `value${i}-1`,
      Key3: `value${i}-2`,
      Key4: `value${i}-3`,
      Key5: `value${i}-4`,
    },
    action: 'update',
  }),
  metadata: generateMetadata(i + 10),
  destination,
  connection,
}));

const deletDataExtesionInputs = Array.from({ length: 10 }, (_, i) => ({
  message: generateRecordPayload({
    identifiers: {
      Key1: `user${i}`,
    },
    action: 'delete',
  }),
  metadata: generateMetadata(i + 20),
  destination,
  connection,
}));

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
            ...deletDataExtesionInputs,
            ...insertDataExtesionInputs,
            ...updateDataExtesionInputs,
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
              batched: true,
              batchedRequest: {
                body: {
                  FORM: {},
                  JSON: {},
                  JSON_ARRAY: {},
                  XML: {
                    payload:
                      '<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"><s:Header><fueloauth>yourAuthToken</fueloauth></s:Header><s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"><CreateRequest xmlns="http://exacttarget.com/wsdl/partnerAPI"><Objects xsi:type="DataExtensionObject"><CustomerKey>123</CustomerKey><Properties><Property><Name>Key1</Name><Value>user0</Value></Property><Property><Name>Key2</Name><Value>value0-1</Value></Property><Property><Name>Key3</Name><Value>value0-2</Value></Property><Property><Name>Key4</Name><Value>value0-3</Value></Property><Property><Name>Key5</Name><Value>value0-4</Value></Property></Properties></Objects><Objects xsi:type="DataExtensionObject"><CustomerKey>123</CustomerKey><Properties><Property><Name>Key1</Name><Value>user1</Value></Property><Property><Name>Key2</Name><Value>value1-1</Value></Property><Property><Name>Key3</Name><Value>value1-2</Value></Property><Property><Name>Key4</Name><Value>value1-3</Value></Property><Property><Name>Key5</Name><Value>value1-4</Value></Property></Properties></Objects><Objects xsi:type="DataExtensionObject"><CustomerKey>123</CustomerKey><Properties><Property><Name>Key1</Name><Value>user2</Value></Property><Property><Name>Key2</Name><Value>value2-1</Value></Property><Property><Name>Key3</Name><Value>value2-2</Value></Property><Property><Name>Key4</Name><Value>value2-3</Value></Property><Property><Name>Key5</Name><Value>value2-4</Value></Property></Properties></Objects><Objects xsi:type="DataExtensionObject"><CustomerKey>123</CustomerKey><Properties><Property><Name>Key1</Name><Value>user3</Value></Property><Property><Name>Key2</Name><Value>value3-1</Value></Property><Property><Name>Key3</Name><Value>value3-2</Value></Property><Property><Name>Key4</Name><Value>value3-3</Value></Property><Property><Name>Key5</Name><Value>value3-4</Value></Property></Properties></Objects><Objects xsi:type="DataExtensionObject"><CustomerKey>123</CustomerKey><Properties><Property><Name>Key1</Name><Value>user4</Value></Property><Property><Name>Key2</Name><Value>value4-1</Value></Property><Property><Name>Key3</Name><Value>value4-2</Value></Property><Property><Name>Key4</Name><Value>value4-3</Value></Property><Property><Name>Key5</Name><Value>value4-4</Value></Property></Properties></Objects><Objects xsi:type="DataExtensionObject"><CustomerKey>123</CustomerKey><Properties><Property><Name>Key1</Name><Value>user5</Value></Property><Property><Name>Key2</Name><Value>value5-1</Value></Property><Property><Name>Key3</Name><Value>value5-2</Value></Property><Property><Name>Key4</Name><Value>value5-3</Value></Property><Property><Name>Key5</Name><Value>value5-4</Value></Property></Properties></Objects><Objects xsi:type="DataExtensionObject"><CustomerKey>123</CustomerKey><Properties><Property><Name>Key1</Name><Value>user6</Value></Property><Property><Name>Key2</Name><Value>value6-1</Value></Property><Property><Name>Key3</Name><Value>value6-2</Value></Property><Property><Name>Key4</Name><Value>value6-3</Value></Property><Property><Name>Key5</Name><Value>value6-4</Value></Property></Properties></Objects><Objects xsi:type="DataExtensionObject"><CustomerKey>123</CustomerKey><Properties><Property><Name>Key1</Name><Value>user7</Value></Property><Property><Name>Key2</Name><Value>value7-1</Value></Property><Property><Name>Key3</Name><Value>value7-2</Value></Property><Property><Name>Key4</Name><Value>value7-3</Value></Property><Property><Name>Key5</Name><Value>value7-4</Value></Property></Properties></Objects><Objects xsi:type="DataExtensionObject"><CustomerKey>123</CustomerKey><Properties><Property><Name>Key1</Name><Value>user8</Value></Property><Property><Name>Key2</Name><Value>value8-1</Value></Property><Property><Name>Key3</Name><Value>value8-2</Value></Property><Property><Name>Key4</Name><Value>value8-3</Value></Property><Property><Name>Key5</Name><Value>value8-4</Value></Property></Properties></Objects><Objects xsi:type="DataExtensionObject"><CustomerKey>123</CustomerKey><Properties><Property><Name>Key1</Name><Value>user9</Value></Property><Property><Name>Key2</Name><Value>value9-1</Value></Property><Property><Name>Key3</Name><Value>value9-2</Value></Property><Property><Name>Key4</Name><Value>value9-3</Value></Property><Property><Name>Key5</Name><Value>value9-4</Value></Property></Properties></Objects></CreateRequest></s:Body></s:Envelope>',
                  },
                },
                endpoint: 'https://validSubDomain.soap.marketingcloudapis.com/Service.asmx',
                files: {},
                headers: {
                  'Content-Type': 'text/xml; charset="UTF-8"',
                  SOAPAction: 'Create',
                },
                method: 'POST',
                params: {},
                type: 'REST',
                version: '1',
              },
              destination,
              metadata: insertDataExtesionInputs.map((input) => input.metadata),
              statusCode: 200,
            },
            {
              batched: true,
              batchedRequest: {
                body: {
                  FORM: {},
                  JSON: {},
                  JSON_ARRAY: {},
                  XML: {
                    payload:
                      '<s:Envelope xmlns:s=\"http://www.w3.org/2003/05/soap-envelope\" xmlns:a=\"http://schemas.xmlsoap.org/ws/2004/08/addressing\" xmlns:u=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd\"><s:Header><fueloauth>yourAuthToken</fueloauth></s:Header><s:Body xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\"><UpdateRequest xmlns=\"http://exacttarget.com/wsdl/partnerAPI\"><Objects xsi:type=\"DataExtensionObject\"><CustomerKey>123</CustomerKey><Properties><Property><Name>Key1</Name><Value>user0</Value></Property><Property><Name>Key2</Name><Value>value0-1</Value></Property><Property><Name>Key3</Name><Value>value0-2</Value></Property><Property><Name>Key4</Name><Value>value0-3</Value></Property><Property><Name>Key5</Name><Value>value0-4</Value></Property></Properties></Objects><Objects xsi:type=\"DataExtensionObject\"><CustomerKey>123</CustomerKey><Properties><Property><Name>Key1</Name><Value>user1</Value></Property><Property><Name>Key2</Name><Value>value1-1</Value></Property><Property><Name>Key3</Name><Value>value1-2</Value></Property><Property><Name>Key4</Name><Value>value1-3</Value></Property><Property><Name>Key5</Name><Value>value1-4</Value></Property></Properties></Objects><Objects xsi:type=\"DataExtensionObject\"><CustomerKey>123</CustomerKey><Properties><Property><Name>Key1</Name><Value>user2</Value></Property><Property><Name>Key2</Name><Value>value2-1</Value></Property><Property><Name>Key3</Name><Value>value2-2</Value></Property><Property><Name>Key4</Name><Value>value2-3</Value></Property><Property><Name>Key5</Name><Value>value2-4</Value></Property></Properties></Objects><Objects xsi:type=\"DataExtensionObject\"><CustomerKey>123</CustomerKey><Properties><Property><Name>Key1</Name><Value>user3</Value></Property><Property><Name>Key2</Name><Value>value3-1</Value></Property><Property><Name>Key3</Name><Value>value3-2</Value></Property><Property><Name>Key4</Name><Value>value3-3</Value></Property><Property><Name>Key5</Name><Value>value3-4</Value></Property></Properties></Objects><Objects xsi:type=\"DataExtensionObject\"><CustomerKey>123</CustomerKey><Properties><Property><Name>Key1</Name><Value>user4</Value></Property><Property><Name>Key2</Name><Value>value4-1</Value></Property><Property><Name>Key3</Name><Value>value4-2</Value></Property><Property><Name>Key4</Name><Value>value4-3</Value></Property><Property><Name>Key5</Name><Value>value4-4</Value></Property></Properties></Objects><Objects xsi:type=\"DataExtensionObject\"><CustomerKey>123</CustomerKey><Properties><Property><Name>Key1</Name><Value>user5</Value></Property><Property><Name>Key2</Name><Value>value5-1</Value></Property><Property><Name>Key3</Name><Value>value5-2</Value></Property><Property><Name>Key4</Name><Value>value5-3</Value></Property><Property><Name>Key5</Name><Value>value5-4</Value></Property></Properties></Objects><Objects xsi:type=\"DataExtensionObject\"><CustomerKey>123</CustomerKey><Properties><Property><Name>Key1</Name><Value>user6</Value></Property><Property><Name>Key2</Name><Value>value6-1</Value></Property><Property><Name>Key3</Name><Value>value6-2</Value></Property><Property><Name>Key4</Name><Value>value6-3</Value></Property><Property><Name>Key5</Name><Value>value6-4</Value></Property></Properties></Objects><Objects xsi:type=\"DataExtensionObject\"><CustomerKey>123</CustomerKey><Properties><Property><Name>Key1</Name><Value>user7</Value></Property><Property><Name>Key2</Name><Value>value7-1</Value></Property><Property><Name>Key3</Name><Value>value7-2</Value></Property><Property><Name>Key4</Name><Value>value7-3</Value></Property><Property><Name>Key5</Name><Value>value7-4</Value></Property></Properties></Objects><Objects xsi:type=\"DataExtensionObject\"><CustomerKey>123</CustomerKey><Properties><Property><Name>Key1</Name><Value>user8</Value></Property><Property><Name>Key2</Name><Value>value8-1</Value></Property><Property><Name>Key3</Name><Value>value8-2</Value></Property><Property><Name>Key4</Name><Value>value8-3</Value></Property><Property><Name>Key5</Name><Value>value8-4</Value></Property></Properties></Objects><Objects xsi:type=\"DataExtensionObject\"><CustomerKey>123</CustomerKey><Properties><Property><Name>Key1</Name><Value>user9</Value></Property><Property><Name>Key2</Name><Value>value9-1</Value></Property><Property><Name>Key3</Name><Value>value9-2</Value></Property><Property><Name>Key4</Name><Value>value9-3</Value></Property><Property><Name>Key5</Name><Value>value9-4</Value></Property></Properties></Objects></UpdateRequest></s:Body></s:Envelope>',
                  },
                },
                endpoint: 'https://validSubDomain.soap.marketingcloudapis.com/Service.asmx',
                files: {},
                headers: {
                  'Content-Type': 'text/xml; charset="UTF-8"',
                  SOAPAction: 'Update',
                },
                method: 'POST',
                params: {},
                type: 'REST',
                version: '1',
              },
              destination,
              metadata: updateDataExtesionInputs.map((input) => input.metadata),
              statusCode: 200,
            },
            {
              batched: true,
              batchedRequest: {
                body: {
                  FORM: {},
                  JSON: {},
                  JSON_ARRAY: {},
                  XML: {
                    payload:
                      '<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"><s:Header><fueloauth>yourAuthToken</fueloauth></s:Header><s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"><DeleteRequest xmlns="http://exacttarget.com/wsdl/partnerAPI"><Objects xsi:type="DataExtensionObject"><CustomerKey>123</CustomerKey><Keys><Key><Name>Key1</Name><Value>user0</Value></Key></Keys></Objects><Objects xsi:type="DataExtensionObject"><CustomerKey>123</CustomerKey><Keys><Key><Name>Key1</Name><Value>user1</Value></Key></Keys></Objects><Objects xsi:type="DataExtensionObject"><CustomerKey>123</CustomerKey><Keys><Key><Name>Key1</Name><Value>user2</Value></Key></Keys></Objects><Objects xsi:type="DataExtensionObject"><CustomerKey>123</CustomerKey><Keys><Key><Name>Key1</Name><Value>user3</Value></Key></Keys></Objects><Objects xsi:type="DataExtensionObject"><CustomerKey>123</CustomerKey><Keys><Key><Name>Key1</Name><Value>user4</Value></Key></Keys></Objects><Objects xsi:type="DataExtensionObject"><CustomerKey>123</CustomerKey><Keys><Key><Name>Key1</Name><Value>user5</Value></Key></Keys></Objects><Objects xsi:type="DataExtensionObject"><CustomerKey>123</CustomerKey><Keys><Key><Name>Key1</Name><Value>user6</Value></Key></Keys></Objects><Objects xsi:type="DataExtensionObject"><CustomerKey>123</CustomerKey><Keys><Key><Name>Key1</Name><Value>user7</Value></Key></Keys></Objects><Objects xsi:type="DataExtensionObject"><CustomerKey>123</CustomerKey><Keys><Key><Name>Key1</Name><Value>user8</Value></Key></Keys></Objects><Objects xsi:type="DataExtensionObject"><CustomerKey>123</CustomerKey><Keys><Key><Name>Key1</Name><Value>user9</Value></Key></Keys></Objects></DeleteRequest></s:Body></s:Envelope>',
                  },
                },
                endpoint: 'https://validSubDomain.soap.marketingcloudapis.com/Service.asmx',
                files: {},
                headers: {
                  'Content-Type': 'text/xml; charset="UTF-8"',
                  SOAPAction: 'Delete',
                },
                method: 'POST',
                params: {},
                type: 'REST',
                version: '1',
              },
              destination,
              metadata: deletDataExtesionInputs.map((input) => input.metadata),
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
];
