const set = require('set-value');
const get = require('get-value');
const sha256 = require('sha256');
const { prepareProxyRequest, httpSend, httpPOST } = require('../../../adapters/network');
const { REFRESH_TOKEN } = require('../../../adapters/networkhandler/authConstants');
const {
  isHttpStatusSuccess,
  getHashFromArray,
  isDefinedAndNotNullAndNotEmpty,
} = require('../../util');
const { getConversionActionId } = require('./utils');
const Cache = require('../../util/cache');
const { CONVERSION_CUSTOM_VARIABLE_CACHE_TTL, SEARCH_STREAM } = require('./config');
const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const {
  AbortedError,
  NetworkInstrumentationError,
  NetworkError,
} = require('../../util/errorTypes');
const tags = require('../../util/tags');

const conversionCustomVariableCache = new Cache(CONVERSION_CUSTOM_VARIABLE_CACHE_TTL);

/**
 * This function helps to determine the type of error occurred. We set the authErrorCategory
 * as per the destination response that is received and take the decision whether
 * to refresh the access_token or disable the destination.
 * @param {*} status
 * @returns
 */
const getAuthErrCategory = (status) => {
  if (status === 401) {
    // UNAUTHORIZED
    return REFRESH_TOKEN;
  }
  return '';
};

const createJob = async (endpoint, headers, payload) => {
  const endPoint = `${endpoint}:create`;
  let createJobResponse = await httpPOST(endPoint, payload, { headers });
  createJobResponse = processAxiosResponse(createJobResponse);
  const { response, status } = createJobResponse;
  if (!isHttpStatusSuccess(status)) {
    throw new AbortedError(
      `[Google Ads Offline Conversions]:: ${response?.error?.message} during google_ads_offline_store_conversions Job Creation`,
      status,
      response,
      getAuthErrCategory(status),
    );
  }
  return response.resourceName.split('/')[3];
};

const addConversionToJob = async (endpoint, headers, jobId, payload) => {
  const endPoint = `${endpoint}/${jobId}:addOperations`;
  let addConversionToJobResponse = await httpPOST(endPoint, payload, { headers });
  addConversionToJobResponse = processAxiosResponse(addConversionToJobResponse);
  if (!isHttpStatusSuccess(addConversionToJobResponse.status)) {
    throw new AbortedError(
      `[Google Ads Offline Conversions]:: ${addConversionToJobResponse.response?.error?.message} during google_ads_offline_store_conversions Add Conversion`,
      addConversionToJobResponse.status,
      addConversionToJobResponse.response,
      getAuthErrCategory(get(addConversionToJobResponse, 'status')),
    );
  }
  return true;
};

const runTheJob = async (endpoint, headers, payload, jobId) => {
  const endPoint = `${endpoint}/${jobId}:run`;
  const executeJobResponse = await httpPOST(endPoint, payload, { headers });
  return executeJobResponse;
};

/**
 * get all the custom variable for a customerID i.e created
 * in Google Ads using searchStream endpoint
 * @param {*} customerId
 * @param {*} event
 * @param {*} headers
 * @returns
 */
