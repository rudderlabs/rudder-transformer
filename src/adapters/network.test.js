const mockLoggerInstance = {
  info: jest.fn(),
};
const { getFormData, httpPOST } = require('./network');
const { getFuncTestData } = require('../../test/testHelper');

jest.mock('@rudderstack/integrations-lib', () => {
  return {
    ...jest.requireActual('@rudderstack/integrations-lib'),
    structuredLogger: jest.fn().mockReturnValue(mockLoggerInstance),
  };
});

jest.mock('axios', () => ({
  ...jest.requireActual('axios'),
  post: jest.fn(),
}));

jest.mock('../util/logger', () => ({
  ...jest.requireActual('../util/logger'),
  getMatchedMetadata: jest.fn(),
}));

const axios = require('axios');
const loggerUtil = require('../util/logger');

const funcName = 'getFormData';

describe(`${funcName} Tests`, () => {
  const funcTestData = getFuncTestData(__dirname, `./testdata/${funcName}.json`);
  test.each(funcTestData)('$description', async ({ description, input, output }) => {
    let result;
    if (Array.isArray(input)) {
      result = getFormData(...input);
    } else {
      result = getFormData(input);
    }
    expect(result.toString()).toEqual(output);
  });
});

describe('logging in http methods', () => {
  beforeEach(() => {
    mockLoggerInstance.info.mockClear();
    loggerUtil.getMatchedMetadata.mockClear();
  });
  test('when proper metadata is sent should call logger without error', async () => {
    const statTags = {
      metadata: {
        destType: 'DT',
        destinationId: 'd1',
        workspaceId: 'w1',
        sourceId: 's1',
      },
      destType: 'DT',
      feature: 'feat',
      endpointPath: '/m/n/o',
      requestMethod: 'post',
    };
    loggerUtil.getMatchedMetadata.mockReturnValue([statTags.metadata]);

    axios.post.mockResolvedValueOnce({
      status: 200,
      data: { a: 1, b: 2, c: 'abc' },
      headers: {
        'Content-Type': 'apllication/json',
        'X-Some-Header': 'headsome',
      },
    });
    await expect(httpPOST('https://some.web.com/m/n/o', {}, {}, statTags)).resolves.not.toThrow(
      Error,
    );
    expect(loggerUtil.getMatchedMetadata).toHaveBeenCalledTimes(2);

    expect(mockLoggerInstance.info).toHaveBeenCalledTimes(2);

    expect(mockLoggerInstance.info).toHaveBeenNthCalledWith(1, ' [DT] /m/n/o request', {
      body: {},
      destType: 'DT',
      destinationId: 'd1',
      workspaceId: 'w1',
      sourceId: 's1',
      url: 'https://some.web.com/m/n/o',
      method: 'post',
    });

    expect(mockLoggerInstance.info).toHaveBeenNthCalledWith(2, ' [DT] /m/n/o response', {
      destType: 'DT',
      destinationId: 'd1',
      workspaceId: 'w1',
      sourceId: 's1',
      body: { a: 1, b: 2, c: 'abc' },
      status: 200,
      headers: {
        'Content-Type': 'apllication/json',
        'X-Some-Header': 'headsome',
      },
    });
  });

  test('when metadata is not sent should call logger without error', async () => {
    const statTags = {
      destType: 'DT',
      feature: 'feat',
      endpointPath: '/m/n/o',
      requestMethod: 'post',
    };
    loggerUtil.getMatchedMetadata.mockReturnValue([statTags.metadata]);

    axios.post.mockResolvedValueOnce({
      status: 200,
      data: { a: 1, b: 2, c: 'abc' },
      headers: {
        'Content-Type': 'apllication/json',
        'X-Some-Header': 'headsome',
      },
    });
    await expect(httpPOST('https://some.web.com/m/n/o', {}, {}, statTags)).resolves.not.toThrow(
      Error,
    );
    expect(loggerUtil.getMatchedMetadata).toHaveBeenCalledTimes(2);

    expect(mockLoggerInstance.info).toHaveBeenCalledTimes(2);

    expect(mockLoggerInstance.info).toHaveBeenNthCalledWith(1, ' [DT] /m/n/o request', {
      body: {},
      url: 'https://some.web.com/m/n/o',
      method: 'post',
    });

    expect(mockLoggerInstance.info).toHaveBeenNthCalledWith(2, ' [DT] /m/n/o response', {
      body: { a: 1, b: 2, c: 'abc' },
      status: 200,
      headers: {
        'Content-Type': 'apllication/json',
        'X-Some-Header': 'headsome',
      },
    });
  });
});
