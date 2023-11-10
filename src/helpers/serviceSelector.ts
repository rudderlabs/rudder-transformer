import { PlatformError } from '@rudderstack/integrations-lib';
import { ProcessorTransformationRequest, RouterTransformationRequestData } from '../types/index';
import { INTEGRATION_SERVICE } from '../routes/utils/constants';
import { CDKV1DestinationService } from '../services/destination/cdkV1Integration';
import { CDKV2DestinationService } from '../services/destination/cdkV2Integration';
import { DestinationService } from '../interfaces/DestinationService';
import { NativeIntegrationDestinationService } from '../services/destination/nativeIntegration';
import { SourceService } from '../interfaces/SourceService';
import { NativeIntegrationSourceService } from '../services/source/nativeIntegration';
import { ComparatorService } from '../services/comparator';
import { FixMe } from '../util/types';

export class ServiceSelector {
  private static serviceMap: Map<string, any> = new Map();

  private static services = {
    [INTEGRATION_SERVICE.CDK_V1_DEST]: CDKV1DestinationService,
    [INTEGRATION_SERVICE.CDK_V2_DEST]: CDKV2DestinationService,
    [INTEGRATION_SERVICE.NATIVE_DEST]: NativeIntegrationDestinationService,
    [INTEGRATION_SERVICE.NATIVE_SOURCE]: NativeIntegrationSourceService,
  };

  private static isCdkDestination(destinationDefinitionConfig: FixMe) {
    return !!destinationDefinitionConfig?.cdkEnabled;
  }

  private static isCdkV2Destination(destinationDefinitionConfig: FixMe) {
    return Boolean(destinationDefinitionConfig?.cdkV2Enabled);
  }

  private static isComparatorEnabled(destinationDefinitionConfig: FixMe): boolean {
    return (
      process.env.COMPARATOR_ENABLED === 'true' &&
      !!destinationDefinitionConfig.comparisonTestEnabeld
    );
  }

  private static getSecondaryServiceName(destinationDefinitionConfig: FixMe): string {
    return destinationDefinitionConfig.comparisonService;
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

  private static getDestinationServiceByName(name: string): DestinationService {
    return this.fetchCachedService(name);
  }

  private static getPrimaryDestinationService(
    events: ProcessorTransformationRequest[] | RouterTransformationRequestData[],
  ): DestinationService {
    const destinationDefinitionConfig: FixMe =
      events[0]?.destination?.DestinationDefinition?.Config;
    if (this.isCdkDestination(destinationDefinitionConfig)) {
      return this.fetchCachedService(INTEGRATION_SERVICE.CDK_V1_DEST);
    }
    if (this.isCdkV2Destination(destinationDefinitionConfig)) {
      return this.fetchCachedService(INTEGRATION_SERVICE.CDK_V2_DEST);
    }
    return this.fetchCachedService(INTEGRATION_SERVICE.NATIVE_DEST);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static getSourceService(arg: unknown) {
    // Implement source event based descision logic for selecting service
  }

  public static getDestinationService(
    events: ProcessorTransformationRequest[] | RouterTransformationRequestData[],
  ): DestinationService {
    const destinationDefinition = events[0]?.destination?.DestinationDefinition;
    const destinationDefinitionConfig = destinationDefinition?.Config;
    const primaryService = this.getPrimaryDestinationService(events);
    if (!this.isComparatorEnabled(destinationDefinitionConfig)) {
      return primaryService;
    }
    const comparatorServiceStateKey = `${destinationDefinition.ID}#${INTEGRATION_SERVICE.COMPARATOR}`;
    if (this.serviceMap.has(comparatorServiceStateKey)) {
      return this.serviceMap.get(comparatorServiceStateKey);
    }
    const secondaryServiceName = this.getSecondaryServiceName(destinationDefinitionConfig);
    const secondaryService = this.getDestinationServiceByName(secondaryServiceName);
    const comparatorService = new ComparatorService(primaryService, secondaryService);

    this.serviceMap.set(comparatorServiceStateKey, comparatorService);
    return comparatorService;
  }
}
