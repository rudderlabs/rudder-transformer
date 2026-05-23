jest.mock('../../../../util/stats', () => ({
  counter: jest.fn(),
  increment: jest.fn(),
  histogram: jest.fn(),
}));

import { AudienceListStrategy } from '../strategies/audience-list';
import type { IterableAudienceProxyInput } from '../types';
import type { GenericProxyHandlerInput } from '../../iterable/types';
import { TransformerProxyError } from '../../../../v0/util/errorTypes';

const stats = require('../../../../util/stats');

const SUBSCRIBE_ENDPOINT = 'https://api.iterable.com/api/lists/subscribe';
const UNSUBSCRIBE_ENDPOINT = 'https://api.iterable.com/api/lists/unsubscribe';

type IdentifierShape = { email?: string; userId?: string };

const createMetadata = (jobId: number, identifier: IdentifierShape = {}) => ({
  jobId,
  userId: identifier.userId ?? '',
  attemptNum: 1,
  sourceId: 'src-1',
  destinationId: 'dest-1',
  workspaceId: 'ws-1',
  secret: {},
  dontBatch: false,
});

const buildProxyV1Request = (
  endpoint: string,
  body: { listId: number | string; subscribers: IdentifierShape[]; channelUnsubscribe?: boolean },
) =>
  ({
    version: 'v1',
    type: 'REST',
    method: 'POST',
    endpoint,
    userId: '',
    headers: { 'Content-Type': 'application/json' },
    body: { JSON: body },
    files: {},
    metadata: [],
    destinationConfig: {},
  }) as unknown as IterableAudienceProxyInput['destinationRequest'];

const buildInput = (
  destinationResponseBody: Record<string, unknown>,
  subscribers: IdentifierShape[],
  endpoint: string = SUBSCRIBE_ENDPOINT,
  status: number = 200,
): IterableAudienceProxyInput => ({
  destinationResponse: {
    status,
    response: destinationResponseBody,
  },
  rudderJobMetadata: subscribers.map((s, idx) => createMetadata(idx + 1, s)),
  destType: 'ITERABLE_AUDIENCE',
  destinationRequest: buildProxyV1Request(endpoint, {
    listId: 12345,
    subscribers:
      subscribers as IterableAudienceProxyInput['destinationRequest']['body']['JSON']['subscribers'],
    channelUnsubscribe: endpoint.includes('/api/lists/unsubscribe') ? false : undefined,
  }),
});

