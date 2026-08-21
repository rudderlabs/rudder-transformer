import request from 'supertest';
import { createHttpTerminator } from 'http-terminator';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { applicationRoutes } from '../../routes';
import { NativeIntegrationDestinationService } from '../../services/destination/nativeIntegration';
import { ServiceSelector } from '../../helpers/serviceSelector';
import stats from '../../util/stats';

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

// Drives JSON.stringify into a given failure via `toJSON`, so the tests stay fast and don't
// have to allocate the hundreds of MB a real oversized response would need.
const buildUnserializableOutput = (version: 'v0' | 'v1', fail: () => never) => {
  const poison = {
    toJSON: fail,
  };
  return version === 'v0'
    ? { status: 200, message: 'success', destinationResponse: poison }
    : {
        status: 200,
        message: 'success',
        response: [{ error: 'ok', statusCode: 200, metadata: { a1: 'b1' }, ...poison }],
      };
};

// getData()'s metadata carries no destinationId/workspaceId, so both fall back to
// NON_DETERMINABLE; the rest mirrors what generateErrorObject tags a delivery failure with.
const expectedFallbackStatTags = {
  destType: 'RUDDER_TEST',
  module: 'destination',
  implementation: 'native',
  feature: 'dataDelivery',
  destinationId: 'Non-determinable',
  workspaceId: 'Non-determinable',
  errorCategory: 'platform',
  errorType: 'retryable',
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
          expect(destinationType).toEqual('rudder_test');
          expect(version).toEqual('v0');
          return testOutput;
        });
      const getNativeDestinationServiceSpy = jest
        .spyOn(ServiceSelector, 'getNativeDestinationService')
        .mockImplementation(() => {
          return mockDestinationService;
        });

      const response = await request(server)
        .post('/v0/destinations/rudder_test/proxy')
        .set('Accept', 'application/json')
        .send(getData());

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ output: testOutput });

      expect(response.header['apiversion']).toEqual('2');
      // Every proxy response is now assigned as a pre-serialized string, so the success path
      // has to keep the exact headers an object body produced.
      expect(response.header['content-type']).toEqual('application/json; charset=utf-8');
      expect(response.header['content-length']).toEqual(
        String(Buffer.byteLength(JSON.stringify({ output: testOutput }))),
      );

      expect(getNativeDestinationServiceSpy).toHaveBeenCalledTimes(1);
      expect(mockDestinationService.deliver).toHaveBeenCalledTimes(1);
    });

    test('delivery failure', async () => {
      const mockDestinationService = new NativeIntegrationDestinationService();
      mockDestinationService.deliver = jest
        .fn()
        .mockImplementation((event, destinationType, requestMetadata, version) => {
          expect(event).toEqual(getData());
          expect(destinationType).toEqual('rudder_test');
          expect(version).toEqual('v0');
          throw new Error('test error');
        });
      const getNativeDestinationServiceSpy = jest
        .spyOn(ServiceSelector, 'getNativeDestinationService')
        .mockImplementation(() => {
          return mockDestinationService;
        });

      const response = await request(server)
        .post('/v0/destinations/rudder_test/proxy')
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

    test('response too large to serialize falls back to a small, bounded error body', async () => {
      // Simulates a destination response too large for JSON.stringify (RangeError: Invalid
      // string length), via `toJSON`, without needing to allocate hundreds of MB in the test.
      const mockDestinationService = new NativeIntegrationDestinationService();
      mockDestinationService.deliver = jest.fn().mockResolvedValue(
        buildUnserializableOutput('v0', () => {
          throw new RangeError('Invalid string length');
        }),
      );
      jest.spyOn(ServiceSelector, 'getNativeDestinationService').mockImplementation(() => {
        return mockDestinationService;
      });
      const incrementSpy = jest.spyOn(stats, 'increment').mockImplementation(() => {});

      const response = await request(server)
        .post('/v0/destinations/rudder_test/proxy')
        .set('Accept', 'application/json')
        .send(getData());

      expect(response.status).toEqual(500);
      // The body is assigned as a pre-serialized string, which Koa would otherwise send as
      // text/plain - assert the exact header an object body would have produced.
      expect(response.header['content-type']).toEqual('application/json; charset=utf-8');
      expect(response.body).toEqual({
        output: {
          status: 500,
          message: 'Destination response payload was too large to serialize',
          destinationResponse: 'Destination response payload was too large to serialize',
          statTags: expectedFallbackStatTags,
        },
      });
      expect(incrementSpy).toHaveBeenCalledWith('proxy_response_serialization_failure', {
        version: 'v0',
        reason: 'tooLarge',
      });
    });

    test('a circular response is reported as unserializable, not as too large', async () => {
      // A circular structure throws TypeError, not RangeError - in this codebase it comes from
      // axios error objects (config.httpsAgent._sessionCache back-references) landing in
      // destinationResponse, which has nothing to do with payload size.
      const mockDestinationService = new NativeIntegrationDestinationService();
      mockDestinationService.deliver = jest.fn().mockResolvedValue(
        buildUnserializableOutput('v0', () => {
          throw new TypeError('Converting circular structure to JSON');
        }),
      );
      jest.spyOn(ServiceSelector, 'getNativeDestinationService').mockImplementation(() => {
        return mockDestinationService;
      });
      const incrementSpy = jest.spyOn(stats, 'increment').mockImplementation(() => {});

      const response = await request(server)
        .post('/v0/destinations/rudder_test/proxy')
        .set('Accept', 'application/json')
        .send(getData());

      expect(response.status).toEqual(500);
      expect(response.body).toEqual({
        output: {
          status: 500,
          message: 'Destination response payload could not be serialized',
          destinationResponse: 'Destination response payload could not be serialized',
          statTags: expectedFallbackStatTags,
        },
      });
      expect(incrementSpy).toHaveBeenCalledWith('proxy_response_serialization_failure', {
        version: 'v0',
        reason: 'unserializable',
      });
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
          expect(destinationType).toEqual('rudder_test');
          expect(version).toEqual('v1');
          return testOutput;
        });
      const getNativeDestinationServiceSpy = jest
        .spyOn(ServiceSelector, 'getNativeDestinationService')
        .mockImplementation(() => {
          return mockDestinationService;
        });

      const response = await request(server)
        .post('/v1/destinations/rudder_test/proxy')
        .set('Accept', 'application/json')
        .send(getData());

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ output: testOutput });

      expect(response.header['apiversion']).toEqual('2');
      expect(response.header['content-type']).toEqual('application/json; charset=utf-8');
      expect(response.header['content-length']).toEqual(
        String(Buffer.byteLength(JSON.stringify({ output: testOutput }))),
      );

      expect(getNativeDestinationServiceSpy).toHaveBeenCalledTimes(1);
      expect(mockDestinationService.deliver).toHaveBeenCalledTimes(1);
    });

    test('delivery failure', async () => {
      const mockDestinationService = new NativeIntegrationDestinationService();
      mockDestinationService.deliver = jest
        .fn()
        .mockImplementation((event, destinationType, requestMetadata, version) => {
          expect(event).toEqual(getData());
          expect(destinationType).toEqual('rudder_test');
          expect(version).toEqual('v1');
          throw new Error('test error');
        });
      const getNativeDestinationServiceSpy = jest
        .spyOn(ServiceSelector, 'getNativeDestinationService')
        .mockImplementation(() => {
          return mockDestinationService;
        });

      const response = await request(server)
        .post('/v1/destinations/rudder_test/proxy')
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

    test('response too large to serialize falls back to a small, bounded per-job error body', async () => {
      // This is the mechanism behind the real INT-6978 incident: a batched v1 response whose
      // per-job entries duplicate a large destination response can exceed JSON.stringify's
      // limit. Simulated here via `toJSON` rather than an actual multi-hundred-MB payload.
      const mockDestinationService = new NativeIntegrationDestinationService();
      mockDestinationService.deliver = jest.fn().mockResolvedValue(
        buildUnserializableOutput('v1', () => {
          throw new RangeError('Invalid string length');
        }),
      );
      jest.spyOn(ServiceSelector, 'getNativeDestinationService').mockImplementation(() => {
        return mockDestinationService;
      });
      const incrementSpy = jest.spyOn(stats, 'increment').mockImplementation(() => {});

      const response = await request(server)
        .post('/v1/destinations/rudder_test/proxy')
        .set('Accept', 'application/json')
        .send(getData());

      expect(response.status).toEqual(200);
      expect(response.header['content-type']).toEqual('application/json; charset=utf-8');
      expect(response.header['apiversion']).toEqual('2');
      expect(response.body).toEqual({
        output: {
          status: 500,
          message: 'Destination response payload was too large to serialize',
          statTags: expectedFallbackStatTags,
          response: [
            {
              error: 'Destination response payload was too large to serialize',
              statusCode: 500,
              metadata: { a1: 'b1' },
            },
          ],
        },
      });
      expect(incrementSpy).toHaveBeenCalledWith('proxy_response_serialization_failure', {
        version: 'v1',
        reason: 'tooLarge',
      });
    });

    test('a circular response is reported as unserializable, not as too large', async () => {
      const mockDestinationService = new NativeIntegrationDestinationService();
      mockDestinationService.deliver = jest.fn().mockResolvedValue(
        buildUnserializableOutput('v1', () => {
          throw new TypeError('Converting circular structure to JSON');
        }),
      );
      jest.spyOn(ServiceSelector, 'getNativeDestinationService').mockImplementation(() => {
        return mockDestinationService;
      });
      const incrementSpy = jest.spyOn(stats, 'increment').mockImplementation(() => {});

      const response = await request(server)
        .post('/v1/destinations/rudder_test/proxy')
        .set('Accept', 'application/json')
        .send(getData());

      expect(response.status).toEqual(200);
      expect(response.body.output.message).toEqual(
        'Destination response payload could not be serialized',
      );
      expect(response.body.output.response).toEqual([
        {
          error: 'Destination response payload could not be serialized',
          statusCode: 500,
          metadata: { a1: 'b1' },
        },
      ]);
      expect(incrementSpy).toHaveBeenCalledWith('proxy_response_serialization_failure', {
        version: 'v1',
        reason: 'unserializable',
      });
    });
  });
});
