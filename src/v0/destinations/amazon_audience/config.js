const CREATE_USERS_URL = 'https://advertising-api.amazon.com/dp/records/hashed/';
const ASSOCIATE_USERS_URL = 'https://advertising-api.amazon.com/v2/dp/audience';
const MAX_PAYLOAD_SIZE_IN_BYTES = 4000000;
const DESTINATION = 'amazon_audience';
module.exports = { CREATE_USERS_URL, MAX_PAYLOAD_SIZE_IN_BYTES, ASSOCIATE_USERS_URL, DESTINATION };
