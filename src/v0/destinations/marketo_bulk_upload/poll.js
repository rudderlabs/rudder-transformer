const { removeUndefinedValues } = require('../../util');
const { getAccessToken, ABORTABLE_CODES, THROTTLED_CODES, POLL_ACTIVITY } = require('./util');
const { httpGET } = require('../../../adapters/network');
const stats = require('../../../util/stats');
const { AbortedError, ThrottledError, RetryableError } = require('../../util/errorTypes');

const getPollStatus = async (event) => {
  const accessToken = await getAccessToken(event.config);
  const { munchkinId } = event.config;

  // To see the status of the import job polling is done
  // DOC: https://developers.marketo.com/rest-api/bulk-import/bulk-lead-import/#polling_job_status
  const requestOptions = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const pollUrl = `https://${munchkinId}.mktorest.com/bulk/v1/leads/batch/${event.importId}.json`;
  const startTime = Date.now();
  const pollStatus = await httpGET(pollUrl, requestOptions);
  const endTime = Date.now();
  const requestTime = endTime - startTime;
  if (pollStatus.success) {
    if (pollStatus.response && pollStatus.response.data.success) {
      stats.increment(POLL_ACTIVITY, 1, {
        integration: 'Marketo_bulk_upload',
        requestTime,
        status: 200,
        state: 'Success',
      });
      return pollStatus.response;
    }
    // DOC: https://developers.marketo.com/rest-api/error-codes/
    if (pollStatus.response && pollStatus.response.data) {
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
        pollStatus.response.data.errors[0] &&
        ((pollStatus.response.data.errors[0].code >= 1000 &&
          pollStatus.response.data.errors[0].code <= 1077) ||
          ABORTABLE_CODES.includes(pollStatus.response.data.errors[0].code))
      ) {
        stats.increment(POLL_ACTIVITY, 1, {
          integration: 'Marketo_bulk_upload',
          requestTime,
          status: 400,
          state: 'Abortable',
        });
        throw new AbortedError(
          pollStatus.response.data.errors[0].message || 'Could not poll status',
          400,
          pollStatus,
        );
      } else if (THROTTLED_CODES.includes(pollStatus.response.data.errors[0].code)) {
        stats.increment(POLL_ACTIVITY, 1, {
          integration: 'Marketo_bulk_upload',
          requestTime,
          status: 500,
          state: 'Retryable',
        });
        throw new ThrottledError(
          pollStatus.response.data.errors[0].message || 'Could not poll status',
          pollStatus,
        );
      }
      stats.increment(POLL_ACTIVITY, 1, {
        integration: 'Marketo_bulk_upload',
        requestTime,
        status: 500,
        state: 'Retryable',
      });
      throw new RetryableError(
        pollStatus.response.response.statusText || 'Error during polling status',
        500,
        pollStatus,
      );
    }
  }
  stats.increment(POLL_ACTIVITY, 1, {
    integration: 'Marketo_bulk_upload',
    requestTime,
    status: 400,
    state: 'Abortable',
  });
  throw new AbortedError('Could not poll status', 400, pollStatus);
};

const responseHandler = async (event) => {
  const pollResp = await getPollStatus(event);
  let pollSuccess;
  let success;
  let statusCode;
  let hasFailed;
  let failedJobsURL;
  let hasWarnings;
  let warningJobsURL;
  let errorResponse;
  // Server expects :
  /**
  * 
  * {
    "success": true,
    "statusCode": 200,
    "hasFailed": true,
    "failedJobsURL": "<some-url>", // transformer URL
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
  if (pollResp && pollResp.data) {
    pollSuccess = pollResp.data.success;
    if (pollSuccess) {
      const { status, numOfRowsFailed, numOfRowsWithWarning } = pollResp.data.result[0];
      if (status === 'Complete') {
        success = true;
        statusCode = 200;
        hasFailed = numOfRowsFailed > 0;
        failedJobsURL = '/getFailedJobs';
        warningJobsURL = '/getWarningJobs';
        hasWarnings = numOfRowsWithWarning > 0;
      } else if (status === 'Importing' || status === 'Queued') {
        success = false;
      }
    } else {
      success = false;
      statusCode = 400;
      errorResponse = pollResp.data.errors
        ? pollResp.data.errors[0].message
        : 'Error in importing jobs';
    }
  }
  const response = {
    success,
    statusCode,
    hasFailed,
    failedJobsURL,
    hasWarnings,
    warningJobsURL,
    errorResponse,
  };
  return removeUndefinedValues(response);
};

const processPolling = async (event) => {
  const resp = await responseHandler(event);
  return resp;
};

module.exports = { processPolling };
