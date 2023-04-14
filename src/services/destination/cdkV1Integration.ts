import { ConfigFactory, Executor } from 'rudder-transformer-cdk';
import IntegrationDestinationService from '../../interfaces/DestinationService';
import {
  DeliveryResponse,
  ErrorDetailer,
  MetaTransferObject,
  ProcessorTransformationRequest,
  ProcessorTransformationResponse,
  RouterTransformationRequestData,
  RouterTransformationResponse,
  ProcessorTransformationOutput,
  UserDeletionRequest,
  UserDeletionResponse,
} from '../../types/index';
import { TransformationError } from '../../v0/util/errorTypes';
import DestinationPostTransformationService from './postTransformation';
import tags from '../../v0/util/tags';
import path from 'path';

export default class CDKV1DestinationService implements IntegrationDestinationService {
  public init() {
    ConfigFactory.init({
      basePath: path.resolve(__dirname, '../../cdk/v1'),
      loggingMode: 'production',
    });
  }

  public getName(): string {
    return 'CDK_V1';
  }

  public getTags(
    destType: string,
    destinationId: string,
    workspaceId: string,
    feature: string,
  ): MetaTransferObject {
    const metaTO = {
      errorDetails: {
        destType: destType.toUpperCase(),
        module: tags.MODULES.DESTINATION,
        implementation: tags.IMPLEMENTATIONS.CDK_V1,
        feature,
        destinationId,
        workspaceId,
      } as ErrorDetailer,
      errorContext: '[CDKV1 Integration Service] Failure During Proc Transform',
    } as MetaTransferObject;
    return metaTO;
  }

  public async doProcessorTransformation(
    events: ProcessorTransformationRequest[],
    destinationType: string,
    _version: string,
    _requestMetadata: Object,
  ): Promise<ProcessorTransformationResponse[]> {
    const tfConfig = await ConfigFactory.getConfig(destinationType);
    const respList: ProcessorTransformationResponse[][] = await Promise.all(
      events.map(async (event) => {
        try {
          let transformedPayloads: any = await Executor.execute(event as any, tfConfig);
          // We are not passing destinationHandler to post processor as we don't have post processing in CDK flows
          return DestinationPostTransformationService.handleProcessorTransformSucessEvents(
            event,
            transformedPayloads,
            undefined,
          );
        } catch (error: any) {
          const metaTO = this.getTags(
            destinationType,
            event.metadata.destinationId,
            event.metadata.workspaceId,
            tags.FEATURES.PROCESSOR,
          );
          metaTO.metadata = event.metadata;
          const erroredResp =
            DestinationPostTransformationService.handleProcessorTransformFailureEvents(
              error,
              metaTO,
            );
          return [erroredResp];
        }
      }),
    );
    return respList.flat();
  }

  public doRouterTransformation(
    _events: RouterTransformationRequestData[],
    _destinationType: string,
    _version: string,
    _requestMetadata: Object,
  ): Promise<RouterTransformationResponse[]> {
    throw new TransformationError('CDKV1 Does not Implement Router Transform Routine');
  }

  public doBatchTransformation(
    _events: RouterTransformationRequestData[],
    _destinationType: string,
    _version: any,
    _requestMetadata: Object,
  ): RouterTransformationResponse[] {
    throw new TransformationError('CDKV1 Does not Implement Batch Transform Routine');
  }

  public deliver(
    _event: ProcessorTransformationOutput,
    _destinationType: string,
    _requestMetadata: Object,
  ): Promise<DeliveryResponse> {
    throw new TransformationError('CDV1 Does not Implement Delivery Routine');
  }

  public processUserDeletion(
    requests: UserDeletionRequest[],
    rudderDestInfo: string,
  ): Promise<UserDeletionResponse[]> {
    throw new TransformationError('CDV1 Does not Implement Deletion Routine');
  }
}
