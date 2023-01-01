import { ConfigFactory, Executor } from "rudder-transformer-cdk";
import IntegrationDestinationService from "../../interfaces/DestinationService";
import {
  DeliveryResponse,
  ErrorDetailer,
  MetaTransferObject,
  ProcessorTransformRequest,
  ProcessorTransformResponse,
  RouterTransformRequestData,
  RouterTransformResponse,
  TransformedEvent
} from "../../types/index";
import { TransformationError } from "../../v0/util/errorTypes";
import PostTransformationServiceDestination from "./postTransformation";
import tags from "../../v0/util/tags";

export default class CDKV1DestinationService
  implements IntegrationDestinationService {
  public getTags(
    destType: string,
    destinationId: string,
    workspaceId: string,
    feature: string
  ): MetaTransferObject {
    const metaTO = {
      errorDetails: {
        destType: destType.toUpperCase(),
        module: tags.MODULES.DESTINATION,
        implementation: tags.IMPLEMENTATIONS.CDK_V1,
        feature,
        destinationId,
        workspaceId,
        context: "[CDKV1 Integration Service] Failure During Proc Transform"
      } as ErrorDetailer
    } as MetaTransferObject;
    return metaTO;
  }

  public async processorRoutine(
    events: ProcessorTransformRequest[],
    destinationType: string,
    _version: string,
    _requestMetadata: Object
  ): Promise<ProcessorTransformResponse[]> {
    const tfConfig = await ConfigFactory.getConfig(destinationType);
    const respList: ProcessorTransformResponse[][] = await Promise.all(
      events.map(async event => {
        try {
          let transformedPayloads: any = await Executor.execute(
            event as any,
            tfConfig
          );
          // We are not passing destinationHandler to post processor as we don't have post processing in CDK flows
          return PostTransformationServiceDestination.handleSuccessEventsAtProcessorDest(
            event,
            transformedPayloads,
            undefined
          );
        } catch (error) {
          const metaTO = this.getTags(
            destinationType,
            event.metadata.destinationId,
            event.metadata.workspaceId,
            tags.FEATURES.PROCESSOR
          );
          metaTO.metadata = event.metadata;
          const erroredResp = PostTransformationServiceDestination.handleFailedEventsAtProcessorDest(
            error,
            metaTO
          );
          return [erroredResp];
        }
      })
    );
    return respList.flat();
  }

  public routerRoutine(
    _events: RouterTransformRequestData[],
    _destinationType: string,
    _version: string,
    _requestMetadata: Object
  ): Promise<RouterTransformResponse[]> {
    throw new TransformationError(
      "CDKV1 Does not Implement Router Transform Routine"
    );
  }

  public batchRoutine(
    _events: RouterTransformRequestData[],
    _destinationType: string,
    _version: any,
    _requestMetadata: Object
  ): RouterTransformResponse[] {
    throw new TransformationError(
      "CDKV1 Does not Implement Batch Transform Routine"
    );
  }

  public deliveryRoutine(
    _event: TransformedEvent,
    _destinationType: string,
    _requestMetadata: Object
  ): Promise<DeliveryResponse> {
    throw new TransformationError("CDV1 Does not Implement Delivery Routine");
  }
}
