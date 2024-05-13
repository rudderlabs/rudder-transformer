const ALLOWED_OPT_IN_VALUES = ['1', '2', ''];
const groupedSuccessfulPayload = {
  identify: {
    method: 'PUT',
    batches: [],
  },
  group: {
    method: 'POST',
    batches: [],
  },
  track: {
    method: 'POST',
    batches: [],
  },
};

module.exports = {
  MAX_BATCH_SIZE: 1000,
  EMAIL_FIELD_ID: 3,
  OPT_IN_FILED_ID: 31,
  ALLOWED_OPT_IN_VALUES,
  MAX_BATCH_SIZE_BYTES: 8000000, // 8 MB,
  groupedSuccessfulPayload,
};
