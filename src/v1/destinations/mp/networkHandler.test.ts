import { networkHandler } from './networkHandler';
import { TransformerProxyError } from '../../../v0/util/errorTypes';
import { ResponseHandlerParams } from '../../../types';
import { getZippedPayload } from './utils';

describe('Mixpanel V1 Network Handler', () => {
  const handler = new networkHandler();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('responseHandler', () => {
    interface TestCase {
      name: string;
      responseParams: ResponseHandlerParams;
      expectError: boolean;
      expectedStatus?: number;
      expectedMessage?: string;
      expectedResponseLength?: number;
      expectedEvents?: Array<{
        statusCode: number;
        error: string | jest.Expect;
        metadata: any;
      }>;
    }

    const mainTestCases: TestCase[] = [
      {
        name: 'undefined destinationRequest',
        responseParams: {
          destinationResponse: {
            status: 200,
            response: { success: true },
          },
          // destinationRequest is undefined
          // @ts-ignore - simplified test data
          rudderJobMetadata: [{ jobId: 1 }],
        },
        expectError: false,
        expectedStatus: 200,
        expectedMessage: 'Processed Successfully',
        expectedResponseLength: 1,
        expectedEvents: [{ statusCode: 200, error: 'success', metadata: { jobId: 1 } }],
      },
      {
        name: 'undefined endpoint',
        responseParams: {
          destinationResponse: {
            status: 200,
            response: { success: true },
          },
          // @ts-ignore - simplified test data
          destinationRequest: {}, // endpoint is undefined
          // @ts-ignore - simplified test data
          rudderJobMetadata: [{ jobId: 1 }],
        },
        expectError: false,
        expectedStatus: 200,
        expectedMessage: 'Processed Successfully',
        expectedResponseLength: 1,
        expectedEvents: [{ statusCode: 200, error: 'success', metadata: { jobId: 1 } }],
      },
      {
        name: 'successful Import API responses',
        responseParams: {
          destinationResponse: {
            status: 200,
            response: { success: true },
          },
          // @ts-ignore - simplified test data
          destinationRequest: {
            endpoint: 'https://api.mixpanel.com/import',
            method: 'POST',
            version: 'v1',
            type: 'mixpanel',
            userId: 'test-user',
            destinationConfig: {},
            body: {
              JSON_ARRAY: {
                batch: JSON.stringify([
                  { event: 'test', properties: { $insert_id: 'event1' } },
                  { event: 'test', properties: { $insert_id: 'event2' } },
                ]),
              },
            },
          },
          // @ts-ignore - simplified test data
          rudderJobMetadata: [{ jobId: 1 }, { jobId: 2 }],
        },
        expectError: false,
        expectedStatus: 200,
        expectedMessage: 'Processed Successfully',
        expectedResponseLength: 2,
        expectedEvents: [
          { statusCode: 200, error: 'success', metadata: { jobId: 1 } },
          { statusCode: 200, error: 'success', metadata: { jobId: 2 } },
        ],
      },
      {
        name: 'Import API partial failures',
        responseParams: {
          destinationResponse: {
            status: 400,
            response: {
              failed_records: [
                { $insert_id: 'event1', field: 'time', message: 'Invalid timestamp' },
              ],
              num_records_imported: 1,
            },
          },
          // @ts-ignore - simplified test data
          destinationRequest: {
            endpoint: 'https://api.mixpanel.com/import',
            method: 'POST',
            version: 'v1',
            type: 'mixpanel',
            userId: 'test-user',
            destinationConfig: {},
            body: {
              JSON_ARRAY: {
                batch: JSON.stringify([
                  { event: 'test', properties: { $insert_id: 'event1' } },
                  { event: 'test', properties: { $insert_id: 'event2' } },
                ]),
              },
            },
          },
          // @ts-ignore - simplified test data
          rudderJobMetadata: [{ jobId: 1 }, { jobId: 2 }],
        },
        expectError: false,
        expectedStatus: 200,
        expectedMessage: 'Partial failure',
        expectedResponseLength: 2,
        expectedEvents: [
          {
            statusCode: 400,
            error: expect.stringContaining('Invalid timestamp'),
            metadata: { jobId: 1 },
          },
          { statusCode: 200, error: 'success', metadata: { jobId: 2 } },
        ],
      },
      {
        name: 'Engage API successful responses',
        responseParams: {
          destinationResponse: {
            status: 200,
            response: { success: true },
          },
          // @ts-ignore - simplified test data
          destinationRequest: {
            endpoint: 'https://api.mixpanel.com/engage',
            method: 'POST',
            version: 'v1',
            type: 'mixpanel',
            userId: 'test-user',
            destinationConfig: {},
          },
          // @ts-ignore - simplified test data
          rudderJobMetadata: [{ jobId: 1 }, { jobId: 2 }],
        },
        expectError: false,
        expectedStatus: 200,
        expectedMessage: 'Processed Successfully',
        expectedResponseLength: 2,
        expectedEvents: [
          { statusCode: 200, error: 'success', metadata: { jobId: 1 } },
          { statusCode: 200, error: 'success', metadata: { jobId: 2 } },
        ],
      },
      {
        name: 'Engage API partial failures',
        responseParams: {
          destinationResponse: {
            status: 200,
            response: {
              error: 'Some properties are invalid',
            },
          },
          // @ts-ignore - simplified test data
          destinationRequest: {
            endpoint: 'https://api.mixpanel.com/engage',
            method: 'POST',
            version: 'v1',
            type: 'mixpanel',
            userId: 'test-user',
            destinationConfig: {},
          },
          // @ts-ignore - simplified test data
          rudderJobMetadata: [{ jobId: 1 }, { jobId: 2 }],
        },
        expectError: false,
        expectedStatus: 200,
        expectedMessage: 'Error in Engage API',
        expectedResponseLength: 2,
        expectedEvents: [
          {
            statusCode: 400,
            error: expect.stringContaining('Engage API error'),
            metadata: { jobId: 1 },
          },
          {
            statusCode: 400,
            error: expect.stringContaining('Engage API error'),
            metadata: { jobId: 2 },
          },
        ],
      },
      {
        name: 'Groups API successful responses',
        responseParams: {
          destinationResponse: {
            status: 200,
            response: { success: true },
          },
          // @ts-ignore - simplified test data
          destinationRequest: {
            endpoint: 'https://api.mixpanel.com/groups',
            method: 'POST',
            version: 'v1',
            type: 'mixpanel',
            userId: 'test-user',
            destinationConfig: {},
          },
          // @ts-ignore - simplified test data
          rudderJobMetadata: [{ jobId: 1 }, { jobId: 2 }],
        },
        expectError: false,
        expectedStatus: 200,
        expectedMessage: 'Processed Successfully',
        expectedResponseLength: 2,
        expectedEvents: [
          { statusCode: 200, error: 'success', metadata: { jobId: 1 } },
          { statusCode: 200, error: 'success', metadata: { jobId: 2 } },
        ],
      },
      {
        name: 'Groups API partial failures',
        responseParams: {
          destinationResponse: {
            status: 200,
            response: {
              error: 'Some group properties are invalid',
            },
          },
          // @ts-ignore - simplified test data
          destinationRequest: {
            endpoint: 'https://api.mixpanel.com/groups',
            method: 'POST',
            version: 'v1',
            type: 'mixpanel',
            userId: 'test-user',
            destinationConfig: {},
          },
          // @ts-ignore - simplified test data
          rudderJobMetadata: [{ jobId: 1 }, { jobId: 2 }],
        },
        expectError: false,
        expectedStatus: 200,
        expectedMessage: 'Error in Groups API',
        expectedResponseLength: 2,
        expectedEvents: [
          {
            statusCode: 400,
            error: expect.stringContaining('Groups API error'),
            metadata: { jobId: 1 },
          },
          {
            statusCode: 400,
            error: expect.stringContaining('Groups API error'),
            metadata: { jobId: 2 },
          },
        ],
      },
      {
        name: 'non-success status codes',
        responseParams: {
          destinationResponse: {
            status: 500,
            response: { error: 'Internal Server Error' },
          },
          // @ts-ignore - simplified test data
          destinationRequest: {
            endpoint: 'https://api.mixpanel.com/import',
            method: 'POST',
            version: 'v1',
            type: 'mixpanel',
            userId: 'test-user',
            destinationConfig: {},
          },
          // @ts-ignore - simplified test data
          rudderJobMetadata: [{ jobId: 1 }, { jobId: 2 }],
        },
        expectError: true,
      },
      {
        name: 'successful responses from generic endpoints',
        responseParams: {
          destinationResponse: {
            status: 200,
            response: { success: true },
          },
          // @ts-ignore - simplified test data
          destinationRequest: {
            endpoint: 'https://api.mixpanel.com/some-other-endpoint',
            method: 'POST',
            version: 'v1',
            type: 'mixpanel',
            userId: 'test-user',
            destinationConfig: {},
          },
          // @ts-ignore - simplified test data
          rudderJobMetadata: [{ jobId: 1 }],
        },
        expectError: false,
        expectedStatus: 200,
        expectedMessage: 'Processed Successfully',
        expectedResponseLength: 1,
        expectedEvents: [{ statusCode: 200, error: 'success', metadata: { jobId: 1 } }],
      },
    ];

    test.each(mainTestCases)(
      'should handle $name correctly',
      ({
        responseParams,
        expectError,
        expectedStatus,
        expectedMessage,
        expectedResponseLength,
        expectedEvents,
      }) => {
        if (expectError) {
          expect(() => handler.responseHandler(responseParams)).toThrow(TransformerProxyError);
        } else {
          const result = handler.responseHandler(responseParams);

          expect(result.status).toBe(expectedStatus);

          if (expectedMessage) {
            expect(result.message).toContain(expectedMessage);
          }

          if (expectedResponseLength != undefined) {
            expect(result.response).toHaveLength(expectedResponseLength);
          }

          if (expectedEvents) {
            expectedEvents.forEach((expectedEvent, index) => {
              // @ts-ignore - response is defined in this context
              expect(result.response[index].statusCode).toBe(expectedEvent.statusCode);

              if (typeof expectedEvent.error === 'string') {
                // @ts-ignore - response is defined in this context
                expect(result.response[index].error).toBe(expectedEvent.error);
              } else {
                // @ts-ignore - response is defined in this context
                expect(result.response[index].error).toEqual(expectedEvent.error);
              }

              // @ts-ignore - response is defined in this context
              expect(result.response[index].metadata).toEqual(expectedEvent.metadata);
            });
          }
        }
      },
    );
  });

  describe('endpoint-specific handlers', () => {
    interface EndpointTestCase {
      name: string;
      responseParams: ResponseHandlerParams;
      expectError: boolean;
      expectedStatus?: number;
      expectedResponseLength?: number;
      expectedFirstEventStatus?: number;
      expectedFirstEventError?: string | jest.Expect;
    }

    const endpointTestCases: EndpointTestCase[] = [
      {
        name: 'Import API non-success responses that are not 400',
        responseParams: {
          destinationResponse: {
            status: 500,
            response: { error: 'Internal Server Error' },
          },
          // @ts-ignore - simplified test data
          destinationRequest: {
            endpoint: 'https://api.mixpanel.com/import',
            method: 'POST',
            version: 'v1',
            type: 'mixpanel',
            userId: 'test-user',
            destinationConfig: {},
          },
          // @ts-ignore - simplified test data
          rudderJobMetadata: [{ jobId: 1 }],
        },
        expectError: true,
      },
      {
        name: 'Import API responses with missing batch data',
        responseParams: {
          destinationResponse: {
            status: 400,
            response: {
              failed_records: [
                { $insert_id: 'event1', field: 'time', message: 'Invalid timestamp' },
              ],
              num_records_imported: 0,
            },
          },
          // @ts-ignore - simplified test data
          destinationRequest: {
            endpoint: 'https://api.mixpanel.com/import',
            method: 'POST',
            version: 'v1',
            type: 'mixpanel',
            userId: 'test-user',
            destinationConfig: {},
            body: {
              // Missing JSON_ARRAY.batch
            },
          },
          // @ts-ignore - simplified test data
          rudderJobMetadata: [{ jobId: 1 }],
        },
        expectError: true,
        expectedStatus: 200,
        expectedResponseLength: 1,
        expectedFirstEventStatus: 200,
        expectedFirstEventError: 'success',
      },
      {
        name: 'Import API responses with malformed JSON batch',
        responseParams: {
          destinationResponse: {
            status: 400,
            response: {
              failed_records: [],
              num_records_imported: 0,
            },
          },
          // @ts-ignore - simplified test data
          destinationRequest: {
            endpoint: 'https://api.mixpanel.com/import',
            method: 'POST',
            version: 'v1',
            type: 'mixpanel',
            userId: 'test-user',
            destinationConfig: {},
            body: {
              JSON_ARRAY: {
                batch: '{malformed json}', // Intentionally malformed JSON
              },
            },
          },
          // @ts-ignore - simplified test data
          rudderJobMetadata: [{ jobId: 1 }],
        },
        expectError: true,
        expectedStatus: 200,
        expectedResponseLength: 1,
        expectedFirstEventStatus: 400,
        expectedFirstEventError: expect.stringContaining('Failed to parse JSON batch'),
      },
      {
        name: 'non-success status codes from generic endpoints',
        responseParams: {
          destinationResponse: {
            status: 400,
            response: { error: 'Bad Request' },
          },
          // @ts-ignore - simplified test data
          destinationRequest: {
            endpoint: 'https://api.mixpanel.com/some-other-endpoint',
            method: 'POST',
            version: 'v1',
            type: 'mixpanel',
            userId: 'test-user',
            destinationConfig: {},
          },
          // @ts-ignore - simplified test data
          rudderJobMetadata: [{ jobId: 1 }],
        },
        expectError: true,
      },
      {
        name: 'Engage API non-success responses',
        responseParams: {
          destinationResponse: {
            status: 500,
            response: { error: 'Internal Server Error' },
          },
          // @ts-ignore - simplified test data
          destinationRequest: {
            endpoint: 'https://api.mixpanel.com/engage',
            method: 'POST',
            version: 'v1',
            type: 'mixpanel',
            userId: 'test-user',
            destinationConfig: {},
          },
          // @ts-ignore - simplified test data
          rudderJobMetadata: [{ jobId: 1 }],
        },
        expectError: true,
      },
      {
        name: 'Groups API non-success responses',
        responseParams: {
          destinationResponse: {
            status: 500,
            response: { error: 'Internal Server Error' },
          },
          // @ts-ignore - simplified test data
          destinationRequest: {
            endpoint: 'https://api.mixpanel.com/groups',
            method: 'POST',
            version: 'v1',
            type: 'mixpanel',
            userId: 'test-user',
            destinationConfig: {},
          },
          // @ts-ignore - simplified test data
          rudderJobMetadata: [{ jobId: 1 }],
        },
        expectError: true,
      },
      {
        name: 'Engage API responses without errors',
        responseParams: {
          destinationResponse: {
            status: 200,
            response: { success: true }, // No error property
          },
          // @ts-ignore - simplified test data
          destinationRequest: {
            endpoint: 'https://api.mixpanel.com/engage',
            method: 'POST',
            version: 'v1',
            type: 'mixpanel',
            userId: 'test-user',
            destinationConfig: {},
          },
          // @ts-ignore - simplified test data
          rudderJobMetadata: [{ jobId: 1 }],
        },
        expectError: false,
        expectedStatus: 200,
        expectedResponseLength: 1,
        expectedFirstEventStatus: 200,
        expectedFirstEventError: 'success',
      },
      {
        name: 'Groups API responses without errors',
        responseParams: {
          destinationResponse: {
            status: 200,
            response: { success: true }, // No error property
          },
          // @ts-ignore - simplified test data
          destinationRequest: {
            endpoint: 'https://api.mixpanel.com/groups',
            method: 'POST',
            version: 'v1',
            type: 'mixpanel',
            userId: 'test-user',
            destinationConfig: {},
          },
          // @ts-ignore - simplified test data
          rudderJobMetadata: [{ jobId: 1 }],
        },
        expectError: false,
        expectedStatus: 200,
        expectedResponseLength: 1,
        expectedFirstEventStatus: 200,
        expectedFirstEventError: 'success',
      },
    ];

    test.each(endpointTestCases)(
      'should handle $name correctly',
      ({
        responseParams,
        expectError,
        expectedStatus,
        expectedResponseLength,
        expectedFirstEventStatus,
        expectedFirstEventError,
      }) => {
        if (expectError) {
          expect(() => handler.responseHandler(responseParams)).toThrow(TransformerProxyError);
        } else {
          const result = handler.responseHandler(responseParams);

          expect(result.status).toBe(expectedStatus);
          if (expectedResponseLength != undefined) {
            expect(result.response).toHaveLength(expectedResponseLength);
          }

          if (expectedFirstEventStatus) {
            // @ts-ignore - response is defined in this context
            expect(result.response[0].statusCode).toBe(expectedFirstEventStatus);
          }

          if (expectedFirstEventError) {
            // @ts-ignore - response is defined in this context
            expect(result.response[0].error).toEqual(expectedFirstEventError);
          }
        }
      },
    );
  });

  describe('prepareProxyRequest', () => {
    const handler = new networkHandler();
    let gzippedData: Buffer | undefined;

    beforeAll(async () => {
      gzippedData = await getZippedPayload('{"key":"value"}');
    });

    const testCases = [
      {
        name: 'JSON payload',
        input: {
          body: {
            JSON: { key: 'value' },
          },
          method: 'POST',
          params: { param1: 'value1' },
          endpoint: 'https://api.example.com',
          headers: { 'Content-Type': 'application/json' },
          destinationConfig: { apiKey: 'test-key' },
        },
        expected: {
          endpoint: 'https://api.example.com',
          data: { key: 'value' },
          method: 'POST',
          params: { param1: 'value1' },
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'RudderLabs',
          },
          config: { apiKey: 'test-key' },
        },
      },
      {
        name: 'JSON_ARRAY payload',
        input: {
          body: {
            JSON_ARRAY: {
              batch: [{ id: 1 }, { id: 2 }],
            },
          },
          method: 'POST',
          endpoint: 'https://api.example.com/batch',
          headers: { 'Content-Type': 'application/json' },
          destinationConfig: { apiKey: 'test-key' },
        },
        expected: {
          endpoint: 'https://api.example.com/batch',
          data: [{ id: 1 }, { id: 2 }],
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'RudderLabs',
          },
          config: { apiKey: 'test-key' },
        },
      },
      {
        name: 'XML payload',
        input: {
          body: {
            XML: {
              payload: '<root><key>value</key></root>',
            },
          },
          method: 'POST',
          endpoint: 'https://api.example.com/xml',
          headers: { 'Content-Type': 'application/xml' },
          destinationConfig: { apiKey: 'test-key' },
        },
        expected: {
          endpoint: 'https://api.example.com/xml',
          data: '<root><key>value</key></root>',
          method: 'POST',
          headers: {
            'Content-Type': 'application/xml',
            'User-Agent': 'RudderLabs',
          },
          config: { apiKey: 'test-key' },
        },
      },
      {
        name: 'with undefined values',
        input: {
          body: {
            JSON: { key: 'value' },
          },
          method: 'POST',
          params: undefined,
          endpoint: 'https://api.example.com',
          headers: { 'Content-Type': 'application/json' },
          destinationConfig: undefined,
        },
        expected: {
          endpoint: 'https://api.example.com',
          data: { key: 'value' },
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'RudderLabs',
          },
        },
      },
    ];

    // Run the basic test cases
    test.each(testCases)('prepareProxyRequest: $name', async ({ input, expected }) => {
      const result = await handler.prepareProxy(input);
      expect(result).toEqual(expected);
    });

    // Separate test for GZIP
    test('prepareProxyRequest: GZIP payload', async () => {
      const input = {
        body: {
          GZIP: {
            payload: '{"key":"value"}',
          },
        },
        method: 'POST',
        endpoint: 'https://api.example.com/gzip',
        headers: { 'Content-Type': 'application/json' },
        destinationConfig: { apiKey: 'test-key' },
      };

      const expected = {
        endpoint: 'https://api.example.com/gzip',
        data: gzippedData,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Encoding': 'gzip',
          'User-Agent': 'RudderLabs',
        },
        config: { apiKey: 'test-key' },
      };

      const result = await handler.prepareProxy(input);
      expect(result).toEqual(expected);
    });

    test('prepareProxyRequest: GZIP invalid payload', async () => {
      const input = {
        body: {
          GZIP: {
            payload: { key: 'value' },
          },
        },
        method: 'POST',
        endpoint: 'https://api.example.com/gzip',
        headers: { 'Content-Type': 'application/json' },
        destinationConfig: { apiKey: 'test-key' },
      };

      const expected = {
        endpoint: 'https://api.example.com/gzip',
        data: undefined,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Encoding': 'gzip',
          'User-Agent': 'RudderLabs',
        },
        config: { apiKey: 'test-key' },
      };

      const result = await handler.prepareProxy(input);
      expect(result).toEqual(expected);
    });
  });
});
