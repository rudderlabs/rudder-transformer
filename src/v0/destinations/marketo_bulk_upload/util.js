const { handleHttpRequest } = require('../../../adapters/network');
const {
  ThrottledError,
  AbortedError,
  RetryableError,
  NetworkError,
} = require('../../util/errorTypes');
const tags = require('../../util/tags');
const { isHttpStatusSuccess } = require('../../util');
const { getDynamicErrorType } = require('../../../adapters/utils/networkUtils');
const stats = require('../../../util/stats');
const {
  ABORTABLE_CODES,
  RETRYABLE_CODES,
  THROTTLED_CODES,
  POLL_ACTIVITY,
  UPLOAD_FILE,
  JOB_STATUS_ACTIVITY,
  MARKETO_FILE_PATH,
  FETCH_ACCESS_TOKEN,
  POLL_STATUS_ERR_MSG,
  FILE_UPLOAD_ERR_MSG,
  FETCH_FAILURE_JOB_STATUS_ERR_MSG,
  FETCH_WARNING_JOB_STATUS_ERR_MSG,
} = require('./config');

const getMarketoFilePath = () => MARKETO_FILE_PATH;

/**
 * Handles common error responses returned from API calls.
 * Checks the error code and throws the appropriate error object based on the code.
 *
 * @param {object} resp - The response object containing the error information.
 * @param {string} OpErrorMessage - The error message to be used if the error code is not recognized.
 * @param {string} OpActivity - The activity name for tracking purposes.
 * @throws {AbortedError} - If the error code is abortable.
 * @throws {ThrottledError} - If the error code is within the range of throttled codes.
 * @throws {RetryableError} - If the error code is neither abortable nor throttled.
 *
 * @example
 * const resp = {
 *   response: {
 *     errors: [
 *       {
 *         code: "1003",
 *         message: "Empty File"
 *       }
 *     ]
 *   }
 * };
 *
 * try {
 *   handleCommonErrorResponse(resp, "Error message", "Activity");
 * } catch (error) {
 *   console.log(error);
 * }
 */
