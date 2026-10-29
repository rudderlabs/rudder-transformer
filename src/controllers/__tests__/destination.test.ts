import request from 'supertest';
import { createHttpTerminator } from 'http-terminator';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { applicationRoutes } from '../../routes';
import { ServiceSelector } from '../../helpers/serviceSelector';
import { DynamicConfigParser } from '../../util/dynamicConfigParser';
import { NativeIntegrationDestinationService } from '../../services/destination/nativeIntegration';

let server: any;
const OLD_ENV = process.env;

beforeAll(async () => {
  process.env = { ...OLD_ENV }; // Make a copy
  const app = new Koa();
  app.use(
    bodyParser({
      jsonLimit: '200mb',
    }),
  );
  applicationRoutes(app);
  server = app.listen();
});

afterAll(async () => {
  process.env = OLD_ENV; // Restore old environment
  const httpTerminator = createHttpTerminator({
    server,
  });
  await httpTerminator.terminate();
});

afterEach(() => {
  jest.clearAllMocks();
});

const getData = () => {
  return [{ event: { a: 'b1' } }, { event: { a: 'b2' } }];
};

const getRouterTransformInputData = () => {
  return {
    input: [
      { message: { a: 'b1' }, destination: {}, metadata: { jobId: 1 } },
      { message: { a: 'b2' }, destination: {}, metadata: { jobId: 2 } },
    ],
    destType: 'rudder_test',
  };
};

