import request from 'supertest';
import { createHttpTerminator } from 'http-terminator';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { applicationRoutes } from '../../routes';
import { NativeIntegrationDestinationService } from '../../services/destination/nativeIntegration';
import { ServiceSelector } from '../../helpers/serviceSelector';
import networkHandlerFactory from '../../adapters/networkHandlerFactory';
import { FetchHandler } from '../../helpers/fetchHandlers';
import stats from '../../util/stats';

// The batching framework's delivery branch returns before the rest of `deliver` runs, so it is
// reached by forcing the gate rather than by configuration. `null` delegates to the real predicate,
// which is what every other test in this file gets: they post to `rudder_test`, which declares no
// `batching` and names no workspace, so the real answer is already false.
let frameworkDeliveryEnabled: boolean | null = null;
jest.mock('../../constants/batchedDestinationsMap', () => {
  const actual = jest.requireActual('../../constants/batchedDestinationsMap');
  return {
    ...actual,
    isBatchingFrameworkEnabled: (destType: string, workspaceId: string) =>
      frameworkDeliveryEnabled ?? actual.isBatchingFrameworkEnabled(destType, workspaceId),
  };
});

// Only the handler's verdicts are faked; `toDeliveryV1Response` - the thing that builds the job
// states under test - stays real.
const handleDeliveryResponseMock = jest.fn();
jest.mock('../../services/destination/nativeBatching/delivery', () => ({
  ...jest.requireActual('../../services/destination/nativeBatching/delivery'),
  handleDeliveryResponse: (...args: unknown[]) => handleDeliveryResponseMock(...args),
}));

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
  frameworkDeliveryEnabled = null;
  jest.restoreAllMocks();
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
  });

  // `capDeliveryV1Errors` is called exactly once in the codebase, here, immediately before
  // `ctx.body`. These drive the real service through the real route so each *producer* of
  // `response[].error` is proven to reach that one call - the coverage argument that previously had
  // to be re-made at every `deliver` return.
  describe('destination response cap (INT-6978)', () => {
    // The cap is lowered through the env var it already reads rather than left at the 50KB default,
    // so a payload that clears it is 4KB instead of the 2MB the default would demand. What is under
    // test is the amplification - one body copied once per job - and that is a property of the job
    // count, not of the body size: at 50 jobs the default made every one of these tests allocate
    // ~100MB, which is what starved the CI runner the docker image build runs on.
    const MAX_ERROR_BYTES = 1024;
    const METRIC = 'proxy_destination_response_truncated';
    const JOBS = 50;
    const OVERSIZED = 'x'.repeat(4 * 1024);

    beforeEach(() => {
      process.env.PROXY_DESTINATION_RESPONSE_MAX_BYTES = String(MAX_ERROR_BYTES);
    });

    afterEach(() => {
      delete process.env.PROXY_DESTINATION_RESPONSE_MAX_BYTES;
    });

    const v1Body = (jobCount: number) => ({
      body: { JSON: { a: 'b' } },
      metadata: Array.from({ length: jobCount }, (_, i) => ({
        jobId: i + 1,
        destinationId: 'dest-1',
        workspaceId: 'ws-1',
      })),
      destinationConfig: {},
    });

    const postV1 = (jobCount = JOBS) =>
      request(server)
        .post('/v1/destinations/rudder_test/proxy')
        .set('Accept', 'application/json')
        .send(v1Body(jobCount));

    const expectAllCapped = (body: any) => {
      expect(body.output.response).toHaveLength(JOBS);
      body.output.response.forEach((jobState: any) => {
        expect(Buffer.byteLength(jobState.error, 'utf8')).toBeLessThanOrEqual(MAX_ERROR_BYTES);
        expect(jobState.error).toContain('[truncated:');
      });
      // Per-job routing survives: only the error text is trimmed.
      expect(body.output.response.map((r: any) => r.metadata.jobId)).toEqual(
        Array.from({ length: JOBS }, (_, i) => i + 1),
      );
    };

    test('caps the echo the v0->v1 adaptation builds', async () => {
      jest.spyOn(networkHandlerFactory, 'getNetworkHandler').mockReturnValue({
        handlerVersion: 'v0',
        networkHandler: {
          proxy: jest.fn().mockResolvedValue({}),
          processAxiosResponse: jest.fn().mockReturnValue({ status: 500, response: {} }),
          responseHandler: jest.fn().mockReturnValue({
            status: 500,
            message: 'failed',
            destinationResponse: { status: 500, response: { blob: OVERSIZED } },
          }),
        },
      } as never);
      const counterSpy = jest.spyOn(stats, 'counter');

      const response = await postV1();

      expectAllCapped(response.body);
      expect(counterSpy).toHaveBeenCalledWith(METRIC, JOBS, { destType: 'RUDDER_TEST' });
    });

    test('caps the echo a native v1 handler builds per job', async () => {
      // `getNetworkHandler` picks a native v1 handler whenever `src/v1/destinations/<dest>/
      // networkHandler` exists, and several build the error inside a per-job map of their own
      // (`braze`'s `buildJobStates`, `hs`'s per-item states). Those never touch the adaptation.
      jest.spyOn(networkHandlerFactory, 'getNetworkHandler').mockReturnValue({
        handlerVersion: 'v1',
        networkHandler: {
          proxy: jest.fn().mockResolvedValue({}),
          processAxiosResponse: jest.fn().mockReturnValue({ status: 500, response: {} }),
          responseHandler: jest.fn().mockImplementation(({ rudderJobMetadata }) => ({
            status: 500,
            message: 'failed',
            response: rudderJobMetadata.map((metadata: any) => ({
              statusCode: 500,
              metadata,
              error: JSON.stringify({ blob: OVERSIZED }),
            })),
          })),
        },
      } as never);

      expectAllCapped((await postV1()).body);
    });

    test('caps the echo the batching framework builds', async () => {
      // The framework branch returns before the rest of `deliver` runs, so it used to need a cap at
      // its own return. An integration's `failureReason` can be the whole destination body -
      // `braze_audience` falls through to `JSON.stringify(response)`.
      frameworkDeliveryEnabled = true;
      jest.spyOn(FetchHandler, 'getBatchDestinationHandler').mockReturnValue({} as never);
      handleDeliveryResponseMock.mockReturnValue({
        kind: 'perItem',
        verdicts: Array.from({ length: JOBS }, () => ({
          kind: 'abort',
          reason: JSON.stringify({ errors: [{ blob: OVERSIZED }] }),
        })),
      });
      jest.spyOn(networkHandlerFactory, 'getNetworkHandler').mockReturnValue({
        handlerVersion: 'v1',
        networkHandler: {
          proxy: jest.fn().mockResolvedValue({}),
          processAxiosResponse: jest.fn().mockReturnValue({ status: 400, response: {} }),
          responseHandler: jest.fn(),
        },
      } as never);

      expectAllCapped((await postV1()).body);
    });

    test('caps the echo that arrives by throw', async () => {
      // The INT-6978 shape, not a hypothetical: facebook's `errorResponseHandler` throws a
      // NetworkError whose fourth argument is the whole response body, so the oversized echo
      // reaches the client through `deliver`'s catch rather than its return.
      const thrown: any = new Error('destination rejected the batch');
      thrown.destinationResponse = {
        response: { error: { code: 190, blob: OVERSIZED } },
        status: 400,
      };
      jest.spyOn(networkHandlerFactory, 'getNetworkHandler').mockReturnValue({
        handlerVersion: 'v0',
        networkHandler: {
          proxy: jest.fn().mockResolvedValue({}),
          processAxiosResponse: jest.fn().mockReturnValue({ status: 400, response: {} }),
          responseHandler: jest.fn().mockImplementation(() => {
            throw thrown;
          }),
        },
      } as never);

      expectAllCapped((await postV1()).body);
    });

    test('leaves a response within the cap byte for byte', async () => {
      const body = { error: { code: 190, message: 'Invalid OAuth access token' } };
      jest.spyOn(networkHandlerFactory, 'getNetworkHandler').mockReturnValue({
        handlerVersion: 'v0',
        networkHandler: {
          proxy: jest.fn().mockResolvedValue({}),
          processAxiosResponse: jest.fn().mockReturnValue({ status: 500, response: {} }),
          responseHandler: jest.fn().mockReturnValue({
            status: 500,
            message: 'failed',
            destinationResponse: { status: 500, response: body },
          }),
        },
      } as never);
      const counterSpy = jest.spyOn(stats, 'counter');

      const response = await postV1();

      response.body.output.response.forEach((jobState: any) => {
        expect(jobState.error).toEqual(JSON.stringify(body));
      });
      expect(counterSpy).not.toHaveBeenCalledWith(METRIC, expect.anything(), expect.anything());
    });

    test('leaves the v0 route uncapped, however large', async () => {
      // The cap is v1 only, deliberately: a v0 request is one job, so the echo appears once rather
      // than once per job and there is no `batchSize x bodySize` growth to bound.
      const body = { blob: OVERSIZED };
      jest.spyOn(networkHandlerFactory, 'getNetworkHandler').mockReturnValue({
        handlerVersion: 'v0',
        networkHandler: {
          proxy: jest.fn().mockResolvedValue({}),
          processAxiosResponse: jest.fn().mockReturnValue({ status: 500, response: {} }),
          responseHandler: jest.fn().mockReturnValue({
            status: 500,
            message: 'failed',
            destinationResponse: { status: 500, response: body },
          }),
        },
      } as never);
      const counterSpy = jest.spyOn(stats, 'counter');

      const response = await request(server)
        .post('/v0/destinations/rudder_test/proxy')
        .set('Accept', 'application/json')
        .send({
          body: { JSON: { a: 'b' } },
          metadata: { jobId: 1, destinationId: 'dest-1', workspaceId: 'ws-1' },
          destinationConfig: {},
        });

      expect(response.body.output.destinationResponse).toEqual({ status: 500, response: body });
      expect(counterSpy).not.toHaveBeenCalledWith(METRIC, expect.anything(), expect.anything());
    });
  });
});
