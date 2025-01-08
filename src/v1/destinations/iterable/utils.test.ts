import { checkIfEventIsAbortableAndExtractErrorMessage } from './utils';
describe('checkIfEventIsAbortableAndExtractErrorMessage', () => {
  // Returns non-abortable and empty error message when failCount is 0
  it('should return non-abortable and empty error message when failCount is 0', () => {
    const event = {
      email: 'test@example.com',
      userId: 'user123',
      eventName: 'testEvent',
    };
    const destinationResponse = {
      status: 200,
      response: {
        failCount: 0,
      },
    };

    const result = checkIfEventIsAbortableAndExtractErrorMessage(event, destinationResponse);
    expect(result).toEqual({ isAbortable: false, errorMsg: '' });
  });

  // Handles undefined or null event fields gracefully
  it('should handle undefined or null event fields gracefully', () => {
    const event = {
      email: null,
      userId: undefined,
      eventName: 'testEvent',
    };
    const destinationResponse = {
      status: 200,
      response: {
        failCount: 1,
        invalidEmails: ['test@example.com'],
      },
    };
    const result = checkIfEventIsAbortableAndExtractErrorMessage(event, destinationResponse);
    expect(result).toEqual({ isAbortable: false, errorMsg: '' });
  });

  // Handles events with all expected fields present
  it('should handle events with all expected fields present and return non-abortable when no match', () => {
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

    const destinationResponse = {
      status: 200,
      response: {
        failCount: 1,
        invalidEmails: ['another@example.com'],
      },
    };

    const result = checkIfEventIsAbortableAndExtractErrorMessage(event, destinationResponse);

    expect(result.isAbortable).toBe(false);
    expect(result.errorMsg).toBe('');
  });

  // Returns appropriate error message for abortable event

  it('should find the right value for which it should fail and passes otherwise for emails', () => {
    const event = {
      email: 'test',
      userId: 'user123',
      eventName: 'purchase',
      dataFields: { customField1: 'value1', customField2: 'value2' },
    };
    const destinationResponse = {
      status: 200,
      response: {
        failCount: 1,
        failedUpdates: {
          invalidEmails: ['test'],
        },
      },
    };
    const result = checkIfEventIsAbortableAndExtractErrorMessage(event, destinationResponse);
    expect(result).toEqual({
      isAbortable: true,
      errorMsg: 'email error:"test" in "failedUpdates.invalidEmails".',
    });
  });

  it('should find the right value for which it should fail', () => {
    const event = {
      email: 'test@gmail.com',
      userId: 'user123',
      eventName: 'purchase',
      dataFields: { customField1: 'test', customField2: 'value2' },
    };
    const destinationResponse = {
      status: 200,
      response: {
        failCount: 1,
        failedUpdates: {
          invalidEmails: ['test'],
        },
      },
    };
    const result = checkIfEventIsAbortableAndExtractErrorMessage(event, destinationResponse);
    expect(result.isAbortable).toBe(false);
    expect(result.errorMsg).toBe('');
  });

  it('should find all the matching paths it failed for and curate error message', () => {
    const event = {
      email: 'test',
      userId: 'user123',
      eventName: 'purchase',
      dataFields: { customField1: 'test', customField2: 'value2' },
    };
    const destinationResponse = {
      status: 200,
      response: {
        failCount: 1,
        invalidEmails: ['test'],
        failedUpdates: {
          invalidEmails: ['test'],
          conflictEmails: ['test'],
        },
      },
    };
    const result = checkIfEventIsAbortableAndExtractErrorMessage(event, destinationResponse);
    expect(result.isAbortable).toBe(true);
    expect(result.errorMsg).toBe(
      'email error:"test" in "invalidEmails,failedUpdates.invalidEmails,failedUpdates.conflictEmails".',
    );
  });

  it('should find the right value for which it should fail and passes otherwise for userIds', () => {
    const event = {
      email: 'test',
      userId: 'user123',
      eventName: 'purchase',
      dataFields: { customField1: 'value1', customField2: 'value2' },
    };
    const destinationResponse = {
      status: 200,
      response: {
        failCount: 1,
        failedUpdates: {
          invalidUserIds: ['user123'],
        },
      },
    };
    const result = checkIfEventIsAbortableAndExtractErrorMessage(event, destinationResponse);
    expect(result).toEqual({
      isAbortable: true,
      errorMsg: 'userId error:"user123" in "failedUpdates.invalidUserIds".',
    });
  });

  it('should find the right value for which it should fail and passes otherwise for disallowed events', () => {
    const event = {
      email: 'test',
      userId: 'user123',
      eventName: 'purchase',
      dataFields: { customField1: 'value1', customField2: 'value2' },
    };
    const destinationResponse = {
      status: 200,
      response: {
        failCount: 1,
        disallowedEventNames: ['purchase'],
        failedUpdates: {
          invalidUserIds: [],
        },
      },
    };
    const result = checkIfEventIsAbortableAndExtractErrorMessage(event, destinationResponse);
    expect(result).toEqual({
      isAbortable: true,
      errorMsg: 'eventName error:"purchase" in "disallowedEventNames".',
    });
  });
});
