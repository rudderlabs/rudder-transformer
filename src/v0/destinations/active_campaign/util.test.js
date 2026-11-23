const { HTTP_STATUS_CODES } = require('../../util/constant');
const { errorHandler, getNormalizedErrorStatus } = require('./util');
const { generateErrorObject } = require('../../util');

const RESPONSE_LIMIT_BYTES = 4 * 1024;
const TRUNCATED = '... [truncated]';
const ERROR_MESSAGE = 'Failed to create new contact';

const captureError = (body, status = 200, success = true) => {
  try {
    errorHandler({ success, response: { status, data: body } }, ERROR_MESSAGE);
  } catch (error) {
    return error;
  }
  throw new Error('errorHandler did not throw');
};

describe('getNormalizedErrorStatus', () => {
  // A 2xx here means the destination returned a success code with an unexpected/non-JSON body.
  // Emitting it as an error status would break the transformer -> rudder-server contract, so it
  // must be coerced to a retryable 5xx.
  it.each([200, 201, 202, 204, 299])('coerces a 2xx status (%i) to a retryable 500', (status) => {
    expect(getNormalizedErrorStatus(status)).toBe(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
  });

  // Genuine failures already carry a non-2xx status and must be passed through untouched.
  it.each([400, 401, 404, 422, 429, 500, 502, 503])(
    'leaves a non-2xx status (%i) unchanged',
    (status) => {
      expect(getNormalizedErrorStatus(status)).toBe(status);
    },
  );

  it('leaves statuses just outside the 2xx range unchanged', () => {
    expect(getNormalizedErrorStatus(199)).toBe(199);
    expect(getNormalizedErrorStatus(300)).toBe(300);
  });
});

describe('errorHandler response budget', () => {
  it.each([
    { name: 'short HTML', body: '<html>login</html>' },
    { name: 'short structured error', body: { errors: [{ title: 'Bad key' }] } },
    { name: 'string at the exact rendered byte limit', body: 'a'.repeat(RESPONSE_LIMIT_BYTES - 2) },
    {
      name: 'object at the exact byte limit',
      body: { error: 'a'.repeat(RESPONSE_LIMIT_BYTES - 12) },
    },
  ])('preserves $name without truncation', ({ body }) => {
    const error = captureError(body);
    expect(error.message).toBe(`${ERROR_MESSAGE} (undefined,${JSON.stringify(body)})`);
    expect(error.destinationResponse).toEqual(body);
    expect(error.status).toBe(500);
    expect(error.statTags.errorType).toBe('retryable');
  });

  it('truncates a wrapped successful 200 HTML login page in both surfaced fields', () => {
    const body = `<html>${'🌍'.repeat(5000)}</html>`;
    const error = captureError(body);
    const surfaced = generateErrorObject(error);
    expect(error.destinationResponse).toContain('<html>');
    expect(error.destinationResponse).toContain(TRUNCATED);
    expect(error.destinationResponse).not.toContain('</html>');
    expect(Buffer.byteLength(error.destinationResponse, 'utf8')).toBeLessThanOrEqual(
      RESPONSE_LIMIT_BYTES,
    );
    expect(Buffer.byteLength(error.message, 'utf8')).toBeLessThanOrEqual(
      Buffer.byteLength(`${ERROR_MESSAGE} (undefined,)`, 'utf8') + RESPONSE_LIMIT_BYTES,
    );
    expect(error.message).toContain(TRUNCATED);
    expect(surfaced.message).toContain(TRUNCATED);
    expect(JSON.parse(surfaced.message).destinationResponse).toBe(error.destinationResponse);
    expect(error.status).toBe(500);
    expect(error.statTags.errorType).toBe('retryable');
  });

  it.each([
    { name: 'object', body: { error: 'x'.repeat(100000) } },
    { name: 'array', body: Array.from({ length: 10000 }, () => ({ error: 'bad key' })) },
    { name: 'escaped small strings', body: Array.from({ length: 3000 }, () => '\\n') },
  ])('replaces oversized $name with a bounded marker', ({ body }) => {
    const error = captureError(body, 503, false);
    expect(error.message).toBe(
      `${ERROR_MESSAGE} (undefined,"[truncated ActiveCampaign response]")`,
    );
    expect(error.destinationResponse).toBe('[truncated ActiveCampaign response]');
    expect(error.destinationResponse).not.toBe(body);
    expect(error.status).toBe(503);
    expect(error.statTags.errorType).toBe('retryable');
    expect(Buffer.byteLength(generateErrorObject(error).message, 'utf8')).toBeLessThan(1024);
  });

  it('preserves genuine non-2xx status and classification for a small response', () => {
    const body = { message: 'Invalid API key' };
    const error = captureError(body, 401, false);
    expect(error.message).toBe(`${ERROR_MESSAGE} (undefined,${JSON.stringify(body)})`);
    expect(error.destinationResponse).toEqual(body);
    expect(error.status).toBe(401);
    expect(error.statTags.errorType).toBe('aborted');
  });
});
