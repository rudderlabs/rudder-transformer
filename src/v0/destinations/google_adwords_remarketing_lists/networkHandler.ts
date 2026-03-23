import { NetworkError } from '@rudderstack/integrations-lib';
import get from 'get-value';
import { prepareProxyRequest, handleHttpRequest } from '../../../adapters/network';
import { isHttpStatusSuccess } from '../../util/index';
import { processAxiosResponse, getDynamicErrorType } from '../../../adapters/utils/networkUtils';
import tags from '../../util/tags';
import { getAuthErrCategory, getDeveloperToken } from '../../util/googleUtils';
import type { OfflineDataJobPayload } from './types';
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

const createJob = async ({
  endpoint,
  headers,
  method,
  params,
  metadata,
}: {
  endpoint: string;
  headers: Record<string, string>;
  method: string;
  params: { customerId: string; listId: string; consent: Record<string, string> };
  metadata: unknown;
}) => {
  const jobCreatingUrl = `${endpoint}:create`;
  const customerMatchUserListMetadata: Record<string, unknown> = {
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

const addUserToJob = async ({
  endpoint,
  headers,
  method,
  jobId,
  body,
  metadata,
}: {
  endpoint: string;
  headers: Record<string, string>;
  method: string;
  jobId: string;
  body: { JSON: OfflineDataJobPayload };
  metadata: unknown;
}) => {
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
const runTheJob = async ({
  endpoint,
  headers,
  method,
  jobId,
  metadata,
}: {
  endpoint: string;
  headers: Record<string, string>;
  method: string;
  jobId: string;
  metadata: unknown;
}) => {
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
const gaAudienceProxyRequest = async (request: {
  body: { JSON: OfflineDataJobPayload };
  method: string;
  params: { customerId: string; listId: string; consent: Record<string, string> };
  endpoint: string;
  metadata: unknown;
  headers: Record<string, string>;
}) => {
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
  let jobId: string | undefined;
  if (firstResponse?.response?.data?.resourceName)
    // eslint-disable-next-line prefer-destructuring
    jobId = firstResponse.response.data.resourceName.split('/')[3];
  const secondResponse = await addUserToJob({
    endpoint,
    headers,
    method,
    jobId: jobId!,
    body,
    metadata,
  });
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
  const thirdResponse = await runTheJob({ endpoint, headers, method, jobId: jobId!, metadata });
  return thirdResponse;
};

const gaAudienceRespHandler = (
  destResponse: { status: number; response: unknown },
  stageMsg: string,
) => {
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

const responseHandler = (responseParams: {
  destinationResponse: {
    status: number;
    response: { partialFailureError?: { code: number } };
  };
}) => {
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

function networkHandler(this: {
  proxy: typeof gaAudienceProxyRequest;
  processAxiosResponse: typeof processAxiosResponse;
  prepareProxy: typeof prepareProxyRequest;
  responseHandler: typeof responseHandler;
}) {
  this.proxy = gaAudienceProxyRequest;
  this.processAxiosResponse = processAxiosResponse;
  this.prepareProxy = prepareProxyRequest;
  this.responseHandler = responseHandler;
}
export { networkHandler };
