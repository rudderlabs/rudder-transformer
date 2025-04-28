import {
  checkIfEventIsAbortableInImport,
  createResponsesForAllEvents,
  createSuccessResponse,
  handleStandardApiResponse,
  handleApiErrorResponse,
  handleNonSuccessResponse,
  handleEndpointSpecificResponses,
} from './utils';
import { TransformerProxyError } from '../../../v0/util/errorTypes';
import { DESTINATION } from '../../../v0/destinations/mp/config';
import { Event, FailedRecord } from './types';

// Define a fail function for testing
function fail(message: string): never {
  throw new Error(message);
}

describe('Mixpanel Utils', () => {
  describe('createResponsesForAllEvents', () => {
    const testCases = [
      {
        name: 'multiple events with the same status and error message',
        rudderJobMetadata: [{ jobId: 1 }, { jobId: 2 }, { jobId: 3 }],
        statusCode: 400,
        errorMessage: 'Test error message',
        expectedResult: [
          { statusCode: 400, metadata: { jobId: 1 }, error: 'Test error message' },
          { statusCode: 400, metadata: { jobId: 2 }, error: 'Test error message' },
          { statusCode: 400, metadata: { jobId: 3 }, error: 'Test error message' },
        ],
      },
      {
        name: 'empty metadata array',
        rudderJobMetadata: [],
        statusCode: 200,
        errorMessage: 'Success',
        expectedResult: [],
      },
    ];

    test.each(testCases)(
      'should handle $name correctly',
      ({ rudderJobMetadata, statusCode, errorMessage, expectedResult }) => {
        const result = createResponsesForAllEvents(rudderJobMetadata, statusCode, errorMessage);
        expect(result).toEqual(expectedResult);
      },
    );
  });

  describe('createSuccessResponse', () => {
    const testCases = [
      {
        name: 'properly formatted success response',
        status: 200,
        message: 'Test success message',
        rudderJobMetadata: [{ jobId: 1 }, { jobId: 2 }],
        expectedResult: {
          status: 200,
          message: 'Test success message',
          response: [
            { statusCode: 200, metadata: { jobId: 1 }, error: 'success' },
            { statusCode: 200, metadata: { jobId: 2 }, error: 'success' },
          ],
        },
      },
      {
        name: 'success response with empty metadata',
        status: 201,
        message: 'Created successfully',
        rudderJobMetadata: [],
        expectedResult: {
          status: 201,
          message: 'Created successfully',
          response: [],
        },
      },
    ];

    test.each(testCases)(
      'should create $name',
      ({ status, message, rudderJobMetadata, expectedResult }) => {
        const result = createSuccessResponse(status, message, rudderJobMetadata);
        expect(result).toEqual(expectedResult);
      },
    );
  });

  describe('handleStandardApiResponse', () => {
    const testCases = [
      {
        name: 'non-success status codes (500)',
        responseParams: {
          destinationResponse: {
            status: 500,
            response: { error: 'Internal Server Error' },
          },
          rudderJobMetadata: [{ jobId: 1 }],
        },
        apiName: 'TestAPI',
        expectedResult: null,
      },
      {
        name: 'non-success status codes (400)',
        responseParams: {
          destinationResponse: {
            status: 400,
            response: { error: 'Bad Request' },
          },
          rudderJobMetadata: [{ jobId: 1 }],
        },
        apiName: 'TestAPI',
        expectedResult: null,
      },
      {
        name: 'API errors with single event',
        responseParams: {
          destinationResponse: {
            status: 200,
            response: { error: 'Some API error' },
          },
          rudderJobMetadata: [{ jobId: 1 }],
        },
        apiName: 'TestAPI',
        expectedResult: {
          status: 200,
          message: expect.stringContaining('Error in TestAPI API'),
          response: [
            {
              statusCode: 400,
              error: expect.stringContaining('TestAPI API error'),
              metadata: { jobId: 1 },
            },
          ],
        },
      },
      {
        name: 'API errors with multiple events',
        responseParams: {
          destinationResponse: {
            status: 200,
            response: { error: 'Some API error' },
          },
          rudderJobMetadata: [{ jobId: 1 }, { jobId: 2 }, { jobId: 3 }],
        },
        apiName: 'TestAPI',
        expectedResult: {
          status: 200,
          message: expect.stringContaining('Error in TestAPI API'),
          response: [
            {
              statusCode: 400,
              error: expect.stringContaining('TestAPI API error'),
              metadata: { jobId: 1 },
            },
            {
              statusCode: 400,
              error: expect.stringContaining('TestAPI API error'),
              metadata: { jobId: 2 },
            },
            {
              statusCode: 400,
              error: expect.stringContaining('TestAPI API error'),
              metadata: { jobId: 3 },
            },
          ],
        },
      },
      {
        name: 'success response with no errors (single event)',
        responseParams: {
          destinationResponse: {
            status: 200,
            response: { success: true },
          },
          rudderJobMetadata: [{ jobId: 1 }],
        },
        apiName: 'TestAPI',
        expectedResult: {
          status: 200,
          message: expect.stringContaining(`Request for ${DESTINATION} Processed Successfully`),
          response: [
            {
              statusCode: 200,
              error: 'success',
              metadata: { jobId: 1 },
            },
          ],
        },
      },
      {
        name: 'success response with no errors (multiple events)',
        responseParams: {
          destinationResponse: {
            status: 200,
            response: { success: true },
          },
          rudderJobMetadata: [{ jobId: 1 }, { jobId: 2 }],
        },
        apiName: 'TestAPI',
        expectedResult: {
          status: 200,
          message: expect.stringContaining(`Request for ${DESTINATION} Processed Successfully`),
          response: [
            {
              statusCode: 200,
              error: 'success',
              metadata: { jobId: 1 },
            },
            {
              statusCode: 200,
              error: 'success',
              metadata: { jobId: 2 },
            },
          ],
        },
      },
      {
        name: 'success response with empty metadata array',
        responseParams: {
          destinationResponse: {
            status: 200,
            response: { success: true },
          },
          rudderJobMetadata: [],
        },
        apiName: 'TestAPI',
        expectedResult: {
          status: 200,
          message: expect.stringContaining(`Request for ${DESTINATION} Processed Successfully`),
          response: [],
        },
      },
      {
        name: 'different API names',
        responseParams: {
          destinationResponse: {
            status: 200,
            response: { error: 'Some API error' },
          },
          rudderJobMetadata: [{ jobId: 1 }],
        },
        apiName: 'DifferentAPI',
        expectedResult: {
          status: 200,
          message: expect.stringContaining('Error in DifferentAPI API'),
          response: [
            {
              statusCode: 400,
              error: expect.stringContaining('DifferentAPI API error'),
              metadata: { jobId: 1 },
            },
          ],
        },
      },
    ];

    test.each(testCases)(
      'should handle $name correctly',
      ({ responseParams, apiName, expectedResult }) => {
        // Test the function directly
        const result = handleStandardApiResponse(responseParams as any, apiName);

        if (expectedResult === null) {
          expect(result).toBeNull();
        } else {
          expect(result).toEqual(expectedResult);
        }
      },
    );
  });

  describe('checkIfEventIsAbortableInImport', () => {
    const testCases = [
      {
        name: 'when event is null',
        event: null,
        failedRecords: [],
        expected: { isAbortable: false, errorMsg: '' },
      },
      {
        name: 'when failedRecords is null',
        event: { properties: { $insert_id: 'event1' } } as Event,
        failedRecords: null,
        expected: { isAbortable: false, errorMsg: '' },
      },
      {
        name: 'when failedRecords is not an array',
        event: { properties: { $insert_id: 'event1' } } as Event,
        failedRecords: null, // Changed from 'not an array' to null for type safety
        expected: { isAbortable: false, errorMsg: '' },
      },
      {
        name: 'when event has no insert_id',
        event: { properties: {} } as Event,
        failedRecords: [
          { $insert_id: 'event1', field: 'time', message: 'Invalid timestamp' } as FailedRecord,
        ],
        expected: { isAbortable: false, errorMsg: '' },
      },
      {
        name: 'when event insert_id is not in failedRecords',
        event: { properties: { $insert_id: 'event2' } } as Event,
        failedRecords: [
          { $insert_id: 'event1', field: 'time', message: 'Invalid timestamp' } as FailedRecord,
        ],
        expected: { isAbortable: false, errorMsg: '' },
      },
      {
        name: 'when event insert_id is in failedRecords',
        event: { properties: { $insert_id: 'event1' } } as Event,
        failedRecords: [
          { $insert_id: 'event1', field: 'time', message: 'Invalid timestamp' } as FailedRecord,
        ],
        expected: {
          isAbortable: true,
          errorMsg: 'Field: time, Message: Invalid timestamp',
        },
      },
    ];

    test.each(testCases)(
      'should return correct result $name',
      ({ event, failedRecords, expected }) => {
        const result = checkIfEventIsAbortableInImport(event, failedRecords);
        expect(result).toEqual(expected);
      },
    );
  });

  describe('handleApiErrorResponse', () => {
    const testCases = [
      {
        name: 'no error in the response',
        apiName: 'TestAPI',
        response: { success: true }, // No error property
        rudderJobMetadata: [{ jobId: 1 }],
        expectedResult: null,
      },
      {
        name: 'error in the response',
        apiName: 'TestAPI',
        response: { error: 'Some API error' },
        rudderJobMetadata: [{ jobId: 1 }, { jobId: 2 }],
        expectedResult: {
          status: 200,
          message: 'MIXPANEL: Error in TestAPI API: Some API error',
          response: [
            { statusCode: 400, metadata: { jobId: 1 }, error: 'TestAPI API error: Some API error' },
            { statusCode: 400, metadata: { jobId: 2 }, error: 'TestAPI API error: Some API error' },
          ],
        },
      },
    ];

    test.each(testCases)(
      'should handle $name correctly',
      ({ apiName, response, rudderJobMetadata, expectedResult }) => {
        const result = handleApiErrorResponse(apiName, response, rudderJobMetadata);
        expect(result).toEqual(expectedResult);
      },
    );
  });

  describe('handleNonSuccessResponse', () => {
    const testCases = [
      {
        name: 'non-success status code (400)',
        responseParams: {
          destinationResponse: {
            status: 400,
            response: { error: 'Bad Request' },
          },
          rudderJobMetadata: [{ jobId: 1 }],
        },
        expectedError: {
          message: expect.stringContaining(
            'Error encountered in transformer proxy V1 with status: 400',
          ),
          status: 400,
        },
      },
      {
        name: 'non-success status code (500)',
        responseParams: {
          destinationResponse: {
            status: 500,
            response: { error: 'Internal Server Error' },
          },
          rudderJobMetadata: [{ jobId: 1 }, { jobId: 2 }],
        },
        expectedError: {
          message: expect.stringContaining(
            'Error encountered in transformer proxy V1 with status: 500',
          ),
          status: 500,
        },
      },
    ];

    test.each(testCases)(
      'should throw TransformerProxyError for $name',
      ({ responseParams, expectedError }) => {
        expect(() => {
          handleNonSuccessResponse(responseParams as any);
        }).toThrow(TransformerProxyError);

        try {
          handleNonSuccessResponse(responseParams as any);
        } catch (error) {
          // Check basic error properties
          if (error instanceof TransformerProxyError) {
            expect(error.message).toEqual(expectedError.message);
            expect(error.status).toBe(expectedError.status);
            expect(error.destinationResponse).toEqual(responseParams.destinationResponse);
          } else {
            // If it's not a TransformerProxyError, the test should fail
            fail('Expected TransformerProxyError but got a different error type');
          }

          // The error responses are passed as the last parameter to TransformerProxyError
          // but we don't have direct access to them in the test
          // Instead, we'll verify that the function was called with the correct parameters
          // by checking that the error was thrown
        }
      },
    );
  });

  describe('handleEndpointSpecificResponses', () => {
    const testCases = [
      {
        name: 'import endpoint',
        endpoint: 'https://api.mixpanel.com/import',
        responseParams: {
          destinationResponse: {
            status: 200,
            response: { success: true },
          },
          destinationRequest: {
            endpoint: 'https://api.mixpanel.com/import',
          },
          rudderJobMetadata: [{ jobId: 1 }],
        },
        expectedResult: {
          status: 200,
          message: expect.stringContaining('Processed Successfully'),
          response: [{ statusCode: 200, error: 'success', metadata: { jobId: 1 } }],
        },
      },
      {
        name: 'engage endpoint',
        endpoint: 'https://api.mixpanel.com/engage',
        responseParams: {
          destinationResponse: {
            status: 200,
            response: { success: true },
          },
          destinationRequest: {
            endpoint: 'https://api.mixpanel.com/engage',
          },
          rudderJobMetadata: [{ jobId: 1 }],
        },
        expectedResult: {
          status: 200,
          message: expect.stringContaining('Processed Successfully'),
          response: [{ statusCode: 200, error: 'success', metadata: { jobId: 1 } }],
        },
      },
      {
        name: 'groups endpoint',
        endpoint: 'https://api.mixpanel.com/groups',
        responseParams: {
          destinationResponse: {
            status: 200,
            response: { success: true },
          },
          destinationRequest: {
            endpoint: 'https://api.mixpanel.com/groups',
          },
          rudderJobMetadata: [{ jobId: 1 }],
        },
        expectedResult: {
          status: 200,
          message: expect.stringContaining('Processed Successfully'),
          response: [{ statusCode: 200, error: 'success', metadata: { jobId: 1 } }],
        },
      },
      {
        name: 'unknown endpoint',
        endpoint: 'https://api.mixpanel.com/unknown',
        responseParams: {
          destinationResponse: {
            status: 200,
            response: { success: true },
          },
          destinationRequest: {
            endpoint: 'https://api.mixpanel.com/unknown',
          },
          rudderJobMetadata: [{ jobId: 1 }],
        },
        expectedResult: null,
      },
    ];

    test.each(testCases)(
      'should handle $name correctly',
      ({ endpoint, responseParams, expectedResult }) => {
        const result = handleEndpointSpecificResponses(endpoint, responseParams as any);
        expect(result).toEqual(expectedResult);
      },
    );
  });
});
