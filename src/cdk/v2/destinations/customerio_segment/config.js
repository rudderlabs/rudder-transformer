const CUSTOMERIO_BASE_ENDPOINT = 'https://track.customer.io/api/v1/segments';

const COMMON_RECORD_ENDPOINT = (segmentId, idType = 'email', segmentAction = 'add_members') =>
  `${CUSTOMERIO_BASE_ENDPOINT}/${segmentId}/${segmentAction}?id_type=${idType}`;

module.exports = {
  MAX_BATCH_SIZE: 1000,
  COMMON_RECORD_ENDPOINT,
};
