import groupBy from "lodash/groupBy";
import { processCdkV2Workflow } from "../../cdk/v2/handler";
import IntegrationServiceDestination from "../../interfaces/IntegrationServiceDestination";
import {
  DeliveryResponse,
  ErrorDetailer,
  Metadata,
  ObjectType,
  ProcessorRequest,
  ProcessorResponse,
  RouterData,
  RouterResponse,
  TransformationDefaultResponse
} from "../../types/types";
import { TRANSFORMER_METRIC } from "../../v0/util/constant";
import PostTransformationServiceDestination from "./postTransformation.destination.service";

export default class CDKV2ServiceDestination
  implements IntegrationServiceDestination {
  public async processorRoutine(
    events: ProcessorRequest[],
    destinationType: string,
    destHandler: any,
    requestMetadata: ObjectType
  ): Promise<ProcessorResponse[]> {
    // TODO: Change the promise type
    const respList: ProcessorResponse[] = await Promise.all<any>(
      events.map(async event => {
        try {
          let transformedPayloads:
            | TransformationDefaultResponse
            | TransformationDefaultResponse[] = await processCdkV2Workflow(
            destinationType,
            event,
            TRANSFORMER_METRIC.ERROR_AT.PROC
          );
          return PostTransformationServiceDestination.handleSuccessEventsAtProcessorDest(
            event,
            transformedPayloads,
            destHandler
          );
        } catch (error) {
          const errorDTO = {
            stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM,
            integrationType:destinationType,
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
    events: RouterData[],
    destinationType: string,
    destHandler: any,
    requestMetadata: ObjectType
  ): Promise<RouterResponse[]> {
    const allDestEvents: Object = groupBy(
      events,
      (ev: RouterData) => ev.destination?.ID
    );
    // TODO: Change the promise type
    const response: RouterResponse[] = await Promise.all<any>(
      Object.values(allDestEvents).map(async (destInputArray: RouterData[]) => {
        try {
          const routerRoutineResponse: RouterResponse[] = await processCdkV2Workflow(
            destinationType,
            destInputArray,
            TRANSFORMER_METRIC.ERROR_AT.RT
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
    _events: RouterData[],
    _destinationType: string,
    _destHandler: any,
    _requestMetadata: ObjectType
  ) {
    throw new Error("CDKV2 Does not Implement Batch Transform Routine");
  }

  public deliveryRoutine(
    _event: TransformationDefaultResponse,
    _metadata: Metadata,
    _destinationType: string,
    _networkHandler: any,
    _requestMetadata: ObjectType
  ): Promise<DeliveryResponse> {
    throw new Error("CDV2 Does not Implement Delivery Routine");
  }
}
