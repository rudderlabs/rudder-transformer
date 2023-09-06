const { removeUndefinedValues, isHttpStatusSuccess } = require('../../util');
const { getAccessToken, handlePollResponse, hydrateStatusForServer } = require('./util');
const { handleHttpRequest } = require('../../../adapters/network');
const stats = require('../../../util/stats');
const { NetworkError } = require('../../util/errorTypes');
const { JSON_MIME_TYPE } = require('../../util/constant');
const { POLL_ACTIVITY } = require('./config');

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
  const { processedResponse: pollStatus } = await handleHttpRequest(
    'get',
    pollUrl,
    requestOptions,
    {
      destType: 'marketo_bulk_upload',
      feature: 'transformation',
    },
  );
  if (!isHttpStatusSuccess(pollStatus.status)) {
    stats.counter(POLL_ACTIVITY, 1, {
      status: pollStatus.status,
      state: 'Retryable',
    });
    throw new NetworkError(
      'Could not poll status',
      hydrateStatusForServer(pollStatus.status, 'During fetching poll status'),
    );
  }
  return handlePollResponse(pollStatus, event.config);
};

const responseHandler = async (event) => {
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
        "Inprogress": true,
         statusCode: 500,
    } // Importing or Queue

  */
  if (pollResp) {
    // As marketo lead import API or bulk API does not support record level error response we are considering
    // file level errors only.
    // ref: https://nation.marketo.com/t5/ideas/support-error-code-in-record-level-in-lead-bulk-api/idi-p/262191
    const { status, numOfRowsFailed, numOfRowsWithWarning, message } = pollResp.result[0];
    if (status === 'Complete') {
      const response = {
        Complete: true,
        statusCode: 200,
        InProgress: false,
        hasFailed: numOfRowsFailed > 0,
        FailedJobURLs: numOfRowsFailed > 0 ? '/getFailedJobs' : undefined,
        HasWarning: numOfRowsWithWarning > 0,
        WarningJobURLs: numOfRowsWithWarning > 0 ? '/getWarningJobs' : undefined,
      };
      return removeUndefinedValues(response);
    }
    if (status === 'Importing' || status === 'Queued') {
      return {
        Complete: false,
        statusCode: 500,
        hasFailed: false,
        InProgress: true,
        HasWarning: false,
      };
    }
    if (status === 'Failed') {
      return {
        Complete: false,
        statusCode: 500,
        hasFailed: false,
        InProgress: false,
        HasWarning: false,
        Error: message || 'Marketo Poll Status Failed',
      };
    }
  }
  // when pollResp is null
  return {
    Complete: false,
    statusCode: 500,
    hasFailed: false,
    InProgress: false,
    HasWarning: false,
    Error: 'No poll response received from Marketo',
  };
};

const processPolling = async (event) => {
  const resp = await responseHandler(event);
  return resp;
};

module.exports = { processPolling };
