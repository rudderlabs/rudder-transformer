const { get, set } = require('lodash');
const sha256 = require('sha256');
const {
  NetworkError,
  // NetworkInstrumentationError,
  GoogleAdsSDK,
  InstrumentationError,
  isDefinedAndNotNullAndNotEmpty,
} = require('@rudderstack/integrations-lib');
// const SqlString = require('sqlstring');
const { prepareProxyRequest } = require('../../../adapters/network');
const { isHttpStatusSuccess } = require('../../util/index');
const { CONVERSION_ACTION_ID_CACHE_TTL } = require('./config');
const { getDeveloperToken } = require('../../util/googleUtils');
const Cache = require('../../util/cache');

const conversionActionIdCache = new Cache(
  'GOOGLE_ADWORDS_ENHANCED_CONVERSIONS_ACTION_ID',
  CONVERSION_ACTION_ID_CACHE_TTL,
);

const { getDynamicErrorType } = require('../../../adapters/utils/networkUtils');

const tags = require('../../util/tags');
const { getAuthErrCategory } = require('../../util/googleUtils');
const { statsClient } = require('../../../util/stats');
const logger = require('../../../logger');

/**
 *  This function is used for collecting the conversionActionId using the conversion name
 * @param {*} method
 * @param {*} headers
 * @param {*} params
 * @returns
 */

const getConversionActionId = async ({ params, googleAds }) => {
  const conversionActionIdKey = sha256(params.event + params.customerId).toString();
  return conversionActionIdCache.get(conversionActionIdKey, async () => {
    const resp = await googleAds.getConversionActionId(params.event);
    if (typeof resp === 'string') {
      return resp;
    }
    if (resp === null) {
      throw new InstrumentationError(
        'Conversion Action not found, make sure the event name provided on the dashboard is exactly same as the conversion action name in Google Ads',
      );
    }
    if (resp.type === 'client-error') {
      throw new NetworkError(
        `"${resp.message} during Google_adwords_enhanced_conversions response transformation[client-error]"`,
        resp.statusCode,
        {
          [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(resp.statusCode),
        },
        resp,
        getAuthErrCategory({ response: resp, status: resp.statusCode }),
      );
    }

    if (resp.type === 'application-error') {
      throw new NetworkError(
        `"${JSON.stringify(resp.responseBody)} during Google_adwords_enhanced_conversions response transformation"`,
        resp.statusCode,
        {
          [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(resp.statusCode),
        },
        resp.responseBody,
        getAuthErrCategory({ response: resp.responseBody, status: resp.statusCode }),
      );
    }
    throw new NetworkError(
      `"${JSON.stringify(resp)} during Google_adwords_enhanced_conversions response transformation"`,
      500,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(500),
      },
      resp,
    );
  });
};

/**
 * This function is responsible for collecting the conversionActionId
 * and calling the enhanced conversion.
 * data to customer list.
 * @param {*} request
 * @returns
 */
const gaecProxyRequest = async (request) => {
  const { body, params } = request;
  const googleAds = new GoogleAdsSDK.GoogleAds(
    {
      accessToken: params.accessToken,
      customerId: params.customerId,
      loginCustomerId: params.subAccount ? params.loginCustomerId : '',
      developerToken: getDeveloperToken(),
    },
    {
      httpClient: {
        statsClient,
        logger,
      },
    },
  );
  const conversionActionId = await getConversionActionId({
    params,
    googleAds,
  });

  set(body.JSON, 'conversionAdjustments[0].conversionAction', `${conversionActionId}`);

  const response = await googleAds.addConversionAdjustMent(body.JSON);

  return response;
};

const gaecProcessAxiosResponse = (sdkResponse) => ({
  response: sdkResponse.responseBody,
  status: sdkResponse.statusCode,
  ...(isDefinedAndNotNullAndNotEmpty(sdkResponse.headers) ? { headers: sdkResponse.headers } : {}),
});
const gaecResponseHandler = (responseParams) => {
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
    this.proxy = gaecProxyRequest;
    this.responseHandler = gaecResponseHandler;
    this.processAxiosResponse = gaecProcessAxiosResponse;
    this.prepareProxy = prepareProxyRequest;
  }
}

module.exports = { networkHandler };
