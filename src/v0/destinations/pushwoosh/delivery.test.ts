import {
  firstJobIdentity,
  handleDeliveryResponse,
  type DeliveryContext,
} from '../../../services/destination/destinationIntegration/delivery';
import type { ProxyMetdata, ProxyV1Request } from '../../../types';
import { Integration } from './routerTransform';

const job = (jobId: number) =>
  ({
    jobId,
    attemptNum: 1,
    userId: `user-${jobId}`,
    sourceId: 'source-1',
    destinationId: 'pushwoosh-dest-1',
    workspaceId: 'ws-1',
    secret: {},
    dontBatch: false,
  }) as ProxyMetdata;

const context = (status: number, response: unknown): DeliveryContext => {
  const jobs = [job(1), job(2)];
  return {
    status,
    response,
    jobs,
    request: { body: { JSON: {} } } as unknown as ProxyV1Request,
    destinationConfig: {},
    ...firstJobIdentity(jobs),
  };
};

// Response bodies captured from the live Pushwoosh API.
const cases = [
  {
    name: 'post-events empty 200 is a success',
    status: 200,
    response: '',
    expected: { kind: 'success' },
  },
  {
    name: 'post-events 400 configuration error aborts the whole batch',
    status: 400,
    response: { message: 'missing application code' },
    expected: { kind: 'abort', reason: 'missing application code' },
  },
  {
    name: 'post-events 401 aborts without an auth refresh',
    status: 401,
    response: { message: 'unauthorized' },
    expected: { kind: 'abort', reason: 'unauthorized' },
  },
  {
    name: 'post-events 400 decode failure is retried with dontBatch',
    status: 400,
    response: {
      action: 'post event',
      status: 'failure',
      error: { message: 'Time.UnmarshalJSON: input is not a JSON string' },
    },
    expected: {
      kind: 'retry',
      reason: 'Pushwoosh rejected the events batch: Time.UnmarshalJSON: input is not a JSON string',
      dontBatch: true,
    },
  },
  {
    name: 'setTags 400 with status_code 210 aborts with the status message',
    status: 400,
    response: { status_code: 210, status_message: 'hwid or userId should be set', response: null },
    expected: { kind: 'abort', reason: 'hwid or userId should be set (status_code: 210)' },
  },
  {
    name: 'setTags 400 with an empty status message keeps the status code',
    status: 400,
    response: { status_code: 210, status_message: '', response: null },
    expected: { kind: 'abort', reason: 'Pushwoosh request failed (status_code: 210)' },
  },
  {
    name: 'unrecognised 5xx body is retried with the generic reason',
    status: 503,
    response: '',
    expected: {
      kind: 'retry',
      reason: '[Generic Response Handler] Request failed with status: 503',
    },
  },
];

describe('Pushwoosh delivery', () => {
  it.each(cases)('$name', ({ status, response, expected }) => {
    expect(handleDeliveryResponse(Integration, context(status, response))).toEqual(expected);
  });
});
