import { ProcessorTransformationRequest, RouterTransformationRequestData } from '../types/index';
import { INTEGRATION_SERVICE } from '../routes/utils/constants';
import CDKV1DestinationService from '../services/destination/cdkV1Integration';
import CDKV2DestinationService from '../services/destination/cdkV2Integration';
import DestinationService from '../interfaces/DestinationService';
import NativeIntegrationDestinationService from '../services/destination/nativeIntegration';
import SourceService from '../interfaces/SourceService';
import NativeIntegrationSourceService from '../services/source/nativeIntegration';
import { PlatformError } from '../v0/util/errorTypes';
import ComparatorService from '../services/comparator';

export default class ServiceSelector {
  private static serviceMap: Map<string, any> = new Map();

  private static isCdkDestination(destinationDefinitionConfig: Object) {
    return !!destinationDefinitionConfig?.['cdkEnabled'];
  }

  private static isCdkV2Destination(destinationDefinitionConfig: Object) {
    return (
      process.env.CDK_V2_Enabled === 'true' &&
      Boolean(destinationDefinitionConfig?.['cdkV2Enabled'])
    );
  }

  private static isComparatorEnabled(destinationDefinitionConfig: Object): boolean {
    return !!destinationDefinitionConfig['camparisonTestEnabeld'];
  }

  private static getSecondaryServiceName(destinationDefinitionConfig: Object): string {
    return destinationDefinitionConfig['camparisonService'];
  }

  private static fetchCachedService(serviceType: string) {
    if (this.serviceMap.has(serviceType)) {
      return this.serviceMap.get(serviceType);
    }
    switch (serviceType) {
      case INTEGRATION_SERVICE.CDK_V1_DEST:
        this.serviceMap.set(INTEGRATION_SERVICE.CDK_V1_DEST, new CDKV1DestinationService());
        break;
      case INTEGRATION_SERVICE.CDK_V2_DEST:
        this.serviceMap.set(INTEGRATION_SERVICE.CDK_V2_DEST, new CDKV2DestinationService());
        break;
      case INTEGRATION_SERVICE.NATIVE_DEST:
        this.serviceMap.set(
          INTEGRATION_SERVICE.NATIVE_DEST,
          new NativeIntegrationDestinationService(),
        );
        break;
      case INTEGRATION_SERVICE.NATIVE_SOURCE:
        this.serviceMap.set(
          INTEGRATION_SERVICE.NATIVE_SOURCE,
          new NativeIntegrationSourceService(),
        );
    }
    return this.serviceMap.get(serviceType);
  }

  public static getNativeDestinationService(): DestinationService {
    return this.fetchCachedService(INTEGRATION_SERVICE.NATIVE_DEST);
  }

  public static getNativeSourceService(): SourceService {
    return this.fetchCachedService(INTEGRATION_SERVICE.NATIVE_SOURCE);
  }

  private static getDestinationServiceByName(name: string): DestinationService {
    switch (name) {
      case INTEGRATION_SERVICE.CDK_V1_DEST:
        return this.fetchCachedService(INTEGRATION_SERVICE.CDK_V1_DEST);
      case INTEGRATION_SERVICE.CDK_V2_DEST:
        return this.fetchCachedService(INTEGRATION_SERVICE.CDK_V2_DEST);
      case INTEGRATION_SERVICE.NATIVE_DEST:
        return this.fetchCachedService(INTEGRATION_SERVICE.NATIVE_DEST);
      default:
        throw new PlatformError('Invalid Service');
    }
  }

  private static getPrimaryDestinationService(
    events: ProcessorTransformationRequest[] | RouterTransformationRequestData[],
  ): DestinationService {
    const destinationDefinitionConfig: Object = events[0].destination.DestinationDefinition.Config;
    if (this.isCdkDestination(destinationDefinitionConfig)) {
      return this.fetchCachedService(INTEGRATION_SERVICE.CDK_V1_DEST);
    } else if (this.isCdkV2Destination(destinationDefinitionConfig)) {
      return this.fetchCachedService(INTEGRATION_SERVICE.CDK_V2_DEST);
    } else {
      return this.fetchCachedService(INTEGRATION_SERVICE.NATIVE_DEST);
    }
  }

  public static getSourceService(arg: unknown) {
    // Implement source event based descision logic for selecting service
  }

  public static getDestinationService(
    events: ProcessorTransformationRequest[] | RouterTransformationRequestData[],
  ): DestinationService {
    const destinationDefinition = events[0].destination.DestinationDefinition;
    const destinationDefinitionConfig = destinationDefinition.Config;
    const primaryService = this.getPrimaryDestinationService(events);
    if (this.isComparatorEnabled(destinationDefinitionConfig)) {
      if (this.serviceMap.has(INTEGRATION_SERVICE.COMPARATOR)) {
        return this.serviceMap.get(INTEGRATION_SERVICE.COMPARATOR);
      }
      const secondaryServiceName = this.getSecondaryServiceName(destinationDefinitionConfig);
      const secondaryService = this.getDestinationServiceByName(secondaryServiceName);
      const comparatorService = new ComparatorService(primaryService, secondaryService);
      const comparatorServiceStateKey = `${destinationDefinition.ID}#${INTEGRATION_SERVICE.COMPARATOR}`;
      this.serviceMap.set(comparatorServiceStateKey, comparatorService);
      return comparatorService;
    }
    return primaryService;
  }
}
