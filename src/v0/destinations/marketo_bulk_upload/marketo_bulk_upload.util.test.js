const {
  handleCommonErrorResponse,
  handlePollResponse,
  handleFileUploadResponse,
} = require('./util');

const { AbortedError, RetryableError } = require('../../util/errorTypes');

describe('handleCommonErrorResponse', () => {
  test('should throw AbortedError for abortable error codes', () => {
    const resp = {
      response: {
        errors: [{ code: 1003, message: 'Aborted' }],
      },
    };
    expect(() => handleCommonErrorResponse(resp, 'OpErrorMessage', 'OpActivity')).toThrow(
      AbortedError,
    );
  });

  test('should throw ThrottledError for throttled error codes', () => {
    const resp = {
      response: {
        errors: [{ code: 615, message: 'Throttled' }],
      },
    };
    expect(() => handleCommonErrorResponse(resp, 'OpErrorMessage', 'OpActivity')).toThrow(
      RetryableError,
    );
  });

  test('should throw RetryableError for other error codes', () => {
    const resp = {
      response: {
        errors: [{ code: 2000, message: 'Retryable' }],
      },
    };
    expect(() => handleCommonErrorResponse(resp, 'OpErrorMessage', 'OpActivity')).toThrow(
      RetryableError,
    );
  });

  test('should throw RetryableError by default', () => {
    const resp = {
      response: {
        errors: [],
      },
    };
    expect(() => handleCommonErrorResponse(resp, 'OpErrorMessage', 'OpActivity')).toThrow(
      RetryableError,
    );
  });
});

describe('handlePollResponse', () => {
  // Tests that the function returns the response object if the polling operation was successful
  it('should return the response object when the polling operation was successful', () => {
    const pollStatus = {
      response: {
        success: true,
        result: [
          {
            batchId: '123',
            status: 'Complete',
            numOfLeadsProcessed: 2,
            numOfRowsFailed: 1,
            numOfRowsWithWarning: 0,
            message: 'Import completed with errors, 2 records imported (2 members), 1 failed',
          },
        ],
      },
    };

    const result = handlePollResponse(pollStatus);

    expect(result).toEqual(pollStatus.response);
  });

  // Tests that the function throws an AbortedError if the response contains an abortable error code
  it('should throw an AbortedError when the response contains an abortable error code', () => {
    const pollStatus = {
      response: {
        errors: [
          {
            code: 1003,
            message: 'Empty file',
          },
        ],
      },
    };

    expect(() => handlePollResponse(pollStatus)).toThrow(AbortedError);
  });

  // Tests that the function throws a ThrottledError if the response contains a throttled error code
  it('should throw a ThrottledError when the response contains a throttled error code', () => {
    const pollStatus = {
      response: {
        errors: [
          {
            code: 615,
            message: 'Exceeded concurrent usage limit',
          },
        ],
      },
    };

    expect(() => handlePollResponse(pollStatus)).toThrow(RetryableError);
  });

  // Tests that the function throws a RetryableError if the response contains an error code that is not abortable or throttled
  it('should throw a RetryableError when the response contains an error code that is not abortable or throttled', () => {
    const pollStatus = {
      response: {
        errors: [
          {
            code: 601,
            message: 'Unauthorized',
          },
        ],
      },
    };

    expect(() => handlePollResponse(pollStatus)).toThrow(RetryableError);
  });

  // Tests that the function returns null if the polling operation was not successful
  it('should return null when the polling operation was not successful', () => {
    const pollStatus = {
      response: {
        success: false,
      },
    };

    const result = handlePollResponse(pollStatus);

    expect(result).toBeNull();
  });
});

describe('handleFileUploadResponse', () => {
  // Tests that the function returns an object with importId, successfulJobs, and unsuccessfulJobs when the response indicates a successful upload.
  it('should return an object with importId, successfulJobs, and unsuccessfulJobs when the response indicates a successful upload', () => {
    const resp = {
      response: {
        success: true,
        result: [
          {
            importId: '3404',
            status: 'Queued',
          },
        ],
      },
    };
    const successfulJobs = [];
    const unsuccessfulJobs = [];
    const requestTime = 100;

    const result = handleFileUploadResponse(resp, successfulJobs, unsuccessfulJobs, requestTime);

    expect(result).toEqual({
      importId: '3404',
      successfulJobs: [],
      unsuccessfulJobs: [],
    });
  });

  // Tests that the function throws a RetryableError when the response indicates an empty file.
  it('should throw a RetryableError when the response indicates an empty file', () => {
    const resp = {
      response: {
        errors: [
          {
            code: '1003',
            message: 'Empty File',
          },
        ],
      },
    };
    const successfulJobs = [];
    const unsuccessfulJobs = [];
    const requestTime = 100;

    expect(() => {
      handleFileUploadResponse(resp, successfulJobs, unsuccessfulJobs, requestTime);
    }).toThrow(RetryableError);
  });

  // Tests that the function throws a RetryableError when the response indicates more than 10 concurrent uses.
  it('should throw a RetryableError when the response indicates more than 10 concurrent uses', () => {
    const resp = {
      response: {
        errors: [
          {
            code: '615',
            message: 'Concurrent Use Limit Exceeded',
          },
        ],
      },
    };
    const successfulJobs = [];
    const unsuccessfulJobs = [];
    const requestTime = 100;

    expect(() => {
      handleFileUploadResponse(resp, successfulJobs, unsuccessfulJobs, requestTime);
    }).toThrow(RetryableError);
  });

  // Tests that the function throws a RetryableError when the response contains an error code between 1000 and 1077.
  it('should throw a Aborted when the response contains an error code between 1000 and 1077', () => {
    const resp = {
      response: {
        errors: [
          {
            code: 1001,
            message: 'Some Error',
          },
        ],
      },
    };
    const successfulJobs = [];
    const unsuccessfulJobs = [];
    const requestTime = 100;

    expect(() => {
      handleFileUploadResponse(resp, successfulJobs, unsuccessfulJobs, requestTime);
    }).toThrow(AbortedError);
  });
});
