const fs = require('fs');
const path = require('path');
const stringify = require('fast-json-stable-stringify');

const getFuncTestData = (dirPath, filePath) => {
  const fileData = fs.readFileSync(path.resolve(dirPath, filePath));
  const testData = JSON.parse(fileData);
  return testData;
};

const responses = [];

const setResponsesForMockAxiosAdapter = ({url, method, data, options}, {response}) => {
  if (process.env.GEN_AXIOS_FOR_TESTS === 'true') {
    const reqObj = {url, ...options, method}
    if (data) {
      reqObj.data = data
    }
    responses.push(`{httpReq: ${stringify(reqObj)},httpRes: ${stringify(response)}},`) 
  }
}
module.exports = {
  getFuncTestData,
  responses,
  setResponsesForMockAxiosAdapter
};
