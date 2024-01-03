const { NetworkError } = require('@rudderstack/integrations-lib');
const { httpSend, prepareProxyRequest } = require('../../../adapters/network');
const { isHttpStatusSuccess, getAuthErrCategoryFromStCode } = require('../../util/index');

const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const tags = require('../../util/tags');
/**
 * This function helps to create a offlineUserDataJobs
 * @param endpoint
 * @param customerId
 * @param listId
 * @param headers
 * @param method
 */

const createJob = async (endpoint, customerId, listId, headers, method) => {
  const jobCreatingUrl = `${endpoint}:create`;
  const jobCreatingRequest = {
    url: jobCreatingUrl,
    data: {
      job: {
        type: 'CUSTOMER_MATCH_USER_LIST',
        customerMatchUserListMetadata: {
          userList: `customers/${customerId}/userLists/${listId}`,
        },
      },
    },
    headers,
    method,
  };
  const response = await httpSend(jobCreatingRequest, {
    destType: 'google_adwords_remarketing_lists',
    feature: 'proxy',
    endpointPath: '/customers/create',
  });
  return response;
};
/**
 * This function helps to put user details in a offlineUserDataJobs
 * @param endpoint
 * @param headers
 * @param method
 * @param jobId
 * @param body
 */

const addUserToJob = async (endpoint, headers, method, jobId, body) => {
  const jobAddingUrl = `${endpoint}/${jobId}:addOperations`;
  const secondRequest = {
    url: jobAddingUrl,
    data: body.JSON,
    headers,
    method,
  };
  const response = await httpSend(secondRequest, {
    destType: 'google_adwords_remarketing_lists',
    feature: 'proxy',
    endpointPath: '/addOperations',
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
const runTheJob = async (endpoint, headers, method, jobId) => {
  const jobRunningUrl = `${endpoint}/${jobId}:run`;
  const thirdRequest = {
    url: jobRunningUrl,
    headers,
    method,
  };
  const response = await httpSend(thirdRequest, {
    destType: 'google_adwords_remarketing_lists',
    feature: 'proxy',
    endpointPath: '/run',
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
  const { body, method, params, endpoint } = request;
  const { headers } = request;
  const { customerId, listId } = params;

  // step1: offlineUserDataJobs creation

  const firstResponse = await createJob(endpoint, customerId, listId, headers, method);
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
  const secondResponse = await addUserToJob(endpoint, headers, method, jobId, body);
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
  const thirdResponse = await runTheJob(endpoint, headers, method, jobId);
  return thirdResponse;
};

const gaAudienceRespHandler = (destResponse, stageMsg) => {
  const { status, response } = destResponse;
  // const respAttributes = response["@attributes"] || null;
  // const { stat, err_code: errorCode } = respAttributes;

  throw new NetworkError(
    `${response?.error?.message} ${stageMsg}`,
    status,
    {
      [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
    },
    response,
    getAuthErrCategoryFromStCode(status),
  );
};

const responseHandler = (destinationResponse) => {
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
