import { Context } from "koa";
import { MiscService } from "../services/misc.service";
import { TransformationDefaultResponse } from "../types/types";
import { ServiceSelector } from "../util/serviceSelector";
import networkHandlerFactory from "../adapters/networkHandlerFactory";
import { isHttpStatusSuccess } from "../v0/util";

export class DeliveryController {
  public static async deliverToDestination(ctx: Context) {
    let requestMetadata = MiscService.getRequestMetadata(ctx);
    let event = ctx.request.body as TransformationDefaultResponse;
    const {
      version,
      destination
    }: { version: string; destination: string } = ctx.params;
    const integrationService = ServiceSelector.getNativeIntegrationService();
    const destNetworkHandler = networkHandlerFactory.getNetworkHandler(
      destination
    );
    const deliveryResponse = await integrationService.deliveryRoutine(
      event,
      event.metadata,
      destination,
      destNetworkHandler,
      requestMetadata
    );

    ctx.body = { output: deliveryResponse };
    ctx.status = isHttpStatusSuccess(deliveryResponse.status)
      ? 200
      : deliveryResponse.status;
    MiscService.transformerPostProcessor(ctx);
    return ctx;
  }
}
