import groupBy from 'lodash/groupBy';
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
import DestinationPostTransformationService from './postTransformation';
import networkHandlerFactory from '../../adapters/networkHandlerFactory';
import FetchHandler from '../../helpers/fetchHandlers';
import tags from '../../v0/util/tags';

export default class NativeIntegrationDestinationService implements IntegrationDestinationService {
  public init() {}

  public getName(): string {
    return 'Native';
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
        implementation: tags.IMPLEMENTATIONS.NATIVE,
        feature,
        destinationId,
        workspaceId,
      } as ErrorDetailer,
      errorContext: '[Native Integration Service] Failure During Processor Transform',
    } as MetaTransferObject;
    return metaTO;
  }

  public async doProcessorTransformation(
    events: ProcessorTransformationRequest[],
    destinationType: string,
    version: string,
    _requestMetadata: Object,
  ): Promise<ProcessorTransformationResponse[]> {
    const destHandler = FetchHandler.getDestHandler(destinationType, version);
    const respList: ProcessorTransformationResponse[][] = await Promise.all(
      events.map(async (event) => {
        try {
          const transformedPayloads:
            | ProcessorTransformationOutput
            | ProcessorTransformationOutput[] = await destHandler.process(event);
          return DestinationPostTransformationService.handleProcessorTransformSucessEvents(
            event,
            transformedPayloads,
            destHandler,
          );
        } catch (error: any) {
          const metaTO = this.getTags(
            destinationType,
            event.metadata?.destinationId,
            event.metadata?.workspaceId,
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
    version: string,
    _requestMetadata: Object,
  ): Promise<RouterTransformationResponse[]> {
    const destHandler = FetchHandler.getDestHandler(destinationType, version);
    const allDestEvents: Object = groupBy(
      events,
      (ev: RouterTransformationRequestData) => ev.destination?.ID,
    );
    const groupedEvents: RouterTransformationRequestData[][] = Object.values(allDestEvents);
    const response: RouterTransformationResponse[][] = await Promise.all(
      groupedEvents.map(async (destInputArray: RouterTransformationRequestData[]) => {
        const metaTO = this.getTags(
          destinationType,
          destInputArray[0].metadata?.destinationId,
          destInputArray[0].metadata?.workspaceId,
          tags.FEATURES.ROUTER,
        );
        try {
          const doRouterTransformationResponse: RouterTransformationResponse[] =
            await destHandler.processRouterDest(destInputArray);
          metaTO.metadata = destInputArray[0].metadata;
          return DestinationPostTransformationService.handleRouterTransformSuccessEvents(
            doRouterTransformationResponse,
            destHandler,
            metaTO,
            tags.IMPLEMENTATIONS.NATIVE,
            destinationType.toUpperCase(),
          );
        } catch (error: any) {
          metaTO.metadatas = destInputArray.map((input) => input.metadata);
          const errorResp = DestinationPostTransformationService.handleRouterTransformFailureEvents(
            error,
            metaTO,
          );
          return [errorResp];
        }
      }),
    );
    return response.flat();
  }

  public doBatchTransformation(
    events: RouterTransformationRequestData[],
    destinationType: string,
    version: any,
    _requestMetadata: Object,
  ): RouterTransformationResponse[] {
    const destHandler = FetchHandler.getDestHandler(destinationType, version);
    if (!destHandler.batch) {
      throw new Error(`${destinationType} does not implement batch`);
    }
    const allDestEvents: Object = groupBy(
      events,
      (ev: RouterTransformationRequestData) => ev.destination?.ID,
    );
    const groupedEvents: RouterTransformationRequestData[][] = Object.values(allDestEvents);
    const response = groupedEvents.map((destEvents) => {
      try {
        const destBatchedRequests: RouterTransformationResponse[] = destHandler.batch(destEvents);
        return destBatchedRequests;
      } catch (error: any) {
        const metaTO = this.getTags(
          destinationType,
          destEvents[0].metadata.destinationId,
          destEvents[0].metadata.workspaceId,
          tags.FEATURES.BATCH,
        );
        metaTO.metadatas = events.map((event) => event.metadata);
        const errResp = DestinationPostTransformationService.handleBatchTransformFailureEvents(
          error,
          metaTO,
        );
        return [errResp];
      }
    });
    return response.flat();
  }

  public async deliver(
    destinationRequest: ProcessorTransformationOutput,
    destinationType: string,
    _requestMetadata: Object,
  ): Promise<DeliveryResponse> {
    try {
      const networkHandler = networkHandlerFactory.getNetworkHandler(destinationType);
      const rawProxyResponse = await networkHandler.proxy(destinationRequest);
      const processedProxyResponse = networkHandler.processAxiosResponse(rawProxyResponse);
      return networkHandler.responseHandler(
        {
          ...processedProxyResponse,
          rudderJobMetadata: destinationRequest.metadata,
        },
        destinationType,
      ) as DeliveryResponse;
    } catch (err: any) {
      const metaTO = this.getTags(
        destinationType,
        destinationRequest.metadata?.destinationId || 'Non-determininable',
        destinationRequest.metadata?.workspaceId || 'Non-determininable',
        tags.FEATURES.DATA_DELIVERY,
      );
      metaTO.metadata = destinationRequest.metadata;
      return DestinationPostTransformationService.handleDeliveryFailureEvents(err, metaTO);
    }
  }

  public async processUserDeletion(
    requests: UserDeletionRequest[],
    rudderDestInfo: string,
  ): Promise<UserDeletionResponse[]> {
    const response = await Promise.all(
      requests.map(async (request) => {
        const { destType } = request;
        const destUserDeletionHandler: any = FetchHandler.getDeletionHandler(
          destType.toLowerCase(),
          'v0',
        );
        if (!destUserDeletionHandler || !destUserDeletionHandler.processDeleteUsers) {
          return {
            statusCode: 404,
            error: `${destType}: Doesn't support deletion of users`,
          } as UserDeletionResponse;
        }
        try {
          const result: UserDeletionResponse = await destUserDeletionHandler.processDeleteUsers({
            ...request,
            rudderDestInfo,
          });
          return result;
        } catch (error: any) {
          const metaTO = this.getTags(destType, 'unknown', 'unknown', tags.FEATURES.USER_DELETION);
          return DestinationPostTransformationService.handleUserDeletionFailureEvents(
            error,
            metaTO,
          );
        }
      }),
    );
    return response;
  }
}
