import get from 'get-value';
import DestinationService from '../../interfaces/DestinationService';
import {
  DeliveryResponse,
  ErrorDetailer,
  MetaTransferObject,
  ProcessorTransformationRequest,
  ProcessorTransformationResponse,
  RouterTransformationRequestData,
  RouterTransformationResponse,
  TransformedOutput,
  UserDeletionRequest,
  UserDeletionResponse,
} from '../../types';
import tags from '../../v0/util/tags';
import { TransformationError } from '../../v0/util/errorTypes';
import AdapterUtility from '../../v1/util/executorUtil';
import FetchAdaptiveHandlers from '../../helpers/fetchAdaptiveHandlers';
import { MappedToDestinationKey } from '../../constants';

export default class AdapterIntegrationService implements DestinationService {
  getName(): string {
    return 'Adapter';
  }

  init(): void {}

  getTags(
    destType: string,
    destinationId: string,
    workspaceId: string,
    feature: string,
  ): MetaTransferObject {
    const metaTo = {
      errorDetails: {
        destType: destType.toUpperCase(),
        module: tags.MODULES.DESTINATION,
        implementation: 'Adapter', // Specific implementation name needed here by passing the implementation
        feature,
        destinationId,
        workspaceId,
      } as ErrorDetailer,
      errorContext: '[Common Adapter Service] Failure During Transform',
    } as MetaTransferObject;
    return metaTo;
  }

  async doProcessorTransformation(
    events: ProcessorTransformationRequest[],
    destinationType: string,
  ): Promise<ProcessorTransformationResponse[]> {
    const isRetlEvents = get(events[0].message, MappedToDestinationKey);
    // het the implementation name from the destinationType
    const executor = FetchAdaptiveHandlers.getAdapterExecutor(destinationType);
    // get the implementation name from the executor
    const implementation = isRetlEvents
      ? executor.getRetlImplementationState()
      : executor.getStreamingImplementationState();
    const resp = await AdapterUtility.executeTransformation(implementation, events, 'processor');
    return resp as ProcessorTransformationResponse[];
  }

  async doRouterTransformation(
    events: RouterTransformationRequestData[],
    destinationType: string,
  ): Promise<RouterTransformationResponse[]> {
    const isRetlEvents = get(events[0].message, MappedToDestinationKey);
     // het the implementation name from the destinationType
     const executor = FetchAdaptiveHandlers.getAdapterExecutor(destinationType);
     // get the implementation name from the executor
     const implementation = isRetlEvents
       ? executor.getRetlImplementationState()
       : executor.getStreamingImplementationState();
     const resp = await AdapterUtility.executeTransformation(implementation, events, 'processor');
     return resp as RouterTransformationResponse[];
  }

  // depriciated in this service
  doBatchTransformation(
    _events: RouterTransformationRequestData[],
    _destinationType: string,
    _version: string,
    _requestMetadata: Object,
  ): RouterTransformationResponse[] {
    throw new TransformationError('Processor batching is not implemented in adpator service');
    // Would need this for kafka multit topic support
  }

  async deliver(
    event: TransformedOutput,
    destinationType: string,
  ): Promise<DeliveryResponse> {
    const executor = FetchAdaptiveHandlers.getAdapterExecutor(destinationType);
    return await executor.executeDelivery(event);
  }

  processUserDeletion(
    events: UserDeletionRequest[],
    rudderDestInfo: string,
  ): Promise<UserDeletionResponse[]> {
    const executor = FetchAdaptiveHandlers.getAdapterExecutor(events[0].destType.toLowerCase());
    return executor.executeDeletion(events, rudderDestInfo);
  }
}
