import { createBatchErrorChecker } from './utils';

describe('createBatchErrorChecker', () => {
  it('should return non-abortable function when failCount is 0', () => {
    const destinationResponse = {
      status: 200,
      response: {
        failCount: 0,
      },
    };

    const checkEventError = createBatchErrorChecker(destinationResponse);
    const event = {
      email: 'test@example.com',
      userId: 'user123',
      eventName: 'testEvent',
    };

    const result = checkEventError(event);
    expect(result).toEqual({ isAbortable: false, errorMsg: '' });
  });

  it('should handle undefined or null event fields gracefully', () => {
    const destinationResponse = {
      status: 200,
      response: {
        failCount: 1,
        invalidEmails: ['test@example.com'],
      },
    };

    const checkEventError = createBatchErrorChecker(destinationResponse);
    const event = {
      email: null,
      userId: undefined,
      eventName: 'testEvent',
    };

    const result = checkEventError(event);
    expect(result).toEqual({ isAbortable: false, errorMsg: '' });
  });

  it('should handle events with all expected fields present and return non-abortable when no match', () => {
    const destinationResponse = {
      status: 200,
      response: {
        failCount: 1,
        invalidEmails: ['another@example.com'],
      },
    };

    const checkEventError = createBatchErrorChecker(destinationResponse);
    const event = {
      email: 'test@example.com',
      userId: 'user123',
      eventName: 'purchase',
      id: 'event123',
      createdAt: '2023-10-01T00:00:00Z',
      campaignId: 'campaign123',
      templateId: 'template123',
      createNewFields: true,
      dataFields: { field1: 'value1' },
    };

    const result = checkEventError(event);
    expect(result.isAbortable).toBe(false);
    expect(result.errorMsg).toBe('');
  });

  it('should find the right value for which it should fail and passes otherwise for emails', () => {
    const destinationResponse = {
      status: 200,
      response: {
        failCount: 1,
        failedUpdates: {
          invalidEmails: ['test'],
        },
      },
    };

    const checkEventError = createBatchErrorChecker(destinationResponse);
    const event = {
      email: 'test',
      userId: 'user123',
      eventName: 'purchase',
      dataFields: { customField1: 'value1', customField2: 'value2' },
    };

    const result = checkEventError(event);
    expect(result).toEqual({
      isAbortable: true,
      errorMsg: 'email error:"test" in "failedUpdates.invalidEmails".',
    });
  });

  it('should find the right value for which it should fail', () => {
    const destinationResponse = {
      status: 200,
      response: {
        failCount: 1,
        invalidEmails: ['test@gmail.com'],
      },
    };

    const checkEventError = createBatchErrorChecker(destinationResponse);
    const event = {
      email: 'test@gmail.com',
      userId: 'user123',
      eventName: 'purchase',
      dataFields: { customField1: 'test', customField2: 'value2' },
    };

    const result = checkEventError(event);
    expect(result).toEqual({
      isAbortable: true,
      errorMsg: 'email error:"test@gmail.com" in "invalidEmails".',
    });
  });

  it('should handle multiple error paths for the same email', () => {
    const destinationResponse = {
      status: 200,
      response: {
        failCount: 1,
        invalidEmails: ['test@example.com'],
        failedUpdates: {
          invalidEmails: ['test@example.com'],
        },
      },
    };

    const checkEventError = createBatchErrorChecker(destinationResponse);
    const event = {
      email: 'test@example.com',
      userId: 'user123',
      eventName: 'purchase',
    };

    const result = checkEventError(event);
    expect(result).toEqual({
      isAbortable: true,
      errorMsg: 'email error:"test@example.com" in "invalidEmails,failedUpdates.invalidEmails".',
    });
  });

  it('should handle multiple error paths for the same userId', () => {
    const destinationResponse = {
      status: 200,
      response: {
        failCount: 1,
        invalidUserIds: ['user123'],
        failedUpdates: {
          invalidUserIds: ['user123'],
        },
      },
    };

    const checkEventError = createBatchErrorChecker(destinationResponse);
    const event = {
      email: 'test@example.com',
      userId: 'user123',
      eventName: 'purchase',
    };

    const result = checkEventError(event);
    expect(result).toEqual({
      isAbortable: true,
      errorMsg: 'userId error:"user123" in "invalidUserIds,failedUpdates.invalidUserIds".',
    });
  });

  it('should handle disallowed event names', () => {
    const destinationResponse = {
      status: 200,
      response: {
        failCount: 1,
        disallowedEventNames: ['blockedEvent'],
      },
    };

    const checkEventError = createBatchErrorChecker(destinationResponse);
    const event = {
      email: 'test@example.com',
      userId: 'user123',
      eventName: 'blockedEvent',
    };

    const result = checkEventError(event);
    expect(result).toEqual({
      isAbortable: true,
      errorMsg: 'eventName error:"blockedEvent" in "disallowedEventNames".',
    });
  });

  it('should combine multiple error types in the same event', () => {
    const destinationResponse = {
      status: 200,
      response: {
        failCount: 1,
        invalidEmails: ['test@example.com'],
        invalidUserIds: ['user123'],
        disallowedEventNames: ['blockedEvent'],
      },
    };

    const checkEventError = createBatchErrorChecker(destinationResponse);
    const event = {
      email: 'test@example.com',
      userId: 'user123',
      eventName: 'blockedEvent',
    };

    const result = checkEventError(event);
    expect(result).toEqual({
      isAbortable: true,
      errorMsg:
        'userId error:"user123" in "invalidUserIds".email error:"test@example.com" in "invalidEmails".eventName error:"blockedEvent" in "disallowedEventNames".',
    });
  });

  it('should handle performance benchmark scenario', () => {
    // Create a large response with many error entries
    const largeResponse = {
      status: 200,
      response: {
        failCount: 1,
        invalidEmails: Array.from({ length: 1000 }, (_, i) => `email${i}@example.com`),
        invalidUserIds: Array.from({ length: 1000 }, (_, i) => `user${i}`),
        disallowedEventNames: Array.from({ length: 100 }, (_, i) => `event${i}`),
        failedUpdates: {
          invalidEmails: Array.from({ length: 500 }, (_, i) => `failedEmail${i}@example.com`),
          invalidUserIds: Array.from({ length: 500 }, (_, i) => `failedUser${i}`),
        },
      },
    };

    const checkEventError = createBatchErrorChecker(largeResponse);
    const event = {
      email: 'email500@example.com',
      userId: 'user500',
      eventName: 'event50',
    };

    const result = checkEventError(event);
    expect(result).toEqual({
      isAbortable: true,
      errorMsg:
        'userId error:"user500" in "invalidUserIds".email error:"email500@example.com" in "invalidEmails".eventName error:"event50" in "disallowedEventNames".',
    });
  });
});
