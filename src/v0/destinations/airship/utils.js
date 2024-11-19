const { v5 } = require('uuid');

// ref : https://docs.airship.com/api/ua/#operation-api-custom-events-post
const transformSessionId = (rawSessionId) => {
  const NAMESPACE = v5.DNS;
  const uuidV5 = v5(rawSessionId, NAMESPACE);
  return uuidV5;
};

module.exports = {
  transformSessionId,
};
