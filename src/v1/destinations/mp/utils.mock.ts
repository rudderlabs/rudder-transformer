import { get } from 'lodash';
import { isHttpStatusSuccess } from '../../../v0/util';
import { DESTINATION } from '../../../v0/destinations/mp/config';
import { TransformerProxyError } from '../../../v0/util/errorTypes';
import tags from '../../../v0/util/tags';
import { getDynamicErrorType } from '../../../adapters/utils/networkUtils';
import { ResponseObject } from '../../../types';
import { Event, FailedRecord, EventResponse, MockProxyMetadata } from './types';

// Mock ResponseParams for testing
export interface MockResponseParams {
  destinationResponse: {
    status: number;
    response?: any;
    headers?: any;
  };
  destinationRequest?: any;
  destType?: string;
  rudderJobMetadata: MockProxyMetadata | MockProxyMetadata[];
  [key: string]: any;
}

/**
 * Checks if an event has failed in the Mixpanel Import API response
 *
 * @param event - The event to check
 * @param failedRecords - The array of failed records from Mixpanel
 * @returns Object containing isAbortable and errorMsg
 */
export const checkIfEventIsAbortableInImport = (
  event: Event | null,
  failedRecords: FailedRecord[] | null,
): { isAbortable: boolean; errorMsg: string } => {
  if (!event || !failedRecords || !Array.isArray(failedRecords)) {
    return { isAbortable: false, errorMsg: '' };
  }

  const insertId = get(event, 'properties.$insert_id');
  if (!insertId) {
    return { isAbortable: false, errorMsg: '' };
  }

  const failedRecord = failedRecords.find((record) => record.$insert_id === insertId);
  if (!failedRecord) {
    return { isAbortable: false, errorMsg: '' };
  }

  return {
    isAbortable: true,
    errorMsg: `Field: ${failedRecord.field}, Message: ${failedRecord.message}`,
  };
};

/**
 * Creates response objects for all events with the same status and error message
 *
 * @param rudderJobMetadata - The metadata for all events
 * @param statusCode - The status code to set for all events
 * @param errorMessage - The error message to set for all events
 * @returns Array of response objects for each event
 */
export const createResponsesForAllEvents = (
  rudderJobMetadata: any[],
  statusCode: number,
  errorMessage: string,
): EventResponse[] =>
  rudderJobMetadata.map((metadata) => ({
    statusCode,
    metadata,
    error: errorMessage,
  }));

/**
 * Creates a standard success response
 *
 * @param status - The HTTP status code
 * @param message - The success message
 * @param rudderJobMetadata - The metadata for all events
 * @returns The success response object
 */
export const createSuccessResponse = (
  status: number,
  message: string,
  rudderJobMetadata: any[],
): ResponseObject => ({
  status,
  message,
  response: createResponsesForAllEvents(rudderJobMetadata, 200, 'success'),
});

/**
 * Handles non-success status codes for all endpoints
 *
 * @param responseParams - The response parameters
 * @throws {TransformerProxyError} - Throws error with appropriate status and message
 */
export const handleNonSuccessResponse = (responseParams: MockResponseParams): never => {
  const { destinationResponse, rudderJobMetadata } = responseParams;
  const { status } = destinationResponse;

  // Ensure rudderJobMetadata is an array
  const metadata = Array.isArray(rudderJobMetadata) ? rudderJobMetadata : [rudderJobMetadata];

  const errorResponses = createResponsesForAllEvents(
    metadata,
    status,
    `Request failed with status: ${status}`,
  );

  throw new TransformerProxyError(
    `MIXPANEL: Error encountered in transformer proxy V1 with status: ${status}`,
    status,
    {
      [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
    },
    destinationResponse,
    '',
    errorResponses,
  );
};

/**
 * Handles responses from Mixpanel APIs that follow the same pattern (Engage, Groups)
 *
 * @param responseParams - The response parameters
 * @param apiName - The name of the API (e.g., 'Engage', 'Groups')
 * @returns The processed response or null if not applicable
 */
export const handleStandardApiResponse = (
  responseParams: MockResponseParams,
  apiName: string,
): ResponseObject | null => {
  const { destinationResponse, rudderJobMetadata } = responseParams;
  const message = `Request for ${DESTINATION} Processed Successfully`;
  const { response, status } = destinationResponse;

  // Ensure rudderJobMetadata is an array
  const metadata = Array.isArray(rudderJobMetadata) ? rudderJobMetadata : [rudderJobMetadata];

  if (!isHttpStatusSuccess(status)) {
    return null; // Let the default handler handle non-success status codes
  }

  const error = get(response, 'error');
  if (error) {
    return {
      status: 207,
      message: `MIXPANEL: Error in ${apiName} API: ${error}`,
      response: createResponsesForAllEvents(metadata, 400, `${apiName} API error: ${error}`),
    };
  }

  return createSuccessResponse(status, message, metadata);
};

/**
 * Handles API responses with error in the response body
 *
 * @param apiName - The name of the API (e.g., 'Engage', 'Groups')
 * @param response - The response object
 * @param rudderJobMetadata - The metadata for all events
 * @returns The processed response with individual event statuses
 */
export const handleApiErrorResponse = (
  apiName: string,
  response: any,
  rudderJobMetadata: any[],
): ResponseObject | null => {
  const error = get(response, 'error');

  if (!error) {
    return null;
  }

  const responseWithIndividualEvents = createResponsesForAllEvents(
    rudderJobMetadata,
    400,
    `${apiName} API error: ${error}`,
  );

  return {
    status: 207,
    message: `MIXPANEL: Error in ${apiName} API: ${error}`,
    response: responseWithIndividualEvents,
  };
};

/**
 * Handles endpoint-specific responses based on the endpoint path
 *
 * @param endpoint - The endpoint path
 * @param responseParams - The response parameters
 * @returns The processed response or null if not applicable
 */
export const handleEndpointSpecificResponses = (
  endpoint: string,
  responseParams: MockResponseParams,
): ResponseObject | null => {
  if (endpoint.includes('/import')) {
    return createSuccessResponse(
      responseParams.destinationResponse.status,
      `Request for ${DESTINATION} Processed Successfully`,
      Array.isArray(responseParams.rudderJobMetadata)
        ? responseParams.rudderJobMetadata
        : [responseParams.rudderJobMetadata],
    );
  }
  if (endpoint.includes('/engage')) {
    return handleStandardApiResponse(responseParams, 'Engage');
  }
  if (endpoint.includes('/groups')) {
    return handleStandardApiResponse(responseParams, 'Groups');
  }
  return null;
};

export default {
  checkIfEventIsAbortableInImport,
  createResponsesForAllEvents,
  createSuccessResponse,
  handleNonSuccessResponse,
  handleStandardApiResponse,
  handleEndpointSpecificResponses,
  handleApiErrorResponse,
};
