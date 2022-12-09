import {
  DeliveryResponse,
  Metadata,
  ObjectType,
  ProcessorRequest,
  ProcessorResponse,
  RouterData,
  RouterResponse,
  TransformationDefaultResponse
} from "../types/types";

export default interface IntegrationServiceDestination {
  processorRoutine(
    events: ProcessorRequest[],
    destinationType: string,
    destHandler: any,
    requestMetadata: ObjectType
  ): Promise<ProcessorResponse[]>;

  routerRoutine(
    events: RouterData[],
    destinationType: string,
    destHandler: any,
    requestMetadata: ObjectType
  ): Promise<RouterResponse[]>;

  batchRoutine(
    events: RouterData[],
    destinationType: string,
    destHandler: any,
    requestMetadata: ObjectType
  ): any;

  deliveryRoutine(
    event: TransformationDefaultResponse,
    metadata: Metadata,
    destinationType: string,
    networkHandler: any,
    requestMetadata: ObjectType
  ): Promise<DeliveryResponse>;
}
