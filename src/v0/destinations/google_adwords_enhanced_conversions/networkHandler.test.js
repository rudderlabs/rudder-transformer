const { NetworkError } = require('@rudderstack/integrations-lib');
const { networkHandler } = require('./networkHandler');

describe('google adwords enhanced conversions - responseHandler', () => {
  const { responseHandler } = new networkHandler();

  it('should treat a 200 response with an undefined body as success (no partial failure)', () => {
    // Google Ads returns a 200 with an empty/absent body when an upload fully
    // succeeds. Previously this crashed while destructuring partialFailureError.
    const destinationResponse = { status: 200, response: undefined };

    const result = responseHandler({ destinationResponse });

    expect(result).toEqual({
      status: 200,
      message: 'Request Processed Successfully',
      destinationResponse,
    });
  });

  it('should treat a 200 response with a partialFailureError of code 0 as success', () => {
    const destinationResponse = {
      status: 200,
      response: { partialFailureError: { code: 0 } },
    };

    const result = responseHandler({ destinationResponse });

    expect(result).toEqual({
      status: 200,
      message: 'Request Processed Successfully',
      destinationResponse,
    });
  });

  it('should throw a NetworkError when a 200 response carries a non-zero partialFailureError', () => {
    const destinationResponse = {
      status: 200,
      response: { partialFailureError: { code: 3, message: 'partial failure' } },
    };

    expect(() => responseHandler({ destinationResponse })).toThrow(NetworkError);
  });
});
