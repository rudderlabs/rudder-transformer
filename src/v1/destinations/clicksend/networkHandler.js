/* eslint-disable @typescript-eslint/naming-convention */
const { TransformerProxyError } = require('../../../v0/util/errorTypes');
const { prepareProxyRequest, proxyRequest } = require('../../../adapters/network');
const { isHttpStatusSuccess } = require('../../../v0/util/index');

const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const tags = require('../../../v0/util/tags');

function checkIfEventIsAbortableAndExtractErrorMessage(singleResponse) {
  const successStatuses = [
    'SUCCESS',
    'Success',
    'QUEUED',
    'Queued',
    'CREATED',
    'Created',
    'NO_CONTENT',
  ];

  const { status } = singleResponse;
  // eslint-disable-next-line unicorn/consistent-destructuring
  const campaignStatus = singleResponse?.sms_campaign?.status;

  // Determine if the status is in the success statuses
  const isStatusSuccess = status && successStatuses.includes(status);
  const isCampaignStatusSuccess = campaignStatus && successStatuses.includes(campaignStatus);

  return {
    isAbortable: !(isStatusSuccess || isCampaignStatusSuccess),
    errorMsg: status || campaignStatus || '',
  };
}
const responseHandler = (responseParams) => {
  const { destinationResponse, rudderJobMetadata } = responseParams;
  const message = `[ CLICKSEND Response V1 Handler] - Request Processed Successfully`;
  let responseWithIndividualEvents = [];
  const { response, status } = destinationResponse;

  if (!isHttpStatusSuccess(status)) {
    const errorMessage = response.replyText || 'unknown error format';
    responseWithIndividualEvents = rudderJobMetadata.map((metadata) => ({
      statusCode: status,
      metadata,
      error: errorMessage,
    }));
    throw new TransformerProxyError(
      ` CLICKSEND: Error transformer proxy v1 during  CLICKSEND response transformation. ${errorMessage}`,
      status,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
      },
      destinationResponse,
      '',
      responseWithIndividualEvents,
    );
  }

  if (isHttpStatusSuccess(status)) {
    // check for Partial Event failures and Successes
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { messages } = response.data;
    const finalData = messages || [response.data];
    finalData.forEach((singleResponse, idx) => {
      const proxyOutput = {
        statusCode: 200,
        metadata: rudderJobMetadata[idx],
        error: 'success',
      };
      // update status of partial event if abortable
      const { isAbortable, errorMsg } = checkIfEventIsAbortableAndExtractErrorMessage(
        singleResponse, // array sms send status / entire destination request
      );
      if (isAbortable) {
        proxyOutput.statusCode = 400;
        proxyOutput.error = errorMsg;
      }
      responseWithIndividualEvents.push(proxyOutput);
    });
    return {
      status,
      message,
      destinationResponse,
      response: responseWithIndividualEvents,
    };
  }

  throw new TransformerProxyError(
    ` CLICKSEND: Error transformer proxy v1 during  CLICKSEND response transformation`,
    status,
    {
      [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
    },
    destinationResponse,
    '',
    responseWithIndividualEvents,
  );
};

function networkHandler() {
  this.prepareProxy = prepareProxyRequest;
  this.proxy = proxyRequest;
  this.processAxiosResponse = processAxiosResponse;
  this.responseHandler = responseHandler;
}

module.exports = { networkHandler, checkIfEventIsAbortableAndExtractErrorMessage };
