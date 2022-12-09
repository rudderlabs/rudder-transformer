import { ConfigFactory, Executor } from "rudder-transformer-cdk";
import IntegrationServiceDestination from "../../interfaces/IntegrationServiceDestination";
import {
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

export default class CDKV1ServiceDestination
  implements IntegrationServiceDestination {
  public async processorRoutine(
    events: ProcessorRequest[],
    destinationType: string,
    destHandler: any,
    requestMetadata: ObjectType
  ): Promise<ProcessorResponse[]> {
    const tfConfig = await ConfigFactory.getConfig(destinationType);
    const respList: ProcessorResponse[] = await Promise.all<any>(
      events.map(async event => {
        try {
          let transformedPayloads: any = await Executor.execute(
            event as any,
            tfConfig
          );
          return PostTransformationServiceDestination.handleSuccessEventsAtProcessorDest(
            event,
            transformedPayloads,
            destHandler
          );
        } catch (error) {
          const errorDTO = {
            stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM,
            destinationType,
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

  public routerRoutine(
    _events: RouterData[],
    _destinationType: string,
    _destHandler: string,
    _requestMetadata: ObjectType
  ): Promise<RouterResponse[]> {
    throw new Error("CDKV1 Does not Implement Router Transform Routine");
  }

  public batchRoutine(
    _events: RouterData[],
    _destinationType: string,
    _destHandler: any,
    _requestMetadata: ObjectType
  ) {
    throw new Error("CDKV1 Does not Implement Batch Transform Routine");
  }

  public deliveryRoutine(
    _event: TransformationDefaultResponse,
    _metadata: Metadata,
    _destinationType: string,
    _networkHandler: any,
    _requestMetadata: ObjectType
  ) {
    throw new Error("CDV1 Does not Implement Delivery Routine");
  }
}