describe('Destination controller tests', () => {
  describe('Destination processor transform tests', () => {
    test('successful transformation at processor', async () => {
      const mockDestinationService = new NativeIntegrationDestinationService();

      const expectedOutput = [
        {
          event: { a: 'b1' },
          request: { query: {} },
          message: {},
        },
        {
          event: { a: 'b2' },
          request: { query: {} },
          message: {},
        },
      ];
      mockDestinationService.doProcessorTransformation = jest
        .fn()
        .mockImplementation((events, destinationType, version, requestMetadata) => {
          expect(events).toEqual(expectedOutput);
          expect(destinationType).toEqual('rudder_test');
          expect(version).toEqual('v0');

          return events;
        });
      const getDestinationServiceSpy = jest
        .spyOn(ServiceSelector, 'getDestinationServiceByType')
        .mockImplementation(() => {
          return mockDestinationService;
        });

      DynamicConfigParser.process = jest.fn().mockImplementation(async (events) => {
        return events;
      });

      const response = await request(server)
        .post('/v0/destinations/rudder_test')
        .set('Accept', 'application/json')
        .send(getData());

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(expectedOutput);

      expect(response.header['apiversion']).toEqual('2');

      expect(getDestinationServiceSpy).toHaveBeenCalledTimes(1);
      expect(mockDestinationService.doProcessorTransformation).toHaveBeenCalledTimes(1);
    });

    test('transformation at processor failure', async () => {
      const mockDestinationService = new NativeIntegrationDestinationService();

      const expectedOutput = [
        {
          statusCode: 500,
          error: 'Processor transformation failed',
          statTags: { errorCategory: 'transformation' },
        },
        {
          statusCode: 500,
          error: 'Processor transformation failed',
          statTags: { errorCategory: 'transformation' },
        },
      ];

      mockDestinationService.doProcessorTransformation = jest
        .fn()
        .mockImplementation((events, destinationType, version, requestMetadata) => {
          expect(destinationType).toEqual('rudder_test');
          expect(version).toEqual('v0');

          throw new Error('Processor transformation failed');
        });
      const getDestinationServiceSpy = jest
        .spyOn(ServiceSelector, 'getDestinationServiceByType')
        .mockImplementation(() => {
          return mockDestinationService;
        });

      DynamicConfigParser.process = jest.fn().mockImplementation(async (events) => {
        return events;
      });

      const response = await request(server)
        .post('/v0/destinations/rudder_test')
        .set('Accept', 'application/json')
        .send(getData());

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(expectedOutput);

      expect(response.header['apiversion']).toEqual('2');

      expect(getDestinationServiceSpy).toHaveBeenCalledTimes(1);
      expect(mockDestinationService.doProcessorTransformation).toHaveBeenCalledTimes(1);
    });
  });

  describe('Destination router transform tests', () => {
    test('successful transformation at router', async () => {
      const mockDestinationService = new NativeIntegrationDestinationService();

      const expectedOutput = [
        {
          message: { a: 'b1' },
          destination: {},
          metadata: { jobId: 1 },
          request: { query: {} },
        },
        {
          message: { a: 'b2' },
          destination: {},
          metadata: { jobId: 2 },
          request: { query: {} },
        },
      ];

      mockDestinationService.doRouterTransformation = jest
        .fn()
        .mockImplementation((events, destinationType, version, requestMetadata) => {
          expect(events).toEqual(expectedOutput);
          expect(destinationType).toEqual('rudder_test');
          expect(version).toEqual('v0');

          return events;
        });
      const getDestinationServiceSpy = jest
        .spyOn(ServiceSelector, 'getDestinationServiceByType')
        .mockImplementation(() => {
          return mockDestinationService;
        });

      DynamicConfigParser.process = jest.fn().mockImplementation(async (events) => {
        return events;
      });

      const response = await request(server)
        .post('/routerTransform')
        .set('Accept', 'application/json')
        .send(getRouterTransformInputData());

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ output: expectedOutput });

      expect(response.header['apiversion']).toEqual('2');

      expect(getDestinationServiceSpy).toHaveBeenCalledTimes(1);
      expect(mockDestinationService.doRouterTransformation).toHaveBeenCalledTimes(1);
    });

    test('transformation at router failure', async () => {
      const mockDestinationService = new NativeIntegrationDestinationService();

      mockDestinationService.doRouterTransformation = jest
        .fn()
        .mockImplementation((events, destinationType, version, requestMetadata) => {
          throw new Error('Router transformation failed');
        });
      const getDestinationServiceSpy = jest
        .spyOn(ServiceSelector, 'getDestinationServiceByType')
        .mockImplementation(() => {
          return mockDestinationService;
        });

      DynamicConfigParser.process = jest.fn().mockImplementation(async (events) => {
        return events;
      });

      const response = await request(server)
        .post('/routerTransform')
        .set('Accept', 'application/json')
        .send(getRouterTransformInputData());

      const expectedOutput = [
        {
          metadata: [{ jobId: 1 }, { jobId: 2 }],
          batched: false,
          statusCode: 500,
          error: 'Router transformation failed',
          statTags: { errorCategory: 'transformation' },
        },
      ];
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ output: expectedOutput });

      expect(response.header['apiversion']).toEqual('2');

      expect(getDestinationServiceSpy).toHaveBeenCalledTimes(1);
      expect(mockDestinationService.doRouterTransformation).toHaveBeenCalledTimes(1);
    });
  });

  describe('Batch transform tests', () => {
    test('successful batching at router', async () => {
      const mockDestinationService = new NativeIntegrationDestinationService();

      const expectedOutput = [
        {
          message: { a: 'b1' },
          destination: {},
          metadata: { jobId: 1 },
          request: { query: {} },
        },
        {
          message: { a: 'b2' },
          destination: {},
          metadata: { jobId: 2 },
          request: { query: {} },
        },
      ];

      mockDestinationService.doBatchTransformation = jest
        .fn()
        .mockImplementation((events, destinationType, version, requestMetadata) => {
          expect(events).toEqual(expectedOutput);
          expect(destinationType).toEqual('rudder_test');
          expect(version).toEqual('v0');

          return events;
        });
      const getDestinationServiceSpy = jest
        .spyOn(ServiceSelector, 'getDestinationServiceByType')
        .mockImplementation(() => {
          return mockDestinationService;
        });

      DynamicConfigParser.process = jest.fn().mockImplementation(async (events) => {
        return events;
      });

      const response = await request(server)
        .post('/batch')
        .set('Accept', 'application/json')
        .send(getRouterTransformInputData());

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(expectedOutput);

      expect(response.header['apiversion']).toEqual('2');

      expect(getDestinationServiceSpy).toHaveBeenCalledTimes(1);
      expect(mockDestinationService.doBatchTransformation).toHaveBeenCalledTimes(1);
    });

    test('batch transformation failure', async () => {
      const mockDestinationService = new NativeIntegrationDestinationService();

      mockDestinationService.doBatchTransformation = jest
        .fn()
        .mockImplementation((events, destinationType, version, requestMetadata) => {
          throw new Error('Batch transformation failed');
        });
      const getDestinationServiceSpy = jest
        .spyOn(ServiceSelector, 'getDestinationServiceByType')
        .mockImplementation(() => {
          return mockDestinationService;
        });

      DynamicConfigParser.process = jest.fn().mockImplementation(async (events) => {
        return events;
      });

      const response = await request(server)
        .post('/batch')
        .set('Accept', 'application/json')
        .send(getRouterTransformInputData());

      const expectedOutput = [
        {
          metadata: [{ jobId: 1 }, { jobId: 2 }],
          batched: false,
          statusCode: 500,
          error: 'Batch transformation failed',
          statTags: { errorCategory: 'transformation' },
        },
      ];
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(expectedOutput);

      expect(response.header['apiversion']).toEqual('2');

      expect(getDestinationServiceSpy).toHaveBeenCalledTimes(1);
      expect(mockDestinationService.doBatchTransformation).toHaveBeenCalledTimes(1);
    });
  });

  describe('Mixed-service router requests', () => {
    const httpDestination = (id: string, version: number, Config: Record<string, unknown>) => ({
      ID: id,
      Name: id,
      Enabled: true,
      WorkspaceID: 'ws-mixed',
      version,
      DestinationDefinition: { ID: 'http', Name: 'HTTP', DisplayName: 'HTTP', Config: {} },
      Config,
    });
    const v1 = httpDestination('dest-v1', 1, {
      apiUrl: 'https://example.com/v1',
      auth: 'noAuth',
      method: 'POST',
      format: 'JSON',
      isDefaultMapping: true,
      isBatchingEnabled: false,
    });
    const v2 = httpDestination('dest-v2', 2, {
      apiUrl: 'https://example.com/v2',
      auth: 'noAuth',
      requestBodyTemplate: '$$.events',
    });
    const input = (destination: typeof v1, jobId: number) => ({
      message: { type: 'track', event: 'E', userId: `u${jobId}` },
      metadata: { jobId, workspaceId: 'ws-mixed', destinationId: destination.ID },
      destination,
    });

    beforeEach(() => {
      jest.restoreAllMocks();
      DynamicConfigParser.process = jest.fn().mockImplementation(async (events) => events);
    });

    test.each([
      { name: 'v2 first', events: [input(v2, 1), input(v1, 2)] },
      { name: 'v1 first', events: [input(v1, 1), input(v2, 2)] },
    ])('routes HTTP v1 to CDK and v2 native in one request ($name)', async ({ events }) => {
      const response = await request(server)
        .post('/routerTransform')
        .send({ destType: 'HTTP', input: events });

      const byDestination = Object.fromEntries(
        response.body.output.map((out: any) => [out.metadata[0].destinationId, out]),
      );
      expect(byDestination['dest-v1']).toMatchObject({
        statusCode: 200,
        batchedRequest: { endpoint: 'https://example.com/v1', body: { JSON: { event: 'E' } } },
      });
      expect(byDestination['dest-v2']).toMatchObject({
        statusCode: 200,
        batchedRequest: { endpoint: 'https://example.com/v2' },
      });
      expect(JSON.parse(byDestination['dest-v2'].batchedRequest.body.JSON_ARRAY.batch)).toEqual([
        expect.objectContaining({ event: 'E' }),
      ]);
    });

    test('a failure in one service group leaves the other group intact', async () => {
      const failing = new NativeIntegrationDestinationService();
      failing.doRouterTransformation = jest.fn().mockRejectedValue(new Error('boom'));
      const succeeding = new NativeIntegrationDestinationService();
      succeeding.doRouterTransformation = jest
        .fn()
        .mockImplementation(async (events) =>
          events.map((ev) => ({ metadata: [ev.metadata], statusCode: 200, batched: false })),
        );
      jest
        .spyOn(ServiceSelector, 'getDestinationServiceByType')
        .mockImplementation((_type, _ws, version) => (version === 1 ? failing : succeeding));

      const response = await request(server)
        .post('/routerTransform')
        .send({ destType: 'HTTP', input: [input(v1, 1), input(v2, 2)] });

      expect(response.body.output).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            metadata: [expect.objectContaining({ jobId: 1 })],
            statusCode: 500,
          }),
          expect.objectContaining({
            metadata: [expect.objectContaining({ jobId: 2 })],
            statusCode: 200,
          }),
        ]),
      );
    });
  });
});
