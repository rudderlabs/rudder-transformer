import { InstrumentationError } from '@rudderstack/integrations-lib';
import type { RecordContext } from '../../../../services/destination/nativeBatching/types';
import type { CustomerIOConnection } from '../types';
import { buildRecordEvent } from './recordTransform';

type TestContext = RecordContext<CustomerIOConnection['config']>;

const makeContext = (
  action: 'insert' | 'update' | 'delete',
  identifiers: Record<string, string | number>,
): TestContext => ({
  action,
  identifiers,
  objectType: 'person',
  connection: {} as any,
});

describe('buildRecordEvent', () => {
  it('maps insert action to identify with attributes from identifiers', () => {
    const result = buildRecordEvent(
      makeContext('insert', {
        id: 'user-1',
        name: 'Alice',
        plan: 'pro',
        created_at: '2024-06-25T14:00:00.000Z',
      }),
      'person',
    );
    expect(result).toEqual({
      type: 'person',
      action: 'identify',
      identifiers: { id: 'user-1' },
      timestamp: 1719324000,
      attributes: { name: 'Alice', plan: 'pro' },
    });
  });

  it('maps update action to identify with attributes from identifiers', () => {
    const result = buildRecordEvent(
      makeContext('update', { email: 'alice@example.com', plan: 'enterprise' }),
      'person',
    );
    expect(result).toEqual({
      type: 'person',
      action: 'identify',
      identifiers: { email: 'alice@example.com' },
      attributes: { plan: 'enterprise' },
    });
  });

  it('maps delete action to delete without attributes', () => {
    const result = buildRecordEvent(
      makeContext('delete', { id: 'user-1', name: 'Alice' }),
      'person',
    );
    expect(result).toEqual({
      type: 'person',
      action: 'delete',
      identifiers: { id: 'user-1' },
    });
    expect(result.attributes).toBeUndefined();
  });

  it('omits attributes when identifiers has only id', () => {
    const result = buildRecordEvent(makeContext('insert', { id: 'user-1' }), 'person');
    expect(result.attributes).toBeUndefined();
  });

  it('prefers cio_id over id and email when all are present', () => {
    const result = buildRecordEvent(
      makeContext('insert', {
        cio_id: 'cio-abc',
        id: 'user-1',
        email: 'alice@example.com',
        plan: 'pro',
      }),
      'person',
    );
    expect(result.identifiers).toEqual({ cio_id: 'cio-abc' });
    expect(result.attributes).toEqual({ id: 'user-1', email: 'alice@example.com', plan: 'pro' });
  });

  it('prefers id over email when cio_id is absent', () => {
    const result = buildRecordEvent(
      makeContext('insert', { id: 'user-1', email: 'alice@example.com', plan: 'pro' }),
      'person',
    );
    expect(result.identifiers).toEqual({ id: 'user-1' });
    expect(result.attributes).toEqual({ email: 'alice@example.com', plan: 'pro' });
  });

  it('uses email identifier when id is absent', () => {
    const result = buildRecordEvent(
      makeContext('insert', { email: 'alice@example.com', plan: 'pro' }),
      'person',
    );
    expect(result.identifiers).toEqual({ email: 'alice@example.com' });
    expect(result.attributes).toEqual({ plan: 'pro' });
  });

  it.each([{ action: 'insert' as const }, { action: 'update' as const }])(
    'maps event record $action action to event payload',
    ({ action }) => {
      const result = buildRecordEvent(
        makeContext(action, {
          id: 'user-1',
          name: 'Order Completed',
          plan: 'pro',
          created_at: '2024-06-25T14:00:00.000Z',
        }),
        'event',
      );
      expect(result).toEqual({
        type: 'person',
        action: 'event',
        identifiers: { id: 'user-1' },
        name: 'Order Completed',
        timestamp: 1719324000,
        attributes: { plan: 'pro' },
      });
    },
  );

  it('maps event record update action using connection object marker', () => {
    const result = buildRecordEvent(
      makeContext('update', {
        email: 'alice@example.com',
        name: 'Plan Changed',
        plan: 'enterprise',
      }),
      'event',
    );
    expect(result).toEqual({
      type: 'person',
      action: 'event',
      identifiers: { email: 'alice@example.com' },
      name: 'Plan Changed',
      attributes: { plan: 'enterprise' },
    });
  });

  it('throws InstrumentationError for event record delete action', () => {
    expect(() =>
      buildRecordEvent(makeContext('delete', { id: 'user-1', event: 'Order Completed' }), 'event'),
    ).toThrow(InstrumentationError);
    expect(() =>
      buildRecordEvent(makeContext('delete', { id: 'user-1', event: 'Order Completed' }), 'event'),
    ).toThrow('Delete action is not supported for CustomerIO event records');
  });
});
