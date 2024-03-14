import * as V0MarketoBulkUploadFileUpload from '../v0/destinations/marketo_bulk_upload/fileUpload';
import * as V0MarketoBulkUploadPollStatus from '../v0/destinations/marketo_bulk_upload/poll';
import * as V0MarketoBulkUploadJobStatus from '../v0/destinations/marketo_bulk_upload/fetchJobStatus';

const fileUploadHandlers = {
  v0: {
    marketo_bulk_upload: V0MarketoBulkUploadFileUpload,
  },
};

const pollStatusHandlers = {
  v0: {
    marketo_bulk_upload: V0MarketoBulkUploadPollStatus,
  },
};

const jobStatusHandlers = {
  v0: {
    marketo_bulk_upload: V0MarketoBulkUploadJobStatus,
  },
};

export const getDestFileUploadHandler = (version, dest) => {
  if (fileUploadHandlers[version] && fileUploadHandlers[version][dest]) {
    return fileUploadHandlers[version][dest];
  }
  return undefined;
};

export const getPollStatusHandler = (version, dest) => {
  if (pollStatusHandlers[version] && pollStatusHandlers[version][dest]) {
    return pollStatusHandlers[version][dest];
  }
  return undefined;
};

export const getJobStatusHandler = (version, dest) => {
  if (jobStatusHandlers[version] && jobStatusHandlers[version][dest]) {
    return jobStatusHandlers[version][dest];
  }
  return undefined;
};
