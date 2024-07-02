const mockLoggerInstance = {
  info: jest.fn(),
};
const { getFormData, httpPOST, httpGET, httpSend, fireHTTPStats } = require('./network');
const { getFuncTestData } = require('../../test/testHelper');
jest.mock('../util/stats', () => ({
  timing: jest.fn(),
  timingSummary: jest.fn(),
  increment: jest.fn(),
  counter: jest.fn(),
  gauge: jest.fn(),
  histogram: jest.fn(),
}));
const stats = require('../util/stats');

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

describe('fireHTTPStats tests', () => {
  beforeEach(() => {
    stats.timing.mockClear();
    stats.counter.mockClear();
  });
  it('should not throw error when metadata is sent as correctly defined object', () => {
    const clientResponse = {
      success: true,
      response: {
        data: { a: 1, b: 2 },
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    };
    const startTime = new Date();
    const statTags = {
      metadata: {
        destType: 'DT',
        destinationId: 'd1',
        workspaceId: 'w1',
        sourceId: 's1',
      },
      destType: 'DT',
      feature: 'feat',
      endpointPath: '/some/url',
      requestMethod: 'post',
    };
    expect(() => {
      fireHTTPStats(clientResponse, startTime, statTags);
    }).not.toThrow(Error);
    expect(stats.timing).toHaveBeenCalledTimes(1);
    expect(stats.timing).toHaveBeenNthCalledWith(1, 'outgoing_request_latency', startTime, {
      destinationId: 'd1',
      workspaceId: 'w1',
      sourceId: 's1',
      destType: 'DT',
      feature: 'feat',
      module: '',
      endpointPath: '/some/url',
      requestMethod: 'post',
    });
  });
  it('should not throw error when metadata is sent as correctly defined object[]', () => {
    const clientResponse = {
      success: false,
      response: {
        response: {
          data: { errors: [{ e: 'something went bad' }] },
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      },
    };
    const startTime = new Date();
    const statTags = {
      metadata: [
        {
          destType: 'DT',
          destinationId: 'd1',
          workspaceId: 'w1',
          jobId: 1,
          sourceId: 's1',
        },
        {
          destType: 'DT',
          jobId: 2,
          destinationId: 'd1',
          workspaceId: 'w2',
          sourceId: 's2',
        },
      ],
      destType: 'DT',
      feature: 'feat',
      endpointPath: '/some/url',
      requestMethod: 'post',
    };
    expect(() => {
      fireHTTPStats(clientResponse, startTime, statTags);
    }).not.toThrow(Error);

    expect(stats.timing).toHaveBeenCalledTimes(2);
    expect(stats.timing).toHaveBeenNthCalledWith(1, 'outgoing_request_latency', startTime, {
      destinationId: 'd1',
      workspaceId: 'w1',
      sourceId: 's1',
      destType: 'DT',
      feature: 'feat',
      module: '',
      endpointPath: '/some/url',
      requestMethod: 'post',
    });
    expect(stats.timing).toHaveBeenNthCalledWith(2, 'outgoing_request_latency', startTime, {
      destinationId: 'd1',
      workspaceId: 'w2',
      sourceId: 's2',
      destType: 'DT',
      module: '',
      feature: 'feat',
      endpointPath: '/some/url',
      requestMethod: 'post',
    });
  });
  it('should not throw error when metadata is not sent', () => {
    const clientResponse = {
      success: false,
      response: {
        response: {
          data: { errors: [{ e: 'something went bad' }] },
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      },
    };
    const startTime = new Date();
    const statTags = {
      destType: 'DT',
      feature: 'feat',
      endpointPath: '/some/url',
      requestMethod: 'post',
    };
    expect(() => {
      fireHTTPStats(clientResponse, startTime, statTags);
    }).not.toThrow(Error);

    expect(stats.timing).toHaveBeenCalledTimes(1);
    expect(stats.timing).toHaveBeenNthCalledWith(1, 'outgoing_request_latency', startTime, {
      destType: 'DT',
      feature: 'feat',
      module: '',
      endpointPath: '/some/url',
      requestMethod: 'post',
    });
  });
  it('should not throw error when metadata is sent as empty array', () => {
    const clientResponse = {
      success: false,
      response: {
        response: {
          data: { errors: [{ e: 'something went bad' }] },
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      },
    };
    const startTime = new Date();
    const statTags = {
      metadata: [],
      destType: 'DT',
      feature: 'feat',
      endpointPath: '/some/url',
      requestMethod: 'post',
    };
    expect(() => {
      fireHTTPStats(clientResponse, startTime, statTags);
    }).not.toThrow(Error);

    expect(stats.timing).toHaveBeenCalledTimes(0);
  });
  it('should not throw error when metadata is sent as empty object', () => {
    const clientResponse = {
      success: false,
      response: {
        response: {
          data: { errors: [{ e: 'something went bad' }] },
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      },
    };
    const startTime = new Date();
    const statTags = {
      metadata: {},
      destType: 'DT',
      feature: 'feat',
      endpointPath: '/some/url',
      requestMethod: 'post',
    };
    expect(() => {
      fireHTTPStats(clientResponse, startTime, statTags);
    }).not.toThrow(Error);

    expect(stats.timing).toHaveBeenCalledTimes(1);
    expect(stats.timing).toHaveBeenNthCalledWith(1, 'outgoing_request_latency', startTime, {
      destType: 'DT',
      feature: 'feat',
      module: '',
      endpointPath: '/some/url',
      requestMethod: 'post',
    });
  });
  it('should not throw error when metadata is sent as [null, null]', () => {
    const clientResponse = {
      success: false,
      response: {
        response: {
          data: { errors: [{ e: 'something went bad' }] },
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      },
    };
    const startTime = new Date();
    const statTags = {
      metadata: [null, null],
      destType: 'DT',
      feature: 'feat',
      endpointPath: '/some/url',
      requestMethod: 'post',
    };
    expect(() => {
      fireHTTPStats(clientResponse, startTime, statTags);
    }).not.toThrow(Error);

    expect(stats.timing).toHaveBeenCalledTimes(0);
  });
  it('should not throw error when metadata is sent as [1, 2]', () => {
    const clientResponse = {
      success: false,
      response: {
        response: {
          data: { errors: [{ e: 'something went bad' }] },
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      },
    };
    const startTime = new Date();
    const statTags = {
      metadata: [1, 2],
      destType: 'DT',
      feature: 'feat',
      endpointPath: '/some/url',
      requestMethod: 'post',
    };
    expect(() => {
      fireHTTPStats(clientResponse, startTime, statTags);
    }).not.toThrow(Error);

    expect(stats.timing).toHaveBeenCalledTimes(2);
    expect(stats.timing).toHaveBeenNthCalledWith(1, 'outgoing_request_latency', startTime, {
      destType: 'DT',
      feature: 'feat',
      module: '',
      endpointPath: '/some/url',
      requestMethod: 'post',
    });
    expect(stats.timing).toHaveBeenNthCalledWith(2, 'outgoing_request_latency', startTime, {
      destType: 'DT',
      feature: 'feat',
      module: '',
      endpointPath: '/some/url',
      requestMethod: 'post',
    });
  });
  it('should not throw error when metadata is sent as 1', () => {
    const clientResponse = {
      success: false,
      response: {
        response: {
          data: { errors: [{ e: 'something went bad' }] },
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      },
    };
    const startTime = new Date();
    const statTags = {
      metadata: 1,
      destType: 'DT',
      feature: 'feat',
      endpointPath: '/some/url',
      requestMethod: 'post',
    };
    expect(() => {
      fireHTTPStats(clientResponse, startTime, statTags);
    }).not.toThrow(Error);

    expect(stats.timing).toHaveBeenCalledTimes(1);
    expect(stats.timing).toHaveBeenNthCalledWith(1, 'outgoing_request_latency', startTime, {
      destType: 'DT',
      feature: 'feat',
      module: '',
      endpointPath: '/some/url',
      requestMethod: 'post',
    });
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
