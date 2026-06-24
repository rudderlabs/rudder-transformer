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

  it('prefers id over email when both are present', () => {
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
});
