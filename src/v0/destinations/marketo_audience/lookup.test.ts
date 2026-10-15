jest.mock('../../../adapters/network');

import { AbortedError, RetryableError, ThrottledError } from '@rudderstack/integrations-lib';
import { httpPOST } from '../../../adapters/network';
import { lookupLeadsByEmail } from './lookup';
import { authCache } from './utils';

const mockHttpPost = httpPOST as unknown as jest.Mock;

const LOOKUP_URL = 'https://123-ABC-456.mktorest.com/rest/v1/leads.json?_method=GET';
const TOKEN = 'cdf01657-110d-4155-99a7-f986b2ff13a0:int';

const lookup = (emails: string[]) =>
  lookupLeadsByEmail({
    accountId: '123-ABC-456',
    token: TOKEN,
    destinationId: 'dest-1',
    workspaceId: 'ws-1',
    emails,
  });

const ok = (data: unknown) => ({ success: true, response: { status: 200, data, headers: {} } });
const httpError = (status: number, data: unknown = '') => ({
  success: false,
  response: { response: { status, data } },
});
const leads = (result: unknown[], extra: Record<string, unknown> = {}) =>
  ok({ requestId: '10e3c#18a8d2c10e7', result, success: true, ...extra });
const failure = (code: string) =>
  ok({
    requestId: '68d8#1846058ee27',
    success: false,
    errors: [{ code, message: 'raw marketo message' }],
  });

const sentForm = (call: number) =>
  Object.fromEntries(new URLSearchParams(mockHttpPost.mock.calls[call][1] as string));

const emailsFrom = (start: number, count: number) =>
  Array.from({ length: count }, (_, i) => `user${start + i}@acme.io`);

const errorShape = (error: Error) => ({
  type: error.constructor.name,
  message: error.message,
  status: (error as { status?: number }).status,
});

