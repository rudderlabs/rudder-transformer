const { httpSend } = require('../../../adapters/network');

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
    method,
  };
  const response = await httpSend(secondRequest);
  return response;
};

module.exports = {
  createJob,
  addUserToJob,
};
