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

// Get batch size from environment variable with default fallback to 1000
const MAX_BATCH_SIZE = parseInt(process.env.EMARSYS_MAX_BATCH_SIZE, 10) || 1000;

module.exports = {
  MAX_BATCH_SIZE,
  EMAIL_FIELD_ID: 3,
  OPT_IN_FILED_ID: 31,
  ALLOWED_OPT_IN_VALUES,
  MAX_BATCH_SIZE_BYTES: 8000000, // 8 MB,
  groupedSuccessfulPayload,
};
