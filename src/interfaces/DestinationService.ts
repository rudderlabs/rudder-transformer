import {
  DeliveryResponse,
  MetaTransferObject,
  ProcessorRequest,
  ProcessorResponse,
  RouterRequestData,
  RouterResponse,
  TransformedEvent
} from "../types/index";

export default interface DestinationService {
  getTags(
    destType: string,
    destinationId: string,
    workspaceId: string,
    feature: string
  ): MetaTransferObject;

  processorRoutine(
    events: ProcessorRequest[],
    destinationType: string,
    version: string,
    requestMetadata: Object
  ): Promise<ProcessorResponse[]>;

  routerRoutine(
    events: RouterRequestData[],
    destinationType: string,
    version: string,
    requestMetadata: Object
  ): Promise<RouterResponse[]>;

  batchRoutine(
    events: RouterRequestData[],
    destinationType: string,
    version: string,
    requestMetadata: Object
  ): RouterResponse[];

  deliveryRoutine(
    event: TransformedEvent,
    destinationType: string,
    requestMetadata: Object
  ): Promise<DeliveryResponse>;
}
