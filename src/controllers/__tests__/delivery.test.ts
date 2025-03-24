import request from 'supertest';
import { createHttpTerminator } from 'http-terminator';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { applicationRoutes } from '../../routes';
import { NativeIntegrationDestinationService } from '../../services/destination/nativeIntegration';
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

const getData = () => {
  return { body: { JSON: { a: 'b' } }, metadata: [{ a1: 'b1' }], destinationConfig: { a2: 'b2' } };
};

describe('Delivery controller tests', () => {
  describe('Delivery V0 tests', () => {
    test('successful delivery', async () => {
      const testOutput = { status: 200, message: 'success' };
      const mockDestinationService = new NativeIntegrationDestinationService();
      mockDestinationService.deliver = jest
        .fn()
        .mockImplementation((event, destinationType, requestMetadata, version) => {
          expect(event).toEqual(getData());
          expect(destinationType).toEqual('__rudder_test__');
          expect(version).toEqual('v0');
          return testOutput;
        });
      const getNativeDestinationServiceSpy = jest
        .spyOn(ServiceSelector, 'getNativeDestinationService')
        .mockImplementation(() => {
          return mockDestinationService;
        });

      const response = await request(server)
        .post('/v0/destinations/__rudder_test__/proxy')
        .set('Accept', 'application/json')
        .send(getData());

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ output: testOutput });

      expect(response.header['apiversion']).toEqual('2');

      expect(getNativeDestinationServiceSpy).toHaveBeenCalledTimes(1);
      expect(mockDestinationService.deliver).toHaveBeenCalledTimes(1);
    });

    test('delivery failure', async () => {
      const mockDestinationService = new NativeIntegrationDestinationService();
      mockDestinationService.deliver = jest
        .fn()
        .mockImplementation((event, destinationType, requestMetadata, version) => {
          expect(event).toEqual(getData());
          expect(destinationType).toEqual('__rudder_test__');
          expect(version).toEqual('v0');
          throw new Error('test error');
        });
      const getNativeDestinationServiceSpy = jest
        .spyOn(ServiceSelector, 'getNativeDestinationService')
        .mockImplementation(() => {
          return mockDestinationService;
        });

      const response = await request(server)
        .post('/v0/destinations/__rudder_test__/proxy')
        .set('Accept', 'application/json')
        .send(getData());

      const expectedResp = {
        output: {
          message: 'test error',
          statTags: {
            errorCategory: 'transformation',
          },
          destinationResponse: '',
          status: 500,
        },
      };
      expect(response.status).toEqual(500);
      expect(response.body).toEqual(expectedResp);

      expect(response.header['apiversion']).toEqual('2');

      expect(getNativeDestinationServiceSpy).toHaveBeenCalledTimes(1);
      expect(mockDestinationService.deliver).toHaveBeenCalledTimes(1);
    });
  });

  describe('Delivery V1 tests', () => {
    test('successful delivery', async () => {
      const testOutput = { status: 200, message: 'success' };
      const mockDestinationService = new NativeIntegrationDestinationService();
      mockDestinationService.deliver = jest
        .fn()
        .mockImplementation((event, destinationType, requestMetadata, version) => {
          expect(event).toEqual(getData());
          expect(destinationType).toEqual('__rudder_test__');
          expect(version).toEqual('v1');
          return testOutput;
        });
      const getNativeDestinationServiceSpy = jest
        .spyOn(ServiceSelector, 'getNativeDestinationService')
        .mockImplementation(() => {
          return mockDestinationService;
        });

      const response = await request(server)
        .post('/v1/destinations/__rudder_test__/proxy')
        .set('Accept', 'application/json')
        .send(getData());

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ output: testOutput });

      expect(response.header['apiversion']).toEqual('2');

      expect(getNativeDestinationServiceSpy).toHaveBeenCalledTimes(1);
      expect(mockDestinationService.deliver).toHaveBeenCalledTimes(1);
    });

    test('delivery failure', async () => {
      const mockDestinationService = new NativeIntegrationDestinationService();
      mockDestinationService.deliver = jest
        .fn()
        .mockImplementation((event, destinationType, requestMetadata, version) => {
          expect(event).toEqual(getData());
          expect(destinationType).toEqual('__rudder_test__');
          expect(version).toEqual('v1');
          throw new Error('test error');
        });
      const getNativeDestinationServiceSpy = jest
        .spyOn(ServiceSelector, 'getNativeDestinationService')
        .mockImplementation(() => {
          return mockDestinationService;
        });

      const response = await request(server)
        .post('/v1/destinations/__rudder_test__/proxy')
        .set('Accept', 'application/json')
        .send(getData());

      const expectedResp = {
        output: {
          message: 'test error',
          statTags: {
            errorCategory: 'transformation',
          },
          status: 500,
          response: [{ error: 'test error', metadata: { a1: 'b1' }, statusCode: 500 }],
        },
      };
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(expectedResp);

      expect(response.header['apiversion']).toEqual('2');

      expect(getNativeDestinationServiceSpy).toHaveBeenCalledTimes(1);
      expect(mockDestinationService.deliver).toHaveBeenCalledTimes(1);
    });
  });
});
