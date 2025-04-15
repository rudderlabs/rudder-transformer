const {
  NetworkError,
  isDefinedAndNotNullAndNotEmpty,
  GoogleAdsSDK,
} = require('@rudderstack/integrations-lib');
const get = require('get-value');
const { prepareProxyRequest } = require('../../../adapters/network');
const { isHttpStatusSuccess } = require('../../util/index');
const { getDynamicErrorType } = require('../../../adapters/utils/networkUtils');
const tags = require('../../util/tags');
const { getAuthErrCategory } = require('../../util/googleUtils');
/**
 * This function helps to create a offlineUserDataJobs
 * @param googleAds
 * @param params
 * ref: https://developers.google.com/google-ads/api/rest/reference/rest/v15/CustomerMatchUserListMetadata
 */

const createJob = async ({ googleAds, params }) => {
  const jobCreatingRequest = {
    job: {
      type: 'CUSTOMER_MATCH_USER_LIST',
      customerMatchUserListMetadata: {
        userList: `customers/${params.customerId}/userLists/${params.listId}`,
        ...(Object.keys(params.consent).length > 0 && {
          consent: params.consent,
        }),
      },
    },
  };

  const response = await googleAds.createOfflineUserDataJob(jobCreatingRequest);
  return response;
};
/**
 * This function helps to put user details in a offlineUserDataJobs
 * @param googleAds
 * @param jobId
 * @param body
 */

const addUserToJob = async ({ googleAds, jobId, body }) => {
  const response = await googleAds.addUserToOfflineUserDataJob(jobId, body.JSON);
  return response;
};

/**
 * This function helps to run a offlineUserDataJobs
 * @param googleAds
 * @param jobId
 */
const runTheJob = async ({ googleAds, jobId }) => {
  const response = await googleAds.runOfflineUserDataJob(jobId);
  return response;
};

/**
 * This function is responsible for making the three steps required for uploding
 * data to customer list.
 * @param {*} request
 * @returns
 */
const gaAudienceProxyRequest = async (request) => {
  const { body, params } = request;

  const googleAds = new GoogleAdsSDK.GoogleAds({
    accessToken: params.accessToken,
    customerId: params.customerId,
    loginCustomerId: params.loginCustomerId,
    developerToken: params.developerToken,
  });

  // step1: offlineUserDataJobs creation

  const firstResponse = await createJob({ googleAds, params });
  if (firstResponse.type !== 'success') {
    return firstResponse;
  }

  // step2: putting users into the job
  const jobId = firstResponse.responseBody?.resourceName?.split('/')[3];
  const secondResponse = await addUserToJob({
    googleAds,
    jobId,
    body,
  });
  if (secondResponse.type !== 'success') {
    return secondResponse;
  }
  const {
    responseBody: { partialFailureError },
  } = secondResponse;
  if (partialFailureError && partialFailureError.code !== 0) {
    return secondResponse;
  }

  // step3: running the job
  const thirdResponse = await runTheJob({ googleAds, jobId });
  return thirdResponse;
};

const garlProcessAxiosResponse = (sdkResponse) => ({
  response: sdkResponse.responseBody || '',
  status: sdkResponse.statusCode,
  ...(isDefinedAndNotNullAndNotEmpty(sdkResponse.headers) ? { headers: sdkResponse.headers } : {}),
});

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
  this.processAxiosResponse = garlProcessAxiosResponse;
  this.prepareProxy = prepareProxyRequest;
  this.responseHandler = responseHandler;
}
module.exports = { networkHandler };
