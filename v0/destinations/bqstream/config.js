// Ref - https://cloud.google.com/bigquery/quotas#streaming_inserts
const MAX_ROWS_PER_REQUEST = 500;

module.exports = {
  MAX_ROWS_PER_REQUEST,
  DESTINATION: "BQSTREAM"
};
