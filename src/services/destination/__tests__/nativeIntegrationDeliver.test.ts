import { PlatformError } from '@rudderstack/integrations-lib';
import {
  ProxyV0Request,
  ProxyV1Request,
  DeliveryV0Response,
  DeliveryV1Response,
  ProxyMetadata,
} from '../../../types/index';
import { NativeIntegrationDestinationService } from '../nativeIntegration';
import { DestinationPostTransformationService } from '../postTransformation';
import networkHandlerFactory from '../../../adapters/networkHandlerFactory';

describe('NativeIntegrationDestinationService - deliver', () => {
  const destinationType = 'test_destination';
  const requestMetadata = {};

  // Common metadata for tests
  const metadata: ProxyMetadata = {
    jobId: 1,
    attemptNum: 1,
    userId: 'test-user',
    sourceId: 'test-source',
    destinationId: 'test-destination',
    workspaceId: 'test-workspace',
    secret: {},
    dontBatch: false,
  };

  // Base delivery request for v0
  const baseV0Request = {
    endpoint: 'https://api.example.com',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { JSON: { key: 'value' } },
    params: {},
    metadata,
  } as unknown as ProxyV0Request;

  // Base delivery request for v1
  const baseV1Request = {
    endpoint: 'https://api.example.com',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { JSON: { key: 'value' } },
    params: {},
    metadata: [metadata],
  } as unknown as ProxyV1Request;

  // Mock network handler factory setup
  const setupNetworkHandlerMock = (handlerVersion: string, responseHandlerReturnValue: any) => {
    const mockNetworkHandler = {
      proxy: jest.fn().mockResolvedValue({ data: 'success' }),
      processAxiosResponse: jest.fn().mockReturnValue({
        status: 200,
        response: { success: true },
      }),
      responseHandler: jest.fn().mockReturnValue(responseHandlerReturnValue),
      prepareProxy: jest.fn(),
    };

    jest.spyOn(networkHandlerFactory, 'getNetworkHandler').mockReturnValue({
      networkHandler: mockNetworkHandler,
      handlerVersion,
    });

    return mockNetworkHandler;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Table-driven tests for successful delivery scenarios
  describe('successful delivery scenarios', () => {
    const testCases = [
      {
        name: 'v0 request with v0 handler',
        request: baseV0Request,
        version: 'v0',
        handlerVersion: 'v0',
        responseHandlerReturn: {
          status: 200,
          message: 'Success',
          destinationResponse: {
            status: 200,
            response: { success: true },
          },
        },
        expectedResult: {
          status: 200,
          message: 'Success',
          destinationResponse: {
            status: 200,
            response: { success: true },
          },
        },
      },
      {
        name: 'v1 request with v1 handler',
        request: baseV1Request,
        version: 'v1',
        handlerVersion: 'v1',
        responseHandlerReturn: {
          status: 200,
          message: 'Success',
          response: [
            {
              statusCode: 200,
              metadata,
              error: 'success',
            },
          ],
        },
        expectedResult: {
          status: 200,
          message: 'Success',
          response: [
            {
              statusCode: 200,
              metadata,
              error: 'success',
            },
          ],
        },
      },
      {
        name: 'v1 request with v0 handler (adaptation)',
        request: baseV1Request,
        version: 'v1',
        handlerVersion: 'v0',
        responseHandlerReturn: {
          status: 200,
          message: 'Success',
          destinationResponse: {
            status: 200,
            response: { success: true },
          },
        },
        expectedResult: {
          status: 200,
          message: 'Success',
          response: [
            {
              statusCode: 200,
              metadata,
              error: '{"success":true}',
            },
          ],
        },
        customAssertions: (result: any) => {
          const v1Response = result as DeliveryV1Response;
          expect(v1Response).toHaveProperty('response');
          expect(Array.isArray(v1Response.response)).toBe(true);
          expect(v1Response.response[0]).toHaveProperty('statusCode', 200);
          expect(v1Response.response[0]).toHaveProperty('metadata', metadata);
          expect(v1Response.response[0]).toHaveProperty('error', '{"success":true}');
        },
      },
    ];

    test.each(testCases)(
      '$name',
      async ({
        request,
        version,
        handlerVersion,
        responseHandlerReturn,
        expectedResult,
        customAssertions,
      }) => {
        // Setup mock
        const mockNetworkHandler = setupNetworkHandlerMock(handlerVersion, responseHandlerReturn);

        // Execute
        const service = new NativeIntegrationDestinationService();
        const result = await service.deliver(request, destinationType, requestMetadata, version);

        // Verify common expectations
        expect(networkHandlerFactory.getNetworkHandler).toHaveBeenCalledWith(
          destinationType,
          version,
        );
        expect(mockNetworkHandler.proxy).toHaveBeenCalledWith(request, destinationType);
        expect(mockNetworkHandler.processAxiosResponse).toHaveBeenCalled();
        expect(mockNetworkHandler.responseHandler).toHaveBeenCalled();

        // Verify result
        expect(result).toEqual(expectedResult);

        // Run custom assertions if provided
        if (customAssertions) {
          customAssertions(result);
        }
      },
    );
  });

  // Table-driven tests for error scenarios
  describe('error scenarios', () => {
    const errorTestCases = [
      {
        name: 'v1 response without response property',
        request: baseV1Request,
        version: 'v1',
        handlerVersion: 'v1',
        responseHandlerReturn: {
          status: 200,
          message: 'Success',
          // Missing response property
        },
        mockSetup: () => {
          const mockNetworkHandler = {
            proxy: jest.fn().mockResolvedValue({ data: 'success' }),
            processAxiosResponse: jest.fn().mockReturnValue({
              status: 200,
              response: { success: true },
            }),
            responseHandler: jest.fn().mockReturnValue({
              status: 200,
              message: 'Success',
              // Missing response property
            }),
            prepareProxy: jest.fn(),
          };

          jest.spyOn(networkHandlerFactory, 'getNetworkHandler').mockReturnValue({
            networkHandler: mockNetworkHandler,
            handlerVersion: 'v1',
          });

          // Mock the post transformation service to handle the error
          jest
            .spyOn(DestinationPostTransformationService, 'handlevV1DeliveriesFailureEvents')
            .mockReturnValue({
              status: 400,
              message: 'Delivery response is not in the correct format',
              response: [
                {
                  statusCode: 400,
                  metadata,
                  error: 'Delivery response is not in the correct format',
                },
              ],
              statTags: {
                destType: 'TEST_DESTINATION',
                destinationId: 'test-destination',
                errorCategory: 'platform',
                feature: 'dataDelivery',
                implementation: 'native',
                module: 'destination',
                workspaceId: 'test-workspace',
              },
            } as DeliveryV1Response);
        },
        expectedResult: {
          status: 400,
          message: 'Delivery response is not in the correct format',
          response: [
            {
              statusCode: 400,
              metadata,
              error: 'Delivery response is not in the correct format',
            },
          ],
          statTags: {
            destType: 'TEST_DESTINATION',
            destinationId: 'test-destination',
            errorCategory: 'platform',
            feature: 'dataDelivery',
            implementation: 'native',
            module: 'destination',
            workspaceId: 'test-workspace',
          },
        },
        verifyMocks: () => {
          expect(networkHandlerFactory.getNetworkHandler).toHaveBeenCalledWith(
            destinationType,
            'v1',
          );
          expect(
            DestinationPostTransformationService.handlevV1DeliveriesFailureEvents,
          ).toHaveBeenCalled();
        },
      },
      {
        name: 'v0 request with networkHandlerFactory error',
        request: baseV0Request,
        version: 'v0',
        mockSetup: () => {
          jest.spyOn(networkHandlerFactory, 'getNetworkHandler').mockImplementation(() => {
            throw new PlatformError(
              'Network handler not found for destination: test_destination',
              500,
            );
          });

          jest
            .spyOn(DestinationPostTransformationService, 'handleDeliveryFailureEvents')
            .mockReturnValue({
              status: 500,
              error: 'Network handler not found for destination: test_destination',
              destinationResponse: undefined,
            } as unknown as DeliveryV0Response);
        },
        expectedResult: {
          status: 500,
          error: 'Network handler not found for destination: test_destination',
        },
        verifyMocks: () => {
          expect(networkHandlerFactory.getNetworkHandler).toHaveBeenCalledWith(
            destinationType,
            'v0',
          );
          expect(
            DestinationPostTransformationService.handleDeliveryFailureEvents,
          ).toHaveBeenCalled();
        },
      },
      {
        name: 'v1 request with networkHandlerFactory error',
        request: baseV1Request,
        version: 'v1',
        mockSetup: () => {
          jest.spyOn(networkHandlerFactory, 'getNetworkHandler').mockImplementation(() => {
            throw new PlatformError(
              'Network handler not found for destination: test_destination',
              500,
            );
          });

          jest
            .spyOn(DestinationPostTransformationService, 'handlevV1DeliveriesFailureEvents')
            .mockReturnValue({
              status: 500,
              message: 'Error',
              response: [
                {
                  statusCode: 500,
                  error: 'Network handler not found for destination: test_destination',
                },
              ],
            } as DeliveryV1Response);
        },
        expectedResult: {
          status: 500,
          message: 'Error',
          response: [
            {
              statusCode: 500,
              error: 'Network handler not found for destination: test_destination',
            },
          ],
        },
        verifyMocks: () => {
          expect(networkHandlerFactory.getNetworkHandler).toHaveBeenCalledWith(
            destinationType,
            'v1',
          );
          expect(
            DestinationPostTransformationService.handlevV1DeliveriesFailureEvents,
          ).toHaveBeenCalled();
        },
      },
    ];

    test.each(errorTestCases)(
      '$name',
      async ({
        request,
        version,
        handlerVersion,
        responseHandlerReturn,
        mockSetup,
        expectedResult,
        verifyMocks,
      }) => {
        // Setup mocks
        if (mockSetup) {
          mockSetup();
        } else if (handlerVersion && responseHandlerReturn) {
          setupNetworkHandlerMock(handlerVersion, responseHandlerReturn);
        }

        const service = new NativeIntegrationDestinationService();

        // Execute and verify result
        const result = await service.deliver(request, destinationType, requestMetadata, version);
        expect(result).toEqual(expectedResult);

        // Verify mocks if provided
        if (verifyMocks) {
          verifyMocks();
        }
      },
    );
  });
});
