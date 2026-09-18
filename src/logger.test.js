// the capture allowlist is parsed at module load in util/logger; set it
// before any require so the S3-capture branch is exercisable
process.env.LOG_DEST_IDS = 'd1';

const mockLoggerInstance = {
  event: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  setLogLevel: jest.fn(),
};

jest.mock('./util/payloadCapture', () => ({
  payloadCapture: { write: jest.fn() },
}));

// eslint-disable-next-line import/order
const { payloadCapture } = require('./util/payloadCapture');

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

  test('hands allowlisted metadata to payload capture with the requestId', () => {
    logger.setLogLevel('info');
    logger.requestLog('BRAZE proxy request', { metadata, requestDetails, requestId: 'r1' });
    expect(payloadCapture.write).toHaveBeenCalledWith({
      kind: 'request',
      identifierMsg: 'BRAZE proxy request',
      metadata: [metadata],
      details: requestDetails,
      requestId: 'r1',
    });
    logger.responseLog('BRAZE proxy response', { metadata, responseDetails, requestId: 'r1' });
    expect(payloadCapture.write).toHaveBeenCalledWith({
      kind: 'response',
      identifierMsg: 'BRAZE proxy response',
      metadata: [metadata],
      details: responseDetails,
      requestId: 'r1',
    });
  });

  test('does not hand non-allowlisted metadata to payload capture, but still event-logs', () => {
    logger.setLogLevel('event');
    const otherMetadata = { destinationId: 'not-allowlisted', workspaceId: 'w1' };
    logger.requestLog('BRAZE proxy request', { metadata: otherMetadata, requestDetails });
    expect(payloadCapture.write).not.toHaveBeenCalled();
    expect(mockLoggerInstance.event).toHaveBeenCalledTimes(1);
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