describe('lookupLeadsByEmail', () => {
  beforeEach(() => {
    mockHttpPost.mockReset();
  });

  it('sends one form-encoded POST per 300 distinct emails with the static endpoint label', async () => {
    mockHttpPost.mockResolvedValue(leads([]));
    const emails = [...emailsFrom(0, 301), 'user0@acme.io'];

    await lookup(emails);

    expect(mockHttpPost).toHaveBeenCalledTimes(2);
    expect(mockHttpPost.mock.calls[0][0]).toBe(LOOKUP_URL);
    expect(sentForm(0)).toEqual({
      filterType: 'email',
      filterValues: emailsFrom(0, 300).join(','),
      fields: 'id,email',
      batchSize: '300',
    });
    expect(sentForm(1).filterValues).toBe('user300@acme.io');
    expect(mockHttpPost.mock.calls[0][2]).toEqual({
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    expect(mockHttpPost.mock.calls[0][3]).toEqual({
      destType: 'marketo_audience',
      feature: 'transformation',
      module: 'router',
      requestMethod: 'POST',
      endpointPath: '/rest/v1/leads.json',
      metadata: { destinationId: 'dest-1', workspaceId: 'ws-1' },
    });
  });

  it('keeps + and & intact in the form body', async () => {
    mockHttpPost.mockResolvedValue(leads([]));

    await lookup(['bob+promo@acme.io', 'r&d@acme.io']);

    expect(mockHttpPost.mock.calls[0][1]).toBe(
      'filterType=email&filterValues=bob%2Bpromo%40acme.io%2Cr%26d%40acme.io&fields=id%2Cemail&batchSize=300',
    );
  });

  it('maps zero, one and several matching leads by case-insensitive email', async () => {
    mockHttpPost.mockResolvedValue(
      leads([
        { id: 101, email: 'Alice@Acme.io' },
        { id: 201, email: 'dan@acme.io' },
        { id: 202, email: 'dan@acme.io' },
      ]),
    );

    const outcomes = await lookup(['alice@acme.io', 'dan@acme.io', 'eve@acme.io']);

    expect(outcomes).toEqual(
      new Map([
        ['alice@acme.io', { kind: 'found', leadId: 101 }],
        ['dan@acme.io', { kind: 'duplicate' }],
        ['eve@acme.io', { kind: 'missing' }],
      ]),
    );
  });

  it('follows nextPageToken while moreResult is true', async () => {
    mockHttpPost
      .mockResolvedValueOnce(
        leads([{ id: 201, email: 'dan@acme.io' }], {
          moreResult: true,
          nextPageToken: 'GIYDAOBNGEYS2MBWKQYDAORQGA5DAMBOGAYDAKZQGAYDALBQ',
        }),
      )
      .mockResolvedValueOnce(
        leads([
          { id: 101, email: 'alice@acme.io' },
          { id: 202, email: 'dan@acme.io' },
        ]),
      );

    const outcomes = await lookup(['alice@acme.io', 'dan@acme.io']);

    expect(mockHttpPost).toHaveBeenCalledTimes(2);
    expect(sentForm(1)).toEqual({
      filterType: 'email',
      filterValues: 'alice@acme.io,dan@acme.io',
      fields: 'id,email',
      batchSize: '300',
      nextPageToken: 'GIYDAOBNGEYS2MBWKQYDAORQGA5DAMBOGAYDAKZQGAYDALBQ',
    });
    expect(outcomes).toEqual(
      new Map([
        ['alice@acme.io', { kind: 'found', leadId: 101 }],
        ['dan@acme.io', { kind: 'duplicate' }],
      ]),
    );
  });

  it('counts a lead repeated across pages once', async () => {
    mockHttpPost
      .mockResolvedValueOnce(
        leads([{ id: 101, email: 'alice@acme.io' }], { moreResult: true, nextPageToken: 'p2' }),
      )
      .mockResolvedValueOnce(leads([{ id: 101, email: 'alice@acme.io' }]));

    const outcomes = await lookup(['alice@acme.io']);

    expect(outcomes.get('alice@acme.io')).toEqual({ kind: 'found', leadId: 101 });
  });

  const failureCases = [
    {
      name: 'success:false 601',
      response: failure('601'),
      expected: {
        type: 'RetryableError',
        message: 'Marketo rejected the access token (code 601)',
        status: 500,
      },
    },
    {
      name: 'success:false 606',
      response: failure('606'),
      expected: {
        type: 'ThrottledError',
        message: 'Marketo rate limit reached (code 606)',
        status: 429,
      },
    },
    {
      name: 'success:false 607',
      response: failure('607'),
      expected: { type: 'AbortedError', message: 'Marketo daily API quota reached', status: 400 },
    },
    {
      name: 'success:false 603',
      response: failure('603'),
      expected: {
        type: 'AbortedError',
        message: 'Marketo API user lacks Read-Only Lead permission',
        status: 400,
      },
    },
    {
      name: 'success:false 1003',
      response: failure('1003'),
      expected: {
        type: 'AbortedError',
        message: 'Marketo lead lookup failed (code 1003)',
        status: 400,
      },
    },
    {
      name: 'HTTP 500',
      response: httpError(500),
      expected: {
        type: 'RetryableError',
        message: 'Marketo lead lookup failed (HTTP 500)',
        status: 500,
      },
    },
    {
      name: 'HTTP 429',
      response: httpError(429),
      expected: {
        type: 'ThrottledError',
        message: 'Marketo rate limit reached (HTTP 429)',
        status: 429,
      },
    },
    {
      name: 'HTTP 403',
      response: httpError(403, { message: 'raw marketo message' }),
      expected: {
        type: 'AbortedError',
        message: 'Marketo lead lookup failed (HTTP 403)',
        status: 403,
      },
    },
  ];

  it.each(failureCases)('classifies a failed lookup: $name', async ({ response, expected }) => {
    mockHttpPost.mockResolvedValue(response);

    const outcome = (await lookup(['alice@acme.io'])).get('alice@acme.io');

    expect(outcome?.kind).toBe('error');
    expect('error' in outcome! && errorShape(outcome.error)).toEqual(expected);
  });

  const unmatchedCases = [
    { name: 'success:false without a code', response: ok({ success: false, errors: [] }) },
    { name: 'a body that is not an object', response: ok('<html>maintenance</html>') },
    { name: 'a result that is not an array', response: ok({ success: true, result: {} }) },
    {
      name: 'a lead for an email that was not requested',
      response: leads([{ id: 7, email: 'mallory@acme.io' }]),
    },
    { name: 'a lead without a usable id', response: leads([{ id: 'x', email: 'alice@acme.io' }]) },
    { name: 'moreResult without a page token', response: leads([], { moreResult: true }) },
  ];

  it.each(unmatchedCases)('retries a response it cannot match: $name', async ({ response }) => {
    mockHttpPost.mockResolvedValue(response);

    const outcome = (await lookup(['alice@acme.io'])).get('alice@acme.io');

    expect('error' in outcome! && errorShape(outcome.error)).toEqual({
      type: 'RetryableError',
      message: 'Marketo lead lookup response could not be matched to the request',
      status: 500,
    });
  });

  it('retries a repeated page token instead of looping', async () => {
    mockHttpPost.mockResolvedValue(leads([], { moreResult: true, nextPageToken: 'same' }));

    const outcome = (await lookup(['alice@acme.io'])).get('alice@acme.io');

    expect(mockHttpPost).toHaveBeenCalledTimes(2);
    expect('error' in outcome! && outcome.error).toBeInstanceOf(RetryableError);
  });

  it('turns an unexpected throw into a retryable error', async () => {
    mockHttpPost.mockRejectedValue(new TypeError('boom'));

    const outcome = (await lookup(['alice@acme.io'])).get('alice@acme.io');

    expect('error' in outcome! && errorShape(outcome.error)).toEqual({
      type: 'RetryableError',
      message: 'Marketo lead lookup failed',
      status: 500,
    });
  });

  it('fails only the emails of the failed chunk', async () => {
    mockHttpPost.mockResolvedValueOnce(leads([])).mockResolvedValueOnce(failure('606'));

    const outcomes = await lookup(emailsFrom(0, 301));

    expect(outcomes.get('user0@acme.io')).toEqual({ kind: 'missing' });
    expect(outcomes.get('user299@acme.io')).toEqual({ kind: 'missing' });
    const failed = outcomes.get('user300@acme.io');
    expect('error' in failed! && failed.error).toBeInstanceOf(ThrottledError);
  });

  it('evicts the cached token on 601 and 602', async () => {
    authCache.set('dest-1', 'stale-token');
    mockHttpPost.mockResolvedValue(failure('602'));

    await lookup(['alice@acme.io']);

    expect(await authCache.get('dest-1')).toBeUndefined();
  });

  it('keeps the cached token on other failures', async () => {
    authCache.set('dest-1', 'good-token');
    mockHttpPost.mockResolvedValue(failure('607'));

    const outcome = (await lookup(['alice@acme.io'])).get('alice@acme.io');

    expect('error' in outcome! && outcome.error).toBeInstanceOf(AbortedError);
    expect(await authCache.get('dest-1')).toBe('good-token');
    authCache.del('dest-1');
  });
});
