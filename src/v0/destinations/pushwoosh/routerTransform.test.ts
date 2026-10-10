import type { Destination, RouterTransformationRequestData } from '../../../types';
import { processDestinationIntegration } from '../../../services/destination/destinationIntegration/processDestinationIntegration';
import { EVENTS_ENDPOINT, MAX_BATCH_SIZE, SET_TAGS_ENDPOINT } from './config';
import { Integration } from './routerTransform';

const destination: Destination = {
  ID: 'pushwoosh-dest-1',
  Name: 'PUSHWOOSH',
  DestinationDefinition: {
    ID: 'pushwoosh-def-1',
    Name: 'PUSHWOOSH',
    DisplayName: 'Pushwoosh',
    Config: {},
  },
  Config: { appCode: 'ABCDE-12345', apiToken: 'token-1' },
  Enabled: true,
  WorkspaceID: 'ws-1',
  Transformations: [],
};

const input = (
  jobId: number,
  message: RouterTransformationRequestData['message'],
): RouterTransformationRequestData =>
  ({
    message,
    destination,
    metadata: { jobId, workspaceId: 'ws-1', destinationId: 'pushwoosh-dest-1' },
  }) as RouterTransformationRequestData;

const track = (jobId: number) =>
  input(jobId, {
    type: 'track',
    userId: `user-${jobId}`,
    event: 'Purchase',
    timestamp: '2026-10-10T10:00:00.000Z',
  });

const identify = (jobId: number) =>
  input(jobId, { type: 'identify', userId: `user-${jobId}`, traits: { plan: 'pro' } });

const requestSummary = (results: Awaited<ReturnType<typeof processDestinationIntegration>>) =>
  results.map((result) => ({
    endpoint:
      result.batchedRequest && 'endpoint' in result.batchedRequest
        ? result.batchedRequest.endpoint
        : undefined,
    jobIds: result.metadata.map(({ jobId }) => Number(jobId)),
    statusCode: result.statusCode,
  }));

describe('PushwooshIntegration batching', () => {
  it('chunks track events into post-events requests of at most MAX_BATCH_SIZE', async () => {
    const jobIds = Array.from({ length: MAX_BATCH_SIZE + 1 }, (_, i) => i + 1);
    const results = await processDestinationIntegration(jobIds.map(track), Integration, {});

    expect(requestSummary(results)).toEqual([
      { endpoint: EVENTS_ENDPOINT, jobIds: jobIds.slice(0, MAX_BATCH_SIZE), statusCode: 200 },
      { endpoint: EVENTS_ENDPOINT, jobIds: [MAX_BATCH_SIZE + 1], statusCode: 200 },
    ]);
  });

  it('sends every identify as its own setTags request', async () => {
    const results = await processDestinationIntegration(
      [identify(1), track(2), identify(3)],
      Integration,
      {},
    );

    const byFirstJob = requestSummary(results).sort((a, b) => a.jobIds[0] - b.jobIds[0]);
    expect(byFirstJob).toEqual([
      { endpoint: SET_TAGS_ENDPOINT, jobIds: [1], statusCode: 200 },
      { endpoint: EVENTS_ENDPOINT, jobIds: [2], statusCode: 200 },
      { endpoint: SET_TAGS_ENDPOINT, jobIds: [3], statusCode: 200 },
    ]);
  });
});
