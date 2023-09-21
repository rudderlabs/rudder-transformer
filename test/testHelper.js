const fs = require('fs');
const path = require('path');
const stringify = require('fast-json-stable-stringify');

const getFuncTestData = (dirPath, filePath) => {
  const fileData = fs.readFileSync(path.resolve(dirPath, filePath));
  const testData = JSON.parse(fileData);
  return testData;
};

const responses = [];

const setResponsesForNwMockGeneration = (reqType, { url, data, requestOptions }, {response}) => {
  if (process.env.GEN_AXIOS_FOR_TESTS === 'true') {
    let resp;
    switch (reqType) {
      case "constructor":
        resp = `{httpReq: ${stringify(requestOptions)},httpRes: ${stringify(response)}},`
        break;
      case "get":
      case "delete":
        resp = `{httpReq: ${stringify({url, ...requestOptions})},httpRes: ${stringify(response)}},`
        break
      default:
        // put, patch, post
        resp = `{httpReq: ${stringify({url, data, ...requestOptions})},httpRes: ${stringify(response)}},`
        break;
    }
    responses.push(resp)
  }
}

module.exports = {
  getFuncTestData,
  responses,
  setResponsesForNwMockGeneration
};
