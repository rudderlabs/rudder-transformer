/* eslint-disable @typescript-eslint/naming-convention */
const { TransformerProxyError } = require('../../../v0/util/errorTypes');
const { prepareProxyRequest, proxyRequest } = require('../../../adapters/network');
const { isHttpStatusSuccess } = require('../../../v0/util/index');

const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const tags = require('../../../v0/util/tags');
const {
  checkIfEventIsAbortableAndExtractErrorMessage,
} = require('../../../v0/destinations/iterable/util');

const responseHandler = (responseParams) => {
  const { destinationResponse, rudderJobMetadata, destinationRequest } = responseParams;
  const message = `[ITERABLE Response Handler] - Request Processed Successfully`;
  let responseWithIndividualEvents = [];
  const { response, status } = destinationResponse;

  if (!isHttpStatusSuccess(status)) {
    const errorMessage = JSON.stringify(response.params) || 'unknown error format';
    responseWithIndividualEvents = rudderJobMetadata.map((metadata) => ({
      statusCode: status,
      metadata,
      error: errorMessage,
    }));
    throw new TransformerProxyError(
      `ITERABLE: Error transformer proxy during ITERABLE response transformation. ${errorMessage}`,
      status,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
      },
      destinationResponse,
      '',
      responseWithIndividualEvents,
    );
  }

  if (isHttpStatusSuccess(status)) {
    // check for Partial Event failures and Successes
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { events, users } = destinationRequest.body.JSON;
    const finalData = events || users;
    finalData.forEach((event, idx) => {
      const proxyOutput = {
        statusCode: 200,
        metadata: rudderJobMetadata[idx],
        error: 'success',
      };
      // update status of partial event if abortable
      const { isAbortable, errorMsg } = checkIfEventIsAbortableAndExtractErrorMessage(
        event,
        destinationResponse,
      );
      if (isAbortable) {
        proxyOutput.statusCode = 400;
        proxyOutput.error = errorMsg;
      }
      responseWithIndividualEvents.push(proxyOutput);
    });
    return {
      status,
      message,
      destinationResponse,
      response: responseWithIndividualEvents,
    };
  }

  throw new TransformerProxyError(
    `ITERABLE: Error transformer proxy during ITERABLE response transformation`,
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

module.exports = { networkHandler, checkIfEventIsAbortableAndExtractErrorMessage };

/**
 * 


class ResponseStrategy {
  handleResponse(responseParams) {
    const { destinationResponse, rudderJobMetadata } = responseParams;
    const { status } = destinationResponse;

    if (!isHttpStatusSuccess(status)) {
      return this.handleError(responseParams);
    }

    return this.handleSuccess(responseParams);
  }

  handleError(responseParams) {
    const { destinationResponse, rudderJobMetadata } = responseParams;
    const { response, status } = destinationResponse;
    const errorMessage = JSON.stringify(response.params) || 'unknown error format';
    
    const responseWithIndividualEvents = rudderJobMetadata.map((metadata) => ({
      statusCode: status,
      metadata,
      error: errorMessage,
    }));

    throw new TransformerProxyError(
      `ITERABLE: Error transformer proxy during ITERABLE response transformation. ${errorMessage}`,
      status,
      { [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status) },
      destinationResponse,
      '',
      responseWithIndividualEvents,
    );
  }

  
  handleSuccess(responseParams) {
    throw new Error('handleSuccess must be implemented');
  }
}


class TrackIdentifyStrategy extends ResponseStrategy {
  constructor(filterFn) {
    super();
    this.filterFn = filterFn;
  }

  handleSuccess(responseParams) {
    const { destinationResponse, rudderJobMetadata, destinationRequest } = responseParams;
    const { status } = destinationResponse;
    const responseWithIndividualEvents = [];
    
    const { events, users } = destinationRequest.body.JSON;
    const finalData = events || users;
    
    finalData.forEach((event, idx) => {
      const proxyOutput = {
        statusCode: 200,
        metadata: rudderJobMetadata[idx],
        error: 'success',
      };

      const { isAbortable, errorMsg } = this.filterFn(event, destinationResponse);
      if (isAbortable) {
        proxyOutput.statusCode = 400;
        proxyOutput.error = errorMsg;
      }
      responseWithIndividualEvents.push(proxyOutput);
    });

    return {
      status,
      message: '[ITERABLE Response Handler] - Request Processed Successfully',
      destinationResponse,
      response: responseWithIndividualEvents,
    };
  }
}


class SimpleStrategy extends ResponseStrategy {
  handleSuccess(responseParams) {
    const { destinationResponse, rudderJobMetadata } = responseParams;
    const { status } = destinationResponse;
    
    const responseWithIndividualEvents = rudderJobMetadata.map(metadata => ({
      statusCode: status,
      metadata,
      error: 'success'
    }));

    return {
      status,
      message: '[ITERABLE Response Handler] - Request Processed Successfully',
      destinationResponse,
      response: responseWithIndividualEvents,
    };
  }
}


const getResponseStrategy = (endpoint) => {
  switch (endpoint) {
    case '/api/events/track':
      return new TrackIdentifyStrategy(checkIfEventIsAbortableAndExtractErrorMessage);
    case '/api/users/update':
      return new TrackIdentifyStrategy(checkIfEventIsAbortableAndExtractErrorMessage);
    default:
      return new SimpleStrategy();
  }
};


const responseHandler = (responseParams) => {
  const { destinationRequest } = responseParams;
  const strategy = getResponseStrategy(destinationRequest.body.endpoint);
  return strategy.handleResponse(responseParams);
};

// ... rest of the code remains same ...
 */
