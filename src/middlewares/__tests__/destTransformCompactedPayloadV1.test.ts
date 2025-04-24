import * as Koa from 'koa';
import { DestTransformCompactedPayloadV1Middleware } from '../destTransformCompactedPayloadV1';
import {
  ProcessorTransformationRequest,
  ProcessorCompactedTransformationRequest,
} from '../../types';
import { PlatformError } from '@rudderstack/integrations-lib';

afterEach(() => {
  jest.clearAllMocks();
});

describe('DestTransformCompactedPayloadV1Middleware', () => {
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
    const originalBody = [
      {
        ...input,
        destination: destination,
        connection: connection,
      },
    ] as ProcessorTransformationRequest[];
    const ctx = {
      request: {
        body: originalBody,
      },
    } as Koa.Context;
    ctx.get = jest.fn((v: string) => '');

    await DestTransformCompactedPayloadV1Middleware(ctx, async () => {
      expect(ctx.request.body).toEqual(originalBody);
    });
  });

  it('should alter body if http header is present', async () => {
    const expectedBody = [
      {
        ...input,
        destination: destination,
        connection: connection,
      },
    ] as ProcessorTransformationRequest[];

    const ctx = {
      request: {
        body: {
          input: [
            {
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
            },
          ],
          destinations: {
            destinationId: destination,
          },
          connections: {
            'sourceId:destinationId': connection,
          },
        } as ProcessorCompactedTransformationRequest,
      },
    } as Koa.Context;
    ctx.get = jest.fn((v) => (v === 'x-content-format' ? 'json+compactedv1' : ''));

    await DestTransformCompactedPayloadV1Middleware(ctx, async () => {
      expect(ctx.request.body).toEqual(expectedBody);
    });
  });

  it('should throw an error if destination is missing', async () => {
    const ctx = {
      request: {
        body: {
          input: [
            {
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
            },
          ],
          destinations: {
            destinationId1: destination,
          },
          connections: {
            'sourceId:destinationId': connection,
          },
        } as ProcessorCompactedTransformationRequest,
      },
    } as Koa.Context;
    ctx.get = jest.fn((v) => (v === 'x-content-format' ? 'json+compactedv1' : ''));

    try {
      await DestTransformCompactedPayloadV1Middleware(ctx, async () => {
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
          input: [
            {
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
            },
          ],
          destinations: {
            destinationId: destination,
          },
          connections: {
            'sourceId:destinationId1': connection,
          },
        } as ProcessorCompactedTransformationRequest,
      },
    } as Koa.Context;
    ctx.get = jest.fn((v) => (v === 'x-content-format' ? 'json+compactedv1' : ''));

    try {
      await DestTransformCompactedPayloadV1Middleware(ctx, async () => {
        fail('should not call next middleware');
      });
    } catch (error) {
      expect(error).toBeInstanceOf(PlatformError);
      expect((error as Error).message).toBe(`no connection found for id sourceId:destinationId`);
    }
  });
});
