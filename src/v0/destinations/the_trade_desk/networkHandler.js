const { NetworkError, AbortedError, PlatformError } = require('@rudderstack/integrations-lib');
const { httpSend, prepareProxyRequest } = require('../../../adapters/network');
const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const { getSignatureHeader } = require('../../../cdk/v2/destinations/the_trade_desk/utils');
const { isHttpStatusSuccess } = require('../../util/index');
const tags = require('../../util/tags');
const { JSON_MIME_TYPE } = require('../../util/constant');

const proxyRequest = async (request) => {
  const { endpoint, data, method, params, headers, config } = prepareProxyRequest(request);

  if (!config?.advertiserSecretKey) {
    throw new PlatformError('Advertiser secret key is missing in destination config. Aborting');
  }

  if (!process.env.THE_TRADE_DESK_DATA_PROVIDER_SECRET_KEY) {
    throw new PlatformError('Data provider secret key is missing. Aborting');
  }

  const ProxyHeaders = {
    ...headers,
    TtdSignature: getSignatureHeader(data, config.advertiserSecretKey),
    'TtdSignature-dp': getSignatureHeader(
      data,
      process.env.THE_TRADE_DESK_DATA_PROVIDER_SECRET_KEY,
    ),
    'Content-Type': JSON_MIME_TYPE,
  };

  const requestOptions = {
    url: endpoint,
    data,
    params,
    headers: ProxyHeaders,
    method,
  };
  const response = await httpSend(requestOptions, { feature: 'proxy', destType: 'the_trade_desk' });
  return response;
};

const responseHandler = (destinationResponse) => {
  const message = 'Request Processed Successfully';
  const { response, status } = destinationResponse;

  // if the response from destination is not a success case build an explicit error
  if (!isHttpStatusSuccess(status)) {
    throw new NetworkError(
      `Request failed with status: ${status} due to ${response}`,
      status,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
      },
      destinationResponse,
    );
  }

  // Trade desk returns 200 with an error in case of "Failed to parse TDID, DAID, UID2, IDL, EUID, or failed to decrypt UID2Token or EUIDToken"
  // https://partner.thetradedesk.com/v3/portal/data/doc/post-data-advertiser-external
  // {"FailedLines":[{"ErrorCode":"MissingUserId","Message":"Invalid DAID, item #1"}]}
  if ('FailedLines' in response && response.FailedLines.length > 0) {
    throw new AbortedError(
      `Request failed with status: ${status} due to ${JSON.stringify(response)}`,
      400,
      destinationResponse,
    );
  }

  // else successfully return status, message and original destination response
  // Trade desk returns 200 with empty object '{}' in response if all the events are processed successfully
  return {
    status,
    message,
    destinationResponse,
  };
};

function networkHandler() {
  this.proxy = proxyRequest;
  this.processAxiosResponse = processAxiosResponse;
  this.prepareProxy = prepareProxyRequest;
  this.responseHandler = responseHandler;
}
module.exports = { networkHandler };
