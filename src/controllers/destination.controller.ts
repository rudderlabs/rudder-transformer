import { Context } from "koa";
import PreTransformationServiceDestination from "../services/destination/preTransformation.destination.service";
import { MiscService } from "../services/misc.service";
import { ProcessorRequest, RouterRequestData, RouterRequest } from "../types/index";
import { ServiceSelector } from "../util/serviceSelector";

export default class DestinationController {
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
    events = PreTransformationServiceDestination.preProcess(
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
    MiscService.transformerPostProcessor(ctx);
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
      "v0"
    );
    events = PreTransformationServiceDestination.preProcess(
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
    MiscService.transformerPostProcessor(ctx);
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
    events = PreTransformationServiceDestination.preProcess(
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
    MiscService.transformerPostProcessor(ctx);
    return ctx;
  }
}
