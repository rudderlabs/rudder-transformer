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
});
