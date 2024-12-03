import { ResponseStrategy } from './responseStrategy';
import { checkIfEventIsAbortableAndExtractErrorMessage } from '../../../v0/destinations/iterable/util';
import { CommonResponse } from './type';

interface ResponseParams {
  destinationResponse: { status: number; response: CommonResponse };
  rudderJobMetadata: any[];
  destinationRequest: {
    body: {
      JSON: {
        events?: any[];
        users?: any[];
      };
    };
  };
}

class TrackIdentifyStrategy extends ResponseStrategy {
  handleSuccess(responseParams: ResponseParams): {
    status: number;
    message: string;
    destinationResponse: { status: number; response: CommonResponse };
    response: Array<{ statusCode: number; metadata: any; error: string }>;
  } {
    const { destinationResponse, rudderJobMetadata, destinationRequest } = responseParams;
    const { status } = destinationResponse;
    const responseWithIndividualEvents: Array<{
      statusCode: number;
      metadata: any;
      error: string;
    }> = [];

    const { events, users } = destinationRequest.body.JSON;
    const finalData = events || users;

    if (finalData) {
      finalData.forEach((event, idx) => {
        const proxyOutput = {
          statusCode: 200,
          metadata: rudderJobMetadata[idx],
          error: 'success',
        };

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
    }

    return {
      status,
      message: '[ITERABLE Response Handler] - Request Processed Successfully',
      destinationResponse,
      response: responseWithIndividualEvents,
    };
  }
}

export { TrackIdentifyStrategy };
