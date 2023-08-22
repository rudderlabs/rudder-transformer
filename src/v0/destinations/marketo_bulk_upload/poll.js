const { removeUndefinedValues } = require('../../util');
const { getAccessToken, ABORTABLE_CODES, THROTTLED_CODES, POLL_ACTIVITY } = require('./util');
const { handleHttpRequest } = require('../../../adapters/network');
const stats = require('../../../util/stats');
const { AbortedError, ThrottledError, RetryableError } = require('../../util/errorTypes');
const { JSON_MIME_TYPE } = require('../../util/constant');

const getPollStatus = async (event) => {
  const accessToken = await getAccessToken(event.config);
  const { munchkinId } = event.config;

  // To see the status of the import job polling is done
  // DOC: https://developers.marketo.com/rest-api/bulk-import/bulk-lead-import/#polling_job_status
  const requestOptions = {
    headers: {
      'Content-Type': JSON_MIME_TYPE,
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const pollUrl = `https://${munchkinId}.mktorest.com/bulk/v1/leads/batch/${event.importId}.json`;
  const startTime = Date.now();
  const { processedResponse: pollStatus } = await handleHttpRequest(
    'get',
    pollUrl,
    requestOptions,
    {
      destType: 'marketo_bulk_upload',
      feature: 'transformation',
    },
  );
  const endTime = Date.now();
  const requestTime = endTime - startTime;
  const POLL_STATUS_ERR_MSG = 'Could not poll status';
  if (pollStatus.status === 200) {
    if (pollStatus.response && pollStatus.response.success) {
      stats.counter(POLL_ACTIVITY, {
        status: 200,
        state: 'Success',
      });
      return pollStatus.response;
    }
    // DOC: https://developers.marketo.com/rest-api/error-codes/
    if (pollStatus.response) {
      // Abortable jobs
      // Errors from polling come as
      /**
       * {
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
        pollStatus.response.errors[0] &&
        ((pollStatus.response.errors[0].code >= 1000 &&
          pollStatus.response.errors[0].code <= 1077) ||
          ABORTABLE_CODES.includes(pollStatus.response.errors[0].code))
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
      } else if (THROTTLED_CODES.includes(pollStatus.response.errors[0].code)) {
        stats.counter(POLL_ACTIVITY, {
          status: 500,
          state: 'Retryable',
        });
        throw new ThrottledError(
          pollStatus.response.errors[0].message || POLL_STATUS_ERR_MSG,
          500,
          pollStatus,
        );
      }
      stats.counter(POLL_ACTIVITY, {
        status: 500,
        state: 'Retryable',
      });
      throw new RetryableError(
        pollStatus?.response?.errors[0]?.message ||
          pollStatus?.response?.response?.statusText ||
          pollStatus?.response?.statusText ||
          'Error during polling status',
        500,
        pollStatus,
      );
    }
  }
  stats.counter(POLL_ACTIVITY, {
    status: 400,
    state: 'Abortable',
  });
  throw new AbortedError(POLL_STATUS_ERR_MSG, 400, pollStatus);
};

const responseHandler = async (event) => {
  const pollResp = await getPollStatus(event);
  let pollSuccess;
  let success = false;
  let statusCode = 500;
  let hasFailed;
  let FailedJobURLs;
  let hasWarnings;
  let warningJobsURL;
  let error;
  let InProgress = false;
  // Server expects :
  /**
  *
  * {
    "Complete": true,
    "statusCode": 200,
    "hasFailed": true,
    "InProgress": false,
    "FailedJobURLs": "<some-url>", // transformer URL
    "hasWarnings": false,
    "warningJobsURL": "<some-url>", // transformer URL
    } // Succesful Upload
    {
        "success": false,
        "statusCode": 400,
        "errorResponse": <some-error-response>
    } // Failed Upload
    {
        "success": false,
    } // Importing or Queue

  */
  if (pollResp) {
    pollSuccess = pollResp.success;
    if (pollSuccess) {
      const { status, numOfRowsFailed, numOfRowsWithWarning } = pollResp.result[0];
      if (status === 'Complete') {
        success = true;
        statusCode = 200;
        hasFailed = numOfRowsFailed > 0;
        FailedJobURLs = '/getFailedJobs';
        warningJobsURL = '/getWarningJobs';
        hasWarnings = numOfRowsWithWarning > 0;
      } else if (status === 'Importing' || status === 'Queued') {
        success = false;
        InProgress = true;
      }
    } else {
      // status is failed
      success = false;
      statusCode = 500;
      error = pollResp.errors ? pollResp.errors[0].message : 'Error in importing jobs';
    }
  }
  const response = {
    Complete: success,
    statusCode,
    hasFailed,
    InProgress,
    FailedJobURLs,
    hasWarnings,
    warningJobsURL,
    error,
  };
  return removeUndefinedValues(response);
};

const processPolling = async (event) => {
  const resp = await responseHandler(event);
  return resp;
};

module.exports = { processPolling };
