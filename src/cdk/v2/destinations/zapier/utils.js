const { defaultRequestConfig } = require('../../../../v0/util');

const buildResponseList = (payload, endpointList, headers) => {
  const responseList = [];
  endpointList.forEach((endpoint) => {
    const response = defaultRequestConfig();
    response.body.JSON = payload;
    response.endpoint = endpoint;
    response.headers = headers;
    responseList.push(response);
  });
  return responseList;
};

module.exports = { buildResponseList };
