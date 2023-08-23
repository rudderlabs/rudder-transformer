const { handleHttpRequest } = require('../../../adapters/network');
const {
  ThrottledError,
  AbortedError,
  RetryableError,
  NetworkError,
} = require('../../util/errorTypes');
const tags = require('../../util/tags');
const { getDynamicErrorType } = require('../../../adapters/utils/networkUtils');
const stats = require('../../../util/stats');

const ABORTABLE_CODES = ['ENOTFOUND', 'ECONNREFUSED', 603, 605, 609, 610];
const RETRYABLE_CODES = ['EADDRINUSE', 'ECONNRESET', 'ETIMEDOUT', 713, 601, 602, 604, 611];
const THROTTLED_CODES = [502, 606, 607, 608, 615];

const MARKETO_FILE_SIZE = 10485760;
const MARKETO_FILE_PATH = `${__dirname}/uploadFile/marketo_bulkupload.csv`;

const POLL_ACTIVITY = 'marketo_bulk_upload_polling';
const POLL_STATUS_ERR_MSG = 'Could not poll status';

const UPLOAD_FILE = 'marketo_bulk_upload_upload_file';
const FILE_UPLOAD_ERR_MSG = 'Could not upload file';

const JOB_STATUS_ACTIVITY = 'marketo_bulk_upload_get_job_status';
const FETCH_FAILURE_JOB_STATUS_ERR_MSG = 'Could not fetch failure job status';
const FETCH_WARNING_JOB_STATUS_ERR_MSG = 'Could not fetch warning job status';


const getMarketoFilePath = () => MARKETO_FILE_PATH;
// Fetch access token from client id and client secret
// DOC: https://developers.marketo.com/rest-api/authentication/
const getAccessToken = async (config) => {
  const { clientId, clientSecret, munchkinId } = config;
  const url = `https://${munchkinId}.mktorest.com/identity/oauth/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`;
  const { processedResponse: resp } = await handleHttpRequest(
    'get',
    url,
    {
      destType: 'marketo_bulk_upload',
      feature: 'transformation',
    },
  );
  const ACCESS_TOKEN_FETCH_ERR_MSG = 'Error during fetching access token';
  if (resp.status === 200) {
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
  }
  // sample response : {response: '[ENOTFOUND] :: DNS lookup failed', status: 400}
  if (resp.response) {
    // handle for abortable codes
    if (
      ABORTABLE_CODES.includes(resp.response) ||
      (resp.code >= 400 && resp.code <= 499)
    ) {
      throw new AbortedError(resp.response, 400, resp);
    } // handle for retryable codes
    else if (RETRYABLE_CODES.includes(resp.response)) {
      throw new RetryableError(resp.response.code, 500, resp);
    } // handle for abortable codes
    else if (resp.response.errors) {
      if (ABORTABLE_CODES.includes(resp.response.errors[0].code)) {
        throw new AbortedError(
          resp.response.errors[0].message ||
          resp.response.response.statusText ||
          ACCESS_TOKEN_FETCH_ERR_MSG,
          400,
          resp,
        );
      } // handle for throttled codes
      else if (THROTTLED_CODES.includes(resp.response.errors[0].code)) {
        throw new ThrottledError(
          resp.response.errors[0].message ||
          resp.response.response.statusText ||
          ACCESS_TOKEN_FETCH_ERR_MSG,
          resp,
        );
      }
      // Assuming none we should retry the remaining errors
      throw new RetryableError(
        resp.response ||
        ACCESS_TOKEN_FETCH_ERR_MSG,
        500,
        resp,
      );
    }
    throw new NetworkError('Could not retrieve authorization token');
  }
  throw new NetworkError('Could not retrieve authorization token');
};



