import {
  DeliveryResponse,
  MetaTransferObject,
  ProcessorTransformRequest,
  ProcessorTransformResponse,
  RouterTransformRequestData,
  RouterTransformResponse,
  TransformedEvent,
  UserDeletionRequest,
  UserDeletionResponse,
} from '../types/index';

export default interface DestinationService {
  init(): void;

  getTags(
    destType: string,
    destinationId: string,
    workspaceId: string,
    feature: string,
  ): MetaTransferObject;

  processorRoutine(
    events: ProcessorTransformRequest[],
    destinationType: string,
    version: string,
    requestMetadata: Object,
  ): Promise<ProcessorTransformResponse[]>;

  routerRoutine(
    events: RouterTransformRequestData[],
    destinationType: string,
    version: string,
    requestMetadata: Object,
  ): Promise<RouterTransformResponse[]>;

  batchRoutine(
    events: RouterTransformRequestData[],
    destinationType: string,
    version: string,
    requestMetadata: Object,
  ): RouterTransformResponse[];

  deliveryRoutine(
    event: TransformedEvent,
    destinationType: string,
    requestMetadata: Object,
  ): Promise<DeliveryResponse>;

  deletionRoutine(
    requests: UserDeletionRequest[],
    rudderDestInfo: string,
  ): Promise<UserDeletionResponse[]>;
}
