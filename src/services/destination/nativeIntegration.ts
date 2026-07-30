/* eslint-disable prefer-destructuring */
/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable @typescript-eslint/no-unused-vars */
import cloneDeep from 'lodash/cloneDeep';
import groupBy from 'lodash/groupBy';
import { mapInBatches } from '@rudderstack/integrations-lib';
import networkHandlerFactory from '../../adapters/networkHandlerFactory';
import { FetchHandler } from '../../helpers/fetchHandlers';
import { DestinationService } from '../../interfaces/DestinationService';
import {
  DeliveryJobState,
  DeliveryV0Response,
  DeliveryV1Response,
  ErrorDetailer,
  MetaTransferObject,
  ProcessorTransformationOutput,
  ProcessorTransformationRequest,
  ProcessorTransformationResponse,
  ProxyRequest,
  ProxyV0Request,
  ProxyV1Request,
  RouterTransformationRequestData,
  RouterTransformationResponse,
  UserDeletionRequest,
  UserDeletionResponse,
} from '../../types/index';
import stats from '../../util/stats';
import tags from '../../v0/util/tags';
import { DestinationPostTransformationService } from './postTransformation';
import { groupRouterTransformEvents } from '../../v0/util';
import {
  isBatchingFrameworkDeliveryEnabled,
  isBatchingFrameworkEnabled,
} from '../../constants/batchedDestinationsMap';
import { processBatchedDestination } from './nativeBatching/processBatchedDestination';
import { toDeliveryV1Response } from './nativeBatching/delivery';
import type { DeliveryContext } from './nativeBatching/delivery';

/**
 * Discriminates the two proxy request shapes on the only field that differs: v1 carries one
 * metadata entry per job, v0 carries a single object. Preferred over `ProxyV1RequestSchema` here —
 * that schema requires `secret` and `dontBatch` on every entry, so a real payload omitting either
 * would fail validation and silently fall through to the legacy handler, which is a worse failure
 * than the cast it replaces.
 */
