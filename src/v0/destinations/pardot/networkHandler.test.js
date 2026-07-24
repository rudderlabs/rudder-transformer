const { NetworkError } = require('@rudderstack/integrations-lib');
const { networkHandler } = require('./networkHandler');
const tags = require('../../util/tags');

const getHandler = () => new networkHandler();

describe('Pardot responseHandler', () => {
  it('should emit a retryable 500 for successful destination responses without @attributes', () => {
    const handler = getHandler();
    const destinationResponse = {
      status: 202,
      response: {
        message: 'Accepted but missing Pardot attributes',
      },
    };

    try {
      handler.responseHandler({ destinationResponse });
    } catch (error) {
      expect(error).toBeInstanceOf(NetworkError);
      expect(error.message).toBe(
        '{"message":"Accepted but missing Pardot attributes"} during Pardot response transformation',
      );
      expect(error.status).toBe(500);
      expect(error.destinationResponse).toEqual(destinationResponse.response);
      expect(error.statTags).toEqual({
        [tags.TAG_NAMES.ERROR_CATEGORY]: tags.ERROR_CATEGORIES.NETWORK,
        [tags.TAG_NAMES.ERROR_TYPE]: tags.ERROR_TYPES.RETRYABLE,
      });
      return;
    }

    throw new Error('Expected responseHandler to throw');
  });

  it('should preserve the destination status for non-2xx responses without @attributes', () => {
    const handler = getHandler();
    const destinationResponse = {
      status: 404,
      response: {
        error: 'Not Found',
      },
    };

    try {
      handler.responseHandler({ destinationResponse });
    } catch (error) {
      expect(error).toBeInstanceOf(NetworkError);
      expect(error.message).toBe('{"error":"Not Found"} during Pardot response transformation');
      expect(error.status).toBe(404);
      expect(error.destinationResponse).toEqual(destinationResponse.response);
      expect(error.statTags).toEqual({
        [tags.TAG_NAMES.ERROR_CATEGORY]: tags.ERROR_CATEGORIES.NETWORK,
        [tags.TAG_NAMES.ERROR_TYPE]: tags.ERROR_TYPES.ABORTED,
      });
      return;
    }

    throw new Error('Expected responseHandler to throw');
  });
});