const getConversionCustomVariable = async (headers, params) => {
  const conversionCustomVariableKey = sha256(params.customerId).toString();
  return conversionCustomVariableCache.get(conversionCustomVariableKey, async () => {
    const data = {
      query: `SELECT conversion_custom_variable.name FROM conversion_custom_variable`,
    };
    const endpoint = SEARCH_STREAM.replace(':customerId', params.customerId);
    const requestOptions = {
      headers,
    };
    let searchStreamResponse = await httpPOST(endpoint, data, requestOptions);
    searchStreamResponse = processAxiosResponse(searchStreamResponse);
    if (!isHttpStatusSuccess(searchStreamResponse.status)) {
      throw new NetworkError(
        `[Google Ads Offline Conversions]:: ${searchStreamResponse?.response?.[0]?.error?.message} during google_ads_offline_conversions response transformation`,
        searchStreamResponse.status,
        {
          [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(searchStreamResponse.status),
        },
        searchStreamResponse?.response || searchStreamResponse,
        getAuthErrCategory(searchStreamResponse.status),
      );
    }
    const conversionCustomVariable = get(searchStreamResponse, 'response.0.results');
    if (!conversionCustomVariable) {
      throw new NetworkInstrumentationError(
        `[Google Ads Offline Conversions]:: Conversion Custom Variable has not been created yet in Google Ads`,
      );
    }
    return conversionCustomVariable;
  });
};

/**
 * convert it into hashMap
 *
 * input:
 * [
 *  {
 *    "conversionCustomVariable": {
 *    "resourceName": "customers/9625812972/conversionCustomVariables/19131634",
 *    "name": "revenue"
 *     }
 *   },
 * ]
 *
 * Output:
 * {
 *  revenue: "customers/9625812972/conversionCustomVariables/19131634"
 * }
 * @param {*} arrays
 * @returns
 */
const getConversionCustomVariableHashMap = (arrays) => {
  const hashMap = {};
  if (Array.isArray(arrays)) {
    arrays.forEach((array) => {
      hashMap[array.conversionCustomVariable.name] = array.conversionCustomVariable.resourceName;
    });
  }
  return hashMap;
};

/**
 * collect conversionActionId for conversionAction parameter
 * @param {*} request
 * @returns
 */
const ProxyRequest = async (request) => {
  const { method, endpoint, headers, params, body } = request;

  if (body.JSON?.isStoreConversion) {
    const firstResponse = await createJob(endpoint, headers, body.JSON.createJobPayload);
    const addPayload = body.JSON.addConversionPayload;
    // Mapping Conversion Action
    const conversionId = await getConversionActionId(headers, params);
    addPayload.operations.forEach((operation) => {
      set(operation, 'create.transaction_attribute.conversion_action', conversionId);
    });
    await addConversionToJob(endpoint, headers, firstResponse, addPayload);
    const thirdResponse = await runTheJob(
      endpoint,
      headers,
      body.JSON.executeJobPayload,
      firstResponse,
    );
    return thirdResponse;
  }
  // fetch conversionAction
  // httpPOST -> axios.post()
  if (params?.event) {
    const conversionActionId = await getConversionActionId(headers, params);
    set(body.JSON, 'conversions.0.conversionAction', conversionActionId);
  }
  // customVariables would be undefined in case of Store Conversions
  if (isDefinedAndNotNullAndNotEmpty(params.customVariables)) {
    // fetch all conversion custom variable in google ads
    let conversionCustomVariable = await getConversionCustomVariable(headers, params);

    // convert it into hashMap
    conversionCustomVariable = getConversionCustomVariableHashMap(conversionCustomVariable);

    const { properties } = params;
    let { customVariables } = params;
    const resultantCustomVariables = [];
    customVariables = getHashFromArray(customVariables, 'from', 'to', false);
    Object.keys(customVariables).forEach((key) => {
      if (properties[key] && conversionCustomVariable[customVariables[key]]) {
        // 1. set custom variable name
        // 2. set custom variable value
        resultantCustomVariables.push({
          conversionCustomVariable: conversionCustomVariable[customVariables[key]],
          value: String(properties[key]),
        });
      }
    });

    if (resultantCustomVariables) {
      set(body.JSON, 'conversions.0.customVariables', resultantCustomVariables);
    }
  }

  const requestBody = { url: endpoint, data: body.JSON, headers, method };
  const response = await httpSend(requestBody);
  return response;
};

const responseHandler = (destinationResponse) => {
  const message = `[Google Ads Offline Conversions Response Handler] - Request processed successfully`;
  const { status } = destinationResponse;
  if (isHttpStatusSuccess(status)) {
    // for google ads offline conversions the partialFailureError returns with status 200
    const { partialFailureError } = destinationResponse.response;
    // non-zero code signifies partialFailure
    // Ref - https://github.com/googleapis/googleapis/blob/master/google/rpc/code.proto
    if (partialFailureError && partialFailureError.code !== 0) {
      throw new NetworkError(
        `[Google Ads Offline Conversions]:: partialFailureError - ${partialFailureError?.message}`,
        status,
        {
          [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
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

  // the response from destination is not a success case build an explicit error
  // return status, original destination response, message
  const { response } = destinationResponse;
  throw new AbortedError(
    `[Google Ads Offline Conversions]:: ${response?.error?.message} during google_ads_offline_conversions response transformation`,
    status,
    response,
    getAuthErrCategory(status),
  );
};

function networkHandler() {
  this.prepareProxy = prepareProxyRequest;
  this.proxy = ProxyRequest;
  this.processAxiosResponse = processAxiosResponse;
  this.responseHandler = responseHandler;
}

module.exports = {
  networkHandler,
};
