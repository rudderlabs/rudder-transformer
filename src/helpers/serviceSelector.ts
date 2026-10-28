import { PlatformError } from '@rudderstack/integrations-lib';
import { DestinationService } from '../interfaces/DestinationService';
import { SourceService } from '../interfaces/SourceService';
import { INTEGRATION_SERVICE } from '../routes/utils/constants';
import { CDKV2DestinationService } from '../services/destination/cdkV2Integration';
import { NativeIntegrationDestinationService } from '../services/destination/nativeIntegration';
import { NativeIntegrationSourceService } from '../services/source/nativeIntegration';
import { ProcessorTransformationRequest, RouterTransformationRequestData } from '../types';
import { shouldUseCdkV2 } from '../cdk/v2/utils';

export class ServiceSelector {
  private static serviceMap: Map<string, any> = new Map();

  private static services = {
    [INTEGRATION_SERVICE.CDK_V2_DEST]: CDKV2DestinationService,
    [INTEGRATION_SERVICE.NATIVE_DEST]: NativeIntegrationDestinationService,
    [INTEGRATION_SERVICE.NATIVE_SOURCE]: NativeIntegrationSourceService,
  };

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

  public static getDestinationServiceByType(
    destType: string,
    workspaceId: string,
    destinationVersion?: number,
  ): DestinationService {
    if (shouldUseCdkV2(destType, workspaceId, destinationVersion)) {
      return this.fetchCachedService(INTEGRATION_SERVICE.CDK_V2_DEST);
    }
    return this.fetchCachedService(INTEGRATION_SERVICE.NATIVE_DEST);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static getSourceService(arg: unknown) {
    // Implement source event based decision logic for selecting service
  }

  /**
   * Splits a request by the service each event resolves to. One request can carry several
   * destinations of the same type (e.g. HTTP v1 on CDK and HTTP v2 native), so selecting from the
   * first event alone would send the others down the wrong path. An event whose destination carries
   * no definition falls back to the first event's type, as routing did before grouping.
   */
  public static groupByDestinationService<
    T extends ProcessorTransformationRequest | RouterTransformationRequestData,
  >(events: T[]): [DestinationService, T[]][] {
    const primaryType = events[0]?.destination?.DestinationDefinition?.Name ?? '';
    const services = new Map<string, DestinationService>();
    const groups = new Map<DestinationService, T[]>();
    for (const event of events) {
      const type = event.destination?.DestinationDefinition?.Name ?? primaryType;
      const workspaceId = event.metadata?.workspaceId ?? '';
      const version = event.destination?.version;
      // Resolve once per distinct (type, workspace, version), not once per event.
      const key = `${type}|${workspaceId}|${version}`;
      let service = services.get(key);
      if (!service) {
        service = this.getDestinationServiceByType(type, workspaceId, version);
        services.set(key, service);
      }
      const group = groups.get(service);
      if (group) group.push(event);
      else groups.set(service, [event]);
    }
    return [...groups];
  }
}
