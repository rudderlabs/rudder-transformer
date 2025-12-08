import request from 'supertest';
import { createHttpTerminator } from 'http-terminator';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { applicationRoutes } from '../../routes';
import { NativeIntegrationSourceService } from '../../services/source/nativeIntegration';
import { ServiceSelector } from '../../helpers/serviceSelector';
import { BaseError } from '@rudderstack/integrations-lib';
import { SourceHydrationOutput, SourceHydrationRequest } from '../../types';

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

    describe('successful hydration scenarios', () => {
      const testCases: {
        description: string;
        requestBody: SourceHydrationRequest;
        expectedOutput: Record<string, unknown>;
        hydrationOutput: SourceHydrationOutput;
        expectedStatus: number;
      }[] = [
        {
          description: 'all jobs successful',
          requestBody: {
            batch: [{ event: { field: 'value1' } }, { event: { field: 'value2' } }],
            source: { id: 'source-1' },
          },
          hydrationOutput: {
            batch: [
              { event: { field: 'value1' }, statusCode: 200, randomData: 'randomData1' },
              { event: { field: 'value2' }, statusCode: 200, randomData: 'randomData2' },
            ],
          },
          expectedOutput: {
            batch: [
              { event: { field: 'value1' }, statusCode: 200, randomData: 'randomData1' },
              { event: { field: 'value2' }, statusCode: 200, randomData: 'randomData2' },
            ],
          },
          expectedStatus: 200,
        },
        {
          description: 'one job failed - returns first error status code',
          requestBody: {
            batch: [
              { event: { field: 'value1' } },
              { event: { field: 'value2' } },
              { event: { field: 'value3' } },
            ],
            source: { id: 'source-1' },
          },
          hydrationOutput: {
            batch: [
              { event: { field: 'value1' }, statusCode: 200, randomData: 'randomData1' },
              {
                event: { field: 'value2' },
                statusCode: 400,
                errorMessage: 'Invalid data',
              },
              { event: { field: 'value3' }, statusCode: 200, randomData: 'randomData3' },
            ],
          },
          expectedOutput: {
            batch: [
              { statusCode: 200, randomData: 'randomData1' },
              { statusCode: 400, errorMessage: 'Invalid data' },
              { statusCode: 200, randomData: 'randomData3' },
            ],
          },
          expectedStatus: 400,
        },
        {
          description: 'empty batch - all jobs successful',
          requestBody: {
            batch: [],
            source: { id: 'source-1' },
          },
          hydrationOutput: {
            batch: [],
          },
          expectedOutput: {
            batch: [],
          },
          expectedStatus: 200,
        },
      ];

      testCases.forEach(
        ({ description, requestBody, expectedOutput, hydrationOutput, expectedStatus }) => {
          test(description, async () => {
            const mockSourceService = new NativeIntegrationSourceService();
            mockSourceService.sourceHydrateRoutine = jest.fn().mockResolvedValue(hydrationOutput);

            const getNativeSourceServiceSpy = jest
              .spyOn(ServiceSelector, 'getNativeSourceService')
              .mockImplementation(() => mockSourceService);

            const response = await request(server)
              .post(`/v2/sources/${sourceType}/hydrate`)
              .set('Accept', 'application/json')
              .send(requestBody);

            expect(response.status).toEqual(expectedStatus);
            expect(response.body).toEqual(expectedOutput);

            expect(getNativeSourceServiceSpy).toHaveBeenCalledTimes(1);
            expect(mockSourceService.sourceHydrateRoutine).toHaveBeenCalledTimes(1);

            expect(mockSourceService.sourceHydrateRoutine).toHaveBeenCalledWith(
              requestBody,
              sourceType,
            );
          });
        },
      );
    });

    describe('validation errors', () => {
      const testCases = [
        {
          description: 'invalid request body - missing batch',
          requestBody: {
            source: { id: 'source-1' },
          },
          expectedStatus: 400,
          expectedError: 'batch: Required',
        },
        {
          description: 'invalid request body - missing source',
          requestBody: {
            batch: [{ event: { field: 'value1' } }],
          },
          expectedStatus: 400,
          expectedError: 'source: Required',
        },
        {
          description: 'invalid request body - batch is not an array',
          requestBody: {
            batch: 'not-an-array',
            source: { id: 'source-1' },
          },
          expectedStatus: 400,
          expectedError: 'batch: Expected array, received string',
        },
        {
          description: 'invalid request body - missing event field in batch item',
          requestBody: {
            batch: [{ notEvent: { field: 'value1' } }],
            source: { id: 'source-1' },
          },
          expectedStatus: 400,
          expectedError: 'batch.0.event: Required',
        },
      ];

      testCases.forEach(({ description, requestBody, expectedStatus, expectedError }) => {
        test(description, async () => {
          const mockSourceService = new NativeIntegrationSourceService();
          mockSourceService.sourceHydrateRoutine = jest.fn();

          const getNativeSourceServiceSpy = jest
            .spyOn(ServiceSelector, 'getNativeSourceService')
            .mockImplementation(() => mockSourceService);

          const response = await request(server)
            .post(`/v2/sources/${sourceType}/hydrate`)
            .set('Accept', 'application/json')
            .send(requestBody);

          expect(response.status).toEqual(expectedStatus);
          expect(response.body).toEqual({ error: expectedError });

          expect(getNativeSourceServiceSpy).toHaveBeenCalledTimes(0);
          expect(mockSourceService.sourceHydrateRoutine).toHaveBeenCalledTimes(0);
        });
      });
    });

    describe('error handling', () => {
      const testCases = [
        {
          description: 'BaseError thrown during hydration - preserves status code',
          requestBody: {
            batch: [{ event: { field: 'value1' } }],
            source: { id: 'source-1' },
          },
          mockError: () => new BaseError('test error', 401),
          expectedStatus: 401,
          expectedBody: { error: 'test error' },
        },
        {
          description: 'generic Error thrown during hydration - returns 500',
          requestBody: {
            batch: [{ event: { field: 'value1' } }],
            source: { id: 'source-1' },
          },
          mockError: () => new Error('Reading properties from undefined'),
          expectedStatus: 500,
          expectedBody: { error: 'Unexpected error during hydration' },
        },
      ];

      testCases.forEach(({ description, requestBody, mockError, expectedStatus, expectedBody }) => {
        test(description, async () => {
          const mockSourceService = new NativeIntegrationSourceService();
          mockSourceService.sourceHydrateRoutine = jest.fn().mockRejectedValue(mockError());

          const getNativeSourceServiceSpy = jest
            .spyOn(ServiceSelector, 'getNativeSourceService')
            .mockImplementation(() => mockSourceService);

          const response = await request(server)
            .post(`/v2/sources/${sourceType}/hydrate`)
            .set('Accept', 'application/json')
            .send(requestBody);

          expect(response.status).toEqual(expectedStatus);
          expect(response.body).toEqual(expectedBody);

          expect(getNativeSourceServiceSpy).toHaveBeenCalledTimes(1);
          expect(mockSourceService.sourceHydrateRoutine).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});
