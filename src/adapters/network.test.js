const mockLoggerInstance = {
  info: jest.fn(),
  error: jest.fn(),
};
const {
  getFormData,
  httpPOST,
  httpGET,
  httpSend,
  fireHTTPStats,
  proxyRequest,
  prepareProxyRequest,
  handleHttpRequest,
  httpDELETE,
  httpPUT,
  httpPATCH,
  getPayloadData,
  getZippedPayload,
} = require('./network');
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

const { PlatformError } = require('@rudderstack/integrations-lib');

// Mock the axios module
jest.mock('axios', () => {
  const mockAxios = jest.fn(); // Mock the default axios function
  mockAxios.get = jest.fn(); // Mock axios.get
  mockAxios.post = jest.fn(); // Mock axios.post
  mockAxios.put = jest.fn(); // Mock axios.put
  mockAxios.patch = jest.fn(); // Mock axios.patch
  mockAxios.delete = jest.fn(); // Mock axios.delete

  // Mock the axios.create method if needed
  mockAxios.create = jest.fn(() => mockAxios);

  return mockAxios; // Return the mocked axios
});

const axios = require('axios');

jest.mock('../util/logger', () => ({
  ...jest.requireActual('../util/logger'),
  getMatchedMetadata: jest.fn(),
}));

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
    const metadataArray = [
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
    ];
    const statTags = {
      metadata: metadataArray,
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
      destinationId: 'd1',
      workspaceId: 'w1',
      sourceId: 's1',
      feature: 'feat',
      module: '',
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

    expect(stats.timing).toHaveBeenCalledTimes(1);
    expect(stats.timing).toHaveBeenNthCalledWith(1, 'outgoing_request_latency', startTime, {
      destType: 'DT',
      feature: 'feat',
      module: '',
      endpointPath: '/some/url',
      requestMethod: 'post',
    });
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

    expect(stats.timing).toHaveBeenCalledTimes(1);
    expect(stats.timing).toHaveBeenNthCalledWith(1, 'outgoing_request_latency', startTime, {
      destType: 'DT',
      feature: 'feat',
      module: '',
      endpointPath: '/some/url',
      requestMethod: 'post',
    });
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

    expect(stats.timing).toHaveBeenCalledTimes(1);
    expect(stats.timing).toHaveBeenNthCalledWith(1, 'outgoing_request_latency', startTime, {
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

  // Additional tests for the simplified fireHTTPStats function
  it('should handle null metadata correctly', () => {
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
      metadata: null,
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

  it('should handle string metadata correctly', () => {
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
      metadata: 'test-metadata',
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

  it('should handle boolean metadata correctly', () => {
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
      metadata: true,
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

  it('should handle complex nested object metadata correctly', () => {
    const clientResponse = {
      success: true,
      response: {
        data: { a: 1, b: 2 },
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    };
    const startTime = new Date();
    const complexMetadata = {
      destType: 'DT',
      destinationId: 'd1',
      workspaceId: 'w1',
      sourceId: 's1',
      nested: {
        level1: {
          level2: 'deep-value',
        },
      },
      array: [1, 2, { nested: 'value' }],
    };
    const statTags = {
      metadata: complexMetadata,
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
      destinationId: 'd1',
      workspaceId: 'w1',
      sourceId: 's1',
      feature: 'feat',
      module: '',
      endpointPath: '/some/url',
      requestMethod: 'post',
    });
  });

  it('should handle mixed array metadata correctly', () => {
    const clientResponse = {
      success: true,
      response: {
        data: { a: 1, b: 2 },
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    };
    const startTime = new Date();
    const mixedMetadata = [
      { destType: 'DT', id: 1 },
      'string-value',
      42,
      null,
      { nested: { value: 'test' } },
    ];
    const statTags = {
      metadata: mixedMetadata,
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

describe('httpDELETE tests', () => {
  beforeEach(() => {
    mockLoggerInstance.info.mockClear();
    loggerUtil.getMatchedMetadata.mockClear();
    axios.delete.mockClear();
  });

  test('should call axios.delete with correct parameters and log request/response', async () => {
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
      requestMethod: 'delete',
    };
    loggerUtil.getMatchedMetadata.mockReturnValue([statTags.metadata]);

    axios.delete.mockResolvedValueOnce({
      status: 200,
      data: { a: 1, b: 2, c: 'abc' },
      headers: {
        'Content-Type': 'application/json',
        'X-Some-Header': 'headsome',
      },
    });

    await expect(httpDELETE('https://some.web.com/m/n/o', {}, statTags)).resolves.not.toThrow(
      Error,
    );
    expect(loggerUtil.getMatchedMetadata).toHaveBeenCalledTimes(2);
    expect(mockLoggerInstance.info).toHaveBeenCalledTimes(2);

    expect(mockLoggerInstance.info).toHaveBeenNthCalledWith(1, ' [DT] /m/n/o request', {
      body: undefined,
      destType: 'DT',
      destinationId: 'd1',
      workspaceId: 'w1',
      sourceId: 's1',
      url: 'https://some.web.com/m/n/o',
      method: 'delete',
    });

    expect(mockLoggerInstance.info).toHaveBeenNthCalledWith(2, ' [DT] /m/n/o response', {
      destType: 'DT',
      destinationId: 'd1',
      workspaceId: 'w1',
      sourceId: 's1',
      body: { a: 1, b: 2, c: 'abc' },
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Some-Header': 'headsome',
      },
    });
  });
});

describe('httpPUT tests', () => {
  beforeEach(() => {
    mockLoggerInstance.info.mockClear();
    loggerUtil.getMatchedMetadata.mockClear();
    axios.put.mockClear();
  });

  test('should call axios.put with correct parameters and log request/response', async () => {
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
      requestMethod: 'put',
    };
    loggerUtil.getMatchedMetadata.mockReturnValue([statTags.metadata]);

    axios.put.mockResolvedValueOnce({
      status: 200,
      data: { a: 1, b: 2, c: 'abc' },
      headers: {
        'Content-Type': 'application/json',
        'X-Some-Header': 'headsome',
      },
    });

    await expect(httpPUT('https://some.web.com/m/n/o', {}, {}, statTags)).resolves.not.toThrow(
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
      method: 'put',
    });

    expect(mockLoggerInstance.info).toHaveBeenNthCalledWith(2, ' [DT] /m/n/o response', {
      destType: 'DT',
      destinationId: 'd1',
      workspaceId: 'w1',
      sourceId: 's1',
      body: { a: 1, b: 2, c: 'abc' },
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Some-Header': 'headsome',
      },
    });
  });
});

describe('httpPATCH tests', () => {
  beforeEach(() => {
    mockLoggerInstance.info.mockClear();
    loggerUtil.getMatchedMetadata.mockClear();
    axios.patch.mockClear();
  });

  test('should call axios.patch with correct parameters and log request/response', async () => {
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
      requestMethod: 'patch',
    };
    loggerUtil.getMatchedMetadata.mockReturnValue([statTags.metadata]);

    axios.patch.mockResolvedValueOnce({
      status: 200,
      data: { a: 1, b: 2, c: 'abc' },
      headers: {
        'Content-Type': 'application/json',
        'X-Some-Header': 'headsome',
      },
    });

    await expect(httpPATCH('https://some.web.com/m/n/o', {}, {}, statTags)).resolves.not.toThrow(
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
      method: 'patch',
    });

    expect(mockLoggerInstance.info).toHaveBeenNthCalledWith(2, ' [DT] /m/n/o response', {
      destType: 'DT',
      destinationId: 'd1',
      workspaceId: 'w1',
      sourceId: 's1',
      body: { a: 1, b: 2, c: 'abc' },
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Some-Header': 'headsome',
      },
    });
  });
});

describe('getPayloadData tests', () => {
  test('should return payload and payloadFormat for non-empty body', () => {
    const body = {
      JSON: { key: 'value' },
      XML: null,
      FORM: null,
    };
    const result = getPayloadData(body);
    expect(result).toEqual({ payload: { key: 'value' }, payloadFormat: 'JSON' });
  });

  test('should return undefined payload and payloadFormat for empty body', () => {
    const body = {};
    const result = getPayloadData(body);
    expect(result).toEqual({ payload: undefined, payloadFormat: undefined });
  });
});

describe('prepareProxyRequest tests', () => {
  const testCases = [
    {
      name: 'should prepare proxy request with correct headers and payload',
      input: {
        body: { JSON: { key: 'value' } },
        method: 'POST',
        params: { param1: 'value1' },
        endpoint: 'https://example.com',
        headers: { 'Content-Type': 'application/json' },
        destinationConfig: { key: 'value' },
      },
      expected: {
        endpoint: 'https://example.com',
        data: { key: 'value' },
        params: { param1: 'value1' },
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'RudderLabs',
        },
        method: 'POST',
        config: { key: 'value' },
      },
    },
    {
      name: 'should prepare proxy request when body is empty',
      input: {
        body: {},
        method: 'GET',
        params: { param1: 'value1' },
        endpoint: 'https://example.com',
        destinationConfig: { key: 'value' },
      },
      expected: {
        endpoint: 'https://example.com',
        params: { param1: 'value1' },
        headers: {
          'User-Agent': 'RudderLabs',
        },
        method: 'GET',
        config: { key: 'value' },
      },
    },
    {
      name: 'should prepare proxy request when body contains in valid payload format',
      input: {
        body: { abc: 'value' },
        method: 'PUT',
        params: { param1: 'value1' },
        endpoint: 'https://example.com',
        destinationConfig: { key: 'value' },
      },
      expected: {
        endpoint: 'https://example.com',
        params: { param1: 'value1' },
        headers: {
          'User-Agent': 'RudderLabs',
        },
        method: 'PUT',
        config: { key: 'value' },
      },
    },
  ];

  testCases.forEach(({ name, input, expected }) => {
    test(name, async () => {
      const result = await prepareProxyRequest(input);
      expect(result).toEqual(expected);
    });
  });
  // Special case for FORM payload string verification
  test('should prepare proxy request when body contains FORM payload', async () => {
    const request = {
      body: {
        FORM: {
          field1: 'value1',
          field2: 'value2',
        },
      },
      method: 'POST',
      endpoint: 'https://example.com',
    };

    const result = await prepareProxyRequest(request);
    const formData = result.data.toString();

    expect(formData).toContain('field1=value1');
    expect(formData).toContain('field2=value2');
  });
});

describe('prepareProxyRequest - GZIP payload', () => {
  const testCases = [
    {
      name: 'should prepare proxy request when gzip payload is correct',
      input: {
        body: {
          GZIP: {
            payload: '{"key":"value"}',
          },
        },
        method: 'POST',
        endpoint: 'https://api.example.com/gzip',
        headers: { 'Content-Type': 'application/json' },
        destinationConfig: { apiKey: 'test-key' },
      },
      expected: {
        endpoint: 'https://api.example.com/gzip',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Encoding': 'gzip',
          'User-Agent': 'RudderLabs',
        },
        config: { apiKey: 'test-key' },
      },
    },
    {
      name: 'should throw an platform error when gzip payload is not correct',
      input: {
        body: {
          GZIP: {
            payload: { key: 'value' },
          },
        },
        method: 'POST',
        endpoint: 'https://api.example.com/gzip',
        headers: { 'Content-Type': 'application/json' },
        destinationConfig: { apiKey: 'test-key' },
      },
      expected: {
        error:
          'Failed to do GZIP compression: TypeError [ERR_INVALID_ARG_TYPE]: The \"chunk\" argument must be of type string or an instance of Buffer, TypedArray, or DataView. Received an instance of Object',
      },
    },
  ];
  testCases.forEach(({ name, input, expected }) => {
    test(name, async () => {
      if (expected.error) {
        expect.assertions(3);
        try {
          await prepareProxyRequest(input);
        } catch (error) {
          expect(error).toBeInstanceOf(PlatformError);
          expect(error.status).toEqual(400);
          expect(error.message).toEqual(expected.error);
        }
      } else {
        testCases[0].expected.data = await getZippedPayload('{"key":"value"}');
        const result = await prepareProxyRequest(input);
        expect(result).toEqual(expected);
      }
    });
  });
});

describe('handleHttpRequest tests', () => {
  beforeEach(() => {
    axios.post.mockClear();
    axios.get.mockClear();
    axios.put.mockClear();
    axios.patch.mockClear();
    axios.delete.mockClear();
  });

  test('should handle POST request correctly', async () => {
    axios.post.mockResolvedValueOnce({
      status: 200,
      data: { key: 'value' },
    });

    const result = await handleHttpRequest('post', 'https://example.com', { key: 'value' }, {});
    expect(result.httpResponse).toEqual({
      success: true,
      response: { status: 200, data: { key: 'value' } },
    });
    expect(result.processedResponse).toBeDefined();
  });

  test('should handle GET request correctly', async () => {
    axios.get.mockResolvedValueOnce({
      status: 200,
      data: { key: 'value' },
    });

    const result = await handleHttpRequest('get', 'https://example.com', {});
    expect(result.httpResponse).toEqual({
      success: true,
      response: { status: 200, data: { key: 'value' } },
    });
    expect(result.processedResponse).toBeDefined();
  });

  test('should handle PUT request correctly', async () => {
    axios.put.mockResolvedValueOnce({
      status: 200,
      data: { key: 'value' },
    });

    const result = await handleHttpRequest('put', 'https://example.com', { key: 'value' }, {});
    expect(result.httpResponse).toEqual({
      success: true,
      response: { status: 200, data: { key: 'value' } },
    });
    expect(result.processedResponse).toBeDefined();
  });

  test('should handle PATCH request correctly', async () => {
    axios.patch.mockResolvedValueOnce({
      status: 200,
      data: { key: 'value' },
    });

    const result = await handleHttpRequest('patch', 'https://example.com', { key: 'value' }, {});
    expect(result.httpResponse).toEqual({
      success: true,
      response: { status: 200, data: { key: 'value' } },
    });
    expect(result.processedResponse).toBeDefined();
  });

  test('should handle DELETE request correctly', async () => {
    axios.delete.mockResolvedValueOnce({
      status: 200,
      data: { key: 'value' },
    });

    const result = await handleHttpRequest('delete', 'https://example.com', {});
    expect(result.httpResponse).toEqual({
      success: true,
      response: { status: 200, data: { key: 'value' } },
    });
    expect(result.processedResponse).toBeDefined();
  });
});

describe('proxyRequest tests', () => {
  beforeEach(() => {
    axios.mockClear();
  });

  test('should proxy request correctly', async () => {
    axios.mockResolvedValueOnce({
      status: 200,
      data: { key: 'value' },
    });

    const request = {
      body: { JSON: { key: 'value' } },
      method: 'POST',
      params: { param1: 'value1' },
      endpoint: 'https://example.com',
      headers: { 'Content-Type': 'application/json' },
      destinationConfig: { key: 'value' },
      metadata: { destType: 'DT' },
    };

    const result = await proxyRequest(request, 'DT');
    expect(result).toEqual({
      success: true,
      response: { status: 200, data: { key: 'value' } },
    });
  });
});
