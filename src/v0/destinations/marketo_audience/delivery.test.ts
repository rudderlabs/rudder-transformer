import {
  abort,
  handleDeliveryResponse,
  perItem,
  retry,
  success,
  throttled,
  type DeliveryContext,
} from '../../../services/destination/destinationIntegration/destinationIntegration';
import { toDeliveryV1Response } from '../../../services/destination/destinationIntegration/delivery';
import type { ProxyV1Request } from '../../../types';
import { Integration } from './routerTransform';
import { authCache } from './utils';

const UNMATCHED = 'Marketo response could not be matched to the request';

const context = (
  status: number,
  response: unknown,
  { method = 'POST', ids = [101, 102] }: { method?: string; ids?: number[] } = {},
): DeliveryContext => {
  const jobs = ids.map((_, i) => ({
    jobId: i + 1,
    attemptNum: 1,
    userId: '',
    sourceId: 'src-1',
    destinationId: 'dest-1',
    workspaceId: 'ws-1',
    secret: {},
    dontBatch: false,
  }));
  return {
    status,
    response,
    jobs,
    request: {
      version: '1',
      type: 'REST',
      method,
      endpoint: 'https://123-ABC-456.mktorest.com/rest/v1/lists/1234/leads.json',
      endpointPath: '/rest/v1/lists/:listId/leads.json',
      userId: '',
      headers: { 'Content-Type': 'application/json' },
      params: {},
      body: { JSON: { input: ids.map((id) => ({ id })) }, JSON_ARRAY: {}, XML: {}, FORM: {} },
      files: {},
      metadata: jobs,
      destinationConfig: {},
    } as unknown as ProxyV1Request,
    destinationConfig: {},
    destinationId: 'dest-1',
    workspaceId: 'ws-1',
  };
};

const handled = (ctx: DeliveryContext) => handleDeliveryResponse(Integration, ctx);
const results = (result: unknown[]) => ({ requestId: 'b6d1#18a8d2c10e7', result, success: true });
const failed = (code: string) => ({
  requestId: '68d8#1846058ee27',
  success: false,
  errors: [{ code, message: 'raw marketo message' }],
});
const skipped = (id: number, code: string) => ({
  id,
  status: 'skipped',
  reasons: [{ code, message: 'raw marketo message' }],
});

