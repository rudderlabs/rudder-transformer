import { Context } from "koa";
import PreTransformationDestinationService from "../services/destination/preTransformation.destination.service";
import MiscService from "../services/misc.service";
import {
  ProcessorRequest,
  RouterRequestData,
  RouterRequest
} from "../types/index";
import { ServiceSelector } from "../util/serviceSelector";
import ControllerUtility from "./util";

export default class DestinationController {
  private static DEFAULT_VERSION = "v0";

  public static async destinationTransformAtProcessor(ctx: Context) {
    let requestMetadata = MiscService.getRequestMetadata(ctx);
    let events = ctx.request.body as ProcessorRequest[];
    const {
      version,
      destination
    }: { version: string; destination: string } = ctx.params;
    const integrationService = ServiceSelector.getDestinationService(events);
    const destinationHandler = ServiceSelector.getDestHandler(
      destination,
      version
    );
    events = PreTransformationDestinationService.preProcess(
      events,
      ctx
    ) as ProcessorRequest[];
    const resplist = await integrationService.processorRoutine(
      events,
      destination,
      destinationHandler,
      requestMetadata
    );
    ctx.body = resplist;
    ControllerUtility.postProcess(ctx);
    return ctx;
  }

  public static async destinationTransformAtRouter(ctx: Context) {
    let requestMetadata = MiscService.getRequestMetadata(ctx);
    const routerRequest = ctx.request.body as RouterRequest;
    const destination = routerRequest.destType;
    let events = routerRequest.input;
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
    const resplist = integrationService.batchRoutine(
      events,
      destination,
      destinationHandler,
      requestMetadata
    );
    ctx.body = resplist;
    ControllerUtility.postProcess(ctx);
    return ctx;
  }
}
