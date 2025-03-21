import request from 'supertest';
import { createHttpTerminator } from 'http-terminator';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { applicationRoutes } from '../../routes';
import { NativeIntegrationSourceService } from '../../services/source/nativeIntegration';
import { ServiceSelector } from '../../helpers/serviceSelector';
import { ControllerUtility } from '../util/index';
import { SourceInputConversionResult } from '../../types';

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

const getV2Data = () => {
  return [
    { request: { body: JSON.stringify({ a: 'b' }) }, source: { id: 1 } },
    { request: { body: JSON.stringify({ a: 'b' }) }, source: { id: 1 } },
  ];
};

const getConvertedData = () => {
  return getData().map((eventInstance) => {
    return { output: eventInstance } as SourceInputConversionResult<typeof eventInstance>;
  });
};

describe('Source controller tests', () => {
  describe('V0 Source transform tests', () => {
    test('successful source transform', async () => {
      const sourceType = '__rudder_test__';
      const version = 'v0';
      const testOutput = [{ event: { a: 'b' } }];

      const mockSourceService = new NativeIntegrationSourceService();
      mockSourceService.sourceTransformRoutine = jest
        .fn()
        .mockImplementation((i, s, v, requestMetadata) => {
          expect(i).toEqual(getConvertedData());
          expect(s).toEqual(sourceType);
          expect(v).toEqual(version);
          return testOutput;
        });
      const getNativeSourceServiceSpy = jest
        .spyOn(ServiceSelector, 'getNativeSourceService')
        .mockImplementation(() => {
          return mockSourceService;
        });

      const adaptInputToVersionSpy = jest
        .spyOn(ControllerUtility, 'adaptInputToVersion')
        .mockImplementation((s, v, e) => {
          expect(s).toEqual(sourceType);
          expect(v).toEqual(version);
          expect(e).toEqual(getData());
          return { implementationVersion: version, input: getConvertedData() };
        });

      const response = await request(server)
        .post('/v0/sources/__rudder_test__')
        .set('Accept', 'application/json')
        .send(getData());

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(testOutput);

      expect(response.header['apiversion']).toEqual('2');

      expect(getNativeSourceServiceSpy).toHaveBeenCalledTimes(1);
      expect(adaptInputToVersionSpy).toHaveBeenCalledTimes(1);
      expect(mockSourceService.sourceTransformRoutine).toHaveBeenCalledTimes(1);
    });

    test('failing source transform', async () => {
      const sourceType = '__rudder_test__';
      const version = 'v0';

      const mockSourceService = new NativeIntegrationSourceService();
      const getNativeSourceServiceSpy = jest
        .spyOn(ServiceSelector, 'getNativeSourceService')
        .mockImplementation(() => {
          return mockSourceService;
        });

      const adaptInputToVersionSpy = jest
        .spyOn(ControllerUtility, 'adaptInputToVersion')
        .mockImplementation((s, v, e) => {
          expect(s).toEqual(sourceType);
          expect(v).toEqual(version);
          expect(e).toEqual(getData());
          throw new Error('test error');
        });

      const response = await request(server)
        .post('/v0/sources/__rudder_test__')
        .set('Accept', 'application/json')
        .send(getData());

      const expectedResp = [
        {
          error: 'test error',
          statTags: {
            errorCategory: 'transformation',
          },
          statusCode: 500,
        },
      ];

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(expectedResp);

      expect(response.header['apiversion']).toEqual('2');

      expect(getNativeSourceServiceSpy).toHaveBeenCalledTimes(1);
      expect(adaptInputToVersionSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('V1 Source transform tests', () => {
    test('successful source transform', async () => {
      const sourceType = '__rudder_test__';
      const version = 'v1';
      const testOutput = [{ event: { a: 'b' }, source: { id: 'id' } }];

      const mockSourceService = new NativeIntegrationSourceService();
      mockSourceService.sourceTransformRoutine = jest
        .fn()
        .mockImplementation((i, s, v, requestMetadata) => {
          expect(i).toEqual(getConvertedData());
          expect(s).toEqual(sourceType);
          expect(v).toEqual(version);
          return testOutput;
        });
      const getNativeSourceServiceSpy = jest
        .spyOn(ServiceSelector, 'getNativeSourceService')
        .mockImplementation(() => {
          return mockSourceService;
        });

      const adaptInputToVersionSpy = jest
        .spyOn(ControllerUtility, 'adaptInputToVersion')
        .mockImplementation((s, v, e) => {
          expect(s).toEqual(sourceType);
          expect(v).toEqual(version);
          expect(e).toEqual(getData());
          return { implementationVersion: version, input: getConvertedData() };
        });

      const response = await request(server)
        .post('/v1/sources/__rudder_test__')
        .set('Accept', 'application/json')
        .send(getData());

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(testOutput);

      expect(response.header['apiversion']).toEqual('2');

      expect(getNativeSourceServiceSpy).toHaveBeenCalledTimes(1);
      expect(adaptInputToVersionSpy).toHaveBeenCalledTimes(1);
      expect(mockSourceService.sourceTransformRoutine).toHaveBeenCalledTimes(1);
    });

    test('failing source transform', async () => {
      const sourceType = '__rudder_test__';
      const version = 'v1';
      const mockSourceService = new NativeIntegrationSourceService();
      const getNativeSourceServiceSpy = jest
        .spyOn(ServiceSelector, 'getNativeSourceService')
        .mockImplementation(() => {
          return mockSourceService;
        });

      const adaptInputToVersionSpy = jest
        .spyOn(ControllerUtility, 'adaptInputToVersion')
        .mockImplementation((s, v, e) => {
          expect(s).toEqual(sourceType);
          expect(v).toEqual(version);
          expect(e).toEqual(getData());
          throw new Error('test error');
        });

      const response = await request(server)
        .post('/v1/sources/__rudder_test__')
        .set('Accept', 'application/json')
        .send(getData());

      const expectedResp = [
        {
          error: 'test error',
          statTags: {
            errorCategory: 'transformation',
          },
          statusCode: 500,
        },
      ];

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(expectedResp);

      expect(response.header['apiversion']).toEqual('2');

      expect(getNativeSourceServiceSpy).toHaveBeenCalledTimes(1);
      expect(adaptInputToVersionSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('V2 Source transform tests', () => {
    test('successful source transform', async () => {
      const sourceType = '__rudder_test__';
      const version = 'v2';
      const testOutput = [{ event: { a: 'b' }, source: { id: 'id' } }];

      const mockSourceService = new NativeIntegrationSourceService();
      mockSourceService.sourceTransformRoutine = jest
        .fn()
        .mockImplementation((i, s, v, requestMetadata) => {
          expect(i).toEqual(getConvertedData());
          expect(s).toEqual(sourceType);
          expect(v).toEqual(version);
          return testOutput;
        });
      const getNativeSourceServiceSpy = jest
        .spyOn(ServiceSelector, 'getNativeSourceService')
        .mockImplementation(() => {
          return mockSourceService;
        });

      const adaptInputToVersionSpy = jest
        .spyOn(ControllerUtility, 'adaptInputToVersion')
        .mockImplementation((s, v, e) => {
          expect(s).toEqual(sourceType);
          expect(v).toEqual(version);
          expect(e).toEqual(getV2Data());
          return { implementationVersion: version, input: getConvertedData() };
        });

      const response = await request(server)
        .post('/v2/sources/__rudder_test__')
        .set('Accept', 'application/json')
        .send(getV2Data());

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(testOutput);

      expect(response.header['apiversion']).toEqual('2');

      expect(getNativeSourceServiceSpy).toHaveBeenCalledTimes(1);
      expect(adaptInputToVersionSpy).toHaveBeenCalledTimes(1);
      expect(mockSourceService.sourceTransformRoutine).toHaveBeenCalledTimes(1);
    });

    test('failing source transform', async () => {
      const sourceType = '__rudder_test__';
      const version = 'v2';
      const mockSourceService = new NativeIntegrationSourceService();
      const getNativeSourceServiceSpy = jest
        .spyOn(ServiceSelector, 'getNativeSourceService')
        .mockImplementation(() => {
          return mockSourceService;
        });

      const adaptInputToVersionSpy = jest
        .spyOn(ControllerUtility, 'adaptInputToVersion')
        .mockImplementation((s, v, e) => {
          expect(s).toEqual(sourceType);
          expect(v).toEqual(version);
          expect(e).toEqual(getV2Data());
          throw new Error('test error');
        });

      const response = await request(server)
        .post('/v2/sources/__rudder_test__')
        .set('Accept', 'application/json')
        .send(getV2Data());

      const expectedResp = [
        {
          error: 'test error',
          statTags: {
            errorCategory: 'transformation',
          },
          statusCode: 500,
        },
      ];

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(expectedResp);

      expect(response.header['apiversion']).toEqual('2');

      expect(getNativeSourceServiceSpy).toHaveBeenCalledTimes(1);
      expect(adaptInputToVersionSpy).toHaveBeenCalledTimes(1);
    });
  });
});
