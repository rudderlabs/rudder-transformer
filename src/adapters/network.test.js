const mockLoggerInstance = {
  info: jest.fn(),
};
const { getFormData, httpPOST, httpGET, httpSend } = require('./network');
const { getFuncTestData } = require('../../test/testHelper');

jest.mock('@rudderstack/integrations-lib', () => {
  return {
    ...jest.requireActual('@rudderstack/integrations-lib'),
    structuredLogger: jest.fn().mockReturnValue(mockLoggerInstance),
  };
});

jest.mock('axios', () => jest.fn());

jest.mock('../util/logger', () => ({
  ...jest.requireActual('../util/logger'),
  getMatchedMetadata: jest.fn(),
}));

const axios = require('axios');
const loggerUtil = require('../util/logger');

axios.post = jest.fn();
axios.get = jest.fn();

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
  test('post - when proper metadata(object) is sent should call logger without error', async () => {
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

  test('post - when metadata is not sent should call logger without error', async () => {
    const statTags = {
      destType: 'DT',
      feature: 'feat',
      endpointPath: '/m/n/o',
      requestMethod: 'post',
    };
    loggerUtil.getMatchedMetadata.mockReturnValue([]);

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

    expect(mockLoggerInstance.info).toHaveBeenCalledTimes(0);
  });

  test('post - when metadata is string should call logger without error', async () => {
    const statTags = {
      metadata: 'random metadata',
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

    expect(mockLoggerInstance.info).toHaveBeenCalledTimes(0);
  });

  test('post - when proper metadata(Array) is sent should call logger without error', async () => {
    const metadata = [
      {
        destType: 'DT',
        destinationId: 'd1',
        workspaceId: 'w1',
        sourceId: 's1',
        jobId: 1,
      },
      {
        destType: 'DT',
        destinationId: 'd1',
        workspaceId: 'w1',
        sourceId: 's1',
        jobId: 2,
      },
      {
        destType: 'DT',
        destinationId: 'd1',
        workspaceId: 'w1',
        sourceId: 's1',
        jobId: 3,
      },
    ];
    const statTags = {
      metadata,
      destType: 'DT',
      feature: 'feat',
      endpointPath: '/m/n/o',
      requestMethod: 'post',
    };
    loggerUtil.getMatchedMetadata.mockReturnValue(statTags.metadata);

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

    expect(mockLoggerInstance.info).toHaveBeenCalledTimes(metadata.length * 2);

    [1, 2, 3].forEach((i) => {
      expect(mockLoggerInstance.info).toHaveBeenNthCalledWith(i, ' [DT] /m/n/o request', {
        body: {},
        destType: 'DT',
        destinationId: 'd1',
        workspaceId: 'w1',
        sourceId: 's1',
        url: 'https://some.web.com/m/n/o',
        method: 'post',
      });

      expect(mockLoggerInstance.info).toHaveBeenNthCalledWith(
        i + metadata.length,
        ' [DT] /m/n/o response',
        {
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
        },
      );
    });
  });

  test('post - when proper metadata(Array of strings,numbers) is sent should call logger without error', async () => {
    const metadata = [1, 2, '3'];
    const statTags = {
      metadata,
      destType: 'DT',
      feature: 'feat',
      endpointPath: '/m/n/o',
      requestMethod: 'post',
    };
    loggerUtil.getMatchedMetadata.mockReturnValue(statTags.metadata);

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

    expect(axios.post).toHaveBeenCalledWith(
      'https://some.web.com/m/n/o',
      {},
      expect.objectContaining({}),
    );

    expect(mockLoggerInstance.info).toHaveBeenCalledTimes(0);
  });

  test('get - when proper metadata(Array of strings,numbers) is sent should call logger without error', async () => {
    const metadata = [1, 2, '3'];
    const statTags = {
      metadata,
      destType: 'DT',
      feature: 'feat',
      endpointPath: '/m/n/o',
      requestMethod: 'post',
    };
    loggerUtil.getMatchedMetadata.mockReturnValue(statTags.metadata);

    axios.get.mockResolvedValueOnce({
      status: 200,
      data: { a: 1, b: 2, c: 'abc' },
      headers: {
        'Content-Type': 'apllication/json',
        'X-Some-Header': 'headsome',
      },
    });
    await expect(httpGET('https://some.web.com/m/n/o', {}, statTags)).resolves.not.toThrow(Error);
    expect(loggerUtil.getMatchedMetadata).toHaveBeenCalledTimes(2);

    expect(axios.get).toHaveBeenCalledWith(
      'https://some.web.com/m/n/o',
      expect.objectContaining({}),
    );

    expect(mockLoggerInstance.info).toHaveBeenCalledTimes(0);
  });

  test('constructor - when proper metadata(Array of strings,numbers) is sent should call logger without error', async () => {
    const metadata = [1, 2, '3'];
    const statTags = {
      metadata,
      destType: 'DT',
      feature: 'feat',
      endpointPath: '/m/n/o',
      requestMethod: 'post',
    };
    loggerUtil.getMatchedMetadata.mockReturnValue(statTags.metadata);

    axios.mockResolvedValueOnce({
      status: 200,
      data: { a: 1, b: 2, c: 'abc' },
      headers: {
        'Content-Type': 'apllication/json',
        'X-Some-Header': 'headsome',
      },
    });
    await expect(
      httpSend({ url: 'https://some.web.com/m/n/o', method: 'get' }, statTags),
    ).resolves.not.toThrow(Error);
    expect(loggerUtil.getMatchedMetadata).toHaveBeenCalledTimes(2);

    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'https://some.web.com/m/n/o',
        method: 'get',
      }),
    );

    expect(mockLoggerInstance.info).toHaveBeenCalledTimes(0);
  });
});
