/* eslint-disable prefer-destructuring */
/* eslint-disable sonarjs/no-duplicate-string */
import { Context } from 'koa';
import { MiscService } from '../services/misc';
import {
  DeliveryResponse,
  ProcessorTransformationOutput,
  ProcessorTransformationOutputWithMetaData,
  ProcessorTransformationOutputWithMetaDataArray,
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
    let deliveryResponse: DeliveryResponse;
    const requestMetadata = MiscService.getRequestMetadata(ctx);
    const { version }: { version: string } = ctx.params;
    let event:
      | ProcessorTransformationOutputWithMetaData
      | ProcessorTransformationOutputWithMetaDataArray;
    if (version === 'v0') {
      event = ctx.request.body as ProcessorTransformationOutputWithMetaData;
    } else {
      event = ctx.request.body as ProcessorTransformationOutputWithMetaDataArray;
    }
    const { destination }: { destination: string } = ctx.params;
    const integrationService = ServiceSelector.getNativeDestinationService();
    try {
      deliveryResponse = await integrationService.deliver(
        event,
        destination,
        requestMetadata,
        version,
      );
    } catch (error: any) {
      if (!Array.isArray(event.metadata)) {
        const metaTO = integrationService.getTags(
          destination,
          event.metadata?.destinationId || 'Non-determininable',
          event.metadata?.workspaceId || 'Non-determininable',
          tags.FEATURES.DATA_DELIVERY,
        );
        metaTO.metadata = event.metadata;
        deliveryResponse = DestinationPostTransformationService.handleDeliveryFailureEvents(
          error,
          metaTO,
        );
      } else {
        const metaTO = integrationService.getTags(
          destination,
          event.metadata[0]?.destinationId || 'Non-determininable',
          event.metadata[0]?.workspaceId || 'Non-determininable',
          tags.FEATURES.DATA_DELIVERY,
        );
        metaTO.metadata = event.metadata[0];
        deliveryResponse = DestinationPostTransformationService.handleDeliveryFailureEvents(
          error,
          metaTO,
        );
      }
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
