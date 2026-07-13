const { HTTP_STATUS_CODES } = require('../../util/constant');
const { getNormalizedErrorStatus } = require('./util');

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
