const { get, set } = require('lodash');
const sha256 = require('sha256');
const { NetworkError, NetworkInstrumentationError } = require('@rudderstack/integrations-lib');
const SqlString = require('sqlstring');
const { prepareProxyRequest, handleHttpRequest } = require('../../../adapters/network');
const { isHttpStatusSuccess } = require('../../util/index');
const { CONVERSION_ACTION_ID_CACHE_TTL } = require('./config');
const Cache = require('../../util/cache');

const conversionActionIdCache = new Cache(CONVERSION_ACTION_ID_CACHE_TTL);

const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const { BASE_ENDPOINT } = require('./config');

const tags = require('../../util/tags');
const { getAuthErrCategory } = require('../../util/googleUtils');

const ERROR_MSG_PATH = 'response[0].error.message';

/**
 *  This function is used for collecting the conversionActionId using the conversion name
 * @param {*} method
 * @param {*} headers
 * @param {*} params
 * @returns
 */

const getConversionActionId = async ({ method, headers, params, metadata }) => {
  const conversionActionIdKey = sha256(params.event + params.customerId).toString();
  return conversionActionIdCache.get(conversionActionIdKey, async () => {
    const queryString = SqlString.format(
      'SELECT conversion_action.id FROM conversion_action WHERE conversion_action.name = ?',
      [params.event],
    );
    const data = {
      query: queryString,
    };
    const searchStreamEndpoint = `${BASE_ENDPOINT}/${params.customerId}/googleAds:searchStream`;
    const requestBody = {
      url: searchStreamEndpoint,
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
        endpointPath: `/googleAds:searchStream`,
        requestMethod: 'POST',
        module: 'dataDelivery',
        metadata,
      },
    );
    const { status, response } = gaecConversionActionIdResponse;
    if (!isHttpStatusSuccess(status)) {
      throw new NetworkError(
        `"${JSON.stringify(
          get(gaecConversionActionIdResponse, ERROR_MSG_PATH, '')
            ? get(gaecConversionActionIdResponse, ERROR_MSG_PATH, '')
            : response,
        )} during Google_adwords_enhanced_conversions response transformation"`,
        status,
        {
          [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
        },
        response,
        getAuthErrCategory(gaecConversionActionIdResponse),
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
  const { body, method, endpoint, params, metadata } = request;
  const { headers } = request;

  const conversionActionId = await getConversionActionId({ method, headers, params, metadata });

  set(
    body.JSON,
    'conversionAdjustments[0].conversionAction',
    `customers/${params.customerId}/conversionActions/${conversionActionId}`,
  );
  const requestBody = { url: endpoint, data: body.JSON, headers, method };
  const { httpResponse: response } = await handleHttpRequest('constructor', requestBody, {
    destType: 'google_adwords_enhanced_conversions',
    feature: 'proxy',
    endpointPath: `/googleAds:uploadOfflineUserData`,
    requestMethod: 'POST',
    module: 'dataDelivery',
    metadata,
  });
  return response;
};

const responseHandler = (responseParams) => {
  const { destinationResponse } = responseParams;
  const message = 'Request Processed Successfully';
  const { status } = destinationResponse;
  if (isHttpStatusSuccess(status)) {
    // for google ads enhance conversions the partialFailureError returns with status 200
    const { partialFailureError } = destinationResponse.response;
    // non-zero code signifies partialFailure
    // Ref - https://github.com/googleapis/googleapis/blob/master/google/rpc/code.proto
    if (partialFailureError && partialFailureError.code !== 0) {
      throw new NetworkError(
        JSON.stringify(partialFailureError),
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
    getAuthErrCategory(destinationResponse),
  );
};

// eslint-disable-next-line func-names, @typescript-eslint/naming-convention
class networkHandler {
  constructor() {
    this.proxy = ProxyRequest;
    this.responseHandler = responseHandler;
    this.processAxiosResponse = processAxiosResponse;
    this.prepareProxy = prepareProxyRequest;
  }
}

module.exports = { networkHandler };
