import groupBy from "lodash/groupBy";
import { processCdkV2Workflow } from "../../cdk/v2/handler";
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
import tags from "../../v0/util/tags";
import PostTransformationServiceDestination from "./postTransformation.destination.service";

export default class CDKV2DestinationService
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
        implementation: tags.IMPLEMENTATIONS.CDK_V2,
        feature,
        destinationId,
        workspaceId,
        context: "[CDKV2 Integration Service] Failure During Router Transform"
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
    // TODO: Change the promise type
    const respList: ProcessorTransformResponse[][] = await Promise.all(
      events.map(async event => {
        try {
          let transformedPayloads:
            | TransformedEvent
            | TransformedEvent[] = await processCdkV2Workflow(
            destinationType,
            event,
            tags.FEATURES.PROCESSOR
          );
          // We are not passing destination handler for CDK flows
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

  public async routerRoutine(
    events: RouterTransformRequestData[],
    destinationType: string,
    _version: string,
    _requestMetadata: Object
  ): Promise<RouterTransformResponse[]> {
    const allDestEvents: Object = groupBy(
      events,
      (ev: RouterTransformRequestData) => ev.destination?.ID
    );
    const response: RouterTransformResponse[][] = await Promise.all(
      Object.values(allDestEvents).map(
        async (destInputArray: RouterTransformRequestData[]) => {
          const metaTO = this.getTags(
            destinationType,
            destInputArray[0].metadata.destinationId,
            destInputArray[0].metadata.workspaceId,
            tags.FEATURES.ROUTER
          );
          try {
            const routerRoutineResponse: RouterTransformResponse[] = await processCdkV2Workflow(
              destinationType,
              destInputArray,
              tags.FEATURES.ROUTER
            );
            return PostTransformationServiceDestination.handleSuccessEventsAtRouterDest(
              routerRoutineResponse,
              undefined,
              metaTO
            );
          } catch (error) {
            metaTO.metadatas = destInputArray.map(input => {
              return input.metadata;
            });
            const erroredResp = PostTransformationServiceDestination.handleFailureEventsAtRouterDest(
              error,
              metaTO
            );
            return [erroredResp];
          }
        }
      )
    );
    return response.flat();
  }

  public batchRoutine(
    _events: RouterTransformRequestData[],
    _destinationType: string,
    _version: string,
    _requestMetadata: Object
  ): RouterTransformResponse[] {
    throw new TransformationError(
      "CDKV2 Does not Implement Batch Transform Routine"
    );
  }

  public deliveryRoutine(
    _event: TransformedEvent,
    _destinationType: string,
    _requestMetadata: Object
  ): Promise<DeliveryResponse> {
    throw new TransformationError("CDV2 Does not Implement Delivery Routine");
  }
}
