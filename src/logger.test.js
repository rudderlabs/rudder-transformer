const mockLoggerInstance = {
  event: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  setLogLevel: jest.fn(),
};

jest.mock('@rudderstack/integrations-lib', () => ({
  ...jest.requireActual('@rudderstack/integrations-lib'),
  // mirrors the lib's LOGLEVELS including the `event` level; keep in sync
  LOGLEVELS: { event: 4, debug: 3, info: 2, warn: 1, error: 0, none: -1 },
  structuredLogger: () => mockLoggerInstance,
}));

const logger = require('./logger');

const metadata = { destinationId: 'd1', workspaceId: 'w1', destType: 'BRAZE' };
const requestDetails = {
  url: 'https://api.example.com/track',
  body: { events: [{ name: 'purchase' }] },
  method: 'POST',
};
const responseDetails = {
  body: { ok: true },
  status: 200,
  headers: { 'content-type': 'application/json' },
};

afterEach(() => {
  logger.setLogLevel('info');
  jest.clearAllMocks();
});

describe('event level gating', () => {
  test('event logs are suppressed at info level', () => {
    logger.setLogLevel('info');
    logger.event('some event');
    expect(mockLoggerInstance.event).not.toHaveBeenCalled();
  });

  test('event logs are suppressed at debug level', () => {
    logger.setLogLevel('debug');
    logger.event('some event');
    expect(mockLoggerInstance.event).not.toHaveBeenCalled();
  });

  test('event logs are emitted at event level', () => {
    logger.setLogLevel('event');
    logger.event('some event');
    expect(mockLoggerInstance.event).toHaveBeenCalledWith(' some event');
  });
});

describe('requestLog / responseLog', () => {
  test('does not log payloads at info level', () => {
    logger.setLogLevel('info');
    logger.requestLog('BRAZE proxy request', { metadata, requestDetails });
    logger.responseLog('BRAZE proxy response', { metadata, responseDetails });
    expect(mockLoggerInstance.event).not.toHaveBeenCalled();
    expect(mockLoggerInstance.info).not.toHaveBeenCalled();
    expect(mockLoggerInstance.warn).not.toHaveBeenCalled();
  });

  test('logs request payload at event level with no allowlist dependency', () => {
    logger.setLogLevel('event');
    logger.requestLog('BRAZE proxy request', { metadata, requestDetails });
    expect(mockLoggerInstance.event).toHaveBeenCalledTimes(1);
    expect(mockLoggerInstance.event).toHaveBeenCalledWith(' BRAZE proxy request', {
      destinationId: 'd1',
      workspaceId: 'w1',
      destType: 'BRAZE',
      url: 'https://api.example.com/track',
      body: { events: [{ name: 'purchase' }] },
      method: 'POST',
    });
    expect(mockLoggerInstance.info).not.toHaveBeenCalled();
  });

  test('logs response payload at event level with no allowlist dependency', () => {
    logger.setLogLevel('event');
    logger.responseLog('BRAZE proxy response', { metadata, responseDetails });
    expect(mockLoggerInstance.event).toHaveBeenCalledTimes(1);
    expect(mockLoggerInstance.event).toHaveBeenCalledWith(' BRAZE proxy response', {
      destinationId: 'd1',
      workspaceId: 'w1',
      destType: 'BRAZE',
      body: { ok: true },
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
    expect(mockLoggerInstance.info).not.toHaveBeenCalled();
  });
});
