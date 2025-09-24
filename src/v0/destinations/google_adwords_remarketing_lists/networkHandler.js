const { NetworkError } = require('@rudderstack/integrations-lib');
const get = require('get-value');
const { prepareProxyRequest, handleHttpRequest } = require('../../../adapters/network');
const { isHttpStatusSuccess } = require('../../util/index');
const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const tags = require('../../util/tags');
const { getAuthErrCategory } = require('../../util/googleUtils');
const { getDeveloperToken } = require('../../util/googleUtils');
/**
 * This function helps to create a offlineUserDataJobs
 * @param endpoint
 * @param customerId
 * @param listId
 * @param headers
 * @param method
 * @consentBlock
 * ref: https://developers.google.com/google-ads/api/rest/reference/rest/v15/CustomerMatchUserListMetadata
 */

const createJob = async ({ endpoint, headers, method, params, metadata }) => {
  const jobCreatingUrl = `${endpoint}:create`;
  const customerMatchUserListMetadata = {
    userList: `customers/${params.customerId}/userLists/${params.listId}`,
  };
  if (Object.keys(params.consent).length > 0) {
    customerMatchUserListMetadata.consent = params.consent;
  }
  const jobCreatingRequest = {
    url: jobCreatingUrl,
    data: {
      job: {
        type: 'CUSTOMER_MATCH_USER_LIST',
        customerMatchUserListMetadata,
      },
    },
    headers,
    method,
  };
  const { httpResponse } = await handleHttpRequest('constructor', jobCreatingRequest, {
    destType: 'google_adwords_remarketing_lists',
    feature: 'proxy',
    endpointPath: '/customers/create',
    requestMethod: 'POST',
    module: 'dataDelivery',
    metadata,
  });
  return httpResponse;
};
/**
 * This function helps to put user details in a offlineUserDataJobs
 * @param endpoint
 * @param headers
 * @param method
 * @param jobId
 * @param body
 */

const addUserToJob = async ({ endpoint, headers, method, jobId, body, metadata }) => {
  const jobAddingUrl = `${endpoint}/${jobId}:addOperations`;
  const secondRequest = {
    url: jobAddingUrl,
    data: body.JSON,
    headers,
    method,
  };
  const { httpResponse: response } = await handleHttpRequest('constructor', secondRequest, {
    destType: 'google_adwords_remarketing_lists',
    feature: 'proxy',
    endpointPath: '/addOperations',
    requestMethod: 'POST',
    module: 'dataDelivery',
    metadata,
  });
  return response;
};

/**
 * This function helps to run a offlineUserDataJobs
 * @param endpoint
 * @param headers
 * @param method
 * @param jobId
 */
const runTheJob = async ({ endpoint, headers, method, jobId, metadata }) => {
  const jobRunningUrl = `${endpoint}/${jobId}:run`;
  const thirdRequest = {
    url: jobRunningUrl,
    headers,
    method,
  };
  const { httpResponse: response } = await handleHttpRequest('constructor', thirdRequest, {
    destType: 'google_adwords_remarketing_lists',
    feature: 'proxy',
    endpointPath: '/run',
    requestMethod: 'POST',
    module: 'dataDelivery',
    metadata,
  });
  return response;
};

/**
 * This function is responsible for making the three steps required for uploding
 * data to customer list.
 * @param {*} request
 * @returns
 */
const gaAudienceProxyRequest = async (request) => {
  const { body, method, params, endpoint, metadata } = request;
  const { headers } = request;

  headers['developer-token'] = getDeveloperToken();

  // step1: offlineUserDataJobs creation

  const firstResponse = await createJob({ endpoint, headers, method, params, metadata });
  if (!firstResponse.success && !isHttpStatusSuccess(firstResponse?.response?.status)) {
    return firstResponse;
  }

  if (isHttpStatusSuccess(firstResponse?.response?.status)) {
    const { partialFailureError } = firstResponse.response.data;
    if (partialFailureError && partialFailureError.code !== 0) {
      return firstResponse;
    }
  }

  // step2: putting users into the job
  let jobId;
  if (firstResponse?.response?.data?.resourceName)
    // eslint-disable-next-line prefer-destructuring
    jobId = firstResponse.response.data.resourceName.split('/')[3];
  const secondResponse = await addUserToJob({ endpoint, headers, method, jobId, body, metadata });
  if (!secondResponse.success && !isHttpStatusSuccess(secondResponse?.response?.status)) {
    return secondResponse;
  }

  if (isHttpStatusSuccess(secondResponse?.response?.status)) {
    const { partialFailureError } = secondResponse.response.data;
    if (partialFailureError && partialFailureError.code !== 0) {
      return secondResponse;
    }
  }

  // step3: running the job
  const thirdResponse = await runTheJob({ endpoint, headers, method, jobId, metadata });
  return thirdResponse;
};

const gaAudienceRespHandler = (destResponse, stageMsg) => {
  let { status } = destResponse;
  const { response } = destResponse;

  if (
    status === 400 &&
    get(response, 'error.details.0.errors.0.errorCode.databaseError') === 'CONCURRENT_MODIFICATION'
  ) {
    status = 500;
  }

  throw new NetworkError(
    `${JSON.stringify(response)} ${stageMsg}`,
    status,
    {
      [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
    },
    response,
    getAuthErrCategory(destResponse),
  );
};

const responseHandler = (responseParams) => {
  const { destinationResponse } = responseParams;
  const message = `Request Processed Successfully`;
  const { status, response } = destinationResponse;
  if (isHttpStatusSuccess(status)) {
    // for google ads offline conversions the partialFailureError returns with status 200
    const { partialFailureError } = response;
    // non-zero code signifies partialFailure
    // Ref - https://github.com/googleapis/googleapis/blob/master/google/rpc/code.proto
    if (partialFailureError && partialFailureError.code !== 0) {
      throw new NetworkError(
        `[Google Ads Re-marketing Lists]:: partialFailureError - ${JSON.stringify(
          partialFailureError,
        )}`,
        400,
        {
          [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(400),
        },
        partialFailureError,
      );
    }

    // Mostly any error will not have a status of 2xx
    return {
      status,
      message,
      destinationResponse,
    };
  }
  // else successfully return status, message and original destination response
  gaAudienceRespHandler(destinationResponse, 'during ga_audience response transformation');
  return undefined;
};

function networkHandler() {
  this.proxy = gaAudienceProxyRequest;
  this.processAxiosResponse = processAxiosResponse;
  this.prepareProxy = prepareProxyRequest;
  this.responseHandler = responseHandler;
}
module.exports = { networkHandler };
