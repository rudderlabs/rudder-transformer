import { networkHandler } from './networkHandler';

const buildHandler = () => {
  const h: any = {};
  networkHandler.call(h);
  return h;
};

const makeMetadata = (jobId: number) => ({
  jobId,
  attemptNum: 1,
  userId: `u${jobId}`,
  destinationId: 'dest-1',
  workspaceId: 'ws-1',
  sourceId: 'src-1',
  secret: {},
  dontBatch: false,
});

const makeBatch = (n: number) =>
  Array.from({ length: n }, (_, i) => ({
    type: 'person',
    action: 'identify',
    identifiers: { id: `u${i + 1}` },
  }));

describe('CustomerIO networkHandler', () => {
  describe('200 — all jobs succeed', () => {
    it('marks all jobs with statusCode 200', () => {
      const h = buildHandler();
      const metadata = [makeMetadata(1), makeMetadata(2)];
      const result = h.responseHandler({
        rudderJobMetadata: metadata,
        destinationResponse: { response: {}, status: 200 },
        destinationRequest: {
          endpoint: 'https://track.customer.io/api/v2/batch',
          body: { JSON: { batch: makeBatch(2) } },
        },
      });
      expect(result.status).toBe(200);
      expect(result.response).toHaveLength(2);
      result.response.forEach((r: any) => expect(r.statusCode).toBe(200));
    });
  });

  describe('207 — partial failure', () => {
    it('marks failed batch_index as 400 and others as 200', () => {
      const h = buildHandler();
      const metadata = [makeMetadata(1), makeMetadata(2), makeMetadata(3)];
      const response = {
        errors: [{ batch_index: 1, reason: 'invalid email' }],
      };
      const result = h.responseHandler({
        rudderJobMetadata: metadata,
        destinationResponse: { response, status: 207 },
        destinationRequest: {
          endpoint: 'https://track.customer.io/api/v2/batch',
          body: { JSON: { batch: makeBatch(3) } },
        },
      });
      expect(result.status).toBe(207);
      expect(result.response[0].statusCode).toBe(200);
      expect(result.response[1].statusCode).toBe(400);
      expect(result.response[1].error).toMatch(/invalid email/);
      expect(result.response[2].statusCode).toBe(200);
    });

    it('marks all as 200 when errors array is empty', () => {
      const h = buildHandler();
      const metadata = [makeMetadata(1), makeMetadata(2)];
      const result = h.responseHandler({
        rudderJobMetadata: metadata,
        destinationResponse: { response: { errors: [] }, status: 207 },
        destinationRequest: {
          endpoint: 'https://track.customer.io/api/v2/batch',
          body: { JSON: { batch: makeBatch(2) } },
        },
      });
      result.response.forEach((r: any) => expect(r.statusCode).toBe(200));
    });
  });

  describe('400 — whole batch aborted', () => {
    it('throws TransformerProxyError', () => {
      const h = buildHandler();
      expect(() =>
        h.responseHandler({
          rudderJobMetadata: [makeMetadata(1)],
          destinationResponse: { response: { message: 'Bad Request' }, status: 400 },
          destinationRequest: {
            endpoint: 'https://track.customer.io/api/v2/batch',
            body: { JSON: { batch: makeBatch(1) } },
          },
        }),
      ).toThrow();
    });
  });

  describe('401 — auth failure', () => {
    it('throws TransformerProxyError with REFRESH_TOKEN auth category', () => {
      const h = buildHandler();
      let thrown: any;
      try {
        h.responseHandler({
          rudderJobMetadata: [makeMetadata(1)],
          destinationResponse: { response: { message: 'Unauthorized' }, status: 401 },
          destinationRequest: {
            endpoint: 'https://track.customer.io/api/v2/batch',
            body: { JSON: { batch: makeBatch(1) } },
          },
        });
      } catch (err: any) {
        thrown = err;
      }
      expect(thrown).toBeDefined();
      // framework maps 401 -> REFRESH_TOKEN; AUTH_STATUS_INACTIVE is for 403
      expect(thrown.authErrorCategory).toBe('REFRESH_TOKEN');
    });

    it('throws TransformerProxyError with AUTH_STATUS_INACTIVE for 403', () => {
      const h = buildHandler();
      let thrown: any;
      try {
        h.responseHandler({
          rudderJobMetadata: [makeMetadata(1)],
          destinationResponse: { response: { message: 'Forbidden' }, status: 403 },
          destinationRequest: {
            endpoint: 'https://track.customer.io/api/v2/batch',
            body: { JSON: { batch: makeBatch(1) } },
          },
        });
      } catch (err: any) {
        thrown = err;
      }
      expect(thrown).toBeDefined();
      expect(thrown.authErrorCategory).toBe('AUTH_STATUS_INACTIVE');
    });
  });
});
