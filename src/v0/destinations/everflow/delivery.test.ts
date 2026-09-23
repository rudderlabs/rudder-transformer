import {
  firstJobIdentity,
  handleDeliveryResponse,
  toDeliveryV1Response,
  type DeliveryContext,
} from '../../../services/destination/destinationIntegration/delivery';
import type { ProxyMetdata, ProxyV1Request } from '../../../types';
import { Integration } from './routerTransform';

const metadata = {
  jobId: 1,
  attemptNum: 1,
  userId: 'user-1',
  sourceId: 'source-1',
  destinationId: 'everflow-dest-1',
  workspaceId: 'ws-1',
  secret: {},
  dontBatch: false,
} as ProxyMetdata;

const context = (status: number, response: unknown): DeliveryContext => ({
  status,
  response,
  jobs: [metadata],
  request: { body: { JSON: {} } } as unknown as ProxyV1Request,
  destinationConfig: {},
  ...firstJobIdentity([metadata]),
});

const deliver = (status: number, response: unknown) => {
  const ctx = context(status, response);
  return toDeliveryV1Response(handleDeliveryResponse(Integration, ctx), ctx, 'EVERFLOW');
};

describe('Everflow delivery', () => {
  it('treats HTTP 200 as success', () => {
    expect(deliver(200, '')).toEqual({
      status: 200,
      message: '[EVERFLOW] Request processed successfully',
      response: [{ statusCode: 200, metadata, error: 'success' }],
    });
  });

  it('treats HTTP 204 as a terminal failed event despite generic 2xx handling', () => {
    expect(deliver(204, '')).toEqual({
      status: 204,
      message:
        '[EVERFLOW] Everflow rejected the conversion (status 204); no error detail returned. Check the Everflow conversion report.',
      response: [
        {
          statusCode: 400,
          metadata,
          error:
            'Everflow rejected the conversion (status 204); no error detail returned. Check the Everflow conversion report.',
        },
      ],
      statTags: {
        errorCategory: 'network',
        errorType: 'aborted',
      },
    });
  });

  it.each([
    {
      name: 'non-empty string',
      status: 400,
      response: '  rejected conversion  ',
      reason: 'rejected conversion',
      verdict: { kind: 'abort' },
    },
    {
      name: 'non-empty object',
      status: 400,
      response: { code: 12, error: 'invalid transaction' },
      reason: '{"code":12,"error":"invalid transaction"}',
      verdict: { kind: 'abort' },
    },
    {
      name: 'empty object',
      status: 400,
      response: {},
      reason:
        'Everflow rejected the conversion (status 400); no error detail returned. Check the Everflow conversion report.',
      verdict: { kind: 'abort' },
    },
    {
      name: 'empty string',
      status: 400,
      response: '   ',
      reason:
        'Everflow rejected the conversion (status 400); no error detail returned. Check the Everflow conversion report.',
      verdict: { kind: 'abort' },
    },
    {
      name: 'rate limit',
      status: 429,
      response: 'Rate limited',
      reason: 'Rate limited',
      verdict: { kind: 'retry', as: 'throttled' },
    },
    {
      name: 'server error',
      status: 500,
      response: '',
      reason:
        'Everflow rejected the conversion (status 500); no error detail returned. Check the Everflow conversion report.',
      verdict: { kind: 'retry' },
    },
  ])(
    'uses the complete $name response with the default status classification',
    ({ status, response, reason, verdict }) => {
      expect(handleDeliveryResponse(Integration, context(status, response))).toEqual({
        ...verdict,
        reason,
      });
    },
  );
});
