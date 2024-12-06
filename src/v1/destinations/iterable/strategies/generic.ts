import { PrincipalStrategy } from './principal';
import { DestinationResponse, SuccessResponse } from '../types';

class GenericStrategy extends PrincipalStrategy {
  handleSuccess(responseParams: {
    destinationResponse: DestinationResponse;
    rudderJobMetadata: any[];
  }): SuccessResponse {
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
