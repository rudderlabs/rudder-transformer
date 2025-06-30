import { get } from 'lodash';
import logger from '../../../logger';
import { isHttpStatusSuccess } from '../../../v0/util';
import { DESTINATION } from '../../../v0/destinations/mp/config';
import { TransformerProxyError } from '../../../v0/util/errorTypes';
import tags from '../../../v0/util/tags';
import { getDynamicErrorType } from '../../../adapters/utils/networkUtils';
import {
  ResponseHandlerParams,
  ResponseProxyObject,
  DeliveryJobState,
  ProxyRequest,
} from '../../../types';
import { Event, FailedRecord } from './types';

const handleDestinationRequest = (destinationRequest: ProxyRequest): Event[] | undefined => {
  const batchPayload = destinationRequest.body?.JSON_ARRAY?.batch;
  const gzipPayload = destinationRequest.body?.GZIP?.payload;
  const rawPayload = batchPayload ?? gzipPayload;

  if (typeof rawPayload !== 'string') {
    logger.warn('handleDestinationRequest: No valid string payload found in request body.');
    return undefined;
  }

  try {
    return JSON.parse(rawPayload);
  } catch (error) {
    logger.error(
      `handleDestinationRequest: Failed to parse payload. Error: ${(error as Error).message}`,
    );
    return undefined;
  }
};

/**
 * Checks if an event has failed in the Mixpanel Import API response,
 * we are doing this by comparing the $insert_id of the event with the $insert_id of the failed records
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
): DeliveryJobState[] =>
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
): ResponseProxyObject => ({
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
export const handleNonSuccessResponse = (responseParams: ResponseHandlerParams): never => {
  const { destinationResponse, rudderJobMetadata } = responseParams;
  const { status, response } = destinationResponse;

  // Ensure rudderJobMetadata is an array
  const metadata = Array.isArray(rudderJobMetadata) ? rudderJobMetadata : [rudderJobMetadata];

  const errorResponses = createResponsesForAllEvents(
    metadata,
    status,
    `Request failed with status: ${status}`,
  );

  throw new TransformerProxyError(
    `MIXPANEL: Error encountered in transformer proxy V1 with status: ${status}: response: ${JSON.stringify(response)}`,
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
  responseParams: ResponseHandlerParams,
  apiName: string,
): ResponseProxyObject | null => {
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
      status: 200,
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
): ResponseProxyObject | null => {
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
    status: 200,
    message: `MIXPANEL: Error in ${apiName} API: ${error}`,
    response: responseWithIndividualEvents,
  };
};

/**
 * Handles responses from Mixpanel Import API
 *
 * @param responseParams - The response parameters
 * @returns The processed response
 */
export const handleImportApiResponse = (
  responseParams: ResponseHandlerParams,
): ResponseProxyObject | null => {
  const { destinationResponse, destinationRequest, rudderJobMetadata } = responseParams;
  const message = `Request for ${DESTINATION} Processed Successfully`;
  const { response, status } = destinationResponse;
  // Ensure rudderJobMetadata is an array
  const metadata = Array.isArray(rudderJobMetadata) ? rudderJobMetadata : [rudderJobMetadata];

  if (status === 400) {
    if (!destinationRequest) {
      return null;
    }
    const events: Event[] | undefined = handleDestinationRequest(destinationRequest);
    if (!events) {
      return null;
    }
    const failedRecords = get(response, 'failed_records', []);
    const numRecordsImported = get(response, 'num_records_imported', 0);

    // For each event in the batch, check if it failed and create appropriate response
    const importResponses = metadata.map((metadataItem, index) => {
      const event = index < events.length ? events[index] : null;
      const { isAbortable, errorMsg } = checkIfEventIsAbortableInImport(event, failedRecords);

      return {
        statusCode: isAbortable ? 400 : 200,
        metadata: metadataItem,
        error: isAbortable ? errorMsg : 'success',
      };
    });

    return {
      status: 200,
      message: `MIXPANEL: Partial failure in batch import. ${failedRecords.length} events failed, ${numRecordsImported} succeeded.`,
      response: importResponses,
    };
  }

  // For successful Import API responses
  if (isHttpStatusSuccess(status)) {
    return createSuccessResponse(status, message, metadata);
  }

  // If we get here, it's a non-success status that will be handled by the default handler
  return null;
};

/**
 * Handles responses from Mixpanel Engage API
 *
 * @param responseParams - The response parameters
 * @returns The processed response or null if not applicable
 */
export const handleEngageApiResponse = (
  responseParams: ResponseHandlerParams,
): ResponseProxyObject | null => handleStandardApiResponse(responseParams, 'Engage');

/**
 * Handles responses from Mixpanel Groups API
 *
 * @param responseParams - The response parameters
 * @returns The processed response or null if not applicable
 */
export const handleGroupsApiResponse = (
  responseParams: ResponseHandlerParams,
): ResponseProxyObject | null => handleStandardApiResponse(responseParams, 'Groups');

/**
 * Handles endpoint-specific responses based on the endpoint path
 *
 * @param endpoint - The endpoint path
 * @param responseParams - The response parameters
 * @returns The processed response or null if not applicable
 */
export const handleEndpointSpecificResponses = (
  endpoint: string,
  responseParams: ResponseHandlerParams,
): ResponseProxyObject | null => {
  if (endpoint.includes('/import')) {
    return handleImportApiResponse(responseParams);
  }
  if (endpoint.includes('/engage')) {
    return handleEngageApiResponse(responseParams);
  }
  if (endpoint.includes('/groups')) {
    return handleGroupsApiResponse(responseParams);
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