const handleCommonErrorResponse = (resp, OpErrorMessage, OpActivity) => {
  if (
    resp.response.errors[0] &&
    ((resp.response?.errors[0]?.code >= 1000 && resp.response?.errors[0]?.code <= 1077) ||
      (ABORTABLE_CODES.includes(resp.response?.errors[0]?.code)))
  ) {
    // for empty file the code is 1003 and that should be retried
    stats.increment(OpActivity, {
      status: 400,
      state: 'Abortable',
    });
    throw new AbortedError(resp.response.errors[0].message || OpErrorMessage, 400);
  } else if (THROTTLED_CODES.includes(resp.response.errors[0].code) ) {
    // for more than 10 concurrent uses the code is 615 and that should be retried
    stats.increment(OpActivity, {
      status: 500,
      state: 'Retryable',
    });
    throw new ThrottledError(resp.response?.errors[0]?.message || OpErrorMessage, 500);
  }
  // by default every thing will be retried
  stats.increment(OpActivity, {
    status: 500,
    state: 'Retryable',
  });
  throw new RetryableError(resp.response.errors[0].message || OpErrorMessage, 500);
};
// Fetch access token from client id and client secret
// DOC: https://developers.marketo.com/rest-api/authentication/
const getAccessToken = async (config) => {
  const { clientId, clientSecret, munchkinId } = config;
  const url = `https://${munchkinId}.mktorest.com/identity/oauth/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`;
  const { processedResponse: resp } = await handleHttpRequest('get', url, {
    destType: 'marketo_bulk_upload',
    feature: 'transformation',
  });
  const ACCESS_TOKEN_FETCH_ERR_MSG = 'Error during fetching access token';
  // sample response : {response: '[ENOTFOUND] :: DNS lookup failed', status: 400}
  if (!isHttpStatusSuccess(resp.status)) {
    if (resp.response) {
      // handle for abortable codes
      if (ABORTABLE_CODES.includes(resp.response) || (resp.code >= 400 && resp.code <= 499)) {
        throw new AbortedError(resp.response, 400, resp);
      } // handle for retryable codes
      else if (RETRYABLE_CODES.includes(resp.response)) {
        throw new RetryableError(resp.response.code, 500, resp);
      } // handle for abortable codes
      else if (resp.response.errors) {
        handleCommonErrorResponse(resp, ACCESS_TOKEN_FETCH_ERR_MSG, FETCH_ACCESS_TOKEN);
      }
      throw new NetworkError('Could not retrieve authorization token');
    }
    throw new NetworkError('Could not retrieve authorization token');
  }

  if (resp.response && resp.response.access_token) {
    return resp.response.access_token;
  }
  throw new NetworkError(
    'Could not retrieve authorisation token',
    resp.status,
    {
      [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(resp.status),
    },
    resp,
  );
};
 /**
   * Handles the response of a polling operation.
   * Checks for any errors in the response and calls the `handleCommonErrorResponse` function to handle them.
   * If the response is successful, increments the stats and returns the response.
   * Otherwise, returns null.
   *
   * @param {object} pollStatus - The response object from the polling operation.
   * @returns {object|null} - The response object if the polling operation was successful, otherwise null.
   */
const handlePollResponse = (pollStatus) => {
  const response = null;
  // DOC: https://developers.marketo.com/rest-api/error-codes/
  if (pollStatus.response.errors) {
    /* Sample error response for poll is:
          
            {
              "requestId": "e42b#14272d07d78",
              "success": false,
              "errors": [
                   {
                      "code": "601",
                      "message": "Unauthorized"
                   }
                  ]
              }
           */
    handleCommonErrorResponse(pollStatus, POLL_STATUS_ERR_MSG, POLL_ACTIVITY);
  }

  /*
    Sample Successful Poll response structure:
    {
      "requestId":"8136#146daebc2ed",
      "success":true,
      "result":[
          {
              "batchId":<batch-id>,
              "status":"Complete",
              "numOfLeadsProcessed":2,
              "numOfRowsFailed":1,
              "numOfRowsWithWarning":0,
              "message":"Import completed with errors, 2 records imported (2 members), 1 failed"
          }
      ]
    }
  */
  if (pollStatus.response && pollStatus.response.success) {
    stats.counter(POLL_ACTIVITY, {
      status: 200,
      state: 'Success',
    });
    return pollStatus.response;
  }

  return response;
};

const handleFetchJobStatusResponse = (resp, type) => {
  if (resp.response?.errors) {
    if (
      ABORTABLE_CODES.includes(resp.response?.errors[0]?.code) ||
      (resp.response?.errors[0]?.code >= 400 && resp.response?.errors[0]?.code <= 499)
    ) {
      stats.increment(JOB_STATUS_ACTIVITY, {
        status: 400,
        state: 'Abortable',
      });
      throw new AbortedError(resp.response.errors[0].message, 400, resp);
    } else if (RETRYABLE_CODES.includes(resp.response?.errors[0]?.code)) {
      stats.increment(JOB_STATUS_ACTIVITY, {
        status: 500,
        state: 'Retryable',
      });
      throw new RetryableError(resp.response?.errors[0]?.message, 500, resp);
    }
    stats.increment(JOB_STATUS_ACTIVITY, {
      status: 400,
      state: 'Abortable',
    });
    if (type === 'fail') {
      throw new AbortedError(FETCH_FAILURE_JOB_STATUS_ERR_MSG, 400, resp);
    } else {
      throw new AbortedError(FETCH_WARNING_JOB_STATUS_ERR_MSG, 400, resp);
    }
  }
  /*
  successful response :
  {
    response: 'city,  email,Import Failure ReasonChennai,s…a,Value for lookup field 'email' not found', 
    status: 200
  }
 
*/
  if (isHttpStatusSuccess(resp.status)) {
    if (resp.response?.success === false) {
      throw new RetryableError(
        resp.response?.errors[0].message || resp.response?.statusText,
        500,
        resp,
      );
    }
    stats.increment(JOB_STATUS_ACTIVITY, {
      status: 200,
      state: 'Success',
    });
    return resp.response;
  }
  if (type === 'fail') {
    throw new AbortedError(FETCH_FAILURE_JOB_STATUS_ERR_MSG, 400, resp);
  } else {
    throw new AbortedError(FETCH_WARNING_JOB_STATUS_ERR_MSG, 400, resp);
  }
};

/**
 * Handles the response received after a file upload request.
 * Checks for errors in the response and throws appropriate error objects based on the error codes.
 * If the response indicates a successful upload, extracts the importId and returns it along with other job details.
 *
 * @param {object} resp - The response object received after a file upload request.
 * @param {array} successfulJobs - An array to store details of successful jobs.
 * @param {array} unsuccessfulJobs - An array to store details of unsuccessful jobs.
 * @param {number} requestTime - The time taken for the request in milliseconds.
 * @returns {object} - An object containing the importId, successfulJobs, and unsuccessfulJobs.
 */
const handleFileUploadResponse = (resp, successfulJobs, unsuccessfulJobs, requestTime) => {
  const importId = null;

  /*
    For unsuccessful response 
    {
        "requestId": "e42b#14272d07d78",
        "success": false,
        "errors": [
            {
                "code": "1003",
                "message": "Empty File"
            }
        ]
    }
   */
  if (resp.response.errors) {
    if (
      resp.response?.errors[0]?.message ===
        'There are 10 imports currently being processed. Please try again later' ||
      resp.response?.errors[0]?.message === 'Empty file' ||
      resp.response?.errors[0]?.code === 1003 ||
      resp.response?.errors[0]?.code === 615
    ) {
      // code handling not only strings
      stats.increment(UPLOAD_FILE, {
        status: 500,
        state: 'Retryable',
      });
      throw new RetryableError(resp.response?.errors[0]?.message || FILE_UPLOAD_ERR_MSG, 500);
    } else {
      handleCommonErrorResponse(resp, FILE_UPLOAD_ERR_MSG, UPLOAD_FILE);
    }
  }

  /**
   * SuccessFul Upload Response :
    {
        "requestId": "d01f#15d672f8560",
        "result": [
            {
                "batchId": 3404,
                "importId": "3404",
                "status": "Queued"
            }
        ],
        "success": true
    }
  */
  if (
    resp?.response?.success &&
    resp?.response?.result.length > 0 &&
    resp?.response?.result[0]?.importId
  ) {
    const { importId } = resp.response.result[0];
    stats.histogram('marketo_bulk_upload_upload_file_time', requestTime);

    stats.increment(UPLOAD_FILE, {
      status: 200,
      state: 'Success',
    });
    return { importId, successfulJobs, unsuccessfulJobs };
  }
  // if neither successful, nor the error message is appropriate sending importId as default null
  return { importId, successfulJobs, unsuccessfulJobs };
};

module.exports = {
  getAccessToken,
  handlePollResponse,
  handleFetchJobStatusResponse,
  handleFileUploadResponse,
  getMarketoFilePath,
};
