const { removeUndefinedValues, isHttpStatusSuccess } = require('../../util');
const { getAccessToken, handlePollResponse } = require('./util');
const { handleHttpRequest } = require('../../../adapters/network');
const stats = require('../../../util/stats');
const { NetworkError, UnauthorizedError } = require('../../util/errorTypes');
const { JSON_MIME_TYPE } = require('../../util/constant');
const { POLL_ACTIVITY } = require('./config');

const getPollStatus = async (event) => {
  const accessToken = await getAccessToken(event.config);

  // If token is null
  if (!accessToken) {
    throw new UnauthorizedError('Authorization failed');
  }
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
  const { processedResponse: pollStatus } = await handleHttpRequest(
    'get',
    pollUrl,
    requestOptions,
    {
      destType: 'marketo_bulk_upload',
      feature: 'transformation',
    },
  );
  const POLL_STATUS_ERR_MSG = 'Could not poll status';

  if (!isHttpStatusSuccess(pollStatus.status)) {
    stats.counter(POLL_ACTIVITY, {
      status: pollStatus.status,
      state: 'Retryable',
    });
    throw new NetworkError(POLL_STATUS_ERR_MSG, pollStatus.status);
  }
  return handlePollResponse(pollStatus, event.config);
};

const responseHandler = async (event) => {
  let success = false;
  let statusCode = 500;
  let hasFailed;
  let HasWarning;
  let error;
  let InProgress = false;
  const pollResp = await getPollStatus(event);
  // Server expects :
  /**
  *
  * {
    "Complete": true,
    "statusCode": 200,
    "hasFailed": true,
    "InProgress": false,
    "FailedJobURLs": "<some-url>", // transformer URL
    "HasWarning": false,
    "WarningJobURLs": "<some-url>", // transformer URL
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
    // As marketo lead import API or bulk API does not support record level error response we are considering
    // file level errors only.
    // ref: https://nation.marketo.com/t5/ideas/support-error-code-in-record-level-in-lead-bulk-api/idi-p/262191
    const { status, numOfRowsFailed, numOfRowsWithWarning } = pollResp.result[0];
    if (status === 'Complete') {
      success = true;
      statusCode = 200;
      hasFailed = numOfRowsFailed > 0;
      HasWarning = numOfRowsWithWarning > 0;
    } else if (status === 'Importing' || status === 'Queued') {
      success = false;
      InProgress = true;
    }
  }
  const response = {
    Complete: success,
    statusCode,
    hasFailed,
    InProgress,
    FailedJobURLs: hasFailed ? '/getFailedJobs' : undefined,
    HasWarning,
    WarningJobURLs: HasWarning ? '/getWarningJobs' : undefined,
    error,
  };
  return removeUndefinedValues(response);
};

const processPolling = async (event) => {
  const resp = await responseHandler(event);
  return resp;
};

module.exports = { processPolling };
