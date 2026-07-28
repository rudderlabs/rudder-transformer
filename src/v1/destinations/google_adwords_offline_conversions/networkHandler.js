const { AbortedError } = require('@rudderstack/integrations-lib');
const { prepareProxyRequest, httpPOST, handleHttpRequest } = require('../../../adapters/network');
const { isHttpStatusSuccess, isEmptyObject } = require('../../../v0/util');
const { destType } = require('../../../v0/destinations/google_adwords_offline_conversions/config');
const { getDeveloperToken, getAuthErrCategory } = require('../../../v0/util/googleUtils');
const { processAxiosResponse } = require('../../../adapters/utils/networkUtils');
const { CommonUtils } = require('../../../util/common');

/**
 * Extracts the full error detail from a Google Ads API error response.
 */
const getGoogleAdsError = (response) => {
  if (typeof response === 'string') return response;
  try {
    return JSON.stringify(response);
  } catch {
    return String(response);
  }
};

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
      `[Google Ads Offline Conversions]:: ${getGoogleAdsError(response)} during google_ads_offline_store_conversions Job Creation`,
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
      `[Google Ads Offline Conversions]:: ${getGoogleAdsError(response)} during google_ads_offline_store_conversions Add Conversion`,
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
 * Delivers enriched Google Ads Offline Conversions requests.
 * @param {*} request
 * @returns
 */
const ProxyRequest = async (request) => {
  const { method, endpoint, headers, body, metadata } = request;

  headers['developer-token'] = getDeveloperToken();

  if (body.JSON?.isStoreConversion) {
    const firstResponse = await createJob({
      endpoint,
      headers,
      payload: body.JSON.createJobPayload,
      metadata,
    });
    const addPayload = body.JSON.addConversionPayload;

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
    `[Google Ads Offline Conversions]:: ${getGoogleAdsError(response)} during google_ads_offline_conversions response transformation`,
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
