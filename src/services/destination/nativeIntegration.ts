/* eslint-disable prefer-destructuring */
/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable @typescript-eslint/no-unused-vars */
import groupBy from 'lodash/groupBy';
import cloneDeep from 'lodash/cloneDeep';
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
  ProxyRequest,
  ProxyDeliveriesRequest,
  ProxyDeliveryRequest,
  DeliveriesResponse,
  DeliveryJobState,
} from '../../types/index';
import { DestinationPostTransformationService } from './postTransformation';
import networkHandlerFactory from '../../adapters/networkHandlerFactory';
import { FetchHandler } from '../../helpers/fetchHandlers';
import tags from '../../v0/util/tags';
import stats from '../../util/stats';

export class NativeIntegrationDestinationService implements DestinationService {
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
    requestMetadata: NonNullable<unknown>,
  ): Promise<ProcessorTransformationResponse[]> {
    const destHandler = FetchHandler.getDestHandler(destinationType, version);
    const respList: ProcessorTransformationResponse[][] = await Promise.all(
      events.map(async (event) => {
        try {
          const transformedPayloads:
            | ProcessorTransformationOutput
            | ProcessorTransformationOutput[] = await destHandler.process(event, requestMetadata);
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
    requestMetadata: NonNullable<unknown>,
  ): Promise<RouterTransformationResponse[]> {
    const destHandler = FetchHandler.getDestHandler(destinationType, version);
    const allDestEvents: NonNullable<unknown> = groupBy(
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
            await destHandler.processRouterDest(cloneDeep(destInputArray), requestMetadata);
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
    requestMetadata: NonNullable<unknown>,
  ): RouterTransformationResponse[] {
    const destHandler = FetchHandler.getDestHandler(destinationType, version);
    if (!destHandler.batch) {
      throw new Error(`${destinationType} does not implement batch`);
    }
    const allDestEvents: NonNullable<unknown> = groupBy(
      events,
      (ev: RouterTransformationRequestData) => ev.destination?.ID,
    );
    const groupedEvents: RouterTransformationRequestData[][] = Object.values(allDestEvents);
    const response = groupedEvents.map((destEvents) => {
      try {
        const destBatchedRequests: RouterTransformationResponse[] = destHandler.batch(
          destEvents,
          requestMetadata,
        );
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
    deliveryRequest: ProxyRequest,
    destinationType: string,
    _requestMetadata: NonNullable<unknown>,
    version: string,
  ): Promise<DeliveryResponse | DeliveriesResponse> {
    try {
      const { networkHandler, handlerVersion } = networkHandlerFactory.getNetworkHandler(
        destinationType,
        version,
      );
      const rawProxyResponse = await networkHandler.proxy(deliveryRequest, destinationType);
      const processedProxyResponse = networkHandler.processAxiosResponse(rawProxyResponse);
      let rudderJobMetadata =
        version.toLowerCase() === 'v1'
          ? (deliveryRequest as ProxyDeliveriesRequest).metadata
          : (deliveryRequest as ProxyDeliveryRequest).metadata;

      if (version.toLowerCase() === 'v1' && handlerVersion.toLowerCase() === 'v0') {
        rudderJobMetadata = rudderJobMetadata[0];
      }

      let responseProxy = networkHandler.responseHandler(
        {
          ...processedProxyResponse,
          rudderJobMetadata,
        },
        destinationType,
      );
      // Adaption Logic for V0 to V1
      if (handlerVersion.toLowerCase() === 'v0' && version.toLowerCase() === 'v1') {
        const v0Response = responseProxy as DeliveryResponse;
        const jobStates = (deliveryRequest as ProxyDeliveriesRequest).metadata.map(
          (metadata) =>
            ({
              error: JSON.stringify(v0Response.destinationResponse?.response),
              statusCode: v0Response.status,
              metadata,
            } as DeliveryJobState),
        );
        responseProxy = {
          response: jobStates,
          status: v0Response.status,
          message: v0Response.message,
          authErrorCategory: v0Response.authErrorCategory,
        } as DeliveriesResponse;
      }
      return responseProxy;
    } catch (err: any) {
      const metadata = Array.isArray(deliveryRequest.metadata)
        ? deliveryRequest.metadata[0]
        : deliveryRequest.metadata;
      const metaTO = this.getTags(
        destinationType,
        metadata?.destinationId || 'Non-determininable',
        metadata?.workspaceId || 'Non-determininable',
        tags.FEATURES.DATA_DELIVERY,
      );

      if (version.toLowerCase() === 'v1') {
        metaTO.metadatas = (deliveryRequest as ProxyDeliveriesRequest).metadata;
        return DestinationPostTransformationService.handlevV1DeliveriesFailureEvents(err, metaTO);
      }
      metaTO.metadata = (deliveryRequest as ProxyDeliveryRequest).metadata;
      return DestinationPostTransformationService.handleDeliveryFailureEvents(err, metaTO);
    }
  }

  public async processUserDeletion(
    requests: UserDeletionRequest[],
    rudderDestInfo: string,
  ): Promise<UserDeletionResponse[]> {
    const response = await Promise.all(
      requests.map(async (request) => {
        const startTime = new Date();
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
          stats.timing('regulation_worker_requests_dest_latency', startTime, {
            feature: tags.FEATURES.USER_DELETION,
            implementation: tags.IMPLEMENTATIONS.NATIVE,
            destType,
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
