const fs = require("fs");
const path = require("path");

const loadData = fs.readFileSync(path.resolve(__dirname, "./data/pipedrive/response.json"));
const storedData = JSON.parse(loadData);

/**
 * Converts params object to url query string
 * @param {*} params 
 */
const generateQueryString = (params) => {
  let queryString = '';
  Object.keys(params).forEach(key => {
    queryString += `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}&`;
  });

  return queryString.slice(0, queryString.length - 1);
};

const pipedriveGetRequestHandler = (url, options) => {
  const encodedUrl = `${url}?${generateQueryString(options.params)}`;
  const data = storedData[encodedUrl];
  return { data, status: 200 };
};

const pipedrivePostRequestHandler = (url, payload, options) => {
  const encodedUrl = `${url}?${generateQueryString(options.params)}`;
  const data = storedData[encodedUrl];
  return { data, status: 201 };
};

// just mocking the response status currently
const pipedrivePutRequestHandler = (url, payload, options) => {
  return { data: {}, status: 200 };
};

module.exports = {
  pipedriveGetRequestHandler,
  pipedrivePostRequestHandler,
  pipedrivePutRequestHandler
}