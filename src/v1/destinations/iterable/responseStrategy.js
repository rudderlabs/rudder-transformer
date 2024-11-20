const { isHttpStatusSuccess } = require('../../../v0/util/index');
const { TransformerProxyError } = require('../../../v0/util/errorTypes');
const { getDynamicErrorType } = require('../../../adapters/utils/networkUtils');
const tags = require('../../../v0/util/tags');

class ResponseStrategy {
  handleResponse(responseParams) {
    const { destinationResponse } = responseParams;
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
    throw new TransformerProxyError(`success response handling is not added:${responseParams}`);
  }
}

module.exports = { ResponseStrategy };
