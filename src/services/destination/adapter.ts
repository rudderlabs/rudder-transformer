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
    const executor = FetchAdaptiveHandlers.getAdapterExecutor(destinationType);
    let resp: ProcessorTransformationResponse[];
    if (isRetlEvents) {
      resp = (await executor.executeRetl(events, 'processor')) as ProcessorTransformationResponse[];
    } else {
      resp = (await executor.executeStreaming(
        events,
        'processor',
      )) as ProcessorTransformationResponse[];
    }
    return resp;
  }

  async doRouterTransformation(
    events: RouterTransformationRequestData[],
    destinationType: string,
  ): Promise<RouterTransformationResponse[]> {
    const isRetlEvents = get(events[0].message, MappedToDestinationKey);
    const executor = FetchAdaptiveHandlers.getAdapterExecutor(destinationType);
    let resp: RouterTransformationResponse[];
    if (isRetlEvents) {
      resp = (await executor.executeRetl(events, 'router')) as RouterTransformationResponse[];
    } else {
      resp = (await executor.executeStreaming(events, 'router')) as RouterTransformationResponse[];
    }
    return resp;
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

  async deliver(event: TransformedOutput, destinationType: string): Promise<DeliveryResponse> {
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
