const fs = require('fs');
const path = require('path');

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
    responses.push(`{httpReq: ${JSON.stringify(reqObj)},httpRes: ${JSON.stringify(response)}},`)
  }
}

const assertRouterOutput = (output, input) => {
  if (!Array.isArray(output) || !Array.isArray(input)) {
    return
  }

  const returnedJobids = {};
  output.forEach((outEvent) => {
    //Assert that metadata is present and is an array
    const metadata = outEvent.metadata;
    expect(Array.isArray(metadata)).toEqual(true);

    //Assert that statusCode is present and is a number between 200 and 600
    const statusCode = outEvent.statusCode;
    expect(statusCode).toBeDefined();
    expect(typeof statusCode === 'number').toEqual(true);
    const validStatusCode = statusCode >= 200 && statusCode < 600;
    expect(validStatusCode).toEqual(true);

    //Assert that every job_id in the input is present in the output one and only one time.
    metadata.forEach((meta) => {
      const jobId = meta.jobId;
      expect(returnedJobids[jobId]).toBeUndefined();
      returnedJobids[jobId] = true;
    });
  });

  const inputJobids = {};
  input.forEach((input) => {
    const jobId = input.metadata.jobId;
    inputJobids[jobId] = true;
  });

  // Router output order is intentionally not asserted here. Rudder Server sorts destinationJobs
  // by MinJobID() before the send loop, so batch send order is guaranteed server-side.
  expect(returnedJobids).toEqual(inputJobids);

};

module.exports = {
  getFuncTestData,
  responses,
  setResponsesForMockAxiosAdapter,
  assertRouterOutput
};
