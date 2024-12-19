const fileUploadHandlers = {
  v0: {
    marketo_bulk_upload: undefined,
  },
};

const pollStatusHandlers = {
  v0: {
    marketo_bulk_upload: undefined,
  },
};

const jobStatusHandlers = {
  v0: {
    marketo_bulk_upload: undefined,
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
