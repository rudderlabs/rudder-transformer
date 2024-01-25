/* eslint-disable prefer-destructuring */
/* eslint-disable sonarjs/no-duplicate-string */
import { Context } from 'koa';
import { MiscService } from '../services/misc';
import {
  DeliveryV1Response,
  DeliveryV0Response,
  ProcessorTransformationOutput,
  ProxyV0Request,
  ProxyV1Request,
} from '../types/index';
import { ServiceSelector } from '../helpers/serviceSelector';
import { DeliveryTestService } from '../services/delivertTest/deliveryTest';
import { ControllerUtility } from './util';
import logger from '../logger';
import { DestinationPostTransformationService } from '../services/destination/postTransformation';
import tags from '../v0/util/tags';
import { FixMe } from '../util/types';

const NON_DETERMINABLE = 'Non-determinable';

export class DeliveryController {
  public static async deliverToDestination(ctx: Context) {
    logger.debug('Native(Delivery):: Request to transformer::', JSON.stringify(ctx.request.body));
    let deliveryResponse: DeliveryV0Response;
    const requestMetadata = MiscService.getRequestMetadata(ctx);
    const deliveryRequest = ctx.request.body as ProxyV0Request;
    const { destination }: { destination: string } = ctx.params;
    const integrationService = ServiceSelector.getNativeDestinationService();
    try {
      deliveryResponse = (await integrationService.deliver(
        deliveryRequest,
        destination,
        requestMetadata,
        'v0',
      )) as DeliveryV0Response;
    } catch (error: any) {
      const { metadata } = deliveryRequest;
      const metaTO = integrationService.getTags(
        destination,
        metadata?.destinationId || NON_DETERMINABLE,
        metadata?.workspaceId || NON_DETERMINABLE,
        tags.FEATURES.DATA_DELIVERY,
      );
      metaTO.metadata = metadata;
      deliveryResponse = DestinationPostTransformationService.handleDeliveryFailureEvents(
        error,
        metaTO,
      );
    }
    ctx.body = { output: deliveryResponse };
    ControllerUtility.deliveryPostProcess(ctx, deliveryResponse.status);

    logger.debug('Native(Delivery):: Response from transformer::', JSON.stringify(ctx.body));
    return ctx;
  }

  public static async deliverToDestinationV1(ctx: Context) {
    logger.debug('Native(Delivery):: Request to transformer::', JSON.stringify(ctx.request.body));
    let deliveryResponse: DeliveryV1Response;
    const requestMetadata = MiscService.getRequestMetadata(ctx);
    const deliveryRequest = ctx.request.body as ProxyV1Request;
    const { destination }: { destination: string } = ctx.params;
    const integrationService = ServiceSelector.getNativeDestinationService();
    try {
      deliveryResponse = (await integrationService.deliver(
        deliveryRequest,
        destination,
        requestMetadata,
        'v1',
      )) as DeliveryV1Response;
    } catch (error: any) {
      const { metadata } = deliveryRequest;
      const metaTO = integrationService.getTags(
        destination,
        metadata[0].destinationId || NON_DETERMINABLE,
        metadata[0].workspaceId || NON_DETERMINABLE,
        tags.FEATURES.DATA_DELIVERY,
      );
      metaTO.metadatas = metadata;
      deliveryResponse = DestinationPostTransformationService.handlevV1DeliveriesFailureEvents(
        error,
        metaTO,
      );
    }
    ctx.body = { output: deliveryResponse };
    ControllerUtility.deliveryPostProcess(ctx, deliveryResponse.status);

    logger.debug('Native(Delivery):: Response from transformer::', JSON.stringify(ctx.body));
    return ctx;
  }

  public static async testDestinationDelivery(ctx: Context) {
    logger.debug(
      'Native(Delivery-Test):: Request to transformer::',
      JSON.stringify(ctx.request.body),
    );
    const { destination }: { destination: string } = ctx.params;
    const { version }: { version: string } = ctx.params;
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
      version,
    );
    ctx.body = { output: response };
    ControllerUtility.postProcess(ctx);
    logger.debug('Native(Delivery-Test):: Response from transformer::', JSON.stringify(ctx.body));
    return ctx;
  }
}
