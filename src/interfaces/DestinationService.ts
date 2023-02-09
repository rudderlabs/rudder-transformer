import {
  DeliveryResponse,
  MetaTransferObject,
  ProcessorTransformationRequest,
  ProcessorTransformationResponse,
  RouterTransformationRequestData,
  RouterTransformationResponse,
  ProcessorTransformationOutput,
  UserDeletionRequest,
  UserDeletionResponse,
} from '../types/index';

export default interface DestinationService {

  getName():string

  init(): void;

  getTags(
    destType: string,
    destinationId: string,
    workspaceId: string,
    feature: string,
  ): MetaTransferObject;

  processorRoutine(
    events: ProcessorTransformationRequest[],
    destinationType: string,
    version: string,
    requestMetadata: Object,
  ): Promise<ProcessorTransformationResponse[]>;

  routerRoutine(
    events: RouterTransformationRequestData[],
    destinationType: string,
    version: string,
    requestMetadata: Object,
  ): Promise<RouterTransformationResponse[]>;

  batchRoutine(
    events: RouterTransformationRequestData[],
    destinationType: string,
    version: string,
    requestMetadata: Object,
  ): RouterTransformationResponse[];

  deliveryRoutine(
    event: ProcessorTransformationOutput,
    destinationType: string,
    requestMetadata: Object,
  ): Promise<DeliveryResponse>;

  deletionRoutine(
    requests: UserDeletionRequest[],
    rudderDestInfo: string,
  ): Promise<UserDeletionResponse[]>;
}
