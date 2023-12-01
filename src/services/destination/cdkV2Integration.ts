/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
import groupBy from 'lodash/groupBy';
import { TransformationError } from '@rudderstack/integrations-lib';
import { processCdkV2Workflow } from '../../cdk/v2/handler';
import { DestinationService } from '../../interfaces/DestinationService';
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
import tags from '../../v0/util/tags';
import { DestinationPostTransformationService } from './postTransformation';
import stats from '../../util/stats';
import { CatchErr } from '../../util/types';

export class CDKV2DestinationService implements DestinationService {
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
    const metaTo = {
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
    return metaTo;
  }

  public async doProcessorTransformation(
    events: ProcessorTransformationRequest[],
    destinationType: string,
    _version: string,
    requestMetadata: NonNullable<unknown>,
  ): Promise<ProcessorTransformationResponse[]> {
    // TODO: Change the promise type
    const respList: ProcessorTransformationResponse[][] = await Promise.all(
      events.map(async (event) => {
        try {
          const transformedPayloads:
            | ProcessorTransformationOutput
            | ProcessorTransformationOutput[] = await processCdkV2Workflow(
            destinationType,
            event,
            tags.FEATURES.PROCESSOR,
            requestMetadata
          );

          stats.increment('event_transform_success', {
            destType: destinationType,
            module: tags.MODULES.DESTINATION,
            destinationId: event.metadata.destinationId,
            workspaceId: event.metadata.workspaceId,
            feature: tags.FEATURES.PROCESSOR,
            implementation: tags.IMPLEMENTATIONS.CDK_V2,
          });

          // We are not passing destination handler for CDK flows
          return DestinationPostTransformationService.handleProcessorTransformSucessEvents(
            event,
            transformedPayloads,
            undefined,
          );
        } catch (error: CatchErr) {
          const metaTo = this.getTags(
            destinationType,
            event.metadata.destinationId,
            event.metadata.workspaceId,
            tags.FEATURES.PROCESSOR,
          );
          metaTo.metadata = event.metadata;
          const erroredResp =
            DestinationPostTransformationService.handleProcessorTransformFailureEvents(
              error,
              metaTo,
            );

          stats.increment('event_transform_failure', metaTo.errorDetails);

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
    requestMetadata: NonNullable<unknown>,
  ): Promise<RouterTransformationResponse[]> {
    const allDestEvents: object = groupBy(
      events,
      (ev: RouterTransformationRequestData) => ev.destination?.ID,
    );
    const response: RouterTransformationResponse[][] = await Promise.all(
      Object.values(allDestEvents).map(
        async (destInputArray: RouterTransformationRequestData[]) => {
          const metaTo = this.getTags(
            destinationType,
            destInputArray[0].metadata.destinationId,
            destInputArray[0].metadata.workspaceId,
            tags.FEATURES.ROUTER,
          );
          metaTo.metadata = destInputArray[0].metadata;
          try {
            const doRouterTransformationResponse: RouterTransformationResponse[] =
              await processCdkV2Workflow(destinationType, destInputArray, tags.FEATURES.ROUTER, requestMetadata);
            return DestinationPostTransformationService.handleRouterTransformSuccessEvents(
              doRouterTransformationResponse,
              undefined,
              metaTo,
              tags.IMPLEMENTATIONS.CDK_V2,
              destinationType.toUpperCase(),
            );
          } catch (error: CatchErr) {
            metaTo.metadatas = destInputArray.map((input) => input.metadata);
            const erroredResp =
              DestinationPostTransformationService.handleRouterTransformFailureEvents(
                error,
                metaTo,
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
    _requestMetadata: NonNullable<unknown>,
  ): RouterTransformationResponse[] {
    throw new TransformationError('CDKV2 Does not Implement Batch Transform Routine');
  }

  public deliver(
    _event: ProcessorTransformationOutput,
    _destinationType: string,
    _requestMetadata: NonNullable<unknown>,
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
