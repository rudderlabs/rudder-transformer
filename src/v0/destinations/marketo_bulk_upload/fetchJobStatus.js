/* eslint-disable no-restricted-syntax */
/* eslint-disable no-prototype-builtins */
const {
  getAccessToken,
  ABORTABLE_CODES,
  THROTTLED_CODES,
  RETRYABLE_CODES,
  JOB_STATUS_ACTIVITY,
} = require('./util');
const { httpGET } = require('../../../adapters/network');
const {
  AbortedError,
  RetryableError,
  ThrottledError,
  PlatformError,
} = require('../../util/errorTypes');
const stats = require('../../../util/stats');
const { JSON_MIME_TYPE } = require('../../util/constant');

const FETCH_FAILURE_JOB_STATUS_ERR_MSG = 'Could not fetch failure job status';
const FAILURE_JOB_STATUS_ERR_MSG = 'Error during fetching failure job status';
const FETCH_WARNING_JOB_STATUS_ERR_MSG = 'Could not fetch warning job status';
const WARNING_JOB_STATUS_ERR_MSG = 'Error during fetching warning job status';

const getFailedJobStatus = async (event) => {
  const { config, importId } = event;
  const accessToken = await getAccessToken(config);
  const { munchkinId } = config;
  // Get status of each lead for failed leads
  // DOC: https://developers.marketo.com/rest-api/bulk-import/bulk-lead-import/#failures
  const requestOptions = {
    headers: {
      'Content-Type': JSON_MIME_TYPE,
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const failedLeadUrl = `https://${munchkinId}.mktorest.com/bulk/v1/leads/batch/${importId}/failures.json`;
  const startTime = Date.now();
  const resp = await httpGET(failedLeadUrl, requestOptions);
  const endTime = Date.now();
  const requestTime = endTime - startTime;

  stats.gauge('marketo_bulk_upload_fetch_job_time', requestTime);
  if (resp.success) {
    if (resp.response && resp.response.data) {
      stats.increment(JOB_STATUS_ACTIVITY, {
        status: 200,
        state: 'Success',
      });
      return resp.response;
    }
    stats.increment(JOB_STATUS_ACTIVITY, {
      status: 400,
      state: 'Abortable',
    });
    throw new AbortedError(FETCH_FAILURE_JOB_STATUS_ERR_MSG, 400, resp);
  }
  if (resp.response) {
    if (
      ABORTABLE_CODES.includes(resp.response.code) ||
      (resp.response.code >= 400 && resp.response.code <= 499)
    ) {
      stats.increment(JOB_STATUS_ACTIVITY, {
        status: 400,
        state: 'Abortable',
      });
      throw new AbortedError(resp.response.code, 400, resp);
    } else if (RETRYABLE_CODES.includes(resp.response.code)) {
      stats.increment(JOB_STATUS_ACTIVITY, {
        status: 500,
        state: 'Retryable',
      });
      throw new RetryableError(resp.response.code, 500, resp);
    } else if (resp.response.response) {
      if (ABORTABLE_CODES.includes(resp.response.response.status)) {
        stats.increment(JOB_STATUS_ACTIVITY, {
          status: 400,
          state: 'Abortable',
        });
        throw new AbortedError(
          resp.response.response.statusText || FAILURE_JOB_STATUS_ERR_MSG,
          400,
          resp,
        );
      } else if (THROTTLED_CODES.includes(resp.response.response.status)) {
        stats.increment(JOB_STATUS_ACTIVITY, {
          status: 500,
          state: 'Retryable',
        });
        throw new ThrottledError(
          resp.response.response.statusText || FAILURE_JOB_STATUS_ERR_MSG,
          resp,
        );
      }
      stats.increment(JOB_STATUS_ACTIVITY, {
        status: 500,
        state: 'Retryable',
      });
      throw new RetryableError(
        resp.response.response.statusText || FAILURE_JOB_STATUS_ERR_MSG,
        500,
        resp,
      );
    }
    stats.increment(JOB_STATUS_ACTIVITY, {
      status: 400,
      state: 'Abortable',
    });
    throw new AbortedError(FETCH_FAILURE_JOB_STATUS_ERR_MSG, 400, resp);
  }
  stats.increment(JOB_STATUS_ACTIVITY, {
    status: 400,
    state: 'Abortable',
  });
  throw new AbortedError(FETCH_FAILURE_JOB_STATUS_ERR_MSG, 400, resp);
};

const getWarningJobStatus = async (event) => {
  const { config, importId } = event;
  const accessToken = await getAccessToken(config);
  const { munchkinId } = config;
  // Get status of each lead for warning leads
  // DOC: https://developers.marketo.com/rest-api/bulk-import/bulk-lead-import/#warnings
  const requestOptions = {
    headers: {
      'Content-Type': JSON_MIME_TYPE,
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const startTime = Date.now();
  const warningJobStatusUrl = `https://${munchkinId}.mktorest.com/bulk/v1/leads/batch/${importId}/warnings.json`;
  const resp = await httpGET(warningJobStatusUrl, requestOptions);
  const endTime = Date.now();
  const requestTime = endTime - startTime;
  stats.gauge('marketo_bulk_upload_fetch_job_time', requestTime);
  if (resp.success) {
    if (resp.response && resp.response.data) {
      stats.increment(JOB_STATUS_ACTIVITY, {
        status: 200,
        state: 'Success',
      });
      return resp.response;
    }
    stats.increment(JOB_STATUS_ACTIVITY, {
      status: 400,
      state: 'Abortable',
    });
    throw new AbortedError(FETCH_WARNING_JOB_STATUS_ERR_MSG, 400, resp);
  }
  if (resp.response) {
    if (
      ABORTABLE_CODES.includes(resp.response.code) ||
      (resp.response.code >= 400 && resp.response.code <= 499)
    ) {
      stats.increment(JOB_STATUS_ACTIVITY, {
        status: 400,
        state: 'Abortable',
      });
      throw new AbortedError(resp.response.code, 400, resp);
    } else if (RETRYABLE_CODES.includes(resp.response.code)) {
      stats.increment(JOB_STATUS_ACTIVITY, {
        status: 500,
        state: 'Retryable',
      });
      throw new RetryableError(resp.response.code, 500, resp);
    } else if (resp.response.response) {
      if (ABORTABLE_CODES.includes(resp.response.response.status)) {
        stats.increment(JOB_STATUS_ACTIVITY, {
          status: 400,
          state: 'Abortable',
        });
        throw new AbortedError(
          resp.response.response.statusText || WARNING_JOB_STATUS_ERR_MSG,
          400,
          resp,
        );
      } else if (THROTTLED_CODES.includes(resp.response.response.status)) {
        stats.increment(JOB_STATUS_ACTIVITY, {
          status: 500,
          state: 'Retryable',
        });
        throw new ThrottledError(
          resp.response.response.statusText || WARNING_JOB_STATUS_ERR_MSG,
          resp,
        );
      }

      stats.increment(JOB_STATUS_ACTIVITY, {
        status: 500,
        state: 'Retryable',
      });
      throw new RetryableError(
        resp.response.response.statusText || WARNING_JOB_STATUS_ERR_MSG,
        500,
        resp,
      );
    }
    stats.increment(JOB_STATUS_ACTIVITY, {
      status: 400,
      state: 'Abortable',
    });
    throw new AbortedError(FETCH_WARNING_JOB_STATUS_ERR_MSG, 400, resp);
  }
  stats.increment(JOB_STATUS_ACTIVITY, {
    status: 400,
    state: 'Abortable',
  });
  throw new AbortedError(FETCH_WARNING_JOB_STATUS_ERR_MSG, 400, resp);
};

const responseHandler = async (event, type) => {
  let failedKeys = [];
  let failedReasons = {};
  let warningKeys = [];
  let warningReasons = {};

  /**
   * {
	"failedKeys" : [jobID1,jobID3],
	"failedReasons" : {
		"jobID1" : "failure-reason-1",
		"jobID3" : "failure-reason-2",
	},
	"warningKeys" : [jobID2,jobID4],
	"warningReasons" : {
		"jobID2" : "warning-reason-1",
		"jobID4" : "warning-reason-2",
	},
	"succeededKeys" : [jobID5]
}
   */

  const responseStatus =
    type === 'fail' ? await getFailedJobStatus(event) : await getWarningJobStatus(event);
  const responseArr = responseStatus.data.split('\n');
  const { input, metadata } = event;
  let headerArr;
  if (metadata && metadata.csvHeader) {
    headerArr = metadata.csvHeader.split(',');
  } else {
    throw new PlatformError('No csvHeader in metadata');
  }
  const data = {};
  input.forEach((i) => {
    const response = headerArr.map((fieldName) => Object.values(i)[0][fieldName]).join(',');
    data[i.metadata.job_id] = response;
  });
  const unsuccessfulJobIdsArr = [];
  const reasons = {};
  const startTime = Date.now();
  for (const element of responseArr) {
    // split response by comma but ignore commas inside double quotes
    const elemArr = element.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    const reasonMessage = elemArr.pop();
    // match response data with received data from server
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const val = data[key];
        if (val === `${elemArr.join()}`) {
          // add job keys if warning/failure

          if (!unsuccessfulJobIdsArr.includes(key)) {
            unsuccessfulJobIdsArr.push(key);
          }
          reasons[key] = reasonMessage;
        }
      }
    }
  }

  const successfulJobIdsArr = Object.keys(data).filter((x) => !unsuccessfulJobIdsArr.includes(x));

  if (type === 'fail') {
    failedKeys = unsuccessfulJobIdsArr;
    failedReasons = reasons;
  } else if (type === 'warn') {
    warningKeys = unsuccessfulJobIdsArr;
    warningReasons = reasons;
  }
  const succeededKeys = successfulJobIdsArr;
  const endTime = Date.now();
  const requestTime = endTime - startTime;
  stats.gauge('marketo_bulk_upload_fetch_job_create_response_time', requestTime);
  const response = {
    statusCode: 200,
    metadata: {
      failedKeys,
      failedReasons,
      warningKeys,
      warningReasons,
      succeededKeys,
    },
  };
  return response;
};

const processJobStatus = async (event, type) => {
  const resp = await responseHandler(event, type);
  return resp;
};
module.exports = { processJobStatus };
