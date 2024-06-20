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
const handleErrorResponse = (status, response, rudderJobMetadata) => {
  const errorMessage = response.replyText || 'unknown error format';
  const responseWithIndividualEvents = rudderJobMetadata.map((metadata) => ({
    statusCode: status,
    metadata,
    error: errorMessage,
  }));
  throw new TransformerProxyError(
    `CLICKSEND: Error transformer proxy v1 during CLICKSEND response transformation. ${errorMessage}`,
    status,
    {
      [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
    },
    { response, status },
    '',
    responseWithIndividualEvents,
  );
};

const responseHandler = (responseParams) => {
  const { destinationResponse, rudderJobMetadata } = responseParams;
  const message = '[CLICKSEND Response V1 Handler] - Request Processed Successfully';
  const { response, status } = destinationResponse;

  if (!isHttpStatusSuccess(status)) {
    handleErrorResponse(status, response, rudderJobMetadata);
  }

  const { messages } = response.data;
  const finalData = messages || [response.data];
  const responseWithIndividualEvents = finalData.map((singleResponse, idx) => {
    const proxyOutput = {
      statusCode: 200,
      metadata: rudderJobMetadata[idx],
      error: 'success',
    };
    const { isAbortable, errorMsg } = checkIfEventIsAbortableAndExtractErrorMessage(singleResponse);
    if (isAbortable) {
      proxyOutput.statusCode = 400;
      proxyOutput.error = errorMsg;
    }
    return proxyOutput;
  });

  return {
    status,
    message,
    destinationResponse,
    response: responseWithIndividualEvents,
  };
};

module.exports = {
  responseHandler,
};

function networkHandler() {
  this.prepareProxy = prepareProxyRequest;
  this.proxy = proxyRequest;
  this.processAxiosResponse = processAxiosResponse;
  this.responseHandler = responseHandler;
}

module.exports = { networkHandler, checkIfEventIsAbortableAndExtractErrorMessage };
