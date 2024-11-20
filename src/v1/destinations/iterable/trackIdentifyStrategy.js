const { ResponseStrategy } = require('./responseStrategy');
const {
  checkIfEventIsAbortableAndExtractErrorMessage,
} = require('../../../v0/destinations/iterable/util');

class TrackIdentifyStrategy extends ResponseStrategy {
  constructor() {
    super();
    this.filterFn = checkIfEventIsAbortableAndExtractErrorMessage;
  }

  handleSuccess(responseParams) {
    const { destinationResponse, rudderJobMetadata, destinationRequest } = responseParams;
    const { status } = destinationResponse;
    const responseWithIndividualEvents = [];

    const { events, users } = destinationRequest.body.JSON;
    const finalData = events || users;

    finalData.forEach((event, idx) => {
      const proxyOutput = {
        statusCode: 200,
        metadata: rudderJobMetadata[idx],
        error: 'success',
      };

      const { isAbortable, errorMsg } = this.filterFn(event, destinationResponse);
      if (isAbortable) {
        proxyOutput.statusCode = 400;
        proxyOutput.error = errorMsg;
      }
      responseWithIndividualEvents.push(proxyOutput);
    });

    return {
      status,
      message: '[ITERABLE Response Handler] - Request Processed Successfully',
      destinationResponse,
      response: responseWithIndividualEvents,
    };
  }
}

module.exports = { TrackIdentifyStrategy };
