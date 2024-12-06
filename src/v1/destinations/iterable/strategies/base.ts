import { TAG_NAMES } from '@rudderstack/integrations-lib';
import { getDynamicErrorType } from '../../../../adapters/utils/networkUtils';
import { isHttpStatusSuccess } from '../../../../v0/util';
import { TransformerProxyError } from '../../../../v0/util/errorTypes';
import { DestinationResponse, ResponseParams } from '../types';

// Base strategy is the base class for all strategies in Iterable destination
class BaseStrategy {
  handleResponse(responseParams: { destinationResponse: DestinationResponse }): void {
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

  handleError(responseParams: ResponseParams): void {
    const { destinationResponse, rudderJobMetadata } = responseParams;
    const { response, status } = destinationResponse;
    // @ts-expect-error: not sure if `response.message` is correct or needed
    const responseMessage = response.params || response.msg || response.message;
    const errorMessage = JSON.stringify(responseMessage) || 'unknown error format';

    const responseWithIndividualEvents = rudderJobMetadata.map((metadata) => ({
      statusCode: status,
      metadata,
      error: errorMessage,
    }));

    throw new TransformerProxyError(
      `ITERABLE: Error transformer proxy during ITERABLE response transformation. ${errorMessage}`,
      status,
      { [TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status) },
      destinationResponse,
      '',
      responseWithIndividualEvents,
    );
  }

  handleSuccess(responseParams: any): void {
    throw new TransformerProxyError(`success response handling is not added:${responseParams}`);
  }
}

export { BaseStrategy };
