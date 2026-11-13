import type { HttpDestinationConfig } from './types';
import { effectiveConfig, resolveOverrideGroup } from './utils';

const config = {
  apiUrl: 'https://example.org',
  method: 'POST' as const,
  headers: [{ to: 'X-Test', from: 'one' }],
  pathParams: [{ path: 'default' }],
  queryParams: [{ to: 'source', from: 'default' }],
  requestBodyTemplate: '$$.events',
  maxBatchSize: 5,
  eventOverrides: [
    { name: 'First', events: ['Lead'], pathParams: [{ path: 'first' }] },
    { name: 'Second', events: ['Lead', 'Order'], queryParams: [] },
  ],
} satisfies HttpDestinationConfig;

describe('HTTP override resolution', () => {
  it.each([
    [{ type: 'track', event: 'Lead' }, 0],
    [{ type: 'track', event: 'Order' }, 1],
    [{ type: 'track', event: 'lead' }, undefined],
    [{ type: 'identify', event: 'Lead' }, 0],
    [{ type: 'page', name: 'Lead' }, undefined],
    [{ type: 'track', event: 5 }, undefined],
    [{ type: 'track' }, undefined],
  ])('resolves %p to %p', (message, expected) => {
    expect(resolveOverrideGroup(message, config.eventOverrides)).toBe(expected);
  });

  it('treats absent groups as unmatched', () => {
    expect(resolveOverrideGroup({ type: 'track', event: 'Lead' }, undefined)).toBeUndefined();
  });
});

describe('effective HTTP config', () => {
  it('inherits all settings for the default and only replaces keys present in a group', () => {
    expect(effectiveConfig(config)).toBe(config);
    expect(effectiveConfig(config, config.eventOverrides[0])).toEqual({
      ...config,
      pathParams: [{ path: 'first' }],
    });
  });

  it('preserves explicit empty arrays and does not override shared request settings', () => {
    expect(effectiveConfig(config, config.eventOverrides[1])).toEqual({
      ...config,
      queryParams: [],
    });
    expect(
      effectiveConfig(config, {
        name: 'All',
        events: ['Lead'],
        pathParams: [],
        queryParams: [],
        requestBodyTemplate: '{"custom": true}',
        maxBatchSize: 1,
      }),
    ).toEqual({
      ...config,
      pathParams: [],
      queryParams: [],
      requestBodyTemplate: '{"custom": true}',
      maxBatchSize: 1,
    });
  });
});