const isProxyV1Request = (request: ProxyRequest): request is ProxyV1Request =>
  Array.isArray(request.metadata);

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
    const respList = await mapInBatches(
      events,
      async (event) => {
        const metaTO = this.getTags(
          destinationType,
          event.metadata?.destinationId,
          event.metadata?.workspaceId,
          tags.FEATURES.PROCESSOR,
        );
        metaTO.metadata = event.metadata;
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
          const erroredResp =
            DestinationPostTransformationService.handleProcessorTransformFailureEvents(
              error,
              metaTO,
            );
          return [erroredResp];
        }
      },
      { sequentialProcessing: false }, // concurrent processing
    );
    return respList.flat();
  }

  public async doRouterTransformation(
    events: RouterTransformationRequestData[],
    destinationType: string,
    version: string,
    requestMetadata: NonNullable<unknown>,
  ): Promise<RouterTransformationResponse[]> {
    const groupedEvents: RouterTransformationRequestData[][] =
      await groupRouterTransformEvents(events);

    const response: RouterTransformationResponse[][] = await mapInBatches(
      groupedEvents,
      async (destInputArray: RouterTransformationRequestData[]) => {
        const { workspaceId } = destInputArray[0].metadata;
        const useBatchingFramework = isBatchingFrameworkEnabled(destinationType, workspaceId);

        const metaTO = this.getTags(
          destinationType,
          destInputArray[0].metadata?.destinationId,
          destInputArray[0].metadata?.workspaceId,
          tags.FEATURES.ROUTER,
        );
        try {
          metaTO.metadata = destInputArray[0].metadata;
          let transformedResponse: RouterTransformationResponse[];
          // destHandler is null for the batching framework path — handleRouterTransformSuccessEvents
          // handles this safely via optional chaining on destHandler?.processMetadataForRouter
          let destHandler: any = null;
          if (useBatchingFramework) {
            const IntegrationClass = FetchHandler.getBatchDestinationHandler(destinationType);
            transformedResponse = await processBatchedDestination(
              destInputArray,
              IntegrationClass,
              requestMetadata,
            );
          } else {
            destHandler = FetchHandler.getDestHandler(destinationType, version);
            transformedResponse = await destHandler.processRouterDest(
              destInputArray,
              requestMetadata,
            );
          }
          return DestinationPostTransformationService.handleRouterTransformSuccessEvents(
            transformedResponse,
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
      },
      { sequentialProcessing: false }, // concurrent processing
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
      const metaTO = this.getTags(
        destinationType,
        destEvents[0].metadata?.destinationId,
        destEvents[0].metadata?.workspaceId,
        tags.FEATURES.BATCH,
      );
      metaTO.metadatas = events.map((event) => event.metadata);
      try {
        const destBatchedRequests: RouterTransformationResponse[] = destHandler.batch(
          destEvents,
          requestMetadata,
        );
        return destBatchedRequests;
      } catch (error: any) {
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
  ): Promise<DeliveryV0Response | DeliveryV1Response> {
    try {
      const originalDestName = destinationType;
      const { networkHandler, handlerVersion } = networkHandlerFactory.getNetworkHandler(
        originalDestName,
        version,
      );
      const rawProxyResponse = await networkHandler.proxy(deliveryRequest, destinationType);
      const processedProxyResponse = networkHandler.processAxiosResponse(rawProxyResponse);

      // Opt-in per workspace, off by default: `handlerVersion` is deliberately ignored here, and
      // so is the v0->v1 adaptation below — the framework produces a v1 response natively, and
      // that adaptation would collapse the metadata array to its first entry.
      //
      // The guard is `isProxyV1Request`, not `version === 'v1'`, because the array-ness of
      // `metadata` is the thing this branch actually depends on: it indexes it, hands it to
      // `handleResponse` as the job list, and returns a `DeliveryV1Response` shaped to it.
      // `version` is the API route rudder-server called ('v0'/'v1' are literals passed by the two
      // controller entry points), so it only tells us which shape to *expect*; narrowing on the
      // shape itself both proves it and removes the cast.
      if (
        isProxyV1Request(deliveryRequest) &&
        isBatchingFrameworkDeliveryEnabled(
          destinationType,
          deliveryRequest.metadata[0]?.workspaceId,
        )
      ) {
        const ctx: DeliveryContext = {
          status: processedProxyResponse.status,
          response: processedProxyResponse.response,
          jobs: deliveryRequest.metadata,
          request: deliveryRequest,
          destinationConfig: deliveryRequest.destinationConfig,
        };
        const IntegrationClass = FetchHandler.getBatchDestinationHandler(destinationType);
        // Uppercased to match `statTags.destType`, which is what every other destination tag in a
        // delivery response and in the stats emitted alongside it uses.
        const frameworkResponse = toDeliveryV1Response(
          IntegrationClass.handleResponse(ctx),
          ctx,
          destinationType.toUpperCase(),
        );

        // The bridge sets `statTags` only for a uniform whole-response failure, and only the
        // error-describing half of it. Enrich it with the same identifying tags
        // `handlevV1DeliveriesFailureEvents` merges for a thrown error, so a returned failure and a
        // thrown one produce the same tag set on `integration.failure_detailed` — a counter carrying
        // just `errorType` could not be attributed to a destination or workspace.
        if (frameworkResponse.statTags) {
          const deliveryMetaTO = this.getTags(
            destinationType,
            ctx.jobs[0]?.destinationId,
            ctx.jobs[0]?.workspaceId,
            tags.FEATURES.DATA_DELIVERY,
          );
          frameworkResponse.statTags = {
            ...frameworkResponse.statTags,
            ...deliveryMetaTO.errorDetails,
          };
        }
        return frameworkResponse;
      }

      let rudderJobMetadata =
        version.toLowerCase() === 'v1'
          ? (deliveryRequest as ProxyV1Request).metadata
          : (deliveryRequest as ProxyV0Request).metadata;

      if (version.toLowerCase() === 'v1' && handlerVersion.toLowerCase() === 'v0') {
        rudderJobMetadata = rudderJobMetadata[0];
      }
      const responseParams = {
        destinationResponse: processedProxyResponse,
        rudderJobMetadata,
        destType: destinationType,
        destinationRequest: deliveryRequest,
      };
      let responseProxy = networkHandler.responseHandler(responseParams);
      // Adaption Logic for V0 to V1
      if (handlerVersion.toLowerCase() === 'v0' && version.toLowerCase() === 'v1') {
        const v0Response = responseProxy as DeliveryV0Response;
        const jobStates = (deliveryRequest as ProxyV1Request).metadata.map(
          (metadata) =>
            ({
              error: JSON.stringify(
                v0Response.destinationResponse?.response === undefined
                  ? v0Response.destinationResponse
                  : v0Response.destinationResponse?.response,
              ),
              statusCode: v0Response.status,
              metadata,
            }) as DeliveryJobState,
        );
        responseProxy = {
          response: jobStates,
          status: v0Response.status,
          message: v0Response.message,
          authErrorCategory: v0Response.authErrorCategory,
        } as DeliveryV1Response;
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
        metaTO.metadatas = (deliveryRequest as ProxyV1Request).metadata;
        return DestinationPostTransformationService.handlevV1DeliveriesFailureEvents(err, metaTO);
      }
      metaTO.metadata = (deliveryRequest as ProxyV0Request).metadata;
      return DestinationPostTransformationService.handleDeliveryFailureEvents(err, metaTO);
    }
  }

  public async processUserDeletion(
    requests: UserDeletionRequest[],
    rudderDestInfo: string,
  ): Promise<UserDeletionResponse[]> {
    const response = await mapInBatches(
      requests,
      async (request) => {
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
        const metaTO = this.getTags(destType, 'unknown', 'unknown', tags.FEATURES.USER_DELETION);
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
          return DestinationPostTransformationService.handleUserDeletionFailureEvents(
            error,
            metaTO,
          );
        }
      },
      { sequentialProcessing: false }, // concurrent processing
    );
    return response;
  }
}