describe('AudienceListStrategy', () => {
  let strategy: AudienceListStrategy;

  beforeEach(() => {
    strategy = new AudienceListStrategy();
    jest.clearAllMocks();
  });

  describe('handleSuccess', () => {
    it('returns 200 for every subscriber when the batch is fully successful', () => {
      const subscribers = [{ email: 'a@b.com' }, { email: 'c@d.com' }, { email: 'e@f.com' }];
      const input = buildInput({ successCount: 3, failCount: 0 }, subscribers);

      const result = strategy.handleSuccess(input);

      expect(result.status).toBe(200);
      expect(result.message).toBe(
        '[ITERABLE_AUDIENCE Response Handler] - Request Processed Successfully',
      );
      expect(result.response).toHaveLength(3);
      result.response.forEach((entry) => {
        expect(entry.statusCode).toBe(200);
        expect(entry.error).toBe('success');
      });
    });

    it('classifies subscribers in top-level invalidEmails as 400', () => {
      const subscribers = [{ email: 'good@example.com' }, { email: 'bad@example.com' }];
      const input = buildInput(
        { successCount: 1, failCount: 1, invalidEmails: ['bad@example.com'] },
        subscribers,
      );

      const result = strategy.handleSuccess(input);

      expect(result.response[0].statusCode).toBe(200);
      expect(result.response[1].statusCode).toBe(400);
      expect(result.response[1].error).toContain('bad@example.com');
      expect(result.response[1].error).toContain('invalidEmails');
    });

    it('classifies subscribers in failedUpdates.invalidEmails as 400', () => {
      const subscribers = [{ email: 'invalid@example.com' }];
      const input = buildInput(
        {
          successCount: 0,
          failCount: 1,
          failedUpdates: { invalidEmails: ['invalid@example.com'] },
        },
        subscribers,
      );

      const result = strategy.handleSuccess(input);

      expect(result.response[0].statusCode).toBe(400);
      expect(result.response[0].error).toContain('failedUpdates.invalidEmails');
    });

    it('classifies subscribers in failedUpdates.conflictEmails as 400', () => {
      const subscribers = [{ email: 'conflict@example.com' }];
      const input = buildInput(
        {
          successCount: 0,
          failCount: 1,
          failedUpdates: { conflictEmails: ['conflict@example.com'] },
        },
        subscribers,
      );

      const result = strategy.handleSuccess(input);

      expect(result.response[0].statusCode).toBe(400);
      expect(result.response[0].error).toContain('failedUpdates.conflictEmails');
    });

    it('classifies subscribers in failedUpdates.conflictUserIds as 400', () => {
      const subscribers = [{ userId: 'conflict_user' }];
      const input = buildInput(
        {
          successCount: 0,
          failCount: 1,
          failedUpdates: { conflictUserIds: ['conflict_user'] },
        },
        subscribers,
      );

      const result = strategy.handleSuccess(input);

      expect(result.response[0].statusCode).toBe(400);
      expect(result.response[0].error).toContain('failedUpdates.conflictUserIds');
    });

    it('classifies subscribers in failedUpdates.invalidUserIds as 400', () => {
      const subscribers = [{ userId: 'bad_user' }];
      const input = buildInput(
        {
          successCount: 0,
          failCount: 1,
          failedUpdates: { invalidUserIds: ['bad_user'] },
        },
        subscribers,
      );

      const result = strategy.handleSuccess(input);

      expect(result.response[0].statusCode).toBe(400);
      expect(result.response[0].error).toContain('failedUpdates.invalidUserIds');
    });

    it('classifies subscribers in failedUpdates.invalidDataEmails as 400', () => {
      const subscribers = [{ email: 'baddata@example.com' }];
      const input = buildInput(
        {
          successCount: 0,
          failCount: 1,
          failedUpdates: { invalidDataEmails: ['baddata@example.com'] },
        },
        subscribers,
      );

      const result = strategy.handleSuccess(input);

      expect(result.response[0].statusCode).toBe(400);
      expect(result.response[0].error).toContain('failedUpdates.invalidDataEmails');
    });

    it('classifies subscribers in failedUpdates.invalidDataUserIds as 400', () => {
      const subscribers = [{ userId: 'baddata_user' }];
      const input = buildInput(
        {
          successCount: 0,
          failCount: 1,
          failedUpdates: { invalidDataUserIds: ['baddata_user'] },
        },
        subscribers,
      );

      const result = strategy.handleSuccess(input);

      expect(result.response[0].statusCode).toBe(400);
      expect(result.response[0].error).toContain('failedUpdates.invalidDataUserIds');
    });

    it('classifies failedUpdates.notFoundEmails as 400 on subscribe', () => {
      const subscribers = [{ email: 'missing@example.com' }];
      const input = buildInput(
        {
          successCount: 0,
          failCount: 1,
          failedUpdates: { notFoundEmails: ['missing@example.com'] },
        },
        subscribers,
        SUBSCRIBE_ENDPOINT,
      );

      const result = strategy.handleSuccess(input);

      expect(result.response[0].statusCode).toBe(400);
      expect(result.response[0].error).toContain('failedUpdates.notFoundEmails');
    });

    it('classifies failedUpdates.notFoundEmails as 200 on unsubscribe', () => {
      const subscribers = [{ email: 'missing@example.com' }];
      const input = buildInput(
        {
          successCount: 0,
          failCount: 1,
          failedUpdates: { notFoundEmails: ['missing@example.com'] },
        },
        subscribers,
        UNSUBSCRIBE_ENDPOINT,
      );

      const result = strategy.handleSuccess(input);

      expect(result.response[0].statusCode).toBe(200);
      expect(result.response[0].error).toBe('success');
    });

    it('classifies failedUpdates.notFoundUserIds as 200 on unsubscribe', () => {
      const subscribers = [{ userId: 'user_missing' }];
      const input = buildInput(
        {
          successCount: 0,
          failCount: 1,
          failedUpdates: { notFoundUserIds: ['user_missing'] },
        },
        subscribers,
        UNSUBSCRIBE_ENDPOINT,
      );

      const result = strategy.handleSuccess(input);

      expect(result.response[0].statusCode).toBe(200);
      expect(result.response[0].error).toBe('success');
    });

    it('classifies failedUpdates.notFoundUserIds as 400 on subscribe', () => {
      const subscribers = [{ userId: 'user_missing' }];
      const input = buildInput(
        {
          successCount: 0,
          failCount: 1,
          failedUpdates: { notFoundUserIds: ['user_missing'] },
        },
        subscribers,
        SUBSCRIBE_ENDPOINT,
      );

      const result = strategy.handleSuccess(input);

      expect(result.response[0].statusCode).toBe(400);
      expect(result.response[0].error).toContain('failedUpdates.notFoundUserIds');
    });

    it('returns 200 and emits metric for forgottenEmails on subscribe (no value tagged)', () => {
      const subscribers = [{ email: 'forgotten@example.com' }];
      const input = buildInput(
        {
          successCount: 0,
          failCount: 1,
          failedUpdates: { forgottenEmails: ['forgotten@example.com'] },
        },
        subscribers,
        SUBSCRIBE_ENDPOINT,
      );

      const result = strategy.handleSuccess(input);

      expect(result.response[0].statusCode).toBe(200);
      expect(result.response[0].error).toBe('success');
      expect(stats.counter).toHaveBeenCalledTimes(1);
      expect(stats.counter).toHaveBeenCalledWith(
        'iterable_forgotten_user_violations',
        1,
        expect.objectContaining({
          destType: 'ITERABLE_AUDIENCE',
          destinationId: 'dest-1',
          workspaceId: 'ws-1',
          identifierType: 'email',
        }),
      );
      // GDPR: the email VALUE must never appear in tag values.
      const tagArg = (stats.counter as jest.Mock).mock.calls[0][2];
      expect(Object.values(tagArg)).not.toContain('forgotten@example.com');
    });

    it('returns 200 and emits metric for forgottenUserIds on subscribe', () => {
      const subscribers = [{ userId: 'forgotten_user' }];
      const input = buildInput(
        {
          successCount: 0,
          failCount: 1,
          failedUpdates: { forgottenUserIds: ['forgotten_user'] },
        },
        subscribers,
        SUBSCRIBE_ENDPOINT,
      );

      const result = strategy.handleSuccess(input);

      expect(result.response[0].statusCode).toBe(200);
      expect(stats.counter).toHaveBeenCalledWith(
        'iterable_forgotten_user_violations',
        1,
        expect.objectContaining({
          identifierType: 'userId',
        }),
      );
      const tagArg = (stats.counter as jest.Mock).mock.calls[0][2];
      expect(Object.values(tagArg)).not.toContain('forgotten_user');
    });

    it('matches emails case-insensitively when looking up failedUpdates.invalidEmails', () => {
      const subscribers = [{ email: 'Alice@Example.Com' }];
      const input = buildInput(
        {
          successCount: 0,
          failCount: 1,
          failedUpdates: { invalidEmails: ['alice@example.com'] },
        },
        subscribers,
      );

      const result = strategy.handleSuccess(input);

      expect(result.response[0].statusCode).toBe(400);
      expect(result.response[0].error).toContain('failedUpdates.invalidEmails');
    });

    it('matches userIds case-sensitively (no match on mismatched case)', () => {
      const subscribers = [{ userId: 'User_123' }];
      const input = buildInput(
        {
          successCount: 0,
          failCount: 1,
          failedUpdates: { invalidUserIds: ['user_123'] },
        },
        subscribers,
      );

      const result = strategy.handleSuccess(input);

      expect(result.response[0].statusCode).toBe(200);
      expect(result.response[0].error).toBe('success');
    });

    it('aligns per-jobId statuses with subscriber order in mixed batches', () => {
      const subscribers = [
        { email: 'forgotten@example.com' },
        { email: 'invalid@example.com' },
        { email: 'conflict@example.com' },
        { email: 'clean1@example.com' },
        { email: 'clean2@example.com' },
      ];
      const input = buildInput(
        {
          successCount: 2,
          failCount: 3,
          failedUpdates: {
            forgottenEmails: ['forgotten@example.com'],
            invalidEmails: ['invalid@example.com'],
            conflictEmails: ['conflict@example.com'],
          },
        },
        subscribers,
      );

      const result = strategy.handleSuccess(input);

      expect(result.response).toHaveLength(5);
      expect(result.response[0].statusCode).toBe(200); // forgotten
      expect(result.response[0].metadata.jobId).toBe(1);
      expect(result.response[1].statusCode).toBe(400); // invalid
      expect(result.response[1].metadata.jobId).toBe(2);
      expect(result.response[1].error).toContain('failedUpdates.invalidEmails');
      expect(result.response[2].statusCode).toBe(400); // conflict
      expect(result.response[2].metadata.jobId).toBe(3);
      expect(result.response[2].error).toContain('failedUpdates.conflictEmails');
      expect(result.response[3].statusCode).toBe(200); // clean
      expect(result.response[3].metadata.jobId).toBe(4);
      expect(result.response[4].statusCode).toBe(200); // clean
      expect(result.response[4].metadata.jobId).toBe(5);
      expect(stats.counter).toHaveBeenCalledTimes(1);
    });

    it('returns an empty response array for an empty subscribers array', () => {
      const input = buildInput({ successCount: 0, failCount: 0 }, []);

      const result = strategy.handleSuccess(input);

      expect(result.response).toEqual([]);
      expect(result.status).toBe(200);
    });
  });

  describe('handleError', () => {
    it('throws TransformerProxyError with AuthErrorCategory=AUTH on 401', () => {
      const mockInput: GenericProxyHandlerInput = {
        destinationResponse: {
          status: 401,
          response: { msg: 'invalid api key' },
        },
        rudderJobMetadata: [createMetadata(1), createMetadata(2)],
        destType: 'ITERABLE_AUDIENCE',
        destinationRequest: {} as GenericProxyHandlerInput['destinationRequest'],
      };

      let caught: TransformerProxyError | undefined;
      try {
        strategy.handleError(mockInput);
      } catch (err) {
        caught = err as TransformerProxyError;
      }

      expect(caught).toBeInstanceOf(TransformerProxyError);
      expect(caught?.status).toBe(401);
      expect(caught?.authErrorCategory).toBe('AUTH');
      expect(caught?.response).toHaveLength(2);
      caught?.response.forEach((entry: { statusCode: number; error: string }) => {
        expect(entry.statusCode).toBe(401);
        expect(entry.error).toContain('invalid api key');
      });
    });

    it.each([
      { name: '404', status: 404 },
      { name: '429', status: 429 },
      { name: '500', status: 500 },
    ])(
      'throws TransformerProxyError fanned-out over every metadata with no AuthErrorCategory on $name',
      ({ status }) => {
        const mockInput: GenericProxyHandlerInput = {
          destinationResponse: {
            status,
            response: { msg: `error ${status}` },
          },
          rudderJobMetadata: [createMetadata(1), createMetadata(2), createMetadata(3)],
          destType: 'ITERABLE_AUDIENCE',
          destinationRequest: {} as GenericProxyHandlerInput['destinationRequest'],
        };

        let caught: TransformerProxyError | undefined;
        try {
          strategy.handleError(mockInput);
        } catch (err) {
          caught = err as TransformerProxyError;
        }

        expect(caught).toBeInstanceOf(TransformerProxyError);
        expect(caught?.status).toBe(status);
        expect(caught?.authErrorCategory).toBe('');
        expect(caught?.response).toHaveLength(3);
        caught?.response.forEach(
          (entry: { statusCode: number; error: string; metadata: { jobId: number } }) => {
            expect(entry.statusCode).toBe(status);
            expect(entry.error).toContain(`error ${status}`);
          },
        );
        expect(
          caught?.response.map((e: { metadata: { jobId: number } }) => e.metadata.jobId),
        ).toEqual([1, 2, 3]);
      },
    );

    it('uses msg field for the error message when present', () => {
      const mockInput: GenericProxyHandlerInput = {
        destinationResponse: {
          status: 500,
          response: { msg: 'internal server error' },
        },
        rudderJobMetadata: [createMetadata(1)],
        destType: 'ITERABLE_AUDIENCE',
        destinationRequest: {} as GenericProxyHandlerInput['destinationRequest'],
      };

      try {
        strategy.handleError(mockInput);
      } catch (err) {
        const proxyErr = err as TransformerProxyError;
        expect(proxyErr.response[0].error).toBe('"internal server error"');
      }
    });

    it('uses params field for the error message when present', () => {
      const mockInput: GenericProxyHandlerInput = {
        destinationResponse: {
          status: 400,
          response: { params: { code: 'BAD_REQUEST' } },
        },
        rudderJobMetadata: [createMetadata(1)],
        destType: 'ITERABLE_AUDIENCE',
        destinationRequest: {} as GenericProxyHandlerInput['destinationRequest'],
      };

      try {
        strategy.handleError(mockInput);
      } catch (err) {
        const proxyErr = err as TransformerProxyError;
        expect(proxyErr.response[0].error).toBe('{"code":"BAD_REQUEST"}');
      }
    });

    it("returns 'unknown error format' for an empty response body", () => {
      const mockInput: GenericProxyHandlerInput = {
        destinationResponse: {
          status: 502,
          response: {},
        },
        rudderJobMetadata: [createMetadata(1)],
        destType: 'ITERABLE_AUDIENCE',
        destinationRequest: {} as GenericProxyHandlerInput['destinationRequest'],
      };

      try {
        strategy.handleError(mockInput);
      } catch (err) {
        const proxyErr = err as TransformerProxyError;
        expect(proxyErr.response[0].error).toBe('unknown error format');
      }
    });
  });

  describe('handleResponse routing', () => {
    it('routes 2xx responses to handleSuccess', () => {
      const handleSuccessSpy = jest
        .spyOn(strategy, 'handleSuccess')
        .mockImplementation(() => undefined as never);
      const handleErrorSpy = jest.spyOn(strategy, 'handleError').mockImplementation(() => {});

      const input = buildInput(
        { successCount: 1, failCount: 0 },
        [{ email: 'a@b.com' }],
        SUBSCRIBE_ENDPOINT,
        200,
      );

      strategy.handleResponse(input);

      expect(handleSuccessSpy).toHaveBeenCalledTimes(1);
      expect(handleErrorSpy).not.toHaveBeenCalled();
    });

    it('routes non-2xx responses to handleError', () => {
      const handleSuccessSpy = jest
        .spyOn(strategy, 'handleSuccess')
        .mockImplementation(() => undefined as never);
      const handleErrorSpy = jest.spyOn(strategy, 'handleError').mockImplementation(() => {});

      const input = buildInput(
        { msg: 'bad request' },
        [{ email: 'a@b.com' }],
        SUBSCRIBE_ENDPOINT,
        400,
      );

      strategy.handleResponse(input);

      expect(handleErrorSpy).toHaveBeenCalledTimes(1);
      expect(handleSuccessSpy).not.toHaveBeenCalled();
    });
  });
});
