const { sendToDestination, userTransformHandler } = require('./routerUtils'); // Update the path accordingly

const logger = require('./logger');
const { proxyRequest } = require('./adapters/network');
const { nodeSysErrorToStatus } = require('./adapters/utils/networkUtils');

// Mock dependencies
jest.mock('./logger');
jest.mock('./adapters/network');
jest.mock('./adapters/utils/networkUtils');

describe('sendToDestination', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it('should send a request to the destination and return a successful response', async () => {
    // Mock proxyRequest to return a successful response
    proxyRequest.mockResolvedValue({
      success: true,
      response: {
        headers: { 'content-type': 'application/json' },
        data: { message: 'Success' },
        status: 200,
      },
    });

    const destination = 'mock-destination';
    const payload = { key: 'value' };

    const result = await sendToDestination(destination, payload);

    expect(logger.info).toHaveBeenCalledWith('Request recieved for destination', destination);
    expect(proxyRequest).toHaveBeenCalledWith(payload);
    expect(result).toEqual({
      headers: { 'content-type': 'application/json' },
      response: { message: 'Success' },
      status: 200,
    });
  });

  it('should handle network failure and return a parsed response', async () => {
    // Mock proxyRequest to return a network failure
    proxyRequest.mockResolvedValue({
      success: false,
      response: {
        code: 'ENOTFOUND', // Simulate a network error
      },
    });

    // Mock nodeSysErrorToStatus to return a specific error message and status
    nodeSysErrorToStatus.mockReturnValue({
      message: 'Network error',
      status: 500,
    });

    const destination = 'mock-destination';
    const payload = { key: 'value' };

    const result = await sendToDestination(destination, payload);

    expect(logger.info).toHaveBeenCalledWith('Request recieved for destination', destination);
    expect(proxyRequest).toHaveBeenCalledWith(payload);
    expect(nodeSysErrorToStatus).toHaveBeenCalledWith('ENOTFOUND');
    expect(result).toEqual({
      headers: null,
      networkFailure: true,
      response: 'Network error',
      status: 500,
    });
  });

  it('should handle axios error with response and return a parsed response', async () => {
    // Mock proxyRequest to return an axios error with response
    proxyRequest.mockResolvedValue({
      success: false,
      response: {
        response: {
          headers: { 'content-type': 'application/json' },
          status: 400,
          data: 'Bad Request',
        },
      },
    });

    const destination = 'mock-destination';
    const payload = { key: 'value' };

    const result = await sendToDestination(destination, payload);

    expect(logger.info).toHaveBeenCalledWith('Request recieved for destination', destination);
    expect(proxyRequest).toHaveBeenCalledWith(payload);
    expect(result).toEqual({
      headers: { 'content-type': 'application/json' },
      status: 400,
      response: 'Bad Request',
    });
  });
});

describe('userTransformHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
    jest.resetModules(); // Reset modules to reset process.env
  });

  it('should return userTransformHandler when functions are enabled', () => {
    // Mock process.env to enable functions
    process.env.ENABLE_FUNCTIONS = 'true';

    const mockUserTransformHandler = jest.fn();
    jest.mock('./util/customTransformer', () => ({
      userTransformHandler: mockUserTransformHandler,
    }));

    const result = userTransformHandler();
    expect(result).toBe(mockUserTransformHandler);
  });

  it('should throw an error when functions are not enabled', () => {
    // Mock process.env to disable functions
    process.env.ENABLE_FUNCTIONS = 'false';

    expect(() => userTransformHandler()).toThrow('Functions are not enabled');
  });
});
