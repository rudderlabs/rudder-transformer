import groupBy from "lodash/groupBy";
import IntegrationDestinationService from "../../interfaces/IntegrationDestinationService";
import {
  DeliveryResponse,
  ErrorDetailer,
  Metadata,
  ProcessorRequest,
  ProcessorResponse,
  RouterRequestData,
  RouterResponse,
  TransformedEvent
} from "../../types/index";
import { TRANSFORMER_METRIC } from "../../v0/util/constant";
import PostTransformationServiceDestination from "./postTransformation.destination.service";

export default class NativeIntegrationServiceDestination
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
            | TransformedEvent[] = await destHandler.process(
            event
          );
          return PostTransformationServiceDestination.handleSuccessEventsAtProcessorDest(
            event,
            transformedPayloads,
            destHandler
          );
        } catch (error) {
          const errorDTO = {
            stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM,
            integrationType: destinationType,
            eventMetadatas: [event.metadata],
            serverRequestMetadata: requestMetadata,
            destinationInfo: [event.destination],
            inputPayload: event.message,
            errorContext:
              "[Native Integration Service] Failure During Processor Transform"
          } as ErrorDetailer;
          return PostTransformationServiceDestination.handleFailedEventsAtProcessorDest(
            error,
            errorDTO
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
      Object.values(allDestEvents).map(async (destInputArray: RouterRequestData[]) => {
        try {
          const routerRoutineResponse: RouterResponse[] = await destHandler.processRouterDest(
            destInputArray
          );
          return PostTransformationServiceDestination.handleSuccessEventsAtRouterDest(
            routerRoutineResponse,
            destHandler
          );
        } catch (error) {
          const errorDTO = {
            stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM,
            integrationType: destinationType,
            eventMetadatas: destInputArray.map(ev => {
              return ev.metadata;
            }),
            serverRequestMetadata: requestMetadata,
            destinationInfo: destInputArray.map(ev => {
              return ev.destination;
            }),
            inputPayload: destInputArray.map(ev => {
              return ev.message;
            }),
            errorContext:
              "[Native Integration Service] Failure During Router Transform"
          } as ErrorDetailer;
          return PostTransformationServiceDestination.handleFailureEventsAtRouterDest(
            error,
            errorDTO
          );
        }
      })
    );
    return response;
  }

  public batchRoutine(
    events: RouterRequestData[],
    destinationType: string,
    destHandler: any,
    requestMetadata: Object
  ) {
    if (!destHandler.batch) {
      throw new Error(`${destinationType} does not implement batch`);
    }
    const allDestEvents: Object = groupBy(
      events,
      (ev: RouterRequestData) => ev.destination?.ID
    );
    const response = Object.entries(allDestEvents).map(
      (destEvents: RouterRequestData[]) => {
        try {
          const destBatchedRequests:
            | RouterResponse
            | RouterResponse[] = destHandler.batch(destEvents);
          return destBatchedRequests;
        } catch (error) {
          const errorDTO = {
            stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM,
            integrationType: destinationType,
            eventMetadatas: destEvents.map(ev => {
              return ev.metadata;
            }),
            serverRequestMetadata: requestMetadata,
            destinationInfo: destEvents.map(ev => {
              return ev.destination;
            }),
            inputPayload: destEvents.map(ev => {
              return ev.message;
            }),
            errorContext:
              "[Native Integration Service] Failure During Batch Transform"
          } as ErrorDetailer;
          return PostTransformationServiceDestination.handleFailureEventsAtBatchDest(
            error,
            errorDTO
          );
        }
      }
    );
    return response;
  }

  public async deliveryRoutine(
    destinationRequest: TransformedEvent,
    metadata: Metadata,
    destinationType: string,
    networkHandler: any,
    requestMetadata: Object
  ): Promise<DeliveryResponse> {
    try {
      const rawProxyResponse = await networkHandler.proxy(destinationRequest);
      const processedProxyResponse = networkHandler.iosResponse(
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
      const errorDTO = {
        eventMetadatas: [metadata],
        stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.RESPONSE_TRANSFORM,
        integrationType: destinationType,
        serverRequestMetadata: requestMetadata,
        destinationInfo: undefined,
        inputPayload: destinationRequest,
        errorContext: "[Native Integration Service] Failure During Delivery"
      } as ErrorDetailer;
      return PostTransformationServiceDestination.handleFailureEventsAtDeliveryDest(
        err,
        errorDTO
      );
    }
  }
}
