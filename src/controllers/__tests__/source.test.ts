import request from 'supertest';
import { createHttpTerminator } from 'http-terminator';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { applicationRoutes } from '../../routes';
import { NativeIntegrationSourceService } from '../../services/source/nativeIntegration';
import { ServiceSelector } from '../../helpers/serviceSelector';

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

const getV2Data = () => {
  return [
    { request: { body: JSON.stringify({ a: 'b' }) }, source: { id: 1 } },
    { request: { body: JSON.stringify({ a: 'b' }) }, source: { id: 1 } },
  ];
};

describe('Source controller tests', () => {
  describe('V2 Source transform tests', () => {
    test('successful source transform', async () => {
      const sourceType = '__rudder_test__';
      const testOutput = [{ event: { a: 'b' }, source: { id: 'id' } }];

      const mockSourceService = new NativeIntegrationSourceService();
      mockSourceService.sourceTransformRoutine = jest
        .fn()
        .mockImplementation((i, s, requestMetadata) => {
          expect(i).toEqual(getV2Data());
          expect(s).toEqual(sourceType);
          return testOutput;
        });
      const getNativeSourceServiceSpy = jest
        .spyOn(ServiceSelector, 'getNativeSourceService')
        .mockImplementation(() => {
          return mockSourceService;
        });

      const response = await request(server)
        .post('/v2/sources/__rudder_test__')
        .set('Accept', 'application/json')
        .send(getV2Data());

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(testOutput);

      expect(response.header['apiversion']).toEqual('2');

      expect(getNativeSourceServiceSpy).toHaveBeenCalledTimes(1);
      expect(mockSourceService.sourceTransformRoutine).toHaveBeenCalledTimes(1);
    });

    test('failing source transform', async () => {
      const sourceType = '__rudder_test__';

      const expectedResp = [
        {
          error: 'test error',
          statTags: {
            errorCategory: 'transformation',
          },
          statusCode: 500,
        },
      ];

      const mockSourceService = new NativeIntegrationSourceService();
      mockSourceService.sourceTransformRoutine = jest
        .fn()
        .mockImplementation((i, s, requestMetadata) => {
          expect(i).toEqual(getV2Data());
          expect(s).toEqual(sourceType);
          // return expectedResp;
          throw new Error('test error');
        });

      const getNativeSourceServiceSpy = jest
        .spyOn(ServiceSelector, 'getNativeSourceService')
        .mockImplementation(() => {
          return mockSourceService;
        });

      const response = await request(server)
        .post('/v2/sources/__rudder_test__')
        .set('Accept', 'application/json')
        .send(getV2Data());

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(expectedResp);

      expect(response.header['apiversion']).toEqual('2');

      expect(getNativeSourceServiceSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('sourceHydrate', () => {
    const sourceType = '__rudder_test__';
    test('all jobs successful', async () => {
      const requestBody = {};
      const testOutput = {
        jobs: [
          { id: 'job1', statusCode: 200, data: { field: 'value1' } },
          { id: 'job2', statusCode: 200, data: { field: 'value2' } },
        ],
      };

      const mockSourceService = new NativeIntegrationSourceService();
      mockSourceService.sourceHydrateRoutine = jest.fn().mockImplementation((input, source) => {
        expect(input).toEqual(requestBody);
        expect(source).toEqual(sourceType);
        return testOutput;
      });

      const getNativeSourceServiceSpy = jest
        .spyOn(ServiceSelector, 'getNativeSourceService')
        .mockImplementation(() => {
          return mockSourceService;
        });

      const response = await request(server)
        .post(`/v2/sources/${sourceType}/hydrate`)
        .set('Accept', 'application/json')
        .send(requestBody);

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ jobs: testOutput.jobs });

      expect(getNativeSourceServiceSpy).toHaveBeenCalledTimes(1);
      expect(mockSourceService.sourceHydrateRoutine).toHaveBeenCalledTimes(1);
    });

    test('one job failed', async () => {
      const requestBody = {};
      const testOutput = {
        jobs: [
          { id: 'job1', statusCode: 200, data: { field: 'value1' } },
          { id: 'job2', statusCode: 400 },
          { id: 'job3', statusCode: 200, data: { field: 'value3' } },
        ],
      };

      const mockSourceService = new NativeIntegrationSourceService();
      mockSourceService.sourceHydrateRoutine = jest.fn().mockResolvedValue(testOutput);

      const getNativeSourceServiceSpy = jest
        .spyOn(ServiceSelector, 'getNativeSourceService')
        .mockImplementation(() => {
          return mockSourceService;
        });

      const response = await request(server)
        .post(`/v2/sources/${sourceType}/hydrate`)
        .set('Accept', 'application/json')
        .send(requestBody);

      expect(response.status).toEqual(400);
      expect(response.body).toEqual({ jobs: testOutput.jobs });

      expect(getNativeSourceServiceSpy).toHaveBeenCalledTimes(1);
      expect(mockSourceService.sourceHydrateRoutine).toHaveBeenCalledTimes(1);
    });

    test('error response', async () => {
      const requestBody = { formId: '123' };
      const testOutput = {
        error: 'Missing access token',
        statusCode: 401,
      };

      const mockSourceService = new NativeIntegrationSourceService();
      mockSourceService.sourceHydrateRoutine = jest.fn().mockResolvedValue(testOutput);

      const getNativeSourceServiceSpy = jest
        .spyOn(ServiceSelector, 'getNativeSourceService')
        .mockImplementation(() => {
          return mockSourceService;
        });

      const response = await request(server)
        .post(`/v2/sources/${sourceType}/hydrate`)
        .set('Accept', 'application/json')
        .send(requestBody);

      expect(response.status).toEqual(401);
      expect(response.body).toEqual({ error: testOutput.error });

      expect(getNativeSourceServiceSpy).toHaveBeenCalledTimes(1);
      expect(mockSourceService.sourceHydrateRoutine).toHaveBeenCalledTimes(1);
    });

    test('exception thrown during hydration', async () => {
      const requestBody = {};
      const errorMessage = 'Unexpected error during hydration';

      const mockSourceService = new NativeIntegrationSourceService();
      mockSourceService.sourceHydrateRoutine = jest.fn().mockRejectedValue(new Error(errorMessage));

      const getNativeSourceServiceSpy = jest
        .spyOn(ServiceSelector, 'getNativeSourceService')
        .mockImplementation(() => {
          return mockSourceService;
        });

      const response = await request(server)
        .post(`/v2/sources/${sourceType}/hydrate`)
        .set('Accept', 'application/json')
        .send(requestBody);

      expect(response.status).toEqual(500);
      expect(response.body).toEqual({ error: errorMessage });

      expect(getNativeSourceServiceSpy).toHaveBeenCalledTimes(1);
      expect(mockSourceService.sourceHydrateRoutine).toHaveBeenCalledTimes(1);
    });
  });
});