describe('MARKETO_AUDIENCE delivery', () => {
  describe('per-lead results on a 2xx', () => {
    const cases = [
      {
        name: 'added and a missing lead on add',
        method: 'POST',
        ids: [101, 102],
        result: [{ id: 101, status: 'added' }, skipped(102, '1004')],
        expected: [success(), abort('Lead not found in Marketo')],
      },
      {
        name: 'removed, missing and not-in-list leads on remove',
        method: 'DELETE',
        ids: [101, 102, 103],
        result: [{ id: 101, status: 'removed' }, skipped(102, '1004'), skipped(103, '1015')],
        expected: [success(), success(), success()],
      },
      {
        name: 'results in another order than the leads were sent',
        method: 'POST',
        ids: [101, 102],
        result: [skipped(102, '1004'), { id: 101, status: 'added' }],
        expected: [success(), abort('Lead not found in Marketo')],
      },
      {
        name: 'a lead not in the list on add',
        method: 'POST',
        ids: [101],
        result: [skipped(101, '1015')],
        expected: [abort('Marketo skipped the lead (code 1015)')],
      },
      {
        name: 'a partition the API user cannot access',
        method: 'DELETE',
        ids: [101],
        result: [skipped(101, '1008')],
        expected: [abort('Lead is in a partition the Marketo API user cannot access')],
      },
      {
        name: 'another skip code',
        method: 'POST',
        ids: [101],
        result: [skipped(101, '1006')],
        expected: [abort('Marketo skipped the lead (code 1006)')],
      },
      {
        name: 'an unknown status',
        method: 'POST',
        ids: [101, 102],
        result: [
          { id: 101, status: 'added' },
          { id: 102, status: 'memberof' },
        ],
        expected: [success(), retry(UNMATCHED)],
      },
    ];

    it.each(cases)('maps $name', ({ method, ids, result, expected }) => {
      expect(handled(context(200, results(result), { method, ids }))).toEqual(perItem(expected));
    });
  });

  describe('responses that cannot be matched to the request', () => {
    const cases = [
      { name: 'fewer results than leads', response: results([{ id: 101, status: 'added' }]) },
      {
        name: 'a result for a lead that was not sent',
        response: results([
          { id: 101, status: 'added' },
          { id: 999, status: 'added' },
        ]),
      },
      {
        name: 'the same lead twice in the results',
        response: results([
          { id: 101, status: 'added' },
          { id: 101, status: 'added' },
        ]),
      },
      {
        name: 'the same lead sent twice',
        ids: [101, 101],
        response: results([
          { id: 101, status: 'added' },
          { id: 102, status: 'added' },
        ]),
      },
      { name: 'a result that is not an array', response: { success: true, result: {} } },
      { name: 'a body that is not an object', response: '<html>maintenance</html>' },
      { name: 'success:false without a code', response: { success: false, errors: [] } },
    ];

    it.each(cases)('retries every job: $name', ({ response, ids }) => {
      expect(handled(context(200, response, { ids }))).toEqual(
        perItem([retry(UNMATCHED), retry(UNMATCHED)]),
      );
    });
  });

  describe('success:false on a 2xx', () => {
    const cases = [
      ...['601', '602'].map((code) => ({
        code,
        verdict: retry(`Marketo rejected the access token (code ${code})`),
      })),
      ...['502', '606', '608', '615'].map((code) => ({
        code,
        verdict: throttled(`Marketo rate limit reached (code ${code})`),
      })),
      { code: '607', verdict: throttled('Marketo daily API quota reached') },
      ...['604', '611', '713'].map((code) => ({
        code,
        verdict: retry(`Marketo is temporarily unavailable (code ${code})`),
      })),
      { code: '1013', verdict: abort('Marketo static list not found') },
      { code: '603', verdict: abort('Marketo denied access') },
      { code: '1003', verdict: abort('Marketo request failed (code 1003)') },
    ];

    it.each(cases)('applies $code to every job', ({ code, verdict }) => {
      expect(handled(context(200, failed(code)))).toEqual(perItem([verdict, verdict]));
    });

    it.each(['601', '602'])('evicts the cached token on %s', async (code) => {
      authCache.set('dest-1', 'stale-token');

      handled(context(200, failed(code)));

      expect(await authCache.get('dest-1')).toBeUndefined();
    });

    it('keeps the cached token on other codes', async () => {
      authCache.set('dest-1', 'good-token');

      handled(context(200, failed('606')));

      expect(await authCache.get('dest-1')).toBe('good-token');
      authCache.del('dest-1');
    });
  });

  describe('HTTP failures', () => {
    const cases = [
      { status: 400, verdict: abort('Marketo request failed (HTTP 400)') },
      { status: 404, verdict: abort('Marketo request failed (HTTP 404)') },
      { status: 429, verdict: throttled('Marketo rate limit reached (HTTP 429)') },
      { status: 503, verdict: retry('Marketo request failed (HTTP 503)') },
    ];

    it.each(cases)('applies HTTP $status to every job', ({ status, verdict }) => {
      expect(handled(context(status, { message: 'raw marketo message' }))).toEqual(
        perItem([verdict, verdict]),
      );
    });

    it('retries every job on a 5xx without its body, which can carry an email', () => {
      const ctx = context(503, { message: 'Failure for alice@example.com' });

      const response = toDeliveryV1Response(handled(ctx), ctx, 'MARKETO_AUDIENCE');

      expect(response.response.map(({ statusCode, error }) => ({ statusCode, error }))).toEqual([
        { statusCode: 500, error: 'Marketo request failed (HTTP 503)' },
        { statusCode: 500, error: 'Marketo request failed (HTTP 503)' },
      ]);
      expect(JSON.stringify(response)).not.toContain('alice@example.com');
    });

    it('retries every job on a 400 that is a Node transport failure, not a Marketo answer', () => {
      const ctx = context(400, '[ENOTFOUND] :: DNS lookup failed');

      const response = toDeliveryV1Response(handled(ctx), ctx, 'MARKETO_AUDIENCE');

      expect(response.response.map(({ statusCode, error }) => ({ statusCode, error }))).toEqual([
        { statusCode: 500, error: 'Marketo request failed (network error)' },
        { statusCode: 500, error: 'Marketo request failed (network error)' },
      ]);
    });

    it('returns per-job errors without the raw response', () => {
      const ctx = context(400, { message: 'raw marketo message' });

      const response = toDeliveryV1Response(handled(ctx), ctx, 'MARKETO_AUDIENCE');

      expect(response.response.map(({ statusCode, error }) => ({ statusCode, error }))).toEqual([
        { statusCode: 400, error: 'Marketo request failed (HTTP 400)' },
        { statusCode: 400, error: 'Marketo request failed (HTTP 400)' },
      ]);
      expect(JSON.stringify(response)).not.toContain('raw marketo message');
    });
  });
});
