import { BaseStrategy } from './base';
import { DestinationResponse, ResponseParams, Response } from '../types';
import { checkIfEventIsAbortableAndExtractErrorMessage } from '../../../../v0/destinations/iterable/util';

class TrackIdentifyStrategy extends BaseStrategy {
  handleSuccess(responseParams: ResponseParams): {
    status: number;
    message: string;
    destinationResponse: DestinationResponse;
    response: Response[];
  } {
    const { destinationResponse, rudderJobMetadata, destinationRequest } = responseParams;
    const { status } = destinationResponse;
    const responseWithIndividualEvents: Response[] = [];

    const { events, users } = destinationRequest?.body.JSON || {};
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
