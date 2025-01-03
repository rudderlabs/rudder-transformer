import { BaseStrategy } from './base';
import { IterableBulkApiResponse, IterableSuccessResponse } from '../types';
import { ProxyMetdata } from '../../../../types';

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
}

export { GenericStrategy };
