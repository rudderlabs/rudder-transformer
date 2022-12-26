import { Context } from "koa";
import MiscService from "../services/misc.service";
import PreTransformationDestinationService from "../services/destination/preTransformation.destination.service";
import PostTransformationDestinationService from "../services/destination/postTransformation.destination.service";
import {
  ProcessorRequest,
  RouterRequestData,
  RouterRequest,
  ProcessorResponse
} from "../types/index";
import { ServiceSelector } from "../util/serviceSelector";
import ControllerUtility from "./util";
import stats from "../util/stats";
import logger from "../logger";
import TaggingService from "../services/tagging.service";

export default class DestinationController {
  public static async destinationTransformAtProcessor(ctx: Context) {
    const startTime = new Date();
    logger.debug(
      "Native(Process-Transform):: Requst to transformer::",
      JSON.stringify(ctx.request.body)
    );
    let resplist: ProcessorResponse[];
    let requestMetadata = MiscService.getRequestMetadata(ctx);
    let events = ctx.request.body as ProcessorRequest[];
    const metaTags = MiscService.getMetaTags(events[0].metadata);
    const {
      version,
      destination
    }: { version: string; destination: string } = ctx.params;
    try {
      const integrationService = ServiceSelector.getDestinationService(events);
      const destinationHandler = ServiceSelector.getDestHandler(
        destination,
        version
      );
      events = PreTransformationDestinationService.preProcess(
        events,
        ctx
      ) as ProcessorRequest[];
      resplist = await integrationService.processorRoutine(
        events,
        destination,
        destinationHandler,
        requestMetadata
      );
    } catch (error) {
      resplist = events.map(ev => {
        const metaTO = TaggingService.getNativeProcTransformTags(
          destination,
          ev.metadata.destinationId,
          ev.metadata.workspaceId
        );
        metaTO.metadata = ev.metadata;
        const errResp = PostTransformationDestinationService.handleFailedEventsAtProcessorDest(
          error,
          metaTO
        );
        return errResp;
      });
    }
    ctx.body = resplist;
    ControllerUtility.postProcess(ctx);
    logger.debug(
      "Native(Process-Transform):: Response from transformer::",
      JSON.stringify(ctx.body)
    );
    stats.timing("dest_transform_request_latency", startTime, {
      destination,
      version,
      ...metaTags
    });
    stats.increment("dest_transform_requests", 1, {
      destination,
      version,
      ...metaTags
    });
    return ctx;
  }

  public static async destinationTransformAtRouter(ctx: Context) {
    logger.debug(
      "Native(Router-Transform):: Requst to transformer::",
      JSON.stringify(ctx.request.body)
    );
    let requestMetadata = MiscService.getRequestMetadata(ctx);
    const routerRequest = ctx.request.body as RouterRequest;
    const destination = routerRequest.destType;
    let events = routerRequest.input;
    try {
      const integrationService = ServiceSelector.getDestinationService(events);
      const destinationHandler = ServiceSelector.getDestHandler(
        destination,
        ControllerUtility.getIntegrationVersion()
      );
      events = PreTransformationDestinationService.preProcess(
        events,
        ctx
      ) as RouterRequestData[];
      const resplist = await integrationService.routerRoutine(
        events,
        destination,
        destinationHandler,
        requestMetadata
      );
      ctx.body = { output: resplist };
    } catch (error) {
      const metaTO = TaggingService.getNativeProcTransformTags(
        destination,
        events[0].metadata.destinationId,
        events[0].metadata.workspaceId
      );
      metaTO.metadatas = events.map(ev => {
        return ev.metadata;
      });
      const errResp = PostTransformationDestinationService.handleFailureEventsAtRouterDest(
        error,
        metaTO
      );
      ctx.body = { output: [errResp] };
    }
    ControllerUtility.postProcess(ctx);
    logger.debug(
      "Native(Router-Transform):: Response from transformer::",
      JSON.stringify(ctx.body)
    );
    return ctx;
  }

  public static batchProcess(ctx: Context) {
    logger.debug(
      "Native(Process-Transform-Batch):: Requst to transformer::",
      JSON.stringify(ctx.request.body)
    );
    let requestMetadata = MiscService.getRequestMetadata(ctx);
    const routerRequest = ctx.request.body as RouterRequest;
    const destination = routerRequest.destType;
    let events = routerRequest.input;
    const integrationService = ServiceSelector.getDestinationService(events);
    const destinationHandler = ServiceSelector.getDestHandler(
      destination,
      ControllerUtility.getIntegrationVersion()
    );
    events = PreTransformationDestinationService.preProcess(
      events,
      ctx
    ) as RouterRequestData[];
    try {
      const resplist = integrationService.batchRoutine(
        events,
        destination,
        destinationHandler,
        requestMetadata
      );
      ctx.body = resplist;
    } catch (error) {
      const metaTO = TaggingService.getNativeBatchTransformTags(
        destination,
        events[0].metadata.destinationId,
        events[0].metadata.workspaceId
      );
      metaTO.metadatas = events.map(ev => {
        return ev.metadata;
      });
      const errResp = PostTransformationDestinationService.handleFailureEventsAtBatchDest(
        error,
        metaTO
      );
      ctx.body = [errResp];
    }
    ControllerUtility.postProcess(ctx);
    logger.debug(
      "Native(Process-Transform-Batch):: Response from transformer::",
      JSON.stringify(ctx.body)
    );
    return ctx;
  }
}
