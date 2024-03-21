const { TransformerProxyError } = require('../../../v0/util/errorTypes');
const { prepareProxyRequest, proxyRequest } = require('../../../adapters/network');
const { isHttpStatusSuccess, getAuthErrCategoryFromStCode } = require('../../../v0/util/index');

const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const tags = require('../../../v0/util/tags');

function constructPartialStatus(errorMessage) {
  const errorPattern = /Index: (\d+), ERROR :: (.*?)\n/g;
  let match;
  const errorMap = {};

  // eslint-disable-next-line no-cond-assign
  while ((match = errorPattern.exec(errorMessage)) !== null) {
    const [, index, message] = match;
    errorMap[index] = message;
  }

  return errorMap;
}

function createResponseArray(metadata, partialStatus) {
  const partialStatusArray = Object.entries(partialStatus).map(([index, message]) => [
    Number(index),
    message,
  ]);
  // Convert destPartialStatus to an object for easier lookup
  const errorMap = partialStatusArray.reduce((acc, [index, message]) => {
    const jobId = metadata[index]?.jobId; // Get the jobId from the metadata array based on the index
    if (jobId !== undefined) {
      acc[jobId] = message;
    }
    return acc;
  }, {});

  return metadata.map((item) => {
    const error = errorMap[item.jobId];
    return {
      statusCode: error ? 400 : 500,
      metadata: item,
      error: error || 'success',
    };
  });
}

// eslint-disable-next-line consistent-return
const responseHandler = (responseParams) => {
  const { destinationResponse, rudderJobMetadata } = responseParams;
  const message = `[LINKEDIN_CONVERSION_API Response V1 Handler] - Request Processed Successfully`;
  let responseWithIndividualEvents = [];
  const { response, status } = destinationResponse;

  // even if a single event is unsuccessful, the entire batch will fail, we will filter that event out and retry others
  if (!isHttpStatusSuccess(status)) {
    if (status === 401 || status === 403) {
      const errorMessage = response.error?.message || 'unknown error format';
      responseWithIndividualEvents = rudderJobMetadata.map((metadata) => ({
        statusCode: status,
        metadata,
        error: errorMessage,
      }));
      throw new TransformerProxyError(
        `LinkedIn Conversion API: Error transformer proxy v1 during LinkedIn Conversion API response transformation`,
        status,
        {
          [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
        },
        destinationResponse,
        getAuthErrCategoryFromStCode(status),
        responseWithIndividualEvents,
      );
    }
    // if the status is 422, we need to parse the error message and construct the response array
    if (status === 422) {
      const destPartialStatus = constructPartialStatus(response?.message);
      responseWithIndividualEvents = [...createResponseArray(rudderJobMetadata, destPartialStatus)];
      return {
        status,
        message,
        destinationResponse,
        response: responseWithIndividualEvents,
      };
    }
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
