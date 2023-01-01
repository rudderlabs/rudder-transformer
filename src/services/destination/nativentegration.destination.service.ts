import groupBy from "lodash/groupBy";
import IntegrationDestinationService from "../../interfaces/DestinationService";
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
import PostTransformationServiceDestination from "./postTransformation.destination.service";
import networkHandlerFactory from "../../adapters/networkHandlerFactory";
import FetchHandler from "../../helpers/fetchHandlers";
import tags from "../../v0/util/tags";

export default class NativeIntegrationDestinationService
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
        implementation: tags.IMPLEMENTATIONS.NATIVE,
        feature,
        destinationId,
        workspaceId,
        context:
          "[Native Integration Service] Failure During Processor Transform"
      } as ErrorDetailer
    } as MetaTransferObject;
    return metaTO;
  }

  public async processorRoutine(
    events: ProcessorRequest[],
    destinationType: string,
    version: string,
    _requestMetadata: Object
  ): Promise<ProcessorResponse[]> {
    const destHandler = FetchHandler.getDestHandler(destinationType, version);
    const respList: ProcessorResponse[][] = await Promise.all(
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
    events: RouterRequestData[],
    destinationType: string,
    version: string,
    _requestMetadata: Object
  ): Promise<RouterResponse[]> {
    const destHandler = FetchHandler.getDestHandler(destinationType, version);
    const allDestEvents: Object = groupBy(
      events,
      (ev: RouterRequestData) => ev.destination?.ID
    );
    const groupedEvents: RouterRequestData[][] = Object.values(allDestEvents);
    const response: RouterResponse[][] = await Promise.all(
      groupedEvents.map(async (destInputArray: RouterRequestData[]) => {
        const metaTO = this.getTags(
          destinationType,
          destInputArray[0].metadata.destinationId,
          destInputArray[0].metadata.workspaceId,
          tags.FEATURES.ROUTER
        );
        try {
          const routerRoutineResponse: RouterResponse[] = await destHandler.processRouterDest(
            destInputArray
          );
          return PostTransformationServiceDestination.handleSuccessEventsAtRouterDest(
            routerRoutineResponse,
            destHandler,
            metaTO
          );
        } catch (error) {
          metaTO.metadatas = destInputArray.map(input => {
            return input.metadata;
          });
          const errorResp = PostTransformationServiceDestination.handleFailureEventsAtRouterDest(
            error,
            metaTO
          );
          return [errorResp];
        }
      })
    );
    return response.flat();
  }

  public batchRoutine(
    events: RouterRequestData[],
    destinationType: string,
    version: any,
    _requestMetadata: Object
  ): RouterResponse[] {
    const destHandler = FetchHandler.getDestHandler(destinationType, version);
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
        const metaTO = this.getTags(
          destinationType,
          destEvents[0].metadata.destinationId,
          destEvents[0].metadata.workspaceId,
          tags.FEATURES.BATCH
        );
        metaTO.metadatas = events.map(event => {
          return event.metadata;
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
    _requestMetadata: Object
  ): Promise<DeliveryResponse> {
    try {
      const networkHandler = networkHandlerFactory.getNetworkHandler(
        destinationType
      );
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
      const metaTO = this.getTags(
        destinationType,
        destinationRequest.metadata?.destinationId || "Non-determininable",
        destinationRequest.metadata?.workspaceId || "Non-determininable",
        tags.FEATURES.DATA_DELIVERY
      );
      metaTO.metadata = destinationRequest.metadata;
      return PostTransformationServiceDestination.handleFailureEventsAtDeliveryDest(
        err,
        metaTO
      );
    }
  }
}
