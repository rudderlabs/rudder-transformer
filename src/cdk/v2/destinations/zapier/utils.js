const { defaultRequestConfig } = require('../../../../v0/util');

const buildResponseList = (payload, endpointList) =>
  endpointList.map((endpoint) => {
    const response = defaultRequestConfig();
    response.body.JSON = payload;
    response.endpoint = endpoint;
    response.headers = { 'content-type': 'application/json' };
    return response;
  });

module.exports = { buildResponseList };
