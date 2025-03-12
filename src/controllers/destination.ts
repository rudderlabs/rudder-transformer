import { Context } from 'koa';
import { ServiceSelector } from '../helpers/serviceSelector';
import { DestinationPostTransformationService } from '../services/destination/postTransformation';
import { DestinationPreTransformationService } from '../services/destination/preTransformation';
import { MiscService } from '../services/misc';
import {
  ProcessorTransformationRequest,
  ProcessorTransformationResponse,
  RouterTransformationRequest,
  RouterTransformationResponse,
  RouterTransformationRequestData,
  RudderMessage,
} from '../types';
import { DynamicConfigParser } from '../util/dynamicConfigParser';
import stats from '../util/stats';
import { getIntegrationVersion } from '../util/utils';
import { checkInvalidRtTfEvents } from '../v0/util';
import tags from '../v0/util/tags';
import { ControllerUtility } from './util';
import logger from '../logger';

export class DestinationController {
  public static async destinationTransformAtProcessor(ctx: Context) {
    logger.debug('Native(Process-Transform):: Requst to transformer::', ctx.request.body);
    let resplist: ProcessorTransformationResponse[];
    const requestMetadata = MiscService.getRequestMetadata(ctx);
    let events = ctx.request.body as ProcessorTransformationRequest[];
    const metaTags = MiscService.getMetaTags(events[0].metadata);
    const { version, destination }: { version: string; destination: string } = ctx.params;
    stats.histogram('dest_transform_input_events', events.length, {
      destination,
      version,
      ...metaTags,
    });
    const integrationService = ServiceSelector.getDestinationService(events);
    try {
      integrationService.init();
      events = DestinationPreTransformationService.preProcess(
        events,
        ctx,
      ) as ProcessorTransformationRequest[];
      const timestampCorrectEvents = ControllerUtility.handleTimestampInEvents(events);
      events = DynamicConfigParser.process(
        timestampCorrectEvents,
      ) as ProcessorTransformationRequest[];
      resplist = await integrationService.doProcessorTransformation(
        events,
        destination,
        version,
        requestMetadata,
      );
    } catch (error: any) {
      resplist = events.map((ev) => {
        const metaTO = integrationService.getTags(
          destination,
          ev.metadata?.destinationId,
          ev.metadata?.workspaceId,
          tags.FEATURES.PROCESSOR,
        );
        metaTO.metadata = ev.metadata;
        const errResp = DestinationPostTransformationService.handleProcessorTransformFailureEvents(
          error,
          metaTO,
        );
        return errResp;
      });
    }
    ctx.body = resplist;
    ControllerUtility.postProcess(ctx);
    stats.histogram('dest_transform_output_events', resplist.length, {
      destination,
      version,
      ...metaTags,
    });
    return ctx;
  }

  public static async destinationTransformAtRouter(ctx: Context) {
    logger.debug('Native(Router-Transform):: Requst to transformer::', ctx.request.body);
    const requestMetadata = MiscService.getRequestMetadata(ctx);
    const routerRequest = ctx.request.body as RouterTransformationRequest;
    const destination = routerRequest.destType;
    let events = routerRequest.input as RouterTransformationRequestData<RudderMessage>[];

    const errorRespEvents = checkInvalidRtTfEvents(events);
    if (errorRespEvents.length > 0) {
      const errorResponse = {
        metadata: [
          {
            destinationType: destination,
          },
        ],
        destination: events?.[0]?.destination || {},
        batched: false,
        statusCode: 400,
        error: 'Invalid router transform payload structure',
      };

      logger.debug(
        `[${destination}] Invalid router transform payload structure: ${JSON.stringify(events)}`,
      );
      ctx.body = { output: [errorResponse] };
      ControllerUtility.postProcess(ctx);
      return ctx;
    }

    const metaTags = MiscService.getMetaTags(events[0].metadata);
    stats.histogram('dest_transform_input_events', events.length, {
      destination,
      version: 'v0',
      ...metaTags,
    });

    const integrationService = ServiceSelector.getDestinationService(events);
    let resplist: RouterTransformationResponse[];

    try {
      const processedEvents = DestinationPreTransformationService.preProcess(
        events,
        ctx,
      ) as RouterTransformationRequestData<RudderMessage>[];

      const timestampCorrectEvents = ControllerUtility.handleTimestampInEvents(
        processedEvents,
      ) as RouterTransformationRequestData<RudderMessage>[];

      events = DynamicConfigParser.process(
        timestampCorrectEvents,
      ) as RouterTransformationRequestData<RudderMessage>[];

      resplist = await integrationService.doRouterTransformation(
        events,
        destination,
        getIntegrationVersion(),
        requestMetadata,
      );
    } catch (error: unknown) {
      const metaTO = integrationService.getTags(
        destination,
        events[0]?.metadata?.destinationId,
        events[0]?.metadata?.workspaceId,
        tags.FEATURES.ROUTER,
      );
      metaTO.metadatas = events.map((ev) => ev.metadata);
      const errResp = DestinationPostTransformationService.handleRouterTransformFailureEvents(
        error as Error,
        metaTO,
      );
      resplist = [errResp];
    }

    ctx.body = { output: resplist };
    ControllerUtility.postProcess(ctx);
    stats.histogram('dest_transform_output_events', resplist.length, {
      destination,
      version: 'v0',
      ...metaTags,
    });
    return ctx;
  }

  public static batchProcess(ctx: Context) {
    logger.debug('Native(Process-Transform-Batch):: Requst to transformer::', ctx.request.body);
    const requestMetadata = MiscService.getRequestMetadata(ctx);
    const routerRequest = ctx.request.body as RouterTransformationRequest;
    const destination = routerRequest.destType;
    const events = routerRequest.input as RouterTransformationRequestData<RudderMessage>[];

    const integrationService = ServiceSelector.getDestinationService(events);
    try {
      const processedEvents = DestinationPreTransformationService.preProcess(
        events,
        ctx,
      ) as RouterTransformationRequestData<RudderMessage>[];

      const timestampCorrectEvents = ControllerUtility.handleTimestampInEvents(
        processedEvents,
      ) as RouterTransformationRequestData<RudderMessage>[];

      const resplist = integrationService.doBatchTransformation(
        timestampCorrectEvents,
        destination,
        getIntegrationVersion(),
        requestMetadata,
      );
      ctx.body = resplist;
    } catch (error: unknown) {
      const metaTO = integrationService.getTags(
        destination,
        events[0]?.metadata?.destinationId,
        events[0]?.metadata?.workspaceId,
        tags.FEATURES.BATCH,
      );
      metaTO.metadatas = events.map((ev) => ev.metadata);
      const errResp = DestinationPostTransformationService.handleBatchTransformFailureEvents(
        error as Error,
        metaTO,
      );
      ctx.body = [errResp];
    }
    ControllerUtility.postProcess(ctx);
    return ctx;
  }
}
