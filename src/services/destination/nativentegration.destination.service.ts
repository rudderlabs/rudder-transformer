import groupBy from "lodash/groupBy";
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
import tags from "../../v0/util/tags";
import PostTransformationServiceDestination from "./postTransformation.destination.service";

export default class NativeIntegrationDestinationService
  implements IntegrationDestinationService {
  public async processorRoutine(
    events: ProcessorRequest[],
    destinationType: string,
    destHandler: any,
    requestMetadata: Object
  ): Promise<ProcessorResponse[]> {
    // TODO: Change the promise type
    const respList: (
      | ProcessorResponse
      | ProcessorResponse[]
    )[] = await Promise.all(
      events.map(async event => {
        try {
          let transformedPayloads:
            | TransformedEvent
            | TransformedEvent[] = await destHandler.process(event);
          return PostTransformationServiceDestination.handleSuccessEventsAtProcessorDest(
            event,
            transformedPayloads,
            destHandler
          );
        } catch (error) {
          const metaTO = {
            errorDetails: {
              destType: destinationType.toUpperCase(),
              module: tags.MODULES.DESTINATION,
              implementation: tags.IMPLEMENTATIONS.NATIVE,
              feature: tags.FEATURES.PROCESSOR,
              destinationId: event.metadata.destinationId,
              workspaceId: event.metadata.workspaceId,
              context:
                "[Native Integration Service] Failure During Processor Transform"
            } as ErrorDetailer,
            metadata: event.metadata
          } as MetaTransferObject;
          return PostTransformationServiceDestination.handleFailedEventsAtProcessorDest(
            error,
            metaTO
          );
        }
      })
    );
    return respList.flat();
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
            const routerRoutineResponse: RouterResponse[] = await destHandler.processRouterDest(
              destInputArray
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
              implementation: tags.IMPLEMENTATIONS.NATIVE,
              feature: tags.FEATURES.ROUTER,
              destinationId: destInputArray[0].metadata.destinationId,
              workspaceId: destInputArray[0].metadata.workspaceId,
              context:
                "[Native Integration Service] Failure During Router Transform"
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
    events: RouterRequestData[],
    destinationType: string,
    destHandler: any,
    requestMetadata: Object
  ): RouterResponse[] {
    if (!destHandler.batch) {
      throw new Error(`${destinationType} does not implement batch`);
    }
    const allDestEvents: Object = groupBy(
      events,
      (ev: RouterRequestData) => ev.destination?.ID
    );
    const groupedEvents: RouterRequestData[][] = Object.values(allDestEvents);
    const response = groupedEvents.map(destEvents => {
      try {
        const destBatchedRequests: RouterResponse[] = destHandler.batch(
          destEvents
        );
        return destBatchedRequests;
      } catch (error) {
        const metaTO = {
          errorDetails: {
            destType: destinationType.toUpperCase(),
            module: tags.MODULES.DESTINATION,
            implementation: tags.IMPLEMENTATIONS.NATIVE,
            feature: tags.FEATURES.BATCH,
            destinationId: destEvents[0].metadata.destinationId,
            workspaceId: destEvents[0].metadata.workspaceId,
            context:
              "[Native Integration Service] Failure During Batch Transform"
          } as ErrorDetailer
        } as MetaTransferObject;
        metaTO.metadatas = destEvents.map(input => {
          return input.metadata;
        });
        const errResp = PostTransformationServiceDestination.handleFailureEventsAtBatchDest(
          error,
          metaTO
        );
        return [errResp];
      }
    });
    return response.flat();
  }

  public async deliveryRoutine(
    destinationRequest: TransformedEvent,
    destinationType: string,
    networkHandler: any,
    requestMetadata: Object
  ): Promise<DeliveryResponse> {
    try {
      const rawProxyResponse = await networkHandler.proxy(destinationRequest);
      const processedProxyResponse = networkHandler.processAxiosResponse(
        rawProxyResponse
      );
      return networkHandler.responseHandler(
        {
          ...processedProxyResponse,
          rudderJobMetadata: destinationRequest.metadata
        },
        destinationType
      ) as DeliveryResponse;
    } catch (err) {
      let metaTO: MetaTransferObject;
      metaTO.errorDetails = {
        destType: destinationType.toUpperCase(),
        module: tags.MODULES.DESTINATION,
        implementation: tags.IMPLEMENTATIONS.NATIVE,
        feature: tags.FEATURES.DATA_DELIVERY,
        destinationId: destinationRequest.metadata.destinationId,
        workspaceId: destinationRequest.metadata.workspaceId,
        context: "[Native Integration Service] Failure During Delivery"
      };
      metaTO.metadata = destinationRequest.metadata;
      return PostTransformationServiceDestination.handleFailureEventsAtDeliveryDest(
        err,
        metaTO
      );
    }
  }
}
