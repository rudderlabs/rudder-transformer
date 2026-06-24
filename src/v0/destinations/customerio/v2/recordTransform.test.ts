import { InstrumentationError } from '@rudderstack/integrations-lib';
import { buildRecordEvent } from './recordTransform';

describe('buildRecordEvent', () => {
  it('maps insert action to identify with attributes from identifiers', () => {
    const message = {
      type: 'record' as const,
      action: 'insert' as const,
      identifiers: { id: 'user-1', name: 'Alice', plan: 'pro' },
    };
    const result = buildRecordEvent(message);
    expect(result).toEqual({
      type: 'person',
      action: 'identify',
      identifiers: { id: 'user-1' },
      attributes: { name: 'Alice', plan: 'pro' },
    });
  });

  it('maps update action to identify with attributes from identifiers', () => {
    const message = {
      type: 'record' as const,
      action: 'update' as const,
      identifiers: { email: 'alice@example.com', plan: 'enterprise' },
    };
    const result = buildRecordEvent(message);
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
    const result = buildRecordEvent(message);
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
    const result = buildRecordEvent(message);
    expect(result.attributes).toBeUndefined();
  });

  it('prefers cio_id over id and email when all are present', () => {
    const message = {
      type: 'record' as const,
      action: 'insert' as const,
      identifiers: { cio_id: 'cio-abc', id: 'user-1', email: 'alice@example.com', plan: 'pro' },
    };
    const result = buildRecordEvent(message);
    expect(result.identifiers).toEqual({ cio_id: 'cio-abc' });
    expect(result.attributes).toEqual({ id: 'user-1', email: 'alice@example.com', plan: 'pro' });
  });

  it('prefers id over email when cio_id is absent', () => {
    const message = {
      type: 'record' as const,
      action: 'insert' as const,
      identifiers: { id: 'user-1', email: 'alice@example.com', plan: 'pro' },
    };
    const result = buildRecordEvent(message);
    expect(result.identifiers).toEqual({ id: 'user-1' });
    expect(result.attributes).toEqual({ email: 'alice@example.com', plan: 'pro' });
  });

  it('uses email identifier when id is absent', () => {
    const message = {
      type: 'record' as const,
      action: 'insert' as const,
      identifiers: { email: 'alice@example.com', plan: 'pro' },
    };
    const result = buildRecordEvent(message);
    expect(result.identifiers).toEqual({ email: 'alice@example.com' });
    expect(result.attributes).toEqual({ plan: 'pro' });
  });

  it('throws InstrumentationError for unsupported action', () => {
    const message = {
      type: 'record' as const,
      action: 'upsert' as any,
      identifiers: { id: 'user-1' },
    };
    expect(() => buildRecordEvent(message)).toThrow(InstrumentationError);
    expect(() => buildRecordEvent(message)).toThrow('Action "upsert" is not supported');
  });

  it('falls back to empty fields when identifiers is absent', () => {
    const message = {
      type: 'record' as const,
      action: 'delete' as const,
    } as any;
    const result = buildRecordEvent(message);
    expect(result.action).toBe('delete');
    expect(result.attributes).toBeUndefined();
  });

  describe('event object type', () => {
    it('maps insert action to event with top-level name and attributes', () => {
      const message = {
        type: 'record' as const,
        action: 'insert' as const,
        identifiers: { id: 'user-1', name: 'Signup Completed', plan: 'pro' },
      };
      const result = buildRecordEvent(message, 'event');
      expect(result).toEqual({
        type: 'person',
        action: 'event',
        identifiers: { id: 'user-1' },
        name: 'Signup Completed',
        attributes: { plan: 'pro' },
      });
      // name must be lifted to top level and excluded from attributes
      expect(result.name).toBe('Signup Completed');
      expect(result.attributes).not.toHaveProperty('name');
    });

    it('maps update action to event with top-level name', () => {
      const message = {
        type: 'record' as const,
        action: 'update' as const,
        identifiers: { email: 'alice@example.com', name: 'Plan Upgraded', plan: 'enterprise' },
      };
      const result = buildRecordEvent(message, 'event');
      expect(result).toEqual({
        type: 'person',
        action: 'event',
        identifiers: { email: 'alice@example.com' },
        name: 'Plan Upgraded',
        attributes: { plan: 'enterprise' },
      });
      expect(result.action).toBe('event');
    });

    it('prefers message.fields.name over identifiers.name for the event name', () => {
      const message = {
        type: 'record' as const,
        action: 'insert' as const,
        fields: { name: 'From Fields' },
        identifiers: { id: 'user-1', name: 'From Identifiers', plan: 'pro' },
      };
      const result = buildRecordEvent(message, 'event');
      expect(result.name).toBe('From Fields');
      // identifiers.name is still excluded from attributes
      expect(result.attributes).toEqual({ plan: 'pro' });
    });

    it('throws InstrumentationError for delete action on event object type', () => {
      const message = {
        type: 'record' as const,
        action: 'delete' as const,
        identifiers: { id: 'user-1', name: 'Some Event' },
      };
      expect(() => buildRecordEvent(message, 'event')).toThrow(InstrumentationError);
      expect(() => buildRecordEvent(message, 'event')).toThrow(
        'Delete action is not supported for "event" object type',
      );
    });

    it('throws InstrumentationError for an unsupported (non-delete) action on event object type', () => {
      const message = {
        type: 'record' as const,
        action: 'upsert' as any,
        identifiers: { id: 'user-1', name: 'Some Event' },
      };
      expect(() => buildRecordEvent(message, 'event')).toThrow(InstrumentationError);
      expect(() => buildRecordEvent(message, 'event')).toThrow('Action "upsert" is not supported');
    });

    it('preserves identifier priority (cio_id > id > email) in the event branch', () => {
      const message = {
        type: 'record' as const,
        action: 'insert' as const,
        identifiers: {
          cio_id: 'cio-abc',
          id: 'user-1',
          email: 'alice@example.com',
          name: 'Event Name',
          plan: 'pro',
        },
      };
      const result = buildRecordEvent(message, 'event');
      expect(result.identifiers).toEqual({ cio_id: 'cio-abc' });
      expect(result.name).toBe('Event Name');
      expect(result.attributes).toEqual({ id: 'user-1', email: 'alice@example.com', plan: 'pro' });
    });

    it('keeps person behavior when object type is undefined or "person"', () => {
      const message = {
        type: 'record' as const,
        action: 'insert' as const,
        identifiers: { id: 'user-1', name: 'Alice', plan: 'pro' },
      };
      const expected = {
        type: 'person',
        action: 'identify',
        identifiers: { id: 'user-1' },
        attributes: { name: 'Alice', plan: 'pro' },
      };
      expect(buildRecordEvent(message, undefined)).toEqual(expected);
      expect(buildRecordEvent(message, 'person')).toEqual(expected);
    });
  });
});
