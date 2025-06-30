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
    destType: '__rudder_test__',
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
          expect(destinationType).toEqual('__rudder_test__');
          expect(version).toEqual('v0');

          return events;
        });
      const getDestinationServiceSpy = jest
        .spyOn(ServiceSelector, 'getDestinationService')
        .mockImplementation(() => {
          return mockDestinationService;
        });

      DynamicConfigParser.process = jest.fn().mockImplementation(async (events) => {
        return events;
      });

      const response = await request(server)
        .post('/v0/destinations/__rudder_test__')
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
          expect(destinationType).toEqual('__rudder_test__');
          expect(version).toEqual('v0');

          throw new Error('Processor transformation failed');
        });
      const getDestinationServiceSpy = jest
        .spyOn(ServiceSelector, 'getDestinationService')
        .mockImplementation(() => {
          return mockDestinationService;
        });

      DynamicConfigParser.process = jest.fn().mockImplementation(async (events) => {
        return events;
      });

      const response = await request(server)
        .post('/v0/destinations/__rudder_test__')
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
          expect(destinationType).toEqual('__rudder_test__');
          expect(version).toEqual('v0');

          return events;
        });
      const getDestinationServiceSpy = jest
        .spyOn(ServiceSelector, 'getDestinationService')
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
        .spyOn(ServiceSelector, 'getDestinationService')
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
          expect(destinationType).toEqual('__rudder_test__');
          expect(version).toEqual('v0');

          return events;
        });
      const getDestinationServiceSpy = jest
        .spyOn(ServiceSelector, 'getDestinationService')
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
        .spyOn(ServiceSelector, 'getDestinationService')
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
});
