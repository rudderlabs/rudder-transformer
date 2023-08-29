/* eslint-disable no-restricted-syntax */
/* eslint-disable no-prototype-builtins */
const { getAccessToken } = require('./util');
const { JOB_STATUS_ACTIVITY } = require('./config');
const { handleHttpRequest } = require('../../../adapters/network');
const { AbortedError, PlatformError, UnauthorizedError } = require('../../util/errorTypes');
const stats = require('../../../util/stats');
const { JSON_MIME_TYPE } = require('../../util/constant');
const { handleFetchJobStatusResponse, getFieldSchema, checkEventStatusViaSchemaMatching } = require('./util');
const { removeUndefinedValues } = require('../../util');

const FETCH_FAILURE_JOB_STATUS_ERR_MSG = 'Could not fetch failure job status';
const FETCH_WARNING_JOB_STATUS_ERR_MSG = 'Could not fetch warning job status';

const getJobsStatus = async (event, type, accessToken) => {
  const { config, importId } = event;
  // If token is null
  if (!accessToken) {
    throw new UnauthorizedError('Authorization failed');
  }
  const { munchkinId } = config;
  let url;
  // Get status of each lead for failed leads
  // DOC: https://developers.marketo.com/rest-api/bulk-import/bulk-lead-import/#failures
  const requestOptions = {
    headers: {
      'Content-Type': JSON_MIME_TYPE,
      Authorization: `Bearer ${accessToken}`,
    },
  };
  if (type === 'fail') {
    url = `https://${munchkinId}.mktorest.com/bulk/v1/leads/batch/${importId}/failures.json`;
  } else {
    url = `https://${munchkinId}.mktorest.com/bulk/v1/leads/batch/${importId}/warnings.json`;
  }
  const startTime = Date.now();
  const { processedResponse: resp } = await handleHttpRequest('get', url, requestOptions, {
    destType: 'marketo_bulk_upload',
    feature: 'transformation',
  });
  const endTime = Date.now();
  const requestTime = endTime - startTime;

  stats.histogram('marketo_bulk_upload_fetch_job_time', requestTime);
  try {
    return handleFetchJobStatusResponse(resp, type, config);
  } catch (err) {
    stats.increment(JOB_STATUS_ACTIVITY, {
      status: 500,
      state: 'Retryable',
    });
    if (type === 'fail') {
      throw new AbortedError(FETCH_FAILURE_JOB_STATUS_ERR_MSG, 500, resp);
    } else {
      throw new AbortedError(FETCH_WARNING_JOB_STATUS_ERR_MSG, 500, resp);
    }
  }
};

/**
 * Handles the response from the server based on the provided type.
 * Retrieves the job status using the getJobsStatus function and processes the response data.
 * Matches the response data with the data received from the server.
 * Returns a response object containing the failed keys, failed reasons, warning keys, warning reasons, and succeeded keys.
 * @param {Object} event - An object containing the input data and metadata.
 * @param {string} type - A string indicating the type of job status to retrieve ("fail" or "warn").
 * @returns {Object} - A response object with the failed keys, failed reasons, warning keys, warning reasons, and succeeded keys.
 */
const responseHandler = async (event, type) => {
  let FailedKeys = [];
  let WarningKeys = [];
  let unsuccessfulJobIdsArr = [];
  let successfulJobIdsArr = [];
  let reasons = {};

  const { config } = event;
  const accessToken = await getAccessToken(config);

  /**
   * {
  "FailedKeys" : [jobID1,jobID3],
  "FailedReasons" : {
    "jobID1" : "failure-reason-1",
    "jobID3" : "failure-reason-2",
  },
  "WarningKeys" : [jobID2,jobID4],
  "WarningReasons" : {
    "jobID2" : "warning-reason-1",
    "jobID4" : "warning-reason-2",
  },
  "SucceededKeys" : [jobID5]
}
   */

  const responseStatus =
    type === 'fail' ? await getJobsStatus(event, 'fail', accessToken) : await getJobsStatus(event, 'warn', accessToken);
  const responseArr = responseStatus.toString().split('\n'); // responseArr = ['field1,field2,Import Failure Reason', 'val1,val2,reason',...]
  const { input, metadata } = event;
  let headerArr;
  if (metadata?.csvHeader) {
    headerArr = metadata.csvHeader.split(',');
  } else {
    throw new PlatformError('No csvHeader in metadata');
  }
  const startTime = Date.now();
  const data = {};
  // create a map of job_id and data sent from server
  // {<jobId>: '<param-val1>,<param-val2>'}
input.forEach((i) => {
  const response = headerArr.map((fieldName) => Object.values(i)[0][fieldName]).join(',');
  data[i.metadata.job_id] = response;
});
  const fieldSchemaMapping = await getFieldSchema(accessToken, config.munchkinId)
  const unsuccessfulJobInfo = checkEventStatusViaSchemaMatching(event, fieldSchemaMapping)

if (Object.keys(unsuccessfulJobInfo).length === 0 ){
    // match marketo response data with received data from server
    for (const element of responseArr) {
      // split response by comma but ignore commas inside double quotes
      const elemArr = element.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      // ref :
      // https://developers.marketo.com/rest-api/bulk-import/bulk-custom-object-import/#:~:text=Now%20we%E2%80%99ll%20make%20Get%20Import%20Custom%20Object%20Failures%20endpoint%20call%20to%20get%20additional%20failure%20detail%3A
      const reasonMessage = elemArr.pop(); // get the column named "Import Failure Reason"
      // fetchFieldSchema
      for (const [key, val] of Object.entries(data)) {
        // joining the parameter values sent from marketo match it with received data from server
        if (val === `${elemArr.map(item => item.replace(/"/g, '')).join(',')}`) {
          // add job keys if warning/failure
          if (!unsuccessfulJobIdsArr.includes(key)) { 
            unsuccessfulJobIdsArr.push(key);
          }
          reasons[key] = reasonMessage;
        }
      }
    }
} else {
  unsuccessfulJobIdsArr = Object.keys(unsuccessfulJobInfo)
  reasons = {...unsuccessfulJobInfo}
}

 successfulJobIdsArr = Object.keys(data).filter((x) => !unsuccessfulJobIdsArr.includes(x));
  if (type === 'fail') {
    FailedKeys = unsuccessfulJobIdsArr.map((strJobId) => parseInt(strJobId, 10));
  } else if (type === 'warn') {
    WarningKeys = unsuccessfulJobIdsArr.map((strJobId) => parseInt(strJobId, 10));
  }
  const SucceededKeys = successfulJobIdsArr.map((strJobId) => parseInt(strJobId, 10));
  const endTime = Date.now();
  const requestTime = endTime - startTime;
  stats.histogram('marketo_bulk_upload_fetch_job_create_response_time', requestTime);
  const response = {
    statusCode: 200,
    metadata: {
      FailedKeys,
      FailedReasons: type === 'fail' ? reasons : undefined,
      WarningKeys,
      WarningReasons: type === 'warn' ? reasons : undefined,
      SucceededKeys,
    },
  };
  return removeUndefinedValues(response);
};

const processJobStatus = async (event, type) => {
  const resp = await responseHandler(event, type);
  return resp;
};
module.exports = { processJobStatus };
