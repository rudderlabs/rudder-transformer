import groupBy from "lodash/groupBy";
import { processCdkV2Workflow } from "../../cdk/v2/handler";
import IntegrationDestinationService from "../../interfaces/IntegrationDestinationService";
import {
  DeliveryResponse,
  ProcessorRequest,
  ProcessorResponse,
  RouterRequestData,
  RouterResponse,
  TransformedEvent
} from "../../types/index";
import { TransformationError } from "../../v0/util/errorTypes";
import tags from "../../v0/util/tags";
import TaggingService from "../tagging.service";
import PostTransformationServiceDestination from "./postTransformation.destination.service";

export default class CDKV2DestinationService
  implements IntegrationDestinationService {
  public async processorRoutine(
    events: ProcessorRequest[],
    destinationType: string,
    _version: string,
    _requestMetadata: Object
  ): Promise<ProcessorResponse[]> {
    // TODO: Change the promise type
    const respList: ProcessorResponse[][] = await Promise.all(
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
          const metaTO = TaggingService.getCDKV2ProcTransformTags(
            destinationType,
            event.metadata.destinationId,
            event.metadata.workspaceId
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
    events: RouterRequestData[],
    destinationType: string,
    _version: string,
    _requestMetadata: Object
  ): Promise<RouterResponse[]> {
    const allDestEvents: Object = groupBy(
      events,
      (ev: RouterRequestData) => ev.destination?.ID
    );
    // TODO: Change the promise type
    const response: RouterResponse[][] = await Promise.all(
      Object.values(allDestEvents).map(
        async (destInputArray: RouterRequestData[]) => {
          const metaTO = TaggingService.getCDKV2RouterTransformTags(
            destinationType,
            destInputArray[0].metadata.destinationId,
            destInputArray[0].metadata.workspaceId
          );
          try {
            const routerRoutineResponse: RouterResponse[] = await processCdkV2Workflow(
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
    _events: RouterRequestData[],
    _destinationType: string,
    _version: string,
    _requestMetadata: Object
  ): RouterResponse[] {
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
