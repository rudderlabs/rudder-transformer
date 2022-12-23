import groupBy from "lodash/groupBy";
import { processCdkV2Workflow } from "../../cdk/v2/handler";
import IntegrationDestinationService from "../../interfaces/IntegrationDestinationService";
import {
  DeliveryResponse,
  ErrorDetailer,
  MetaTransferObject,
  ProcessorRequest,
  ProcessorResponse,
  RouterRequestData,
  RouterResponse,
  TransformedEvent
} from "../../types/index";
import { TransformationError } from "../../v0/util/errorTypes";
import tags from "../../v0/util/tags";
import PostTransformationServiceDestination from "./postTransformation.destination.service";

export default class CDKV2DestinationService
  implements IntegrationDestinationService {
  public async processorRoutine(
    events: ProcessorRequest[],
    destinationType: string,
    destHandler: any,
    requestMetadata: Object
  ): Promise<ProcessorResponse[]> {
    // TODO: Change the promise type
    const respList: ProcessorResponse[] = await Promise.all<any>(
      events.map(async event => {
        try {
          let transformedPayloads:
            | TransformedEvent
            | TransformedEvent[] = await processCdkV2Workflow(
            destinationType,
            event,
            tags.FEATURES.PROCESSOR
          );
          return PostTransformationServiceDestination.handleSuccessEventsAtProcessorDest(
            event,
            transformedPayloads,
            destHandler
          );
        } catch (error) {
          let metaTO: MetaTransferObject;
          metaTO.errorDetails = {
            destType: destinationType.toUpperCase(),
            module: tags.MODULES.DESTINATION,
            implementation: tags.IMPLEMENTATIONS.CDK_V2,
            feature: tags.FEATURES.PROCESSOR,
            destinationId: event.metadata.destinationId,
            workspaceId: event.metadata.workspaceId,
            context:
              "[CDKV2 Integration Service] Failure During Processor Transform"
          };
          metaTO.metadata = event.metadata;
          return PostTransformationServiceDestination.handleFailedEventsAtProcessorDest(
            error,
            metaTO
          );
        }
      })
    );
    return respList;
  }

  public async routerRoutine(
    events: RouterRequestData[],
    destinationType: string,
    destHandler: any,
    requestMetadata: Object
  ): Promise<RouterResponse[]> {
    const allDestEvents: Object = groupBy(
      events,
      (ev: RouterRequestData) => ev.destination?.ID
    );
    // TODO: Change the promise type
    const response: RouterResponse[] = await Promise.all<any>(
      Object.values(allDestEvents).map(
        async (destInputArray: RouterRequestData[]) => {
          try {
            const routerRoutineResponse: RouterResponse[] = await processCdkV2Workflow(
              destinationType,
              destInputArray,
              tags.FEATURES.ROUTER
            );
            return PostTransformationServiceDestination.handleSuccessEventsAtRouterDest(
              routerRoutineResponse,
              destHandler
            );
          } catch (error) {
            let metaTO: MetaTransferObject;
            metaTO.errorDetails = {
              destType: destinationType.toUpperCase(),
              module: tags.MODULES.DESTINATION,
              implementation: tags.IMPLEMENTATIONS.CDK_V2,
              feature: tags.FEATURES.ROUTER,
              destinationId: destInputArray[0].metadata.destinationId,
              workspaceId: destInputArray[0].metadata.workspaceId,
              context:
                "[CDKV2 Integration Service] Failure During Router Transform"
            };
            metaTO.metadatas = destInputArray.map(input => {
              return input.metadata;
            });
            return PostTransformationServiceDestination.handleFailureEventsAtRouterDest(
              error,
              metaTO
            );
          }
        }
      )
    );
    return response;
  }

  public batchRoutine(
    _events: RouterRequestData[],
    _destinationType: string,
    _destHandler: any,
    _requestMetadata: Object
  ) {
    throw new TransformationError(
      "CDKV2 Does not Implement Batch Transform Routine"
    );
  }

  public deliveryRoutine(
    _event: TransformedEvent,
    _destinationType: string,
    _networkHandler: any,
    _requestMetadata: Object
  ): Promise<DeliveryResponse> {
    throw new TransformationError("CDV2 Does not Implement Delivery Routine");
  }
}