const handlePollResponse = (pollStatus) => {

  const response = null;

  // TODO: handle record level poll status
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
  // DOC: https://developers.marketo.com/rest-api/error-codes/
  if (pollStatus.response) {
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
    if (
      (pollStatus.response?.errors[0]?.code >= 1000 &&
        pollStatus.response?.errors[0]?.code <= 1077) ||
      ABORTABLE_CODES.includes(pollStatus.response?.errors[0]?.code)
    ) {
      stats.counter(POLL_ACTIVITY, {
        status: 400,
        state: 'Abortable',
      });
      throw new AbortedError(
        pollStatus.response.errors[0].message || POLL_STATUS_ERR_MSG,
        400,
        pollStatus,
      );
    } else if (THROTTLED_CODES.includes(pollStatus.response?.errors[0]?.code)) {
      stats.counter(POLL_ACTIVITY, {
        status: 500,
        state: 'Retryable',
      });
      throw new ThrottledError(
        pollStatus.response?.errors[0]?.message || POLL_STATUS_ERR_MSG,
        500,
        pollStatus,
      );
    }
    stats.counter(POLL_ACTIVITY, {
      status: 500,
      state: 'Retryable',
    });
    throw new RetryableError(
      pollStatus.response?.errors[0]?.message ||
      pollStatus.response?.response?.statusText ||
      pollStatus.response?.statusText ||
      'Error during polling status',
      500,
      pollStatus,
    );
  }

  return response;

}

const handleFetchJobStatusResponse = (resp, type) => {
  console.log(JSON.stringify(resp))
  const response = null
  /*
  successful response :
  {
    response: 'city,  email,Import Failure ReasonChennai,s…a,Value for lookup field 'email' not found', 
    status: 200
  }
 
*/
  if (resp.status === 200) {
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
  return response;
}

/**
 * 
 * @param {*} resp 
 * @param {*} successfulJobs 
 * @param {*} unsuccessfulJobs 
 * @param {*} requestTime 
 * @returns handles the response of getImportId axios call and returns final parameters: 
 * importId, successfulJobs, unsuccessfulJobs
 */
const handleFileUploadResponse = (resp, successfulJobs, unsuccessfulJobs, requestTime) => {
  const importId = null;
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
  if (resp.response) {
    if (
      resp.response?.errors[0]?.message ===
      'There are 10 imports currently being processed. Please try again later' ||
      resp.response?.errors[0]?.message === 'Empty file'
    ) {
      stats.increment(UPLOAD_FILE, {
        status: 500,
        state: 'Retryable',
      });
      throw new RetryableError(
        resp.response?.errors[0]?.message || FILE_UPLOAD_ERR_MSG,
        500,
        { importId, successfulJobs, unsuccessfulJobs },
      );
    } else if (
      resp.response.errors[0] &&
      ((resp.response?.errors[0]?.code >= 1000 &&
        resp.response?.errors[0]?.code <= 1077 && resp.response?.errors[0]?.code !== 1003) ||
        ABORTABLE_CODES.indexOf(resp.response?.errors[0]?.code))
    ) {
      // for empty file the code is 1003 and that should be retried
      stats.increment(UPLOAD_FILE, {
        status: 400,
        state: 'Abortable',
      });
      throw new AbortedError(
        resp.response.errors[0].message || FILE_UPLOAD_ERR_MSG,
        400,
        { importId, successfulJobs, unsuccessfulJobs },
      );
    } else if (THROTTLED_CODES.indexOf(resp.response.errors[0].code) ||
      resp.response?.errors[0]?.code !== 615) {
      // for more than 10 concurrent uses the code is 615 and that should be retried
      stats.increment(UPLOAD_FILE, {
        status: 500,
        state: 'Retryable',
      });
      throw new ThrottledError(
        resp.response?.errors[0]?.message ||
        FILE_UPLOAD_ERR_MSG,
        500,
        { importId, successfulJobs, unsuccessfulJobs },
      );
    }
    // by default every thing will be retried
    stats.increment(UPLOAD_FILE, {
      status: 500,
      state: 'Retryable',
    });
    throw new RetryableError(
      resp.response.response.statusText ||
      resp.response.errors[0].message ||
      FILE_UPLOAD_ERR_MSG,
      500,
      { importId, successfulJobs, unsuccessfulJobs },
    );
  }

  // By default importId is null

  return { importId, successfulJobs, unsuccessfulJobs };

}



module.exports = {
  getAccessToken,
  ABORTABLE_CODES,
  RETRYABLE_CODES,
  THROTTLED_CODES,
  MARKETO_FILE_SIZE,
  getMarketoFilePath,
  POLL_ACTIVITY,
  UPLOAD_FILE,
  JOB_STATUS_ACTIVITY,
  handlePollResponse,
  handleFetchJobStatusResponse,
  handleFileUploadResponse
};
