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
import logger from '../logger';
import { ControllerUtility } from './util';

const NON_DETERMINABLE = 'Non-determinable';

// A response too large for JSON.stringify (RangeError: Invalid string length) would otherwise
// crash later - uncaught - inside Koa's own response-sending code, with no chance for any
// middleware to recover it into a well-formed body. Catch it here instead, where we still have
// the request's own (always-small) metadata to build a proper, retryable per-job fallback from.
function ensureSerializable<T>(deliveryResponse: T, buildFallback: () => T): T {
  try {
    JSON.stringify(deliveryResponse);
    return deliveryResponse;
  } catch (error: unknown) {
    logger.error('[DeliveryController] Response body too large to serialize', {
      error: error instanceof Error ? error.message : String(error),
    });
    return buildFallback();
  }
}

export class DeliveryController {
  public static async deliverToDestination(ctx: Context) {
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
    deliveryResponse = ensureSerializable(deliveryResponse, () =>
      DestinationPostTransformationService.buildResponseTooLargeFallbackV0(),
    );
    ctx.body = { output: deliveryResponse };
    ControllerUtility.deliveryPostProcess(ctx, deliveryResponse.status);

    return ctx;
  }

  public static async deliverToDestinationV1(ctx: Context) {
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
    deliveryResponse = ensureSerializable(deliveryResponse, () =>
      DestinationPostTransformationService.buildResponseTooLargeFallbackV1(
        deliveryRequest.metadata,
      ),
    );
    ctx.body = { output: deliveryResponse };
    if (isDefinedAndNotNullAndNotEmpty(deliveryResponse.authErrorCategory)) {
      ControllerUtility.deliveryPostProcess(ctx, deliveryResponse.status);
    } else {
      ControllerUtility.deliveryPostProcess(ctx);
    }

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
