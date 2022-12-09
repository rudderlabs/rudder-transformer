import { ObjectType, ProcessorRequest, RouterData } from "../types/types";
import { MiscService } from "../services/misc.service";
import { INTEGRATION_SERVICE } from "../routes/utils/constants";
import CDKV1ServiceDestination from "../services/destination/cdkV1Integration.destination.service";
import CDKV2ServiceDestination from "../services/destination/cdkV2Integration.destination.service";
import IntegrationServiceDestination from "../interfaces/IntegrationServiceDestination";
import NativeIntegrationServiceDestination from "../services/destination/nativentegration.destination.service";

export class ServiceSelector {
  private static destHandlerMap: Map<string, any> = new Map();
  private static serviceMap: Map<string, any> = new Map();

  private static isCdkDestination(destinationDefinitionConfig: ObjectType) {
    return !!destinationDefinitionConfig?.["cdkEnabled"];
  }

  private static isCdkV2Destination(destinationDefinitionConfig: ObjectType) {
    return !!destinationDefinitionConfig?.["cdkV2Enabled"];
  }

  private static fetchCachedService(serviceType: string) {
    let service: any;
    if (this.serviceMap.has(serviceType)) {
      service = this.serviceMap.get(serviceType);
    } else {
      switch (serviceType) {
        case INTEGRATION_SERVICE.CDK_V1:
          this.serviceMap.set(
            INTEGRATION_SERVICE.CDK_V1,
            new CDKV1ServiceDestination()
          );
          break;
        case INTEGRATION_SERVICE.CDK_V2:
          this.serviceMap.set(
            INTEGRATION_SERVICE.CDK_V2,
            new CDKV2ServiceDestination()
          );
          break;
        default:
          this.serviceMap.set(
            INTEGRATION_SERVICE.NATIVE,
            new NativeIntegrationServiceDestination()
          );
      }
      service = this.serviceMap.get(serviceType);
    }
    return service;
  }

  public static getDestHandler(dest: string, version: string) {
    let destinationHandler: any;
    if (this.destHandlerMap.get(dest)) {
      destinationHandler = this.destHandlerMap.get(dest);
    } else {
      destinationHandler = MiscService.getDestHandler(dest, version);
      this.destHandlerMap.set(dest, destinationHandler);
    }
    return destinationHandler;
  }

  public static getNativeIntegrationService(): IntegrationServiceDestination {
    return this.fetchCachedService(INTEGRATION_SERVICE.NATIVE);
  }

  public static getDestinationService(
    events: ProcessorRequest[] | RouterData[]
  ): IntegrationServiceDestination {
    const destinationDefinitionConfig: ObjectType =
      events[0].destination.DestinationDefinition.Config;
    if (this.isCdkDestination(destinationDefinitionConfig)) {
      return this.fetchCachedService(INTEGRATION_SERVICE.CDK_V1);
    } else if (this.isCdkV2Destination(destinationDefinitionConfig)) {
      return this.fetchCachedService(INTEGRATION_SERVICE.CDK_V2);
    } else {
      return this.fetchCachedService(INTEGRATION_SERVICE.NATIVE);
    }
  }
}
