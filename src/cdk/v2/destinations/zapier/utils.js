const { defaultRequestConfig } = require('../../../../v0/util');

const buildResponseList = (payload, endpointList) => {
  const responseList = [];
  endpointList.forEach((endpoint) => {
    const response = defaultRequestConfig();
    response.body.JSON = payload;
    response.endpoint = endpoint;
    response.headers = { 'content-type': 'application/json' };
    responseList.push(response);
  });
  return responseList;
};

module.exports = { buildResponseList };
