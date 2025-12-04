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
  isEmptyObject,
} = require('../../../v0/util');
const {
  getConversionActionId,
  isClickCallBatchingEnabled,
} = require('../../../v0/destinations/google_adwords_offline_conversions/utils');
const Cache = require('../../../v0/util/cache');
const {
  CONVERSION_CUSTOM_VARIABLE_CACHE_TTL,
  SEARCH_STREAM,
  destType,
} = require('../../../v0/destinations/google_adwords_offline_conversions/config');
const { getDeveloperToken, getAuthErrCategory } = require('../../../v0/util/googleUtils');
const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const tags = require('../../../v0/util/tags');
const { CommonUtils } = require('../../../util/common');

const conversionCustomVariableCache = new Cache(
  'GOOGLE_ADWORDS_OFFLINE_CONVERSIONS_CUSTOM_VARIABLE',
  CONVERSION_CUSTOM_VARIABLE_CACHE_TTL,
);

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
    for (const element of arrays) {
      hashMap[element.conversionCustomVariable.name] =
        element.conversionCustomVariable.resourceName;
    }
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

  headers['developer-token'] = getDeveloperToken();

  const shouldBatchClickCallConversionEvents = isClickCallBatchingEnabled();
  if (body.JSON?.isStoreConversion) {
    const firstResponse = await createJob({
      endpoint,
      headers,
      payload: body.JSON.createJobPayload,
      metadata,
    });
    const addPayload = body.JSON.addConversionPayload;
    // Mapping Conversion Action
    if (!shouldBatchClickCallConversionEvents) {
      const conversionId = await getConversionActionId({ headers, params, metadata });
      if (Array.isArray(addPayload.operations)) {
        for (const operation of addPayload.operations) {
          set(operation, 'create.transaction_attribute.conversion_action', conversionId);
        }
      }
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
  if (!shouldBatchClickCallConversionEvents) {
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
      for (const key of Object.keys(customVariables)) {
        if (properties[key] && conversionCustomVariable[customVariables[key]]) {
          // 1. set custom variable name
          // 2. set custom variable value
          resultantCustomVariables.push({
            conversionCustomVariable: conversionCustomVariable[customVariables[key]],
            value: String(properties[key]),
          });
        }
      }

      if (resultantCustomVariables) {
        set(body.JSON, 'conversions.0.customVariables', resultantCustomVariables);
      }
    }
  }
  const requestBody = { url: endpoint, data: body.JSON, headers, method };
  const { httpResponse } = await handleHttpRequest(
    'constructor',
    requestBody,
    {
      feature: 'proxy',
      destType: 'google_adwords_offline_conversions',
      endpointPath: `/proxy`,
      requestMethod: 'POST',
      module: 'dataDelivery',
      metadata,
    },
    true,
  );
  return httpResponse;
};

const responseHandler = (responseParams) => {
  const { destinationResponse, rudderJobMetadata } = responseParams;
  const message = `[Google Ads Offline Conversions Response Handler] - Request processed successfully`;
  const { status } = destinationResponse;
  const { partialFailureError, results } = destinationResponse.response;
  const metaDataArray = CommonUtils.toArray(rudderJobMetadata);
  if (isHttpStatusSuccess(status) && (!partialFailureError || partialFailureError.code === 0)) {
    // for google ads offline conversions the partialFailureError returns with status 200
    return {
      status,
      message,
      destinationResponse,
      response: metaDataArray.map((metadata) => ({
        statusCode: status,
        metadata,
        error: 'success',
      })),
    };
  }

  // non-zero code signifies partialFailure
  // Ref - https://github.com/googleapis/googleapis/blob/master/google/rpc/code.proto
  if (partialFailureError && partialFailureError.code !== 0) {
    const errorMessage = partialFailureError.message || 'unknown error format';
    const responseWithIndividualEvents = metaDataArray.map((metadata, i) => {
      const eventResponse = results?.[i] ?? {};
      const isEventFailed = isEmptyObject(eventResponse);
      return {
        statusCode: isEventFailed ? 400 : 200,
        metadata,
        error: isEventFailed ? errorMessage : 'success',
      };
    });

    const data = {
      status: 400,
      message: `[Google Ads Offline Conversions]:: ${errorMessage}`,
      destinationResponse,
      statTags: {
        errorCategory: 'network',
        errorType: 'aborted',
        destType: destType && typeof destType === 'string' ? destType.toUpperCase() : '',
        module: 'destination',
        implementation: 'native',
        feature: 'dataDelivery',
        destinationId: metaDataArray[0]?.destinationId || '',
        workspaceId: metaDataArray[0]?.workspaceId || '',
      },
      response: responseWithIndividualEvents,
    };
    return data;
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
