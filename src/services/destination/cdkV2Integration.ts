import groupBy from 'lodash/groupBy';
import { processCdkV2Workflow } from '../../cdk/v2/handler';
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
import tags from '../../v0/util/tags';
import DestinationPostTransformationService from './postTransformation';

export default class CDKV2DestinationService implements IntegrationDestinationService {
  public init() {}

  public getName(): string {
    return 'CDK_V2';
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
        implementation: tags.IMPLEMENTATIONS.CDK_V2,
        feature,
        destinationId,
        workspaceId,
      } as ErrorDetailer,
      errorContext: '[CDKV2 Integration Service] Failure During Router Transform',
    } as MetaTransferObject;
    return metaTO;
  }

  public async doProcessorTransformation(
    events: ProcessorTransformationRequest[],
    destinationType: string,
    _version: string,
    _requestMetadata: Object,
  ): Promise<ProcessorTransformationResponse[]> {
    // TODO: Change the promise type
    const respList: ProcessorTransformationResponse[][] = await Promise.all(
      events.map(async (event) => {
        try {
          const transformedPayloads: ProcessorTransformationOutput | ProcessorTransformationOutput[] =
            await processCdkV2Workflow(destinationType, event, tags.FEATURES.PROCESSOR);
          // We are not passing destination handler for CDK flows
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

  public async doRouterTransformation(
    events: RouterTransformationRequestData[],
    destinationType: string,
    _version: string,
    _requestMetadata: Object,
  ): Promise<RouterTransformationResponse[]> {
    const allDestEvents: Object = groupBy(
      events,
      (ev: RouterTransformationRequestData) => ev.destination?.ID,
    );
    const response: RouterTransformationResponse[][] = await Promise.all(
      Object.values(allDestEvents).map(
        async (destInputArray: RouterTransformationRequestData[]) => {
          const metaTO = this.getTags(
            destinationType,
            destInputArray[0].metadata.destinationId,
            destInputArray[0].metadata.workspaceId,
            tags.FEATURES.ROUTER,
          );
          try {
            const doRouterTransformationResponse: RouterTransformationResponse[] =
              await processCdkV2Workflow(destinationType, destInputArray, tags.FEATURES.ROUTER);
            return DestinationPostTransformationService.handleRouterTransformSuccessEvents(
              doRouterTransformationResponse,
              undefined,
              metaTO,
            );
          } catch (error: any) {
            metaTO.metadatas = destInputArray.map((input) => input.metadata);
            const erroredResp =
              DestinationPostTransformationService.handleRouterTransformFailureEvents(
                error,
                metaTO,
              );
            return [erroredResp];
          }
        },
      ),
    );
    return response.flat();
  }

  public doBatchTransformation(
    _events: RouterTransformationRequestData[],
    _destinationType: string,
    _version: string,
    _requestMetadata: Object,
  ): RouterTransformationResponse[] {
    throw new TransformationError('CDKV2 Does not Implement Batch Transform Routine');
  }

  public deliver(
    _event: ProcessorTransformationOutput,
    _destinationType: string,
    _requestMetadata: Object,
  ): Promise<DeliveryResponse> {
    throw new TransformationError('CDKV2 Does not Implement Delivery Routine');
  }

  public processUserDeletion(
    requests: UserDeletionRequest[],
    rudderDestInfo: string,
  ): Promise<UserDeletionResponse[]> {
    throw new TransformationError('CDKV2 Does not Implement Deletion Routine');
  }
}
