/**
 * Tests for the HTTP v2 template sandbox — runs inside isolated-vm.
 *
 * Prerequisites:
 *   - Node must be started with --no-node-snapshot (isolated-vm requirement).
 *     The project's jest config already sets NODE_OPTIONS='--no-node-snapshot'.
 */
import { PlatformError } from '@rudderstack/integrations-lib';
import {
  httpTemplateSandboxRunner,
  sandboxedEvaluateHttpBody,
  sandboxedEvaluateRequestFields,
  sandboxedParseHttpTemplates,
} from './templateSandboxClient';

describe('http templateSandboxClient', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('validates HTTP body and scalar fields together with ordered outcomes', async () => {
    const results = await sandboxedParseHttpTemplates(
      ['$$.events', '$number($$.message.id)', '$map($$.events)'],
      'ws-verify',
    );
    expect(results.map((result) => result.valid)).toEqual([true, true, false]);
  });

  it('isolates a failed request field from other events in one sandbox call', async () => {
    const results = await sandboxedEvaluateRequestFields(
      {
        headers: [{ to: 'X-ID', from: '$number($$.message.id)' }],
        queryParams: [],
        pathParams: [],
      },
      [{ id: '12' }, { id: 'bad' }, { id: '42' }],
      'ws-fields',
    );
    expect(results[0]).toEqual({
      ok: true,
      fields: { headers: { 'X-ID': 12 }, params: {}, pathParams: [] },
    });
    expect(results[1]).toMatchObject({ ok: false });
    expect(results[2]).toEqual({
      ok: true,
      fields: { headers: { 'X-ID': 42 }, params: {}, pathParams: [] },
    });
  });

  it('evaluates HTTP root arrays and objects with the same chunk binding', async () => {
    expect(await sandboxedEvaluateHttpBody('$$.events', [[{ id: 1 }]], 'ws-http')).toEqual([
      { ok: true, body: [{ id: 1 }] },
    ]);
    expect(
      await sandboxedEvaluateHttpBody('{ "data": $$.events }', [[{ id: 1 }]], 'ws-http'),
    ).toEqual([{ ok: true, body: { data: [{ id: 1 }] } }]);
  });

  it('reports one failed HTTP body chunk without discarding the successful chunks', async () => {
    expect(
      await sandboxedEvaluateHttpBody(
        '{ "value": $number($$.events.value) }',
        [[{ value: '1' }], [{ value: 'bad' }], [{ value: '3' }]],
        'ws-http',
      ),
    ).toEqual([
      { ok: true, body: { value: 1 } },
      expect.objectContaining({ ok: false, error: expect.stringContaining('Unable to cast') }),
      { ok: true, body: { value: 3 } },
    ]);
  });

  it('surfaces sandbox infrastructure failures as a generic PlatformError', async () => {
    jest
      .spyOn(httpTemplateSandboxRunner, 'execute')
      .mockRejectedValueOnce(new Error('Isolate was disposed'));
    const error = await sandboxedEvaluateHttpBody('$$.events', [[{}]], 'ws-http').catch((e) => e);
    expect(error).toBeInstanceOf(PlatformError);
    expect(error.message).toBe('Template evaluation is temporarily unavailable');
  });
});
