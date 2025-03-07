import { ConfigurationError, InstrumentationError } from '@rudderstack/integrations-lib';
import { createEventChunk, validateEvent } from './transform';

describe('createEventChunk', () => {
  it('should return ProcessedEvent with id and eventAction when valid identifiers provided', () => {
    const mockEvent = {
      message: {
        identifiers: {
          userId: 'test-123',
        },
        action: 'ADD',
      },
      metadata: {
        someData: 'test',
      },
      destination: {
        Config: {
          hardID: 'userId',
        },
      },
    };

    const result = createEventChunk(mockEvent as any);

    expect(result).toEqual({
      payload: {
        ids: ['test-123'],
      },
      metadata: mockEvent.metadata,
      eventAction: 'ADD',
    });
  });

  it('should throw ConfigurationError when identifiers is null', () => {
    const mockEvent = {
      message: {
        identifiers: null,
      },
    };

    expect(() => {
      createEventChunk(mockEvent as any);
    }).toThrow(new ConfigurationError('[CustomerIO] Identifiers are required, aborting.'));
  });

  it('should throw ConfigurationError when identifiers object is empty', () => {
    const mockEvent = {
      message: {
        identifiers: {},
        eventAction: 'ADD',
      },
      metadata: {
        someData: 'test',
      },
    };

    expect(() => createEventChunk(mockEvent as any)).toThrow(ConfigurationError);
  });

  it('should throw ConfigurationError when first identifier value is null', () => {
    const mockEvent = {
      message: {
        identifiers: {
          userId: null,
        },
        eventAction: 'ADD',
      },
      metadata: {
        someData: 'test',
      },
    };

    expect(() => createEventChunk(mockEvent as any)).toThrow(ConfigurationError);
  });

  it('should throw ConfigurationError when identifier is neither string nor number', () => {
    const mockEvent = {
      message: {
        identifiers: {
          userId: {},
        },
        eventAction: 'ADD',
      },
      metadata: {
        someData: 'test',
      },
    };

    jest.spyOn(require('./utils'), 'getEventAction').mockReturnValue('ADD');

    expect(() => createEventChunk(mockEvent as any)).toThrow(ConfigurationError);
    expect(() => createEventChunk(mockEvent as any)).toThrow(
      '[CustomerIO] Identifier type should be a string or integer',
    );
  });

  it('should throw ConfigurationError when event.message.identifiers is undefined', () => {
    const mockEvent = {
      message: {
        identifiers: undefined,
        eventAction: 'ADD',
      },
      metadata: {
        someData: 'test',
      },
    };

    expect(() => createEventChunk(mockEvent as any)).toThrow(ConfigurationError);
    expect(() => createEventChunk(mockEvent as any)).toThrow(
      '[CustomerIO] Identifiers are required, aborting.',
    );
  });
});

describe('validateEvent', () => {
  it('should throw InstrumentationError for non-RECORD event type', () => {
    const mockEvent = {
      message: {
        identifiers: {
          id: '123',
        },
        type: 'track',
      },
    };

    expect(() => validateEvent(mockEvent as any)).toThrow(InstrumentationError);
    expect(() => validateEvent(mockEvent as any)).toThrow('message type track is not supported');
  });

  it('should throw InstrumentationError when action type is unsupported', () => {
    const mockEvent = {
      message: {
        identifiers: {
          id: '123',
        },
        type: 'record',
        action: 'unsupported_action',
      },
      connection: {
        config: {
          destination: {
            audienceId: 'test-id',
            identifierMappings: {
              key: 'value',
            },
          },
        },
      },
    };

    expect(() => validateEvent(mockEvent as any)).toThrow(InstrumentationError);
  });

  it('should throw InstrumentationError when identifiers are missing', () => {
    const mockEvent = {
      message: {
        identifiers: {},
        type: 'record',
        action: 'insert',
      },
      connection: {
        config: {
          destination: {
            audienceId: 'test-id',
            identifierMappings: {
              key: 'value',
            },
          },
        },
      },
    };

    expect(() => validateEvent(mockEvent as any)).toThrow(InstrumentationError);
  });

  it('should throw InstrumentationError when multiple identifiers are present', () => {
    const mockEvent = {
      message: {
        identifiers: {
          id1: '123',
          id2: '456',
        },
        type: 'record',
        action: 'insert',
      },
      connection: {
        config: {
          destination: {
            audienceId: 'test-id',
            identifierMappings: {
              key: 'value',
            },
          },
        },
      },
    };

    expect(() => validateEvent(mockEvent as any)).toThrow(InstrumentationError);
  });

  it('should throw InstrumentationError when connection config is missing', () => {
    const mockEvent = {
      message: {
        identifiers: {
          id: '123',
        },
        type: 'record',
        action: 'insert',
      },
    };

    expect(() => validateEvent(mockEvent as any)).toThrow(InstrumentationError);
  });

  it('should throw InstrumentationError when audienceId is missing', () => {
    const mockEvent = {
      message: {
        identifiers: {
          id: '123',
        },
        type: 'record',
        action: 'insert',
      },
      connection: {
        config: {
          destination: {
            identifierMappings: {
              key: 'value',
            },
          },
        },
      },
    };

    expect(() => validateEvent(mockEvent as any)).toThrow(InstrumentationError);
  });
});
