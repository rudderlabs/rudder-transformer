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

  test('getPrimaryDestinationService should return cdk v2 dest service', async () => {
    const events = [
      {
        destination: {
          DestinationDefinition: {
            Name: 'WEBHOOK',
          },
        },
      },
    ] as unknown as ProcessorTransformationRequest[];
    expect(ServiceSelector['getPrimaryDestinationService'](events)).toBeInstanceOf(
      CDKV2DestinationService,
    );
  });

  test('getPrimaryDestinationService should return native dest service', async () => {
    const events = [{}] as ProcessorTransformationRequest[];
    expect(ServiceSelector['getPrimaryDestinationService'](events)).toBeInstanceOf(
      NativeIntegrationDestinationService,
    );
  });

  test('getDestinationService should return native dest service', async () => {
    const events = [{}] as ProcessorTransformationRequest[];
    expect(ServiceSelector.getDestinationService(events)).toBeInstanceOf(
      NativeIntegrationDestinationService,
    );
  });
});
