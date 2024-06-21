const { getFormData, fireHTTPStats } = require('./network');
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
