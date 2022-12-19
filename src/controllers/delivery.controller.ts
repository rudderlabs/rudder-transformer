import { Context } from "koa";
import MiscService from "../services/misc.service";
import { TransformedEvent } from "../types/index";
import { ServiceSelector } from "../util/serviceSelector";
import networkHandlerFactory from "../adapters/networkHandlerFactory";
import { isHttpStatusSuccess } from "../v0/util";
import DeliveryTestService from "../services/delivertTest/deliveryTest.service";
import ControllerUtility from "./util";

export default class DeliveryController {
  public static async deliverToDestination(ctx: Context) {
    let requestMetadata = MiscService.getRequestMetadata(ctx);
    let event = ctx.request.body as TransformedEvent;
    const {
      version,
      destination
    }: { version: string; destination: string } = ctx.params;
    const integrationService = ServiceSelector.getNativeIntegrationServiceDest();
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
    ControllerUtility.transformerPostProcessor(ctx);
    return ctx;
  }

  public static async testDestinationDelivery(ctx: Context) {
    const {
      version,
      destination
    }: { version: string; destination: string } = ctx.params;
    const { deliveryPayload, destinationRequestPayload } = ctx.request
      .body as any;
    const response = await DeliveryTestService.deliverTestRoutine(
      destination,
      destinationRequestPayload,
      deliveryPayload
    );
    ctx.body = { output: response };
    ControllerUtility.transformerPostProcessor(ctx);
    return ctx;
  }
}
