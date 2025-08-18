import { PlatformError } from '@rudderstack/integrations-lib';
import { DestinationService } from '../interfaces/DestinationService';
import { SourceService } from '../interfaces/SourceService';
import { INTEGRATION_SERVICE } from '../routes/utils/constants';
import { CDKV2DestinationService } from '../services/destination/cdkV2Integration';
import { NativeIntegrationDestinationService } from '../services/destination/nativeIntegration';
import { NativeIntegrationSourceService } from '../services/source/nativeIntegration';
import { FixMe, ProcessorTransformationRequest, RouterTransformationRequestData } from '../types';

export class ServiceSelector {
  private static serviceMap: Map<string, any> = new Map();

  private static services = {
    [INTEGRATION_SERVICE.CDK_V2_DEST]: CDKV2DestinationService,
    [INTEGRATION_SERVICE.NATIVE_DEST]: NativeIntegrationDestinationService,
    [INTEGRATION_SERVICE.NATIVE_SOURCE]: NativeIntegrationSourceService,
  };

  private static isCdkV2Destination(destinationDefinitionConfig: FixMe) {
    return Boolean(destinationDefinitionConfig?.cdkV2Enabled);
  }

  private static fetchCachedService(serviceType: string) {
    if (this.serviceMap.has(serviceType)) {
      return this.serviceMap.get(serviceType);
    }
    const Service = this.services[serviceType];
    if (!Service) {
      throw new PlatformError('Invalid Service');
    }
    this.serviceMap.set(serviceType, new Service());
    return this.serviceMap.get(serviceType);
  }

  public static getNativeDestinationService(): DestinationService {
    return this.fetchCachedService(INTEGRATION_SERVICE.NATIVE_DEST);
  }

  public static getNativeSourceService(): SourceService {
    return this.fetchCachedService(INTEGRATION_SERVICE.NATIVE_SOURCE);
  }

  private static getPrimaryDestinationService(
    events: ProcessorTransformationRequest[] | RouterTransformationRequestData[],
  ): DestinationService {
    const destinationDefinitionConfig: FixMe =
      events[0]?.destination?.DestinationDefinition?.Config;
    if (this.isCdkV2Destination(destinationDefinitionConfig)) {
      return this.fetchCachedService(INTEGRATION_SERVICE.CDK_V2_DEST);
    }
    return this.fetchCachedService(INTEGRATION_SERVICE.NATIVE_DEST);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static getSourceService(arg: unknown) {
    // Implement source event based decision logic for selecting service
  }

  public static getDestinationService(
    events: ProcessorTransformationRequest[] | RouterTransformationRequestData[],
  ): DestinationService {
    return this.getPrimaryDestinationService(events);
  }
}
