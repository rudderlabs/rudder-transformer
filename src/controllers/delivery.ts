/* eslint-disable prefer-destructuring */
/* eslint-disable sonarjs/no-duplicate-string */
import { isDefinedAndNotNullAndNotEmpty } from '@rudderstack/integrations-lib';
import { Context } from 'koa';
import { ServiceSelector } from '../helpers/serviceSelector';
import { DeliveryTestService } from '../services/delivertTest/deliveryTest';
import { DestinationPostTransformationService } from '../services/destination/postTransformation';
import { MiscService } from '../services/misc';
import {
  DeliveryV0Response,
  DeliveryV1Response,
  ProcessorTransformationOutput,
  ProxyV0Request,
  ProxyV1Request,
  FixMe,
} from '../types';
import tags from '../v0/util/tags';
import { ControllerUtility } from './util';
import logger from '../logger';
import { isFeatureEnabled } from '../util/featureFlags';

const NON_DETERMINABLE = 'Non-determinable';

// Env var gating the request/response payload logs below. These emit full request/response
// bodies which may contain sensitive customer data/PII, so they are enabled per-workspace
// (value: "ALL" or a comma-separated list of workspace IDs) and logged at `warn` so they
// surface at the default LOG_LEVEL when explicitly turned on for debugging.
const DELIVERY_REQUEST_RESPONSE_LOG_FLAG = 'DELIVERY_REQUEST_RESPONSE_LOG_ENABLED';

export class DeliveryController {
  private static logDeliveryPayload(workspaceId: string, message: string, payload: unknown) {
    if (isFeatureEnabled(DELIVERY_REQUEST_RESPONSE_LOG_FLAG, workspaceId)) {
      logger.warn(message, payload);
    }
  }

  public static async deliverToDestination(ctx: Context) {
    let deliveryResponse: DeliveryV0Response;
    const requestMetadata = MiscService.getRequestMetadata(ctx);
    const deliveryRequest = ctx.request.body as ProxyV0Request;
    const { destination }: { destination: string } = ctx.params;
    const integrationService = ServiceSelector.getNativeDestinationService();
    DeliveryController.logDeliveryPayload(
      deliveryRequest.metadata.workspaceId,
      'Native(Delivery):: Request to transformer for delivery::',
      ctx.request.body,
    );
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

    DeliveryController.logDeliveryPayload(
      deliveryRequest.metadata.workspaceId,
      'Native(Delivery):: Response from transformer after delivery::',
      ctx.body,
    );
    return ctx;
  }

  public static async deliverToDestinationV1(ctx: Context) {
    let deliveryResponse: DeliveryV1Response;
    const requestMetadata = MiscService.getRequestMetadata(ctx);
    const deliveryRequest = ctx.request.body as ProxyV1Request;
    const { destination }: { destination: string } = ctx.params;
    const integrationService = ServiceSelector.getNativeDestinationService();
    DeliveryController.logDeliveryPayload(
      deliveryRequest.metadata[0].workspaceId,
      'Native(Delivery):: Request to transformer for delivery::',
      ctx.request.body,
    );
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
    if (isDefinedAndNotNullAndNotEmpty(deliveryResponse.authErrorCategory)) {
      ControllerUtility.deliveryPostProcess(ctx, deliveryResponse.status);
    } else {
      ControllerUtility.deliveryPostProcess(ctx);
    }

    DeliveryController.logDeliveryPayload(
      deliveryRequest.metadata[0].workspaceId,
      'Native(Delivery):: Response from transformer::',
      ctx.body,
    );
    return ctx;
  }

  public static async testDestinationDelivery(ctx: Context) {
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
    return ctx;
  }
}
