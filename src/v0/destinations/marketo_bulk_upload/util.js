const { httpGET } = require('../../../adapters/network');
const {
  ThrottledError,
  AbortedError,
  RetryableError,
  NetworkError,
} = require('../../util/errorTypes');
const tags = require('../../util/tags');
const { getDynamicErrorType } = require('../../../adapters/utils/networkUtils');

const ABORTABLE_CODES = ['ENOTFOUND', 'ECONNREFUSED', 603, 605, 609, 610];
const RETRYABLE_CODES = ['EADDRINUSE', 'ECONNRESET', 'ETIMEDOUT', 713, 601, 602, 604, 611];
const THROTTLED_CODES = [502, 606, 607, 608, 615];

const MARKETO_FILE_SIZE = 10485760;
const MARKETO_FILE_PATH = `${__dirname}/uploadFile/marketo_bulkupload.csv`;

const POLL_ACTIVITY = 'marketo_bulk_upload_polling';
const UPLOAD_FILE = 'marketo_bulk_upload_upload_file';
const JOB_STATUS_ACTIVITY = 'marketo_bulk_upload_get_job_status';

const getMarketoFilePath = () => MARKETO_FILE_PATH;
// Fetch access token from client id and client secret
// DOC: https://developers.marketo.com/rest-api/authentication/
const getAccessToken = async (config) => {
  const { clientId, clientSecret, munchkinId } = config;
  const url = `https://${munchkinId}.mktorest.com/identity/oauth/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`;
  const resp = await httpGET(url);
  if (resp.success) {
    if (resp.response && resp.response.data && resp.response.data.access_token) {
      return resp.response.data.access_token;
    }
    const status = resp?.response?.status || 400;
    throw new NetworkError(
      'Could not retrieve authorisation token',
      status,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
      },
      resp,
    );
  }
  if (resp.response) {
    // handle for abortable codes
    if (
      ABORTABLE_CODES.includes(resp.response.code) ||
      (resp.response.code >= 400 && resp.response.code <= 499)
    ) {
      throw new AbortedError(resp.response.code, 400, resp);
    } // handle for retryable codes
    else if (RETRYABLE_CODES.includes(resp.response.code)) {
      throw new RetryableError(resp.response.code, 500, resp);
    } // handle for abortable codes
    else if (resp.response.response) {
      if (ABORTABLE_CODES.includes(resp.response.response.status)) {
        throw new AbortedError(
          resp.response.response.statusText || 'Error during fetching access token',
          400,
          resp,
        );
      } // handle for throttled codes
      else if (THROTTLED_CODES.includes(resp.response.response.status)) {
        throw new ThrottledError(
          resp.response.response.statusText || 'Error during fetching access token',
          resp,
        );
      }
      // Assuming none we should retry the remaining errors
      throw new RetryableError(
        resp.response.response.statusText || 'Error during fetching access token',
        500,
        resp,
      );
    }
    throw new NetworkError('Could not retrieve authorization token');
  }
  throw new NetworkError('Could not retrieve authorization token');
};

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
};
