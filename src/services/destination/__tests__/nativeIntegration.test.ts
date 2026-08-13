import { FetchHandler } from '../../../helpers/fetchHandlers';
import {
  ProcessorTransformationOutput,
  ProcessorTransformationRequest,
  ProcessorTransformationResponse,
  ProxyV1Request,
} from '../../../types/index';
import { NativeIntegrationDestinationService } from '../nativeIntegration';
import { DestinationPostTransformationService } from '../postTransformation';
import networkHandlerFactory from '../../../adapters/networkHandlerFactory';

afterEach(() => {
  jest.clearAllMocks();
});

describe('NativeIntegration Service', () => {
  test('doProcessorTransformation - success', async () => {
    const destType = '__rudder_test__';
    const version = 'v0';
    const requestMetadata = {};
    const event = { message: { a: 'b' } } as unknown as ProcessorTransformationRequest;
    const events: ProcessorTransformationRequest[] = [event, event];

    const tevent = { version: 'v0', endpoint: 'http://abc' } as ProcessorTransformationOutput;
    const tresp = { output: tevent, statusCode: 200 } as ProcessorTransformationResponse;
    const tresponse: ProcessorTransformationResponse[] = [tresp, tresp];

    FetchHandler.getDestHandler = jest.fn().mockImplementation((d, v) => {
      expect(d).toEqual(destType);
      expect(v).toEqual(version);
      return {
        process: jest.fn(() => {
          return tevent;
        }),
      };
    });

    const postTransformSpy = jest
      .spyOn(DestinationPostTransformationService, 'handleProcessorTransformSucessEvents')
      .mockImplementation((e, p, d) => {
        expect(e).toEqual(event);
        expect(p).toEqual(tevent);
        return [tresp];
      });

    const service = new NativeIntegrationDestinationService();
    const resp = await service.doProcessorTransformation(
      events,
      destType,
      version,
      requestMetadata,
    );

    expect(resp).toEqual(tresponse);

    expect(postTransformSpy).toHaveBeenCalledTimes(2);
  });

  test('doProcessorTransformation - failure', async () => {
    const destType = '__rudder_test__';
    const version = 'v0';
    const requestMetadata = {};
    const event = { message: { a: 'b' } } as unknown as ProcessorTransformationRequest;
    const events: ProcessorTransformationRequest[] = [event, event];

    FetchHandler.getDestHandler = jest.fn().mockImplementation((d, v) => {
      expect(d).toEqual(destType);
      expect(v).toEqual(version);
      return {
        process: jest.fn(() => {
          throw new Error('test error');
        }),
      };
    });

    const service = new NativeIntegrationDestinationService();
    const resp = await service.doProcessorTransformation(
      events,
      destType,
      version,
      requestMetadata,
    );

    const expected = [
      {
        metadata: undefined,
        statusCode: 500,
        error: 'test error',
        statTags: { errorCategory: 'transformation' },
      },
      {
        metadata: undefined,
        statusCode: 500,
        error: 'test error',
        statTags: { errorCategory: 'transformation' },
      },
    ];

    console.log('resp:', resp);
    expect(resp).toEqual(expected);
  });

  // Characterizes a structural risk found while investigating INT-6978: when a v0-only
  // network handler is adapted to the v1 (batched) proxy response shape, the *entire* raw
  // destination response is duplicated once per job in the batch, with no size cap. This is
  // NOT fixed by the fb_custom_audience `errorResponseHandler` change (PR #5459) - that fix
  // only prevents a non-2xx/no-error response from being misclassified as success; a
  // genuinely large 2xx response still goes through this same unbounded duplication.
  // In production this pattern, combined with a 6000-job batch, produced a response body
  // large enough to throw `RangeError: Invalid string length` inside an unrelated Koa
  // response-size stats middleware, which wiped the response body and caused rudder-server
  // to record `router_transformerproxy_invalid_response{reason="missing output"}`.
  test('deliver (v1, adapted from a v0 handler) - duplicates the raw destination response once per job, unbounded by batch size', async () => {
    const destType = '__rudder_test__';
    const bigDestinationResponse = { ack: 'x'.repeat(10_000) };

    networkHandlerFactory.getNetworkHandler = jest.fn().mockReturnValue({
      networkHandler: {
        proxy: jest.fn().mockResolvedValue({ success: true, response: {} }),
        processAxiosResponse: jest.fn().mockReturnValue({ response: {}, status: 200 }),
        responseHandler: jest.fn().mockReturnValue({
          destinationResponse: bigDestinationResponse,
          message: 'Request Processed Successfully',
          status: 200,
        }),
      },
      handlerVersion: 'v0',
    });

    const jobCount = 200;
    const metadata = Array.from({ length: jobCount }, (_, i) => ({
      jobId: i + 1,
      attemptNum: 1,
      userId: 'u1',
      sourceId: 's1',
      destinationId: 'd1',
      workspaceId: 'w1',
      secret: {},
      dontBatch: false,
    }));
    const deliveryRequest = {
      version: '1',
      type: 'REST',
      method: 'POST',
      endpoint: 'http://abc',
      userId: '',
      metadata,
      destinationConfig: {},
    } as unknown as ProxyV1Request;

    const service = new NativeIntegrationDestinationService();
    const resp: any = await service.deliver(deliveryRequest, destType, {}, 'v1');

    const perJobPayloadSize = JSON.stringify(bigDestinationResponse).length;

    expect(resp.response).toHaveLength(jobCount);
    // Every job carries its own full copy of the same large payload - nothing is deduplicated
    // or capped, so the response grows linearly (here: unbounded) with the batch size.
    expect(
      resp.response.every((job: any) => job.error === JSON.stringify(bigDestinationResponse)),
    ).toBe(true);
    expect(JSON.stringify(resp.response).length).toBeGreaterThan(
      jobCount * perJobPayloadSize * 0.9,
    );
  });
});
