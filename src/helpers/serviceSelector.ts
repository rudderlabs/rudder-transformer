import { ProcessorTransformRequest, RouterTransformRequestData } from "../types/index";
import { INTEGRATION_SERVICE } from "../routes/utils/constants";
import CDKV1DestinationService from "../services/destination/cdkV1Integration.destination.service";
import CDKV2DestinationService from "../services/destination/cdkV2Integration.destination.service";
import DestinationService from "../interfaces/DestinationService";
import NativeIntegrationDestinationService from "../services/destination/nativentegration.destination.service";
import SourceService from "../interfaces/SourceService";
import NativeIntegrationSourceService from "../services/source/nativeIntegration.source.service";

export default class ServiceSelector {

  private static serviceMap: Map<string, any> = new Map();

  private static isCdkDestination(destinationDefinitionConfig: Object) {
    return !!destinationDefinitionConfig?.["cdkEnabled"];
  }

  private static isCdkV2Destination(destinationDefinitionConfig: Object) {
    return !!destinationDefinitionConfig?.["cdkV2Enabled"];
  }

  private static fetchCachedService(serviceType: string) {
    let service: any;
    if (this.serviceMap.has(serviceType)) {
      service = this.serviceMap.get(serviceType);
    } else {
      switch (serviceType) {
        case INTEGRATION_SERVICE.CDK_V1_DEST:
          this.serviceMap.set(
            INTEGRATION_SERVICE.CDK_V1_DEST,
            new CDKV1DestinationService()
          );
          break;
        case INTEGRATION_SERVICE.CDK_V2_DEST:
          this.serviceMap.set(
            INTEGRATION_SERVICE.CDK_V2_DEST,
            new CDKV2DestinationService()
          );
          break;
        case INTEGRATION_SERVICE.NATIVE_DEST:
          this.serviceMap.set(
            INTEGRATION_SERVICE.NATIVE_DEST,
            new NativeIntegrationDestinationService()
          );
          break;
        case INTEGRATION_SERVICE.NATIVE_SOURCE:
          this.serviceMap.set(
            INTEGRATION_SERVICE.NATIVE_SOURCE,
            new NativeIntegrationSourceService()
          );
      }
      service = this.serviceMap.get(serviceType);
    }
    return service;
  }


  public static getNativeDestinationService(): DestinationService {
    return this.fetchCachedService(INTEGRATION_SERVICE.NATIVE_DEST);
  }

  public static getNativeSourceService(): SourceService {
    return this.fetchCachedService(INTEGRATION_SERVICE.NATIVE_SOURCE);
  }

  public static getDestinationService(
    events: ProcessorTransformRequest[] | RouterTransformRequestData[]
  ): DestinationService {
    const destinationDefinitionConfig: Object =
      events[0].destination.DestinationDefinition.Config;
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
}
