const { TransformerProxyError } = require('../../../v0/util/errorTypes');
const { prepareProxyRequest, proxyRequest } = require('../../../adapters/network');
const { isHttpStatusSuccess } = require('../../../v0/util/index');
const { CommonUtils } = require('../../../util/common');

const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const tags = require('../../../v0/util/tags');

const responseHandler = (responseParams) => {
  const { destinationResponse, rudderJobMetadata, destType } = responseParams;
  const message = `[ALGOLIA Response V1 Handler] - Request Processed Successfully`;
  const { response, status } = destinationResponse;
  const metaDataArray = CommonUtils.toArray(rudderJobMetadata);

  if (isHttpStatusSuccess(status)) {
    return {
      status,
      message,
      destinationResponse,
      response: metaDataArray.map((metadata) => ({
        statusCode: 200,
        metadata,
        error: 'success',
      })),
    };
  }

  // If metadata.dontBatch is not set, use status 500, otherwise use the original status of destinationResponse because event already retried
  const errorMessage = response?.error?.message || response?.message || 'unknown error format';
  if (status >= 400 && status < 500) {
    return {
      status: 200,
      message: `[ALGOLIA Response V1 Handler] - Request Processed with Errors`,
      destinationResponse,
      statTags: {
        errorCategory: 'network',
        errorType: 'retryable',
        destType: destType && typeof destType === 'string' ? destType.toUpperCase() : '',
        module: 'destination',
        implementation: 'native',
        feature: 'dataDelivery',
        destinationId: metaDataArray[0]?.destinationId || '',
        workspaceId: metaDataArray[0]?.workspaceId || '',
      },
      response: metaDataArray.map((metadata) => {
        const statusCode = !metadata.dontBatch ? 500 : status;
        return {
          statusCode,
          metadata: { ...metadata, dontBatch: true },
          error: errorMessage,
        };
      }),
    };
  }

  throw new TransformerProxyError(
    `ALGOLIA: Error transformer proxy v1 during ALGOLIA response transformation`,
    status,
    {
      [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
    },
    destinationResponse,
    '',
    metaDataArray.map((metadata) => ({
      statusCode: status,
      metadata,
      error: errorMessage,
    })),
  );
};

function networkHandler() {
  this.prepareProxy = prepareProxyRequest;
  this.proxy = proxyRequest;
  this.processAxiosResponse = processAxiosResponse;
  this.responseHandler = responseHandler;
}

module.exports = { networkHandler };
