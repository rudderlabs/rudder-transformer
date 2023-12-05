import { Context } from 'koa';
import { MiscService } from '../services/misc';
import {
  DeliveriesResponse,
  DeliveryResponse,
  ProcessorTransformationOutput,
  ProxyDeliveriesRequest,
  ProxyDeliveryRequest,
  ProxyRequest,
} from '../types/index';
import { ServiceSelector } from '../helpers/serviceSelector';
import { DeliveryTestService } from '../services/delivertTest/deliveryTest';
import { ControllerUtility } from './util';
import logger from '../logger';
import { DestinationPostTransformationService } from '../services/destination/postTransformation';
import tags from '../v0/util/tags';
import { FixMe } from '../util/types';

export class DeliveryController {
  public static async deliverToDestination(ctx: Context) {
    logger.debug('Native(Delivery):: Request to transformer::', JSON.stringify(ctx.request.body));
    let deliveryResponse: DeliveryResponse | DeliveriesResponse;
    const requestMetadata = MiscService.getRequestMetadata(ctx);
    const deliveryRequest = ctx.request.body as ProxyRequest;
    const { destination }: { destination: string } = ctx.params;
    const { version }: { version: string } = ctx.params;
    const integrationService = ServiceSelector.getNativeDestinationService();
    try {
      deliveryResponse = await integrationService.deliver(
        deliveryRequest,
        destination,
        requestMetadata,
        version,
      );
    } catch (error: any) {
      const metadata = Array.isArray(deliveryRequest.metadata)
        ? deliveryRequest.metadata[0]
        : deliveryRequest.metadata;
      const metaTO = integrationService.getTags(
        destination,
        metadata?.destinationId || 'Non-determinable',
        metadata?.workspaceId || 'Non-determinable',
        tags.FEATURES.DATA_DELIVERY,
      );
      if (version.toLowerCase() === 'v1') {
        metaTO.metadatas = (deliveryRequest as ProxyDeliveriesRequest).metadata;
      } else {
        metaTO.metadata = (deliveryRequest as ProxyDeliveryRequest).metadata;
      }
      deliveryResponse = DestinationPostTransformationService.handleDeliveryFailureEvents(
        error,
        metaTO,
      );
    }
    ctx.body = { output: deliveryResponse };
    if (version.toLowerCase() === 'v1') {
      ControllerUtility.deliveryPostProcess(ctx);
    } else {
      ControllerUtility.deliveryPostProcess(ctx, deliveryResponse.status);
    }
    logger.debug('Native(Delivery):: Response from transformer::', JSON.stringify(ctx.body));
    return ctx;
  }

  public static async testDestinationDelivery(ctx: Context) {
    logger.debug(
      'Native(Delivery-Test):: Request to transformer::',
      JSON.stringify(ctx.request.body),
    );
    const { destination }: { destination: string } = ctx.params;
    const {
      deliveryPayload,
      destinationRequestPayload,
    }: {
      deliveryPayload: ProcessorTransformationOutput;
      destinationRequestPayload: ProcessorTransformationOutput;
    } = ctx.request.body as FixMe;
    const response = await DeliveryTestService.doTestDelivery(
      destination,
      destinationRequestPayload,
      deliveryPayload,
    );
    ctx.body = { output: response };
    ControllerUtility.postProcess(ctx);
    logger.debug('Native(Delivery-Test):: Response from transformer::', JSON.stringify(ctx.body));
    return ctx;
  }
}
