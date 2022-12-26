import { ErrorDetailer, MetaTransferObject } from "../types/index";
import tags from "../v0/util/tags";

export default class TaggingService {
  public static getNativeProcTransformTags(
    destType: string,
    destinationId: string,
    workspaceId: string
  ): MetaTransferObject {
    const metaTO = {
      errorDetails: {
        destType: destType.toUpperCase(),
        module: tags.MODULES.DESTINATION,
        implementation: tags.IMPLEMENTATIONS.NATIVE,
        feature: tags.FEATURES.PROCESSOR,
        destinationId: destinationId,
        workspaceId: workspaceId,
        context:
          "[Native Integration Service] Failure During Processor Transform"
      } as ErrorDetailer
    } as MetaTransferObject;
    return metaTO;
  }

  public static getNativeRouterTransformTags(
    destType: string,
    destinationId: string,
    workspaceId: string
  ): MetaTransferObject {
    const metaTO = {
      errorDetails: {
        destType: destType.toUpperCase(),
        module: tags.MODULES.DESTINATION,
        implementation: tags.IMPLEMENTATIONS.NATIVE,
        feature: tags.FEATURES.ROUTER,
        destinationId,
        workspaceId,
        context: "[Native Integration Service] Failure During Router Transform"
      } as ErrorDetailer
    } as MetaTransferObject;
    return metaTO;
  }

  public static getNativeBatchTransformTags(
    destType: string,
    destinationId: string,
    workspaceId: string
  ): MetaTransferObject {
    const metaTO = {
      errorDetails: {
        destType: destType.toUpperCase(),
        module: tags.MODULES.DESTINATION,
        implementation: tags.IMPLEMENTATIONS.NATIVE,
        feature: tags.FEATURES.BATCH,
        destinationId,
        workspaceId,
        context: "[Native Integration Service] Failure During Batch Transform"
      } as ErrorDetailer
    } as MetaTransferObject;
    return metaTO;
  }

  public static getNativeDeliveryTags(
    destType: string,
    destinationId: string,
    workspaceId: string
  ): MetaTransferObject {
    const metaTO = {
      errorDetails: {
        destType: destType.toUpperCase(),
        module: tags.MODULES.DESTINATION,
        implementation: tags.IMPLEMENTATIONS.NATIVE,
        feature: tags.FEATURES.DATA_DELIVERY,
        destinationId,
        workspaceId,
        context: "[Native Integration Service] Failure During Delivery"
      } as ErrorDetailer
    } as MetaTransferObject;
    return metaTO;
  }
}
