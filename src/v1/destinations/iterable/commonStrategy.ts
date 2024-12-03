import { CommonResponse } from './type';

const { ResponseStrategy } = require('./responseStrategy');

class CommonStrategy extends ResponseStrategy {
  handleSuccess(responseParams: {
    destinationResponse: { status: number; response: CommonResponse };
    rudderJobMetadata: any[];
  }): {
    status: number;
    message: string;
    destinationResponse: { status: number; response: CommonResponse };
    response: { statusCode: number; metadata: any; error: string }[];
  } {
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

export { CommonStrategy };
