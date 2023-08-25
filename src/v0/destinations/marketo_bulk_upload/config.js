const ABORTABLE_CODES = ['ENOTFOUND', 'ECONNREFUSED', '601','603', '605', '609', '610'];
const RETRYABLE_CODES = ['EADDRINUSE', 'ECONNRESET', 'ETIMEDOUT', '713', '602', '604', '611'];
const THROTTLED_CODES = ['502', '606', '607', '608', '615'];

const MARKETO_FILE_SIZE = 10485760;
const MARKETO_FILE_PATH = `${__dirname}/uploadFile/marketo_bulkupload.csv`;

const FETCH_ACCESS_TOKEN = 'marketo_bulk_upload_access_token_fetching';

const POLL_ACTIVITY = 'marketo_bulk_upload_polling';
const POLL_STATUS_ERR_MSG = 'Could not poll status';

const UPLOAD_FILE = 'marketo_bulk_upload_upload_file';
const FILE_UPLOAD_ERR_MSG = 'Could not upload file';

const JOB_STATUS_ACTIVITY = 'marketo_bulk_upload_get_job_status';
const FETCH_FAILURE_JOB_STATUS_ERR_MSG = 'Could not fetch failure job status';
const FETCH_WARNING_JOB_STATUS_ERR_MSG = 'Could not fetch warning job status';

module.exports = {
  ABORTABLE_CODES,
  RETRYABLE_CODES,
  THROTTLED_CODES,
  MARKETO_FILE_SIZE,
  POLL_ACTIVITY,
  UPLOAD_FILE,
  JOB_STATUS_ACTIVITY,
  MARKETO_FILE_PATH,
  FETCH_ACCESS_TOKEN,
  POLL_STATUS_ERR_MSG,
  FILE_UPLOAD_ERR_MSG,
  FETCH_FAILURE_JOB_STATUS_ERR_MSG,
  FETCH_WARNING_JOB_STATUS_ERR_MSG,
};
