import { INTEGRATION_SERVICE } from '../../routes/utils/constants';
import { CDKV2DestinationService } from '../../services/destination/cdkV2Integration';
import { NativeIntegrationDestinationService } from '../../services/destination/nativeIntegration';
import { ProcessorTransformationRequest } from '../../types/index';
import { ServiceSelector } from '../serviceSelector';

afterEach(() => {
  jest.clearAllMocks();
});

describe('ServiceSelector Service', () => {
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

  test('isCdkV2Destination should return true', async () => {
    const destinationDefinitionConfig = {
      cdkV2Enabled: true,
    };
    expect(ServiceSelector['isCdkV2Destination'](destinationDefinitionConfig)).toBe(true);
  });

  test('isCdkV2Destination should return false', async () => {
    const destinationDefinitionConfig = {
      cdkV2EnabledXYZ: true,
    };
    expect(ServiceSelector['isCdkV2Destination'](destinationDefinitionConfig)).toBe(false);
  });

  test('getPrimaryDestinationService should return cdk v2 dest service', async () => {
    const events = [
      {
        destination: {
          DestinationDefinition: {
            Config: {
              cdkV2Enabled: true,
            },
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
