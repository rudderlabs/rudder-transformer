const set = require('set-value');
const get = require('get-value');
const sha256 = require('sha256');
const {
  AbortedError,
  NetworkInstrumentationError,
  NetworkError,
} = require('@rudderstack/integrations-lib');
const { prepareProxyRequest, httpPOST, handleHttpRequest } = require('../../../adapters/network');
const {
  isHttpStatusSuccess,
  getHashFromArray,
  isDefinedAndNotNullAndNotEmpty,
} = require('../../util');
const { getConversionActionId } = require('./utils');
const Cache = require('../../util/cache');
const { CONVERSION_CUSTOM_VARIABLE_CACHE_TTL, SEARCH_STREAM, destType } = require('./config');
const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const tags = require('../../util/tags');
const { getAuthErrCategory } = require('../../util/googleUtils');

const conversionCustomVariableCache = new Cache(CONVERSION_CUSTOM_VARIABLE_CACHE_TTL);

const createJob = async ({ endpoint, headers, payload, metadata }) => {
  const endPoint = `${endpoint}:create`;
  let createJobResponse = await httpPOST(
    endPoint,
    payload,
    { headers },
    {
      destType,
      feature: 'proxy',
      endpointPath: `/create`,
      requestMethod: 'POST',
      module: 'dataDelivery',
      metadata,
    },
  );
  createJobResponse = processAxiosResponse(createJobResponse);
  const { response, status } = createJobResponse;
  if (!isHttpStatusSuccess(status)) {
    throw new AbortedError(
      `[Google Ads Offline Conversions]:: ${response?.error?.message || response?.[0]?.error?.message} during google_ads_offline_store_conversions Job Creation`,
      status,
      response,
      getAuthErrCategory(createJobResponse),
    );
  }
  return response.resourceName.split('/')[3];
};

const addConversionToJob = async ({ endpoint, headers, jobId, payload, metadata }) => {
  const endPoint = `${endpoint}/${jobId}:addOperations`;
  let addConversionToJobResponse = await httpPOST(
    endPoint,
    payload,
    { headers },
    {
      destType: 'google_adwords_offline_conversions',
      feature: 'proxy',
      endpointPath: `/addOperations`,
      requestMethod: 'POST',
      module: 'dataDelivery',
      metadata,
    },
  );
  addConversionToJobResponse = processAxiosResponse(addConversionToJobResponse);
  const { response, status } = addConversionToJobResponse;
  if (!isHttpStatusSuccess(status)) {
    throw new AbortedError(
      `[Google Ads Offline Conversions]:: ${response?.error?.message} during google_ads_offline_store_conversions Add Conversion`,
      status,
      response,
      getAuthErrCategory(addConversionToJobResponse),
    );
  }
  return true;
};

const runTheJob = async ({ endpoint, headers, payload, jobId, metadata }) => {
  const endPoint = `${endpoint}/${jobId}:run`;
  const { httpResponse: executeJobResponse } = await handleHttpRequest(
    'post',
    endPoint,
    payload,
    { headers },
    {
      destType: 'google_adwords_offline_conversions',
      feature: 'proxy',
      endpointPath: `/run`,
      requestMethod: 'POST',
      module: 'dataDelivery',
      metadata,
    },
  );
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
const getConversionCustomVariable = async ({ headers, params, metadata }) => {
  const conversionCustomVariableKey = sha256(params.customerId).toString();
  return conversionCustomVariableCache.get(conversionCustomVariableKey, async () => {
    const data = {
      query: `SELECT conversion_custom_variable.name FROM conversion_custom_variable`,
    };
    const endpoint = SEARCH_STREAM.replace(':customerId', params.customerId);
    const requestOptions = {
      headers,
    };
    let searchStreamResponse = await httpPOST(endpoint, data, requestOptions, {
      destType: 'google_adwords_offline_conversions',
      feature: 'proxy',
      endpointPath: `/searchStream`,
      requestMethod: 'POST',
      module: 'dataDelivery',
      metadata,
    });
    searchStreamResponse = processAxiosResponse(searchStreamResponse);
    const { response, status } = searchStreamResponse;
    if (!isHttpStatusSuccess(status)) {
      throw new NetworkError(
        `[Google Ads Offline Conversions]:: ${response?.[0]?.error?.message} during google_ads_offline_conversions response transformation`,
        status,
        {
          [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
        },
        response || searchStreamResponse,
        getAuthErrCategory(searchStreamResponse),
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
 * Validates custom variable
 * @param {*} customVariables
 * @returns
 */
const isValidCustomVariables = (customVariables) => {
  if (
    isDefinedAndNotNullAndNotEmpty(customVariables) &&
    Array.isArray(customVariables) &&
    customVariables.length > 0
  ) {
    return customVariables.some(
      (customVariable) => !!(customVariable.from !== '' && customVariable.to !== ''),
    );
  }
  return false;
};

/**
 * collect conversionActionId for conversionAction parameter
 * @param {*} request
 * @returns
 */
const ProxyRequest = async (request) => {
  const { method, endpoint, headers, params, body, metadata } = request;

  if (body.JSON?.isStoreConversion) {
    const firstResponse = await createJob({
      endpoint,
      headers,
      payload: body.JSON.createJobPayload,
      metadata,
    });
    const addPayload = body.JSON.addConversionPayload;
    // Mapping Conversion Action
    const conversionId = await getConversionActionId({ headers, params, metadata });
    if (Array.isArray(addPayload.operations)) {
      addPayload.operations.forEach((operation) => {
        set(operation, 'create.transaction_attribute.conversion_action', conversionId);
      });
    }
    await addConversionToJob({
      endpoint,
      headers,
      jobId: firstResponse,
      payload: addPayload,
      metadata,
    });
    const thirdResponse = await runTheJob({
      endpoint,
      headers,
      payload: body.JSON.executeJobPayload,
      jobId: firstResponse,
      metadata,
    });
    return thirdResponse;
  }
  // fetch conversionAction
  // httpPOST -> myAxios.post()
  if (params?.event) {
    const conversionActionId = await getConversionActionId({ headers, params, metadata });
    set(body.JSON, 'conversions.0.conversionAction', conversionActionId);
  }
  // customVariables would be undefined in case of Store Conversions
  if (isValidCustomVariables(params.customVariables)) {
    // fetch all conversion custom variable in google ads
    let conversionCustomVariable = await getConversionCustomVariable({
      headers,
      params,
      metadata,
    });

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
  const { httpResponse } = await handleHttpRequest('constructor', requestBody, {
    feature: 'proxy',
    destType: 'gogole_adwords_offline_conversions',
    endpointPath: `/proxy`,
    requestMethod: 'POST',
    module: 'dataDelivery',
    metadata,
  });
  return httpResponse;
};

const responseHandler = (responseParams) => {
  const { destinationResponse } = responseParams;
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

  // the response from destination is not a success case build an explicit error
  // return status, original destination response, message
  const { response } = destinationResponse;
  throw new AbortedError(
    `[Google Ads Offline Conversions]:: ${response?.error?.message} during google_ads_offline_conversions response transformation`,
    status,
    response,
    getAuthErrCategory(destinationResponse),
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
