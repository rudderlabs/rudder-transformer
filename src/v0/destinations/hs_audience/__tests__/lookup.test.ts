jest.mock('../../../../adapters/network');

import { httpPOST } from '../../../../adapters/network';
import { generateErrorObject } from '../../../util';
import { correlateContactLookup, lookupDistinctEmails } from '../lookup';

const mockHttpPost = httpPOST as unknown as jest.Mock;
const LARGE_ID = '9007199254740993';

function httpSuccess(data: unknown, status = 200) {
  return { success: true, response: { data, status, headers: {} } };
}

function httpFailure(status: number, data: unknown = {}) {
  return { success: false, response: { response: { status, data } } };
}

function foundBody(rows: { email: string; id: string }[]) {
  return {
    status: 'COMPLETE',
    results: rows.map((row) => ({ id: row.id, properties: { email: row.email } })),
    errors: [],
  };
}

function emails(count: number, offset = 0): string[] {
  return Array.from({ length: count }, (_unused, index) => `user${offset + index}@example.com`);
}

describe('correlateContactLookup', () => {
  it('matches reordered results by normalized email and normalizes the contact id', () => {
    const correlated = correlateContactLookup(['b@example.com', 'a@example.com'], {
      status: 'COMPLETE',
      results: [
        { id: '00123', properties: { email: '  A@Example.com ' } },
        { id: LARGE_ID, properties: { email: 'b@example.com' } },
      ],
      errors: [],
    });

    expect(correlated.get('a@example.com')).toEqual({ kind: 'found', recordId: '123' });
    expect(correlated.get('b@example.com')).toEqual({ kind: 'found', recordId: LARGE_ID });
  });

  it('matches primary and secondary addresses to the same contact without leaking extra aliases', () => {
    const requested = ['a@example.com', 'alias@example.com', 'b@example.com'];
    const correlated = correlateContactLookup(requested, {
      status: 'COMPLETE',
      results: [
        {
          id: '00123',
          properties: {
            email: 'A@Example.com',
            hs_additional_emails: ' Alias@Example.com ;a@example.com;;unused@example.com ',
          },
        },
        { id: '2', properties: { email: 'b@example.com', hs_additional_emails: null } },
      ],
      errors: [],
    });

    expect(correlated.get('a@example.com')).toEqual({ kind: 'found', recordId: '123' });
    expect(correlated.get('alias@example.com')).toEqual({ kind: 'found', recordId: '123' });
    expect(correlated.get('b@example.com')).toEqual({ kind: 'found', recordId: '2' });
    expect(correlated.has('unused@example.com')).toBe(false);
  });

  it('matches a secondary address when the primary address was not requested', () => {
    const correlated = correlateContactLookup(['alias@example.com'], {
      status: 'COMPLETE',
      results: [
        {
          id: '1',
          properties: {
            email: 'primary@example.com',
            hs_additional_emails: 'alias@example.com',
          },
        },
      ],
      errors: [],
    });

    expect(correlated.get('alias@example.com')).toEqual({ kind: 'found', recordId: '1' });
  });

  it.each([
    [
      'duplicate contact claims',
      [
        {
          id: '1',
          properties: { email: 'primary@example.com', hs_additional_emails: 'a@example.com' },
        },
        { id: '2', properties: { email: 'a@example.com' } },
      ],
      [],
    ],
    [
      'a found address also reported missing',
      [{ id: '1', properties: { email: 'a@example.com' } }],
      [{ category: 'OBJECT_NOT_FOUND', context: { ids: ['a@example.com'] } }],
    ],
    [
      'non-string secondary addresses',
      [
        {
          id: '1',
          properties: { email: 'a@example.com', hs_additional_emails: ['alias@example.com'] },
        },
      ],
      [],
    ],
  ])('keeps a usable contact match despite %s', (_name, results, errors) => {
    expect(correlateContactLookup(['a@example.com'], { results, errors })).toEqual(
      new Map([['a@example.com', { kind: 'found', recordId: '1' }]]),
    );
  });

  it('skips a secondary address that fails validation and keeps the requested match', () => {
    const correlated = correlateContactLookup(['alias@example.com'], {
      status: 'COMPLETE',
      results: [
        {
          id: '1',
          properties: {
            email: 'primary@example.com',
            hs_additional_emails: 'invalid-address;old@legacy_corp.com;alias@example.com',
          },
        },
      ],
      errors: [],
    });

    expect(correlated.get('alias@example.com')).toEqual({ kind: 'found', recordId: '1' });
  });

  it('accepts an explicit OBJECT_NOT_FOUND miss and ignores free-text messages', () => {
    const correlated = correlateContactLookup(['missing@example.com'], {
      status: 'COMPLETE',
      results: [],
      errors: [
        {
          category: 'OBJECT_NOT_FOUND',
          message: 'also-not-requested@example.com was not found',
          context: { ids: ['  Missing@Example.com '] },
        },
      ],
    });

    expect(correlated.get('missing@example.com')).toEqual({ kind: 'miss' });
  });

  it('leaves an email unmatched when it is only named in message text', () => {
    expect(
      correlateContactLookup(['missing@example.com'], {
        status: 'COMPLETE',
        results: [],
        errors: [
          {
            category: 'OBJECT_NOT_FOUND',
            message: 'missing@example.com was not found',
          },
        ],
      }),
    ).toEqual(new Map());
  });

  it('preserves usable answers when another requested email is uncovered', () => {
    expect(
      correlateContactLookup(['a@example.com', 'b@example.com'], {
        status: 'COMPLETE',
        results: [{ id: '1', properties: { email: 'a@example.com' } }],
        errors: [{ category: 'OBJECT_NOT_FOUND', context: { ids: ['b@example.com'] } }],
      }).get('b@example.com'),
    ).toEqual({ kind: 'miss' });

    expect(
      correlateContactLookup(['a@example.com', 'b@example.com'], {
        status: 'COMPLETE',
        results: [{ id: '1', properties: { email: 'a@example.com' } }],
        errors: [],
      }),
    ).toEqual(new Map([['a@example.com', { kind: 'found', recordId: '1' }]]));
  });

  it('accepts a repeated result when the contact id is the same', () => {
    const correlated = correlateContactLookup(['a@example.com'], {
      status: 'COMPLETE',
      results: [
        { id: '001', properties: { email: 'A@Example.com' } },
        { id: '1', properties: { email: 'a@example.com' } },
      ],
      errors: [],
    });

    expect(correlated.get('a@example.com')).toEqual({ kind: 'found', recordId: '1' });
  });

  it.each([
    ['missing status', { results: [{ id: '1', properties: { email: 'a@example.com' } }] }],
    [
      'a different status',
      { status: 'PENDING', results: [{ id: '1', properties: { email: 'a@example.com' } }] },
    ],
    [
      'a mismatched error count',
      { numErrors: 2, results: [{ id: '1', properties: { email: 'a@example.com' } }], errors: [] },
    ],
    [
      'a malformed error array',
      { results: [{ id: '1', properties: { email: 'a@example.com' } }], errors: {} },
    ],
    [
      'an unrelated error',
      {
        results: [{ id: '1', properties: { email: 'a@example.com' } }],
        errors: [{ category: 'VALIDATION_ERROR' }],
      },
    ],
  ])('matches contacts despite %s', (_name, body) => {
    expect(correlateContactLookup(['a@example.com'], body)).toEqual(
      new Map([['a@example.com', { kind: 'found', recordId: '1' }]]),
    );
  });

  it.each([
    null,
    '',
    {},
    { results: {} },
    { results: [null, { id: '0', properties: { email: 'a@example.com' } }] },
    { errors: [{ category: 'OBJECT_NOT_FOUND', context: { ids: [1] } }] },
    { errors: [{ category: 'VALIDATION_ERROR', context: { ids: ['a@example.com'] } }] },
  ])('leaves unusable answers unmatched: %p', (body) => {
    expect(correlateContactLookup(['a@example.com'], body)).toEqual(new Map());
  });

  it('keeps confirmed misses despite malformed sibling entries', () => {
    expect(
      correlateContactLookup(['missing@example.com'], {
        results: [null],
        errors: [
          null,
          { category: 'OBJECT_NOT_FOUND', context: { ids: [null, 'missing@example.com'] } },
        ],
      }),
    ).toEqual(new Map([['missing@example.com', { kind: 'miss' }]]));
  });
});

