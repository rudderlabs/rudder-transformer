import { AbortedError, RetryableError, ThrottledError } from '@rudderstack/integrations-lib';
import { DESTINATION } from '../../destinations/salesforce/config';

// ref: https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/errorcodes.htm?q=error%20code
/**
 * 
 * @param {*} response is of structure
 * [
 * {
 *  "message" : "The requested resource does not exist",
 *  "errorCode" : "NOT_FOUND"
}
]
 * @returns error message
 */
const getErrorMessage = (response: { message?: string; errorCode?: string }[]) => {
  if (Array.isArray(response) && response?.[0]?.message && response?.[0]?.message?.length > 0) {
    return response[0].message;
  }
  return JSON.stringify(response);
};

export const handleCommonAbortableError = (
  destResponse: any,
  sourceMessage: string,
  status: number,
) => {
  throw new AbortedError(
    `${DESTINATION} Request Failed: "${status}" due to "${getErrorMessage(destResponse.response)}", (Aborted) ${sourceMessage}`,
    400,
    destResponse,
  );
};

export const handleAuthError = (
  errorCode: string,
  authErrCategory: string,
  sourceMessage: string,
  destResponse: any,
  status: number,
) => {
  if (errorCode === 'INVALID_SESSION_ID') {
    throw new RetryableError(
      `${DESTINATION} Request Failed - due to "INVALID_SESSION_ID", (${authErrCategory}) ${sourceMessage}`,
      500,
      destResponse,
      authErrCategory,
    );
  }
  handleCommonAbortableError(destResponse, sourceMessage, status);
};

export const errorResponseHandler = (destResponse: any, sourceMessage: string) => {
  const { response, status } = destResponse;
  const matchErrorCode = (errorCode) =>
    response && Array.isArray(response) && response.some((resp) => resp?.errorCode === errorCode);
  const matchErrorMessage = (messageCode) =>
    response &&
    Array.isArray(response) &&
    response.some((resp) => resp?.message?.includes(messageCode));
  switch (status) {
    case 403:
      if (matchErrorCode('REQUEST_LIMIT_EXCEEDED')) {
        throw new ThrottledError(
          `${DESTINATION} Request Failed - due to "REQUEST_LIMIT_EXCEEDED", (Throttled) ${sourceMessage}`,
          destResponse,
        );
      }
      handleCommonAbortableError(destResponse, sourceMessage, status);
      break;

    case 503:
      if (matchErrorCode('SERVER_UNAVAILABLE')) {
        throw new ThrottledError(
          `${DESTINATION} Request Failed: ${status} - due to Search unavailable, ${sourceMessage}`,
          destResponse,
        );
      }
      throw new RetryableError(
        `${DESTINATION} Request Failed: ${status} - due to "${getErrorMessage(response)}", (Retryable) ${sourceMessage}`,
        500,
        destResponse,
      );

    case 400:
      if (
        (matchErrorCode('CANNOT_INSERT_UPDATE_ACTIVATE_ENTITY') &&
          matchErrorMessage('UNABLE_TO_LOCK_ROW')) ||
        matchErrorMessage('Too many SOQL queries')
      ) {
        throw new RetryableError(
          `${DESTINATION} Request Failed - "${response[0].message}", (Retryable) ${sourceMessage}`,
          500,
          destResponse,
        );
      }
      handleCommonAbortableError(destResponse, sourceMessage, status);
      break;

    case 500:
      throw new RetryableError(
        `${DESTINATION} Request Failed: ${status} - due to "${getErrorMessage(response)}", (Retryable) ${sourceMessage}`,
        500,
        destResponse,
      );

    default:
      // Default case: aborting for all other error codes
      handleCommonAbortableError(destResponse, sourceMessage, status);
  }
};
