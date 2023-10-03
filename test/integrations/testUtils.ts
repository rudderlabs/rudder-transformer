import { globSync } from 'glob';
import { join } from 'path';
import { MockHttpCallsData, TestCaseData } from './testTypes';
import MockAdapter from 'axios-mock-adapter';
import isMatch from 'lodash/isMatch';

export const getTestDataFilePaths = (dirPath: string, destination: string = ''): string[] => {
  const globPattern = join(dirPath, '**', 'data.ts');
  let testFilePaths = globSync(globPattern);
  if (destination) {
    testFilePaths = testFilePaths.filter((testFile) => testFile.includes(destination));
  }
  return testFilePaths;
};

export const getTestData = (filePath): TestCaseData[] => {
  return require(filePath).data as TestCaseData[];
};

export const getMockHttpCallsData = (filePath): MockHttpCallsData[] => {
  return require(filePath).networkCallsData as MockHttpCallsData[];
};

export const getAllTestMockDataFilePaths = (dirPath: string, destination: string): string[] => {
  const globPattern = join(dirPath, '**', 'network.ts');
  let testFilePaths = globSync(globPattern);
  if (destination) {
    testFilePaths = testFilePaths.filter((testFile) => testFile.includes(destination));
  }
  return testFilePaths;
};

export const addMock = (mock: MockAdapter, axiosMock: MockHttpCallsData) => {
  const { url, method, data: reqData, ...opts } = axiosMock.httpReq;
  const { data, headers, status } = axiosMock.httpRes;

  const headersAsymMatch = {
    asymmetricMatch: function (actual) {
      return isMatch(actual, opts.headers);
    },
  };

  switch (method.toLowerCase()) {
    case 'get':
      // @ts-ignore
      mock.onGet(url, reqData, headersAsymMatch).reply(status, data, headers);
      break;
    case 'delete':
      // @ts-ignore
      mock.onDelete(url, reqData, headersAsymMatch).reply(status, data, headers);
      break;
    case 'post':
      // @ts-ignore
      mock.onPost(url, reqData, headersAsymMatch).reply(status, data, headers);
      break;
    case 'patch':
      // @ts-ignore
      mock.onPatch(url, reqData, headersAsymMatch).reply(status, data, headers);
      break;
    case 'put':
      // @ts-ignore
      mock.onPut(url, reqData, headersAsymMatch).reply(status, data, headers);
      break;
    default:
      break;
  }
};
