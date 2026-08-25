import { routerOutputToProxyRequests } from './routerProxyRequests';
import type { RouterOutput } from './types';

describe('routerOutputToProxyRequests', () => {
  it('preserves proxy metadata fields used by destination network handlers', () => {
    const routerOutput: RouterOutput = {
      batchedRequest: {
        version: '1',
        type: 'REST',
        method: 'POST',
        endpoint: 'https://rest.iad-03.braze.com/users/track',
        endpointPath: 'users/track',
        headers: { Authorization: 'Bearer test' },
        params: {},
        body: { JSON: { attributes: [{ external_id: 'user-1' }] } },
        files: {},
      },
      metadata: [
        {
          jobId: 42,
          attemptNum: 0,
          userId: 'user-1',
          sourceId: 'source-1',
          destinationId: 'destination-1',
          workspaceId: 'workspace-1',
          secret: {},
          destInfo: { attributesIndices: [0] },
          omitempty: { tracked: true },
          dontBatch: false,
        },
      ],
      destination: {
        ID: 'destination-1',
        Config: {},
      },
      batched: true,
      statusCode: 200,
    };

    const [proxyRequest] = routerOutputToProxyRequests(routerOutput);

    expect(proxyRequest.metadata).toEqual([
      {
        jobId: 42,
        attemptNum: 0,
        userId: 'user-1',
        sourceId: 'source-1',
        destinationId: 'destination-1',
        workspaceId: 'workspace-1',
        secret: {},
        destInfo: { attributesIndices: [0] },
        omitempty: { tracked: true },
        dontBatch: false,
      },
    ]);
  });

  it('defaults optional proxy metadata records to empty objects', () => {
    const routerOutput: RouterOutput = {
      batchedRequest: {
        version: '1',
        type: 'REST',
        method: 'POST',
        endpoint: 'https://rest.iad-03.braze.com/users/track',
        endpointPath: 'users/track',
        headers: { Authorization: 'Bearer test' },
        params: {},
        body: { JSON: { attributes: [{ external_id: 'user-1' }] } },
        files: {},
      },
      metadata: [
        {
          jobId: 42,
          attemptNum: 0,
          userId: 'user-1',
          sourceId: 'source-1',
          destinationId: 'destination-1',
          workspaceId: 'workspace-1',
          secret: {},
          destInfo: 'invalid',
          omitempty: null,
          dontBatch: false,
        },
      ],
      destination: {
        ID: 'destination-1',
        Config: {},
      },
      batched: true,
      statusCode: 200,
    };

    const [proxyRequest] = routerOutputToProxyRequests(routerOutput);

    expect(proxyRequest.metadata).toEqual([
      {
        jobId: 42,
        attemptNum: 0,
        userId: 'user-1',
        sourceId: 'source-1',
        destinationId: 'destination-1',
        workspaceId: 'workspace-1',
        secret: {},
        destInfo: {},
        omitempty: {},
        dontBatch: false,
      },
    ]);
  });
});
