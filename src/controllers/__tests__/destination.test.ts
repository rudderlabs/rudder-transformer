import request from 'supertest';
import { createHttpTerminator } from 'http-terminator';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { applicationRoutes } from '../../routes';
import { ServiceSelector } from '../../helpers/serviceSelector';
import { DynamicConfigParser } from '../../util/dynamicConfigParser';
import { NativeIntegrationDestinationService } from '../../services/destination/nativeIntegration';
import { errorHandlerMiddleware } from '../../middlewares/errorHandler';

let server: any;
const OLD_ENV = process.env;

beforeAll(async () => {
  process.env = { ...OLD_ENV }; // Make a copy
  const app = new Koa();
  app.use(errorHandlerMiddleware());
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
  return [
    { message: { a: 'b1' }, destination: {}, metadata: { jobId: 1 } },
    { message: { a: 'b2' }, destination: {}, metadata: { jobId: 2 } },
  ];
};

const getProcessorTransformResponse = () => [
  {
    output: {
      version: '1',
      type: 'REST',
      method: 'POST',
      endpoint: 'https://example.com',
      headers: {},
      params: {},
      body: { JSON: {} },
      files: {},
    },
    metadata: { jobId: 1 },
    statusCode: 200,
  },
];

const getRouterTransformResponse = () => [
  {
    batchedRequest: {
      version: '1',
      type: 'REST',
      method: 'POST',
      endpoint: 'https://example.com',
      headers: {},
      params: {},
      body: { JSON: {} },
      files: {},
    },
    metadata: [{ jobId: 1 }, { jobId: 2 }],
    destination: { ID: 'destination-1' },
    batched: false,
    statusCode: 200,
  },
];

const getRouterTransformInputData = () => {
  return {
    input: [
      { message: { a: 'b1' }, destination: {}, metadata: { jobId: 1 } },
      { message: { a: 'b2' }, destination: {}, metadata: { jobId: 2 } },
    ],
    destType: 'rudder_test',
  };
};

const expectResponseValidationError = (response: any, endpoint: string) => {
  expect(response.status).toEqual(500);
  expect(response.body.error).toEqual('Internal Server Error');
  expect(response.body.message).toContain(`Response schema validation failed for ${endpoint}`);
};

describe('Destination controller tests', () => {
  describe('Destination processor transform tests', () => {
    test('successful transformation at processor', async () => {
      const mockDestinationService = new NativeIntegrationDestinationService();

      const expectedEvents = [
        { message: { a: 'b1' }, destination: {}, metadata: { jobId: 1 }, request: { query: {} } },
        { message: { a: 'b2' }, destination: {}, metadata: { jobId: 2 }, request: { query: {} } },
      ];
      const expectedOutput = getProcessorTransformResponse();
      mockDestinationService.doProcessorTransformation = jest
        .fn()
        .mockImplementation((events, destinationType, version, requestMetadata) => {
          expect(events).toEqual(expectedEvents);
          expect(destinationType).toEqual('rudder_test');
          expect(version).toEqual('v0');

          return expectedOutput;
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
        .post('/v0/destinations/rudder_test')
        .set('Accept', 'application/json')
        .send(getData());

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(expectedOutput);

      expect(response.header['apiversion']).toEqual('2');

      expect(getDestinationServiceSpy).toHaveBeenCalledTimes(1);
      expect(mockDestinationService.doProcessorTransformation).toHaveBeenCalledTimes(1);
    });

    test('rejects invalid processor response schema', async () => {
      const mockDestinationService = new NativeIntegrationDestinationService();
      mockDestinationService.doProcessorTransformation = jest.fn().mockReturnValue([
        {
          metadata: { jobId: 1 },
          statusCode: 200,
        },
      ]);
      jest.spyOn(ServiceSelector, 'getDestinationService').mockImplementation(() => {
        return mockDestinationService;
      });
      DynamicConfigParser.process = jest.fn().mockImplementation(async (events) => events);

      const response = await request(server)
        .post('/v0/destinations/rudder_test')
        .set('Accept', 'application/json')
        .send(getData());

      expectResponseValidationError(response, 'destination processor transform');
      expect(mockDestinationService.doProcessorTransformation).toHaveBeenCalledTimes(1);
    });

    test('transformation at processor failure', async () => {
      const mockDestinationService = new NativeIntegrationDestinationService();

      const expectedOutput = [
        {
          statusCode: 500,
          error: 'Processor transformation failed',
          metadata: { jobId: 1 },
          statTags: { errorCategory: 'transformation' },
        },
        {
          statusCode: 500,
          error: 'Processor transformation failed',
          metadata: { jobId: 2 },
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
        .spyOn(ServiceSelector, 'getDestinationService')
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

      const expectedEvents = [
        { message: { a: 'b1' }, destination: {}, metadata: { jobId: 1 }, request: { query: {} } },
        { message: { a: 'b2' }, destination: {}, metadata: { jobId: 2 }, request: { query: {} } },
      ];
      const expectedOutput = getRouterTransformResponse();

      mockDestinationService.doRouterTransformation = jest
        .fn()
        .mockImplementation((events, destinationType, version, requestMetadata) => {
          expect(events).toEqual(expectedEvents);
          expect(destinationType).toEqual('rudder_test');
          expect(version).toEqual('v0');

          return expectedOutput;
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

    test('rejects invalid router response schema', async () => {
      const mockDestinationService = new NativeIntegrationDestinationService();
      mockDestinationService.doRouterTransformation = jest.fn().mockReturnValue([
        {
          metadata: [{ jobId: 1 }],
          batched: false,
          statusCode: 200,
        },
      ]);
      jest.spyOn(ServiceSelector, 'getDestinationService').mockImplementation(() => {
        return mockDestinationService;
      });
      DynamicConfigParser.process = jest.fn().mockImplementation(async (events) => events);

      const response = await request(server)
        .post('/routerTransform')
        .set('Accept', 'application/json')
        .send(getRouterTransformInputData());

      expectResponseValidationError(response, 'destination router transform');
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

      const expectedEvents = [
        { message: { a: 'b1' }, destination: {}, metadata: { jobId: 1 }, request: { query: {} } },
        { message: { a: 'b2' }, destination: {}, metadata: { jobId: 2 }, request: { query: {} } },
      ];
      const expectedOutput = getRouterTransformResponse();

      mockDestinationService.doBatchTransformation = jest
        .fn()
        .mockImplementation((events, destinationType, version, requestMetadata) => {
          expect(events).toEqual(expectedEvents);
          expect(destinationType).toEqual('rudder_test');
          expect(version).toEqual('v0');

          return expectedOutput;
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

    test('rejects invalid batch response schema', async () => {
      const mockDestinationService = new NativeIntegrationDestinationService();
      mockDestinationService.doBatchTransformation = jest.fn().mockReturnValue([
        {
          metadata: [{ jobId: 1 }],
          batched: false,
          statusCode: 200,
        },
      ]);
      jest.spyOn(ServiceSelector, 'getDestinationService').mockImplementation(() => {
        return mockDestinationService;
      });
      DynamicConfigParser.process = jest.fn().mockImplementation(async (events) => events);

      const response = await request(server)
        .post('/batch')
        .set('Accept', 'application/json')
        .send(getRouterTransformInputData());

      expectResponseValidationError(response, 'destination batch transform');
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
