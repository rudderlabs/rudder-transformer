import { buildRecordEvent } from './recordTransform';

describe('buildRecordEvent', () => {
  const eventCases = [
    {
      action: 'insert' as const,
      expectedAttributes: { plan: 'pro' },
    },
    {
      action: 'update' as const,
      expectedAttributes: { plan: 'pro' },
    },
  ];

  it('maps insert action to identify with attributes from identifiers', () => {
    const message = {
      type: 'record' as const,
      action: 'insert' as const,
      identifiers: {
        id: 'user-1',
        name: 'Alice',
        plan: 'pro',
        created_at: '2024-06-25T14:00:00.000Z',
      },
    };
    const result = buildRecordEvent(message, 'person');
    expect(result).toEqual({
      type: 'person',
      action: 'identify',
      identifiers: { id: 'user-1' },
      timestamp: 1719324000,
      attributes: { name: 'Alice', plan: 'pro' },
    });
  });

  it('maps update action to identify with attributes from identifiers', () => {
    const message = {
      type: 'record' as const,
      action: 'update' as const,
      identifiers: { email: 'alice@example.com', plan: 'enterprise' },
    };
    const result = buildRecordEvent(message, 'person');
    expect(result).toEqual({
      type: 'person',
      action: 'identify',
      identifiers: { email: 'alice@example.com' },
      attributes: { plan: 'enterprise' },
    });
  });

  it('maps delete action to delete without attributes', () => {
    const message = {
      type: 'record' as const,
      action: 'delete' as const,
      identifiers: { id: 'user-1', name: 'Alice' },
    };
    const result = buildRecordEvent(message, 'person');
    expect(result).toEqual({
      type: 'person',
      action: 'delete',
      identifiers: { id: 'user-1' },
    });
    expect(result.attributes).toBeUndefined();
  });

  it('omits attributes when identifiers has only id', () => {
    const message = {
      type: 'record' as const,
      action: 'insert' as const,
      identifiers: { id: 'user-1' },
    };
    const result = buildRecordEvent(message, 'person');
    expect(result.attributes).toBeUndefined();
  });

  it('prefers cio_id over id and email when all are present', () => {
    const message = {
      type: 'record' as const,
      action: 'insert' as const,
      identifiers: { cio_id: 'cio-abc', id: 'user-1', email: 'alice@example.com', plan: 'pro' },
    };
    const result = buildRecordEvent(message, 'person');
    expect(result.identifiers).toEqual({ cio_id: 'cio-abc' });
    expect(result.attributes).toEqual({ id: 'user-1', email: 'alice@example.com', plan: 'pro' });
  });

  it('prefers id over email when cio_id is absent', () => {
    const message = {
      type: 'record' as const,
      action: 'insert' as const,
      identifiers: { id: 'user-1', email: 'alice@example.com', plan: 'pro' },
    };
    const result = buildRecordEvent(message, 'person');
    expect(result.identifiers).toEqual({ id: 'user-1' });
    expect(result.attributes).toEqual({ email: 'alice@example.com', plan: 'pro' });
  });

  it('uses email identifier when id is absent', () => {
    const message = {
      type: 'record' as const,
      action: 'insert' as const,
      identifiers: { email: 'alice@example.com', plan: 'pro' },
    };
    const result = buildRecordEvent(message, 'person');
    expect(result.identifiers).toEqual({ email: 'alice@example.com' });
    expect(result.attributes).toEqual({ plan: 'pro' });
  });

  it.each(eventCases)(
    'maps event record $action action to event payload',
    ({ action, expectedAttributes }) => {
      const message = {
        type: 'record' as const,
        action,
        identifiers: {
          id: 'user-1',
          name: 'Order Completed',
          plan: 'pro',
          created_at: '2024-06-25T14:00:00.000Z',
        },
      };
      const result = buildRecordEvent(message, 'event');
      expect(result).toEqual({
        type: 'person',
        action: 'event',
        identifiers: { id: 'user-1' },
        name: 'Order Completed',
        timestamp: 1719324000,
        attributes: expectedAttributes,
      });
    },
  );

  it('maps event record update action using connection object marker', () => {
    const message = {
      type: 'record' as const,
      action: 'update' as const,
      identifiers: { email: 'alice@example.com', name: 'Plan Changed', plan: 'enterprise' },
    };
    const result = buildRecordEvent(message, 'event');
    expect(result).toEqual({
      type: 'person',
      action: 'event',
      identifiers: { email: 'alice@example.com' },
      name: 'Plan Changed',
      attributes: { plan: 'enterprise' },
    });
  });
});
