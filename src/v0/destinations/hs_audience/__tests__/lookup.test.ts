jest.mock('../../../../adapters/network');

import { httpPOST } from '../../../../adapters/network';
import { generateErrorObject } from '../../../util';
import { correlateContactLookup, lookupDistinctEmails } from '../lookup';

const mockHttpPost = httpPOST as unknown as jest.Mock;
const LARGE_ID = '9007199254740993';

function httpSuccess(data: unknown, status = 200) {
  return { success: true, response: { data, status, headers: {} } };
}

function httpFailure(status: number, data: unknown = { message: 'raw-body-sentinel' }) {
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

    expect(correlated?.get('a@example.com')).toEqual({ kind: 'found', recordId: '123' });
    expect(correlated?.get('b@example.com')).toEqual({ kind: 'found', recordId: LARGE_ID });
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

    expect(correlated?.get('missing@example.com')).toEqual({ kind: 'miss' });
  });

  it('rejects a miss that is only named in message text', () => {
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
    ).toBeNull();
  });

  it('accepts a partial body only when every requested email is accounted for once', () => {
    expect(
      correlateContactLookup(['a@example.com', 'b@example.com'], {
        status: 'COMPLETE',
        results: [{ id: '1', properties: { email: 'a@example.com' } }],
        errors: [{ category: 'OBJECT_NOT_FOUND', context: { ids: ['b@example.com'] } }],
      })?.get('b@example.com'),
    ).toEqual({ kind: 'miss' });

    expect(
      correlateContactLookup(['a@example.com', 'b@example.com'], {
        status: 'COMPLETE',
        results: [{ id: '1', properties: { email: 'a@example.com' } }],
        errors: [],
      }),
    ).toBeNull();
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

    expect(correlated?.get('a@example.com')).toEqual({ kind: 'found', recordId: '1' });
  });

  it.each([
    ['incomplete status', { status: 'PENDING', results: [], errors: [] }],
    [
      'email in both results and errors',
      {
        status: 'COMPLETE',
        results: [{ id: '1', properties: { email: 'a@example.com' } }],
        errors: [{ category: 'OBJECT_NOT_FOUND', context: { ids: ['a@example.com'] } }],
      },
    ],
    [
      'two results disagree',
      {
        status: 'COMPLETE',
        results: [
          { id: '1', properties: { email: 'a@example.com' } },
          { id: '2', properties: { email: 'a@example.com' } },
        ],
        errors: [],
      },
    ],
    [
      'error category is not OBJECT_NOT_FOUND',
      {
        status: 'COMPLETE',
        results: [],
        errors: [{ category: 'VALIDATION_ERROR', context: { ids: ['a@example.com'] } }],
      },
    ],
    [
      'context.ids is not a string array',
      {
        status: 'COMPLETE',
        results: [],
        errors: [{ category: 'OBJECT_NOT_FOUND', context: { ids: [1] } }],
      },
    ],
    [
      'result id is malformed',
      {
        status: 'COMPLETE',
        results: [{ id: '0', properties: { email: 'a@example.com' } }],
        errors: [],
      },
    ],
    [
      'numErrors does not match the error entries',
      {
        status: 'COMPLETE',
        numErrors: 2,
        results: [{ id: '1', properties: { email: 'a@example.com' } }],
        errors: [],
      },
    ],
  ])('retries the chunk when the body is %s', (_name, body) => {
    expect(correlateContactLookup(['a@example.com'], body)).toBeNull();
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
      properties: ['email'],
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

  it('does not mark a malformed or incomplete chunk as a miss', async () => {
    mockHttpPost.mockResolvedValueOnce(
      httpSuccess({
        status: 'COMPLETE',
        results: [{ id: '1', properties: { email: 'a@example.com' } }],
        errors: [],
      }),
    );

    const lookedUp = await lookupDistinctEmails('pat-test', ['a@example.com', 'b@example.com'], {});

    expect(lookedUp.get('a@example.com')?.kind).toBe('error');
    expect(lookedUp.get('b@example.com')?.kind).toBe('error');
    const failure = lookedUp.get('a@example.com');
    if (failure?.kind !== 'error') {
      throw new Error('expected a chunk error');
    }
    const generated = generateErrorObject(failure.error);
    expect(generated.message).toBe('HubSpot contact lookup response could not be correlated');
    expect(generated.status).toBe(500);
    expect(generated.message).not.toContain('raw-body');
  });

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
    expect(generateErrorObject(middle.error).message).toBe(
      'HubSpot contact lookup is temporarily unavailable',
    );
    expect(generateErrorObject(middle.error).message).not.toContain('raw-body-sentinel');
  });

  it('classifies auth, scope, throttle, and transport without treating them as misses', async () => {
    mockHttpPost.mockResolvedValueOnce(httpFailure(401, { message: 'token pat-secret' }));
    const rejected = await lookupDistinctEmails('pat-test', ['a@example.com'], {});
    const rejectedError = rejected.get('a@example.com');
    if (rejectedError?.kind !== 'error') {
      throw new Error('expected an auth error');
    }
    const generated = generateErrorObject(rejectedError.error);
    expect(generated.message).toBe('HubSpot rejected the access token');
    expect(generated.status).toBe(401);
    expect(generated.authErrorCategory || '').toBe('');
    expect(generated.message).not.toContain('pat-secret');

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
    expect(generateErrorObject(rejectedLookupError.error).message).toBe(
      'HubSpot contact lookup was rejected',
    );
    expect(generateErrorObject(rejectedLookupError.error).message).not.toContain(
      'raw-body-sentinel',
    );

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
