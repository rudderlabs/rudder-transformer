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

  public static getNativeSourceTransformTags(): MetaTransferObject {
    const metaTO = {
      errorDetails: {
        module: tags.MODULES.SOURCE,
        implementation: tags.IMPLEMENTATIONS.NATIVE,
        context: "[Native Integration Service] Failure During Source Transform"
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

  public static getCDKV1ProcTransformTags(
    destType: string,
    destinationId: string,
    workspaceId: string
  ): MetaTransferObject {
    const metaTO = {
      errorDetails: {
        destType: destType.toUpperCase(),
        module: tags.MODULES.DESTINATION,
        implementation: tags.IMPLEMENTATIONS.CDK_V1,
        feature: tags.FEATURES.PROCESSOR,
        destinationId,
        workspaceId,
        context: "[CDKV1 Integration Service] Failure During Proc Transform"
      } as ErrorDetailer
    } as MetaTransferObject;
    return metaTO;
  }

  public static getCDKV2ProcTransformTags(
    destType: string,
    destinationId: string,
    workspaceId: string
  ): MetaTransferObject {
    const metaTO = {
      errorDetails: {
        destType: destType.toUpperCase(),
        module: tags.MODULES.DESTINATION,
        implementation: tags.IMPLEMENTATIONS.CDK_V2,
        feature: tags.FEATURES.PROCESSOR,
        destinationId,
        workspaceId,
        context: "[CDKV2 Integration Service] Failure During Proc Transform"
      } as ErrorDetailer
    } as MetaTransferObject;
    return metaTO;
  }
  

  public static getCDKV2RouterTransformTags(
    destType: string,
    destinationId: string,
    workspaceId: string
  ): MetaTransferObject {
    const metaTO = {
      errorDetails: {
        destType: destType.toUpperCase(),
        module: tags.MODULES.DESTINATION,
        implementation: tags.IMPLEMENTATIONS.CDK_V2,
        feature: tags.FEATURES.ROUTER,
        destinationId,
        workspaceId,
        context: "[CDKV2 Integration Service] Failure During Router Transform"
      } as ErrorDetailer
    } as MetaTransferObject;
    return metaTO;
  }
}
