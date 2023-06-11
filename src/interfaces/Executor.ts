import {
  DeliveryResponse,
  ProcessorTransformationRequest,
  ProcessorTransformationResponse,
  RouterTransformationRequestData,
  RouterTransformationResponse,
  TransformationStage,
  TransformedOutput,
  UserDeletionRequest,
  UserDeletionResponse,
} from '../types';
import IDestination from './Destination';

export default interface Executor {
  streamingImplementation: IDestination;
  retlImplementation: IDestination;

  getStreamingImplementationState(): IDestination;
  getRetlImplementationState(): IDestination;
  setImplementationState(): void;
  executeStreaming(
    inputs: (ProcessorTransformationRequest | RouterTransformationRequestData)[],
    stage: TransformationStage,
  ): Promise<(ProcessorTransformationResponse | RouterTransformationResponse)[]>;

  executeRetl(
    inputs: (ProcessorTransformationRequest | RouterTransformationRequestData)[],
    stage: TransformationStage,
  ): Promise<(ProcessorTransformationResponse | RouterTransformationResponse)[]>;

  executeDelivery(event: TransformedOutput): Promise<DeliveryResponse>;
  executeDeletion(
    requests: UserDeletionRequest[],
    rudderDestInfo: string,
  ): Promise<UserDeletionResponse[]>;
}
