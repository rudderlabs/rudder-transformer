const { httpSend, prepareProxyRequest } = require("../../../adapters/network");
const { isHttpStatusSuccess } = require("../../util/index");

const {
  REFRESH_TOKEN
} = require("../../../adapters/networkhandler/authConstants");

const {
  processAxiosResponse,
  getDynamicErrorType
} = require("../../../adapters/utils/networkUtils");
const { NetworkError } = require("../../util/errorTypes");
const tags = require("../../util/tags");
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
        type: "CUSTOMER_MATCH_USER_LIST",
        customerMatchUserListMetadata: {
          userList: `customers/${customerId}/userLists/${listId}`
        }
      }
    },
    headers,
    method
  };
  const response = await httpSend(jobCreatingRequest);
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
    method
  };
  const response = await httpSend(secondRequest);
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
    method
  };
  const response = await httpSend(thirdRequest);
  return response;
};

/**
 * This function is responsible for making the three steps required for uploding
 * data to customer list.
 * @param {*} request
 * @returns
 */
const gaAudienceProxyRequest = async request => {
  const { body, method, params, endpoint } = request;
  const { headers } = request;
  const { customerId, listId } = params;

  // step1: offlineUserDataJobs creation

  const firstResponse = await createJob(
    endpoint,
    customerId,
    listId,
    headers,
    method
  );
  if (
    !firstResponse.success &&
    !isHttpStatusSuccess(firstResponse.response.response.status)
  ) {
    return firstResponse;
  }

  // step2: putting users into the job
  let jobId;
  if (firstResponse.response.data && firstResponse.response.data.resourceName)
    // eslint-disable-next-line prefer-destructuring
    jobId = firstResponse.response.data.resourceName.split("/")[3];
  const secondResponse = await addUserToJob(
    endpoint,
    headers,
    method,
    jobId,
    body
  );
  // console.log(JSON.stringify(secondResponse.response.response));
  if (
    !secondResponse.success &&
    !isHttpStatusSuccess(secondResponse.response.response.status)
  ) {
    return secondResponse;
  }

  // step3: running the job
  const thirdResponse = await runTheJob(endpoint, headers, method, jobId);
  return thirdResponse;
};

/**
 * This function helps to detarmine type of error occured. According to the response
 * we set authErrorCategory to take decision if we need to refresh the access_token
 * or need to disable the destination.
 * @param {*} code
 * @param {*} response
 * @returns
 */
const getAuthErrCategory = (code, response) => {
  switch (code) {
    case 401:
      if (!response.error.details) return REFRESH_TOKEN;
      return "";
    default:
      return "";
  }
};

const gaAudienceRespHandler = (destResponse, stageMsg) => {
  const { status, response } = destResponse;
  // const respAttributes = response["@attributes"] || null;
  // const { stat, err_code: errorCode } = respAttributes;

  throw new NetworkError(
    `${response.error.message} ${stageMsg}`,
    status,
    {
      [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status)
    },
    response,
    getAuthErrCategory(status, response)
  );
};

const responseHandler = destinationResponse => {
  const message = `Request Processed Successfully`;
  const { status } = destinationResponse;
  if (isHttpStatusSuccess(status)) {
    // Mostly any error will not have a status of 2xx
    return {
      status,
      message,
      destinationResponse
    };
  }
  // else successfully return status, message and original destination response
  gaAudienceRespHandler(
    destinationResponse,
    "during ga_audience response transformation"
  );
};

const networkHandler = function() {
  this.proxy = gaAudienceProxyRequest;
  this.processAxiosResponse = processAxiosResponse;
  this.prepareProxy = prepareProxyRequest;
  this.responseHandler = responseHandler;
};
module.exports = { networkHandler };
