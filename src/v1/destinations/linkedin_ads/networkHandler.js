const lodash = require('lodash');
const { TransformerProxyError } = require('../../../v0/util/errorTypes');
const { prepareProxyRequest, proxyRequest } = require('../../../adapters/network');
const { isHttpStatusSuccess } = require('../../../v0/util/index');

const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const tags = require('../../../v0/util/tags');
const {
  constructPartialStatus,
  createResponseArray,
  getAuthErrCategoryFromStCode,
} = require('../../../cdk/v2/destinations/linkedin_ads/utils');

// eslint-disable-next-line consistent-return
// ref :
// 1) https://learn.microsoft.com/en-us/linkedin/shared/api-guide/concepts/error-handling
// 2) https://learn.microsoft.com/en-us/linkedin/marketing/integrations/ads-reporting/conversions-api?view=li-lms-2024-02&tabs=http#api-error-details
// statusCode : 422 we have found by trial and error, not documented in their doc

const responseHandler = (responseParams) => {
  const { destinationResponse, rudderJobMetadata } = responseParams;
  const message = `[LINKEDIN_CONVERSION_API Response V1 Handler] - Request Processed Successfully`;
  let responseWithIndividualEvents = [];
  const { response, status } = destinationResponse;

  // even if a single event is unsuccessful, the entire batch will fail, we will filter that event out and retry others
  if (!isHttpStatusSuccess(status)) {
    const errorMessage = response.message || 'unknown error format';
    responseWithIndividualEvents = rudderJobMetadata.map((metadata) => ({
      statusCode: status,
      metadata,
      error: errorMessage,
    }));
    if (status === 401 || status === 403) {
      const finalStatus = status === 401 && response.code !== 'REVOKED_ACCESS_TOKEN' ? 500 : 400;
      const finalMessage =
        status === 401
          ? 'Invalid or expired access token. Retrying'
          : 'Lack of permissions to perform the operation. Aborting';
      throw new TransformerProxyError(
        `LinkedIn Conversion API: Error transformer proxy v1 during LinkedIn Conversion API response transformation. ${finalMessage}`,
        finalStatus,
        {
          [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(finalStatus),
        },
        destinationResponse,
        getAuthErrCategoryFromStCode(destinationResponse),
        responseWithIndividualEvents,
      );
    }
    // if the status is 422, we need to parse the error message and construct the response array
    if (status === 422) {
      const destPartialStatus = constructPartialStatus(response?.message);
      // if the error message is not in the expected format, we will abort all of the events
      if (!destPartialStatus || lodash.isEmpty(destPartialStatus)) {
        throw new TransformerProxyError(
          `LinkedIn Conversion API: Error transformer proxy v1 during LinkedIn Conversion API response transformation. Error parsing error message`,
          status,
          {
            [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
          },
          destinationResponse,
          getAuthErrCategoryFromStCode(status),
          responseWithIndividualEvents,
        );
      }
      responseWithIndividualEvents = [...createResponseArray(rudderJobMetadata, destPartialStatus)];
      return {
        status,
        message,
        destinationResponse,
        response: responseWithIndividualEvents,
      };
    }
    throw new TransformerProxyError(
      `LinkedIn Conversion API: Error transformer proxy v1 during LinkedIn Conversion API response transformation. ${errorMessage}`,
      status,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
      },
      destinationResponse,
      getAuthErrCategoryFromStCode(status),
      responseWithIndividualEvents,
    );
  }

  // otherwise all events are successful
  responseWithIndividualEvents = rudderJobMetadata.map((metadata) => ({
    statusCode: 200,
    metadata,
    error: 'success',
  }));

  return {
    status,
    message,
    destinationResponse,
    response: responseWithIndividualEvents,
  };
};

function networkHandler() {
  this.prepareProxy = prepareProxyRequest;
  this.proxy = proxyRequest;
  this.processAxiosResponse = processAxiosResponse;
  this.responseHandler = responseHandler;
}

module.exports = { networkHandler };
