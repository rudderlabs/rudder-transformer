/**
 * Network Handler for Dummy Destination (Proxy v1)
 * This file demonstrates an implementation of a network handler for Proxy v1
 */

const { TransformerProxyError } = require('../../../v0/util/errorTypes');
const { prepareProxyRequest, proxyRequest } = require('../../../adapters/network');
const { isHttpStatusSuccess } = require('../../../v0/util/index');
const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const { DESTINATION } = require('../../../v0/destinations/dummy/config');
const tags = require('../../../v0/util/tags');

/**
 * Response handler for the dummy destination (v1)
 * This handler supports partial batch failures for Proxy v1
 * @param responseParams - The response parameters
 * @returns The processed response
 */
const responseHandler = (responseParams) => {
  const { destinationResponse, rudderJobMetadata } = responseParams;
  const { status, response } = destinationResponse;
  const responseWithIndividualEvents = [];

  // Check if the response is successful
  if (isHttpStatusSuccess(status)) {
    // For successful responses, create a success response for each metadata
    rudderJobMetadata.forEach((metadata) => {
      responseWithIndividualEvents.push({
        statusCode: 200,
        metadata,
        error: 'success',
      });
    });

    return {
      status,
      message: `[${DESTINATION}] Request processed successfully`,
      destinationResponse,
      response: responseWithIndividualEvents,
    };
  }

  // Handle rate limiting
  if (status === 429) {
    // For rate limiting, mark all events as retryable
    rudderJobMetadata.forEach((metadata) => {
      responseWithIndividualEvents.push({
        statusCode: 429,
        metadata,
        error: `[${DESTINATION}] Rate limit exceeded. Please try again later.`,
      });
    });

    throw new TransformerProxyError(
      `[${DESTINATION}] Rate limit exceeded. Please try again later.`,
      429,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: 'retryable',
      },
      destinationResponse,
      '',
      responseWithIndividualEvents,
    );
  }

  // Handle authentication errors
  if (status === 401 || status === 403) {
    // For auth errors, mark all events with auth error
    rudderJobMetadata.forEach((metadata) => {
      responseWithIndividualEvents.push({
        statusCode: status,
        metadata,
        error: `[${DESTINATION}] Authentication failed: ${response?.error || 'Invalid credentials'}`,
      });
    });

    throw new TransformerProxyError(
      `[${DESTINATION}] Authentication failed: ${response?.error || 'Invalid credentials'}`,
      status,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: 'auth',
      },
      destinationResponse,
      'auth',
      responseWithIndividualEvents,
    );
  }

  // Handle other errors
  rudderJobMetadata.forEach((metadata) => {
    responseWithIndividualEvents.push({
      statusCode: status,
      metadata,
      error: `[${DESTINATION}] Request failed with status ${status}: ${
        response?.error || 'Unknown error'
      }`,
    });
  });

  throw new TransformerProxyError(
    `[${DESTINATION}] Request failed with status ${status}: ${response?.error || 'Unknown error'}`,
    status,
    {
      [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
    },
    destinationResponse,
    '',
    responseWithIndividualEvents,
  );
};

function networkHandler() {
  this.prepareProxy = prepareProxyRequest;
  this.proxy = proxyRequest;
  this.processAxiosResponse = processAxiosResponse;
  this.responseHandler = responseHandler;
}

module.exports = { networkHandler };
