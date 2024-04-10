import { Context } from 'koa';
import { MiscService } from '../services/misc';
import { DestinationPreTransformationService } from '../services/destination/preTransformation';
import { DestinationPostTransformationService } from '../services/destination/postTransformation';
import {
  ProcessorTransformationRequest,
  RouterTransformationRequest,
  ProcessorTransformationResponse,
  RouterTransformationResponse,
} from '../types/index';
import { ServiceSelector } from '../helpers/serviceSelector';
import { ControllerUtility } from './util';
import stats from '../util/stats';
import logger from '../logger';
import { getIntegrationVersion } from '../util/utils';
import tags from '../v0/util/tags';
import { DynamicConfigParser } from '../util/dynamicConfigParser';
import { checkInvalidRtTfEvents } from '../v0/util';

export class DestinationController {
  public static async destinationTransformAtProcessor(ctx: Context) {
    const startTime = new Date();
    logger.debug(
      'Native(Process-Transform):: Requst to transformer::',
      JSON.stringify(ctx.request.body),
    );
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
    logger.debug(
      'Native(Process-Transform):: Response from transformer::',
      JSON.stringify(ctx.body),
    );
    stats.histogram('dest_transform_output_events', resplist.length, {
      destination,
      version,
      ...metaTags,
    });
    stats.timing('dest_transform_request_latency', startTime, {
      destination,
      feature: tags.FEATURES.PROCESSOR,
      version,
      ...metaTags,
    });
    stats.increment('dest_transform_requests', {
      destination,
      version,
      ...metaTags,
    });
    return ctx;
  }

  public static async destinationTransformAtRouter(ctx: Context) {
    const startTime = new Date();
    logger.debug(
      'Native(Router-Transform):: Requst to transformer::',
      JSON.stringify(ctx.request.body),
    );
    const requestMetadata = MiscService.getRequestMetadata(ctx);
    const routerRequest = ctx.request.body as RouterTransformationRequest;
    const destination = routerRequest.destType;
    let events = routerRequest.input;
    const errorRespEvents = checkInvalidRtTfEvents(events);
    if (errorRespEvents.length > 0) {
      errorRespEvents[0].metadata = [
        {
          destType: destination,
        },
      ];
      logger.debug(
        `[${destination}] Invalid router transform payload structure: ${JSON.stringify(events)}`,
      );
      ctx.body = { output: errorRespEvents };
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
      events = DestinationPreTransformationService.preProcess(events, ctx);
      const timestampCorrectEvents = ControllerUtility.handleTimestampInEvents(events);
      events = DynamicConfigParser.process(timestampCorrectEvents);
      resplist = await integrationService.doRouterTransformation(
        events,
        destination,
        getIntegrationVersion(),
        requestMetadata,
      );
    } catch (error: any) {
      const metaTO = integrationService.getTags(
        destination,
        events[0].metadata?.destinationId,
        events[0].metadata?.workspaceId,
        tags.FEATURES.ROUTER,
      );
      metaTO.metadatas = events.map((ev) => ev.metadata);
      const errResp = DestinationPostTransformationService.handleRouterTransformFailureEvents(
        error,
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
    logger.debug(
      'Native(Router-Transform):: Response from transformer::',
      JSON.stringify(ctx.body),
    );
    stats.timing('dest_transform_request_latency', startTime, {
      destination,
      version: 'v0',
      feature: tags.FEATURES.ROUTER,
      ...metaTags,
    });
    return ctx;
  }

  public static batchProcess(ctx: Context) {
    logger.debug(
      'Native(Process-Transform-Batch):: Requst to transformer::',
      JSON.stringify(ctx.request.body),
    );
    const startTime = new Date();
    const requestMetadata = MiscService.getRequestMetadata(ctx);
    const routerRequest = ctx.request.body as RouterTransformationRequest;
    const destination = routerRequest.destType;
    let events = routerRequest.input;
    const integrationService = ServiceSelector.getDestinationService(events);
    try {
      events = DestinationPreTransformationService.preProcess(events, ctx);
      const timestampCorrectEvents = ControllerUtility.handleTimestampInEvents(events);
      const resplist = integrationService.doBatchTransformation(
        timestampCorrectEvents,
        destination,
        getIntegrationVersion(),
        requestMetadata,
      );
      ctx.body = resplist;
    } catch (error: any) {
      const metaTO = integrationService.getTags(
        destination,
        events[0].metadata.destinationId,
        events[0].metadata.workspaceId,
        tags.FEATURES.BATCH,
      );
      metaTO.metadatas = events.map((ev) => ev.metadata);
      const errResp = DestinationPostTransformationService.handleBatchTransformFailureEvents(
        error,
        metaTO,
      );
      ctx.body = [errResp];
    }
    ControllerUtility.postProcess(ctx);
    logger.debug(
      'Native(Process-Transform-Batch):: Response from transformer::',
      JSON.stringify(ctx.body),
    );
    stats.timing('dest_transform_request_latency', startTime, {
      destination,
      feature: tags.FEATURES.BATCH,
      version: 'v0',
    });
    return ctx;
  }
}
