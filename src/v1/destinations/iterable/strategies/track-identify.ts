import { BaseStrategy } from './base';
import { IterableBulkProxyInput } from '../types';
import { checkIfEventIsAbortableAndExtractErrorMessage } from '../utils';
import { DeliveryJobState, DeliveryV1Response } from '../../../../types';

class TrackIdentifyStrategy extends BaseStrategy {
  handleSuccess(responseParams: IterableBulkProxyInput): DeliveryV1Response {
    const { destinationResponse, rudderJobMetadata, destinationRequest } = responseParams;
    const { status } = destinationResponse;
    const responseWithIndividualEvents: DeliveryJobState[] = [];

    const { events, users } = destinationRequest?.body.JSON || {};
    const finalData = events || users;

    if (finalData) {
      finalData.forEach((event, idx) => {
        const parsedOutput = {
          statusCode: 200,
          metadata: rudderJobMetadata[idx],
          error: 'success',
        };

        const { isAbortable, errorMsg } = checkIfEventIsAbortableAndExtractErrorMessage(
          event,
          destinationResponse,
        );
        if (isAbortable) {
          parsedOutput.statusCode = 400;
          parsedOutput.error = errorMsg;
        }
        responseWithIndividualEvents.push(parsedOutput);
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
