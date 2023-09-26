const { get, set } = require('lodash');
const sha256 = require('sha256');
const { prepareProxyRequest, handleHttpRequest } = require('../../../adapters/network');
const {
  isHttpStatusSuccess,
  getAuthErrCategoryFromErrDetailsAndStCode,
} = require('../../util/index');
const { CONVERSION_ACTION_ID_CACHE_TTL } = require('./config');
const Cache = require('../../util/cache');

const conversionActionIdCache = new Cache(CONVERSION_ACTION_ID_CACHE_TTL);

const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const { BASE_ENDPOINT } = require('./config');
const { NetworkError, NetworkInstrumentationError } = require('../../util/errorTypes');
const tags = require('../../util/tags');

/**
 *  This function is used for collecting the conversionActionId using the conversion name
 * @param {*} method
 * @param {*} headers
 * @param {*} params
 * @returns
 */

const getConversionActionId = async (method, headers, params) => {
  const conversionActionIdKey = sha256(params.event + params.customerId).toString();
  return conversionActionIdCache.get(conversionActionIdKey, async () => {
    const data = {
      query: `SELECT conversion_action.id FROM conversion_action WHERE conversion_action.name = '${params.event}'`,
    };
    const requestBody = {
      url: `${BASE_ENDPOINT}/${params.customerId}/googleAds:searchStream`,
      data,
      headers,
      method,
    };
    const { processedResponse: gaecConversionActionIdResponse } = await handleHttpRequest(
      'constructor',
      requestBody,
      {
        destType: 'google_adwords_enhanced_conversions',
        feature: 'proxy',
      },
    );
    if (!isHttpStatusSuccess(gaecConversionActionIdResponse.status)) {
      throw new NetworkError(
        `"${JSON.stringify(
          get(gaecConversionActionIdResponse, 'response[0].error.message', '')
            ? get(gaecConversionActionIdResponse, 'response[0].error.message', '')
            : gaecConversionActionIdResponse.response,
        )} during Google_adwords_enhanced_conversions response transformation"`,
        gaecConversionActionIdResponse.status,
        {
          [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(gaecConversionActionIdResponse.status),
        },
        gaecConversionActionIdResponse.response,
        getAuthErrCategoryFromErrDetailsAndStCode(
          get(gaecConversionActionIdResponse, 'status'),
          get(gaecConversionActionIdResponse, 'response[0].error.message'),
        ),
      );
    }
    const conversionActionId = get(
      gaecConversionActionIdResponse,
      'response[0].results[0].conversionAction.id',
    );
    if (!conversionActionId) {
      throw new NetworkInstrumentationError(
        `Unable to find conversionActionId for conversion:${params.event}`,
      );
    }
    return conversionActionId;
  });
};

/**
 * This function is responsible for collecting the conversionActionId
 * and calling the enhanced conversion.
 * data to customer list.
 * @param {*} request
 * @returns
 */
const ProxyRequest = async (request) => {
  const { body, method, endpoint, params } = request;
  const { headers } = request;

  const conversionActionId = await getConversionActionId(method, headers, params);

  set(
    body.JSON,
    'conversionAdjustments[0].conversionAction',
    `customers/${params.customerId}/conversionActions/${conversionActionId}`,
  );
  const requestBody = { url: endpoint, data: body.JSON, headers, method };
  const { httpResponse: response } = await handleHttpRequest('constructor', requestBody, {
    destType: 'google_adwords_enhanced_conversions',
    feature: 'proxy',
  });
  return response;
};

const responseHandler = (destinationResponse) => {
  const message = 'Request Processed Successfully';
  const { status } = destinationResponse;
  if (isHttpStatusSuccess(status)) {
    // for google ads enhance conversions the partialFailureError returns with status 200
    const { partialFailureError } = destinationResponse.response;
    // non-zero code signifies partialFailure
    // Ref - https://github.com/googleapis/googleapis/blob/master/google/rpc/code.proto
    if (partialFailureError && partialFailureError.code !== 0) {
      throw new NetworkError(
        `[Google Ads Offline Conversions]:: partialFailureError - ${JSON.stringify(
          partialFailureError,
        )}`,
        400,
        {
          [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(400),
        },
        partialFailureError,
      );
    }

    return {
      status,
      message,
      destinationResponse,
    };
  }
  // else successfully return status, message and original destination response
  const { response } = destinationResponse;
  const errMessage = get(response, 'error.message', '');
  throw new NetworkError(
    `${errMessage}" during Google_adwords_enhanced_conversions response transformation`,
    status,
    {
      [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
    },
    response,
    getAuthErrCategoryFromErrDetailsAndStCode(status, response),
  );
};

class networkHandler {
  constructor() {
    this.proxy = ProxyRequest;
    this.responseHandler = responseHandler;
    this.processAxiosResponse = processAxiosResponse;
    this.prepareProxy = prepareProxyRequest;
  }
}

module.exports = { networkHandler };
