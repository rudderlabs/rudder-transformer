import { CommonResponse } from './type';

const { isHttpStatusSuccess } = require('../../../v0/util/index');
const { TransformerProxyError } = require('../../../v0/util/errorTypes');
const { getDynamicErrorType } = require('../../../adapters/utils/networkUtils');
const tags = require('../../../v0/util/tags');

class ResponseStrategy {
  handleResponse(responseParams: {
    destinationResponse: { status: number; response: CommonResponse };
  }): void {
    const { destinationResponse } = responseParams;
    const { status } = destinationResponse;

    if (!isHttpStatusSuccess(status)) {
      return this.handleError({
        destinationResponse,
        rudderJobMetadata: [],
      });
    }

    return this.handleSuccess(responseParams);
  }

  handleError(responseParams): void {
    const { destinationResponse, rudderJobMetadata } = responseParams;
    const { response, status } = destinationResponse;
    const errorMessage =
      JSON.stringify(response.params) ||
      JSON.stringify(response.msg) ||
      JSON.stringify(response.message) ||
      'unknown error format';

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

  handleSuccess(responseParams: any): void {
    throw new TransformerProxyError(`success response handling is not added:${responseParams}`);
  }
}

export { ResponseStrategy };
