import { Context } from "koa";
import PreTransformationDestinationService from "../services/destination/preTransformation.destination.service";
import ErrorReportingService from "../services/errorReporting.service";
import MiscService from "../services/misc.service";
import {
  ProcessorRequest,
  RouterRequestData,
  RouterRequest,
  ProcessorResponse,
  RouterResponse
} from "../types/index";
import { ServiceSelector } from "../util/serviceSelector";
import { generateErrorObject } from "../v0/util";
import tags from "../v0/util/tags";
import ControllerUtility from "./util";
import stats from "../util/stats";
import logger from "../logger";

export default class DestinationController {
  private static DEFAULT_VERSION = "v0";

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
        const errorObj = generateErrorObject(error, {
          destType: destination.toUpperCase(),
          module: tags.MODULES.DESTINATION,
          implementation: tags.IMPLEMENTATIONS.NATIVE,
          feature: tags.FEATURES.PROCESSOR,
          destinationId: ev.metadata.destinationId,
          workspaceId: ev.metadata.workspaceId,
          context: "[Destination Controller] Failure During Processor Transform"
        });
        const resp = {
          metadata: ev.metadata,
          statusCode: 500,
          error: error.toString(),
          statTags: errorObj.statTags
        } as ProcessorResponse;
        ErrorReportingService.reportError(
          error,
          resp.statTags["context"],
          resp
        );
        return resp;
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
    let requestMetadata = MiscService.getRequestMetadata(ctx);
    const routerRequest = ctx.request.body as RouterRequest;
    const destination = routerRequest.destType;
    let events = routerRequest.input;
    try {
      const integrationService = ServiceSelector.getDestinationService(events);
      const destinationHandler = ServiceSelector.getDestHandler(
        destination,
        this.DEFAULT_VERSION
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
      const errorObj = generateErrorObject(error, {
        destType: destination.toUpperCase(),
        module: tags.MODULES.DESTINATION,
        implementation: tags.IMPLEMENTATIONS.NATIVE,
        feature: tags.FEATURES.ROUTER,
        destinationId: events[0].metadata.destinationId,
        workspaceId: events[0].metadata.workspaceId,
        context: "[Destination Controller] Failure During Router Transform"
      });
      const metadatas = events.map(ev => {
        return ev.metadata;
      });
      const resp: RouterResponse = {
        metadata: metadatas,
        statusCode: 500,
        error: error.toString(),
        statTags: errorObj.statTags,
        batched: false
      };
      ctx.body = { output: resp };
    }
    ControllerUtility.postProcess(ctx);
    return ctx;
  }

  public static batchProcess(ctx: Context) {
    let requestMetadata = MiscService.getRequestMetadata(ctx);
    const routerRequest = ctx.request.body as RouterRequest;
    const destination = routerRequest.destType;
    let events = routerRequest.input;
    const integrationService = ServiceSelector.getDestinationService(events);
    const destinationHandler = ServiceSelector.getDestHandler(
      destination,
      "V0"
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
      const errorObj = generateErrorObject(error, {
        destType: destination.toUpperCase(),
        module: tags.MODULES.DESTINATION,
        implementation: tags.IMPLEMENTATIONS.NATIVE,
        feature: tags.FEATURES.ROUTER,
        destinationId: events[0].metadata.destinationId,
        workspaceId: events[0].metadata.workspaceId,
        context: "[Destination Controller] Failure During Batch Transform"
      });
      const metadatas = events.map(ev => {
        return ev.metadata;
      });
      const resp: RouterResponse = {
        metadata: metadatas,
        statusCode: 500,
        error: error.toString(),
        statTags: errorObj.statTags,
        batched: false
      };
      ctx.body = resp;
    }

    ControllerUtility.postProcess(ctx);
    return ctx;
  }
}
