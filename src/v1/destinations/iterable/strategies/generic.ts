import { BaseStrategy } from './base';
import {
  GenericProxyHandlerInput,
  IterableBulkApiResponse,
  IterableSuccessResponse,
} from '../types';
import { ProxyMetdata } from '../../../../types';
import { TransformerProxyError } from '../../../../v0/util/errorTypes';
import { TAG_NAMES } from '../../../../v0/util/tags';
import { getDynamicErrorType } from '../../../../adapters/utils/networkUtils';

class GenericStrategy extends BaseStrategy {
  handleSuccess(responseParams: {
    destinationResponse: IterableBulkApiResponse;
    rudderJobMetadata: ProxyMetdata[];
  }): IterableSuccessResponse {
    const { destinationResponse, rudderJobMetadata } = responseParams;
    const { status } = destinationResponse;

    const responseWithIndividualEvents = rudderJobMetadata.map((metadata) => ({
      statusCode: status,
      metadata,
      error: 'success',
    }));

    return {
      status,
      message: '[ITERABLE Response Handler] - Request Processed Successfully',
      destinationResponse,
      response: responseWithIndividualEvents,
    };
  }

  handleError(responseParams: GenericProxyHandlerInput): void {
    const { destinationResponse, rudderJobMetadata } = responseParams;
    const { response, status } = destinationResponse;
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
}

export { GenericStrategy };