describe('lookupDistinctEmails', () => {
  beforeEach(() => {
    mockHttpPost.mockReset();
  });

  it('sends 100 emails in the first call and the remainder in the second', async () => {
    mockHttpPost.mockImplementation(async (_url: string, body: { inputs: { id: string }[] }) =>
      httpSuccess(
        foundBody(body.inputs.map((input, index) => ({ email: input.id, id: String(index + 1) }))),
      ),
    );

    const requested = emails(101);
    const lookedUp = await lookupDistinctEmails('pat-test', requested, { workspaceId: 'ws-1' });

    expect(mockHttpPost).toHaveBeenCalledTimes(2);
    expect(mockHttpPost.mock.calls[0][1].inputs).toHaveLength(100);
    expect(mockHttpPost.mock.calls[1][1].inputs).toEqual([{ id: 'user100@example.com' }]);
    expect(lookedUp.get('user0@example.com')).toEqual({ kind: 'found', recordId: '1' });
    expect(lookedUp.get('user100@example.com')?.kind).toBe('found');
    expect(mockHttpPost.mock.calls[0][1]).toEqual({
      idProperty: 'email',
      properties: ['email', 'hs_additional_emails'],
      propertiesWithHistory: [],
      inputs: emails(100).map((id) => ({ id })),
    });
    expect(mockHttpPost.mock.calls[0][2].headers).toEqual({
      Authorization: 'Bearer pat-test',
      'Content-Type': 'application/json',
    });
    expect(mockHttpPost.mock.calls[0][3]).toEqual(
      expect.objectContaining({
        destType: 'HS_AUDIENCE',
        feature: 'transformation',
        module: 'router',
        requestMethod: 'POST',
        endpointPath: '/crm/v3/objects/contacts/batch/read',
        metadata: { workspaceId: 'ws-1' },
      }),
    );
  });

  it('looks up a duplicated email once', async () => {
    mockHttpPost.mockImplementation(async (_url: string, body: { inputs: { id: string }[] }) =>
      httpSuccess(foundBody(body.inputs.map((input) => ({ email: input.id, id: '8' })))),
    );

    const lookedUp = await lookupDistinctEmails('pat-test', ['a@example.com', 'a@example.com'], {});

    expect(mockHttpPost).toHaveBeenCalledTimes(1);
    expect(mockHttpPost.mock.calls[0][1].inputs).toEqual([{ id: 'a@example.com' }]);
    expect(lookedUp.get('a@example.com')).toEqual({ kind: 'found', recordId: '8' });
  });

  it('retries only uncovered emails and preserves known contacts', async () => {
    mockHttpPost.mockResolvedValueOnce(
      httpSuccess({
        status: 'COMPLETE',
        results: [{ id: '1', properties: { email: 'a@example.com' } }],
        errors: [],
      }),
    );

    const lookedUp = await lookupDistinctEmails('pat-test', ['a@example.com', 'b@example.com'], {});

    expect(lookedUp.get('a@example.com')).toEqual({ kind: 'found', recordId: '1' });
    expect(lookedUp.get('b@example.com')?.kind).toBe('error');
    const failure = lookedUp.get('b@example.com');
    if (failure?.kind !== 'error') {
      throw new Error('expected an unmatched-email error');
    }
    const generated = generateErrorObject(failure.error);
    expect(generated.message).toBe('HubSpot contact lookup response could not be correlated');
    expect(generated.status).toBe(500);
    expect(generated.message).not.toContain('raw-body');
  });

  it.each([
    [401, 'HubSpot rejected the access token'],
    [403, 'HubSpot token is missing the crm.objects.contacts.read scope'],
    [429, 'HubSpot rate limit exceeded'],
    [477, 'HubSpot contact lookup is temporarily unavailable'],
  ] as const)(
    'stops after HTTP %s and applies that error to the remaining emails',
    async (status, message) => {
      mockHttpPost.mockResolvedValueOnce(httpFailure(status));

      const lookedUp = await lookupDistinctEmails('pat-test', emails(201), {});

      expect(mockHttpPost).toHaveBeenCalledTimes(1);
      const first = lookedUp.get('user0@example.com');
      const last = lookedUp.get('user200@example.com');
      if (first?.kind !== 'error' || last?.kind !== 'error') {
        throw new Error('expected the portal-wide failure on every email');
      }
      expect(first.error).toBe(last.error);
      expect(generateErrorObject(first.error).message).toBe(message);
    },
  );

  it('keeps a failed middle chunk from changing the chunks around it', async () => {
    let call = 0;
    mockHttpPost.mockImplementation(async (_url: string, body: { inputs: { id: string }[] }) => {
      call += 1;
      if (call === 2) {
        return httpFailure(503, { message: 'raw-body-sentinel' });
      }
      return httpSuccess(foundBody(body.inputs.map((input) => ({ email: input.id, id: '4' }))));
    });

    const lookedUp = await lookupDistinctEmails('pat-test', emails(201), {});

    expect(mockHttpPost).toHaveBeenCalledTimes(3);
    expect(lookedUp.get('user0@example.com')).toEqual({ kind: 'found', recordId: '4' });
    expect(lookedUp.get('user100@example.com')?.kind).toBe('error');
    expect(lookedUp.get('user199@example.com')?.kind).toBe('error');
    expect(lookedUp.get('user200@example.com')).toEqual({ kind: 'found', recordId: '4' });
    const middle = lookedUp.get('user100@example.com');
    if (middle?.kind !== 'error') {
      throw new Error('expected the middle chunk to fail');
    }
    expect(generateErrorObject(middle.error).message).toBe('raw-body-sentinel');
  });

  it('classifies auth, scope, throttle, and transport without treating them as misses', async () => {
    mockHttpPost.mockResolvedValueOnce(
      httpFailure(401, {
        message: 'Invalid access token',
        category: 'INVALID_AUTHENTICATION',
        correlationId: 'corr-auth',
      }),
    );
    const rejected = await lookupDistinctEmails('pat-test', ['a@example.com'], {});
    const rejectedError = rejected.get('a@example.com');
    if (rejectedError?.kind !== 'error') {
      throw new Error('expected an auth error');
    }
    const generated = generateErrorObject(rejectedError.error);
    expect(generated.message).toBe(
      'Invalid access token (category: INVALID_AUTHENTICATION, correlationId: corr-auth)',
    );
    expect(generated.status).toBe(401);
    expect(generated.authErrorCategory || '').toBe('');

    mockHttpPost.mockResolvedValueOnce(httpFailure(403));
    const forbidden = await lookupDistinctEmails('pat-test', ['a@example.com'], {});
    const forbiddenError = forbidden.get('a@example.com');
    if (forbiddenError?.kind !== 'error') {
      throw new Error('expected a scope error');
    }
    expect(generateErrorObject(forbiddenError.error).message).toBe(
      'HubSpot token is missing the crm.objects.contacts.read scope',
    );

    mockHttpPost.mockResolvedValueOnce(httpFailure(400, { message: 'raw-body-sentinel' }));
    const rejectedLookup = await lookupDistinctEmails('pat-test', ['a@example.com'], {});
    const rejectedLookupError = rejectedLookup.get('a@example.com');
    if (rejectedLookupError?.kind !== 'error') {
      throw new Error('expected a rejected lookup');
    }
    expect(generateErrorObject(rejectedLookupError.error).status).toBe(400);
    expect(generateErrorObject(rejectedLookupError.error).message).toBe('raw-body-sentinel');

    mockHttpPost.mockResolvedValueOnce(httpFailure(429));
    const throttled = await lookupDistinctEmails('pat-test', ['a@example.com'], {});
    const throttledError = throttled.get('a@example.com');
    if (throttledError?.kind !== 'error') {
      throw new Error('expected a throttle error');
    }
    expect(generateErrorObject(throttledError.error).status).toBe(429);
    expect(generateErrorObject(throttledError.error).message).toBe('HubSpot rate limit exceeded');

    mockHttpPost.mockResolvedValueOnce({ success: false, response: { code: 'ECONNRESET' } });
    const transport = await lookupDistinctEmails('pat-test', ['a@example.com'], {});
    const transportError = transport.get('a@example.com');
    if (transportError?.kind !== 'error') {
      throw new Error('expected a transport error');
    }
    expect(generateErrorObject(transportError.error).status).toBe(500);
    expect(generateErrorObject(transportError.error).message).toBe(
      'HubSpot contact lookup is temporarily unavailable',
    );
  });

  it.each([
    ['ENOTFOUND', 400, 'HubSpot contact lookup was rejected'],
    ['EPIPE', 400, 'HubSpot contact lookup was rejected'],
    ['UNKNOWN_CODE', 400, 'HubSpot contact lookup was rejected'],
    ['ETIMEDOUT', 500, 'HubSpot contact lookup is temporarily unavailable'],
    ['ECONNREFUSED', 500, 'HubSpot contact lookup is temporarily unavailable'],
    ['ECONNABORTED', 500, 'HubSpot contact lookup is temporarily unavailable'],
  ])('uses the shared network mapping for %s', async (code, status, message) => {
    mockHttpPost.mockResolvedValueOnce({ success: false, response: { code } });
    const result = await lookupDistinctEmails('pat-test', ['a@example.com'], {});
    const outcome = result.get('a@example.com');
    expect(outcome?.kind).toBe('error');
    const generated = outcome?.kind === 'error' && generateErrorObject(outcome.error);
    expect(generated).toEqual(expect.objectContaining({ status, message }));
  });

  it.each([400, 401, 403, 404, 429, 477, 503])(
    'includes HubSpot details for HTTP %s',
    async (status) => {
      mockHttpPost.mockResolvedValueOnce(
        httpFailure(status, {
          message: 'Lookup failed',
          category: 'REQUEST_ERROR',
          correlationId: 'corr-lookup',
          errors: [{ message: 'nested detail' }],
        }),
      );
      const result = await lookupDistinctEmails('pat-test', ['a@example.com'], {});
      const outcome = result.get('a@example.com');
      expect(outcome?.kind).toBe('error');
      const generated = outcome?.kind === 'error' && generateErrorObject(outcome.error);
      expect(generated).toEqual(
        expect.objectContaining({
          status,
          message: 'Lookup failed (category: REQUEST_ERROR, correlationId: corr-lookup)',
        }),
      );
      // NetworkError defaults destinationResponse to ''; the raw HubSpot body must stay absent.
      expect(generated && generated.destinationResponse).toBeFalsy();
    },
  );

  it('does not reuse a previous invocation or another credential', async () => {
    mockHttpPost.mockImplementation(
      async (_url: string, body: { inputs: { id: string }[] }, options) => {
        const token = options.headers.Authorization as string;
        const id = token.endsWith('token-a') ? '1' : '2';
        return httpSuccess(foundBody(body.inputs.map((input) => ({ email: input.id, id }))));
      },
    );

    const first = await lookupDistinctEmails('token-a', ['a@example.com'], {});
    const second = await lookupDistinctEmails('token-a', ['a@example.com'], {});
    const other = await lookupDistinctEmails('token-b', ['a@example.com'], {});

    expect(mockHttpPost).toHaveBeenCalledTimes(3);
    expect(first.get('a@example.com')).toEqual({ kind: 'found', recordId: '1' });
    expect(second.get('a@example.com')).toEqual({ kind: 'found', recordId: '1' });
    expect(other.get('a@example.com')).toEqual({ kind: 'found', recordId: '2' });
    expect(mockHttpPost.mock.calls[2][2].headers.Authorization).toBe('Bearer token-b');
  });
});
