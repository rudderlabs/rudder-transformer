import {
  DeliveryResponse,
  MetaTransferObject,
  ProcessorTransformationRequest,
  ProcessorTransformationResponse,
  RouterTransformationRequestData,
  RouterTransformationResponse,
  UserDeletionRequest,
  UserDeletionResponse,
  ProxyRequest,
  DeliveriesResponse,
} from '../types/index';

export interface DestinationService {
  getName(): string;

  init(): void;

  getTags(
    destType: string,
    destinationId: string,
    workspaceId: string,
    feature: string,
  ): MetaTransferObject;

  doProcessorTransformation(
    events: ProcessorTransformationRequest[],
    destinationType: string,
    version: string,
    requestMetadata: NonNullable<unknown>,
  ): Promise<ProcessorTransformationResponse[]>;

  doRouterTransformation(
    events: RouterTransformationRequestData[],
    destinationType: string,
    version: string,
    requestMetadata: NonNullable<unknown>,
  ): Promise<RouterTransformationResponse[]>;

  doBatchTransformation(
    events: RouterTransformationRequestData[],
    destinationType: string,
    version: string,
    requestMetadata: NonNullable<unknown>,
  ): RouterTransformationResponse[];

  deliver(
    event: ProxyRequest,
    destinationType: string,
    requestMetadata: NonNullable<unknown>,
    version: string,
  ): Promise<DeliveryResponse | DeliveriesResponse>;

  processUserDeletion(
    requests: UserDeletionRequest[],
    rudderDestInfo: string,
  ): Promise<UserDeletionResponse[]>;
}
