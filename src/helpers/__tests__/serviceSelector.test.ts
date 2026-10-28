import { INTEGRATION_SERVICE } from '../../routes/utils/constants';
import { CDKV2DestinationService } from '../../services/destination/cdkV2Integration';
import { NativeIntegrationDestinationService } from '../../services/destination/nativeIntegration';
import { ProcessorTransformationRequest } from '../../types/index';
import { ServiceSelector } from '../serviceSelector';

const originalDisableWebhookCdkV2 = process.env.DISABLE_WEBHOOK_CDK_V2;

afterEach(() => {
  jest.clearAllMocks();
  if (originalDisableWebhookCdkV2 === undefined) {
    delete process.env.DISABLE_WEBHOOK_CDK_V2;
  } else {
    process.env.DISABLE_WEBHOOK_CDK_V2 = originalDisableWebhookCdkV2;
  }
});

describe('ServiceSelector Service', () => {
  const serviceByTypeCases = [
    {
      name: 'CDK v2-only HTTP destination',
      destType: 'http',
      workspaceId: 'workspace-1',
      disableValue: undefined,
      expectedService: CDKV2DestinationService,
    },
    {
      name: 'native Amplitude destination',
      destType: 'am',
      workspaceId: 'workspace-1',
      disableValue: undefined,
      expectedService: NativeIntegrationDestinationService,
    },
    {
      name: 'globally disabled Webhook CDK v2 destination',
      destType: 'webhook',
      workspaceId: 'workspace-1',
      disableValue: 'ALL',
      expectedService: NativeIntegrationDestinationService,
    },
    {
      name: 'explicitly enabled Webhook CDK v2 destination',
      destType: 'webhook',
      workspaceId: 'workspace-1',
      disableValue: 'NONE',
      expectedService: CDKV2DestinationService,
    },
    {
      name: 'workspace-disabled Webhook CDK v2 destination',
      destType: 'webhook',
      workspaceId: 'workspace-2',
      disableValue: 'workspace-1, workspace-2',
      expectedService: NativeIntegrationDestinationService,
    },
    {
      name: 'workspace-enabled Webhook CDK v2 destination',
      destType: 'webhook',
      workspaceId: 'workspace-3',
      disableValue: 'workspace-1, workspace-2',
      expectedService: CDKV2DestinationService,
    },
  ];

  test('should save the service in the cache', async () => {
    expect(ServiceSelector['serviceMap'].get(INTEGRATION_SERVICE.NATIVE_DEST)).toBeUndefined();
    expect(ServiceSelector['serviceMap'].get(INTEGRATION_SERVICE.NATIVE_SOURCE)).toBeUndefined();

    ServiceSelector.getNativeDestinationService();
    ServiceSelector.getNativeSourceService();

    expect(ServiceSelector['serviceMap'].get(INTEGRATION_SERVICE.NATIVE_DEST)).toBeDefined();
    expect(ServiceSelector['serviceMap'].get(INTEGRATION_SERVICE.NATIVE_SOURCE)).toBeDefined();
  });

  test('fetchCachedService should throw error for invalidService', async () => {
    expect(() => ServiceSelector['fetchCachedService']('invalidService')).toThrow(
      'Invalid Service',
    );
  });

  test.each(serviceByTypeCases)(
    'getDestinationServiceByType returns the expected service for $name',
    ({ destType, workspaceId, disableValue, expectedService }) => {
      if (disableValue === undefined) {
        delete process.env.DISABLE_WEBHOOK_CDK_V2;
      } else {
        process.env.DISABLE_WEBHOOK_CDK_V2 = disableValue;
      }

      expect(ServiceSelector.getDestinationServiceByType(destType, workspaceId)).toBeInstanceOf(
        expectedService,
      );
    },
  );

  test('routes HTTP v2 to native while preserving v1 CDK selection', () => {
    expect(ServiceSelector.getDestinationServiceByType('HTTP', 'workspace-1', 2)).toBeInstanceOf(
      NativeIntegrationDestinationService,
    );
    expect(ServiceSelector.getDestinationServiceByType('HTTP', 'workspace-1', 1)).toBeInstanceOf(
      CDKV2DestinationService,
    );
  });

  test('groups a mixed HTTP request by the service each event resolves to', () => {
    const event = (jobId: number, version: number) => ({
      destination: { DestinationDefinition: { Name: 'HTTP' }, version },
      metadata: { workspaceId: 'workspace-1', jobId },
    });
    const groups = ServiceSelector.groupByDestinationService([
      event(1, 2),
      event(2, 1),
      event(3, 2),
    ] as unknown as ProcessorTransformationRequest[]);
    expect(groups).toHaveLength(2);
    expect(groups[0][0]).toBeInstanceOf(NativeIntegrationDestinationService);
    expect(groups[0][1].map((e) => e.metadata.jobId)).toEqual([1, 3]);
    expect(groups[1][0]).toBeInstanceOf(CDKV2DestinationService);
    expect(groups[1][1].map((e) => e.metadata.jobId)).toEqual([2]);
  });

  test("uses the first event's destination type for events without a definition", () => {
    const groups = ServiceSelector.groupByDestinationService([
      { destination: { DestinationDefinition: { Name: 'WEBHOOK' } }, metadata: { jobId: 1 } },
      { destination: {}, metadata: { jobId: 2 } },
    ] as unknown as ProcessorTransformationRequest[]);
    expect(groups).toHaveLength(1);
    expect(groups[0][0]).toBeInstanceOf(CDKV2DestinationService);
    expect(groups[0][1]).toHaveLength(2);
  });
});
