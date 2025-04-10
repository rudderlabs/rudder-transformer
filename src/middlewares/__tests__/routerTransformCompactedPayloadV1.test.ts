import * as Koa from 'koa';
import { RouterTransformCompactedPayloadV1Middleware } from '../routerTransformCompactedPayloadV1';
import { RouterTransformationRequest, RouterCompactedTransformationRequest } from '../../types';
import { PlatformError } from '@rudderstack/integrations-lib';

afterEach(() => {
  jest.clearAllMocks();
});

describe('RouterTransformCompactedPayloadV1Middleware', () => {
  const destination = {
    ID: 'destinationId',
    Name: 'destinationName',
    DestinationDefinition: {
      Name: 'testDestination',
      DisplayName: 'Test Destination',
      ID: 'testDestinationId',
      Config: {},
    },
    Config: {},
    Enabled: true,
    WorkspaceID: 'workspaceId',
    Transformations: [],
  };
  const connection = {
    sourceId: 'sourceId',
    destinationId: 'destinationId',
    enabled: true,
    config: {},
  };
  const input = {
    message: { type: 'track' },
    metadata: {
      sourceId: 'sourceId',
      destinationId: 'destinationId',
      messageId: 'messageId',
      workspaceId: 'workspaceId',
      sourceType: 'sourceType',
      sourceCategory: 'sourceCategory',
      jobId: 1,
      destinationType: 'destinationType',
    },
    libraries: [],
    credentials: [],
  };
  it('should not alter body if http header is not present', async () => {
    const originalBody = {
      input: [
        {
          ...input,
          destination: destination,
          connection: connection,
        },
      ],
      destType: 'testDestination',
    } as RouterTransformationRequest;
    const ctx = {
      request: {
        body: originalBody,
      },
    } as Koa.Context;
    ctx.get = jest.fn((v: string) => '');

    await RouterTransformCompactedPayloadV1Middleware(ctx, async () => {
      expect(ctx.request.body).toEqual(originalBody);
    });
  });

  it('should alter body if http header is present', async () => {
    const expectedBody = {
      input: [
        {
          ...input,
          destination: destination,
          connection: connection,
        },
      ],
      destType: 'testDestination',
    } as RouterTransformationRequest;

    const ctx = {
      request: {
        body: {
          input: [input],
          destinations: {
            destinationId: destination,
          },
          connections: {
            'sourceId:destinationId': connection,
          },
          destType: 'testDestination',
        } as RouterCompactedTransformationRequest,
      },
    } as Koa.Context;
    ctx.get = jest.fn((v) => (v === 'x-content-format' ? 'json+compactedv1' : ''));

    await RouterTransformCompactedPayloadV1Middleware(ctx, async () => {
      expect(ctx.request.body).toEqual(expectedBody);
    });
  });

  it('should throw an error if destination is missing', async () => {
    const ctx = {
      request: {
        body: {
          input: [input],
          destinations: {
            destinationId1: destination,
          },
          connections: {
            'sourceId:destinationId': connection,
          },
          destType: 'testDestination',
        } as RouterCompactedTransformationRequest,
      },
    } as Koa.Context;
    ctx.get = jest.fn((v) => (v === 'x-content-format' ? 'json+compactedv1' : ''));

    try {
      await RouterTransformCompactedPayloadV1Middleware(ctx, async () => {
        fail('should not call next middleware');
      });
    } catch (error) {
      expect(error).toBeInstanceOf(PlatformError);
      expect((error as Error).message).toBe(`no destination found for id destinationId`);
    }
  });

  it('should throw an error if connection is missing', async () => {
    const ctx = {
      request: {
        body: {
          input: [input],
          destinations: {
            destinationId: destination,
          },
          connections: {
            'sourceId:destinationId1': connection,
          },
          destType: 'testDestination',
        } as RouterCompactedTransformationRequest,
      },
    } as Koa.Context;
    ctx.get = jest.fn((v) => (v === 'x-content-format' ? 'json+compactedv1' : ''));

    try {
      await RouterTransformCompactedPayloadV1Middleware(ctx, async () => {
        fail('should not call next middleware');
      });
    } catch (error) {
      expect(error).toBeInstanceOf(PlatformError);
      expect((error as Error).message).toBe(`no connection found for id sourceId:destinationId`);
    }
  });
});
