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

  doProcessorTransformation(
    events: ProcessorTransformationRequest[],
    destinationType: string,
    version: string,
    requestMetadata: Object,
  ): Promise<ProcessorTransformationResponse[]>;

  doRouterTransformation(
    events: RouterTransformationRequestData[],
    destinationType: string,
    version: string,
    requestMetadata: Object,
  ): Promise<RouterTransformationResponse[]>;

  doBatchTransformation(
    events: RouterTransformationRequestData[],
    destinationType: string,
    version: string,
    requestMetadata: Object,
  ): RouterTransformationResponse[];

  deliver(
    event: ProcessorTransformationOutput,
    destinationType: string,
    requestMetadata: Object,
  ): Promise<DeliveryResponse>;

  processUserDeletion(
    requests: UserDeletionRequest[],
    rudderDestInfo: string,
  ): Promise<UserDeletionResponse[]>;
}
