/* eslint-disable prefer-destructuring */
/* eslint-disable sonarjs/no-duplicate-string */
import { isDefinedAndNotNullAndNotEmpty } from '@rudderstack/integrations-lib';
import { Context } from 'koa';
import { ServiceSelector } from '../helpers/serviceSelector';
import { DeliveryTestService } from '../services/delivertTest/deliveryTest';
import {
  DestinationPostTransformationService,
  SerializationFailureReason,
} from '../services/destination/postTransformation';
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
import stats from '../util/stats';
import logger from '../logger';
import { ControllerUtility } from './util';

const NON_DETERMINABLE = 'Non-determinable';

// A delivery response that JSON.stringify rejects - over V8's ~512MB string ceiling, or
// circular - would otherwise crash later, uncaught, inside Koa's own response-sending code,
// leaving rudder-server with a body it can't parse. Serialize it here instead, where we still
// have the request's own (always-small) metadata to build a proper, retryable per-job fallback
// from.
//
// The serialized string is what gets handed to Koa, deliberately: assigning an object body
// means the payload is stringified three times over (once here, once by `ctx.response.length`
// in the request-size middleware, once by Koa's `respond()`). At the sizes this guard exists
// for that is three transient half-gigabyte strings, which risks tripping the memory fence and
// killing the process - a worse outcome than the RangeError being guarded against. A string
// body is passed straight through by both later steps, so the payload is serialized exactly
// once.
function serializeDeliveryResponse<T>(
  deliveryResponse: T,
  buildFallback: (reason: SerializationFailureReason) => T,
  version: 'v0' | 'v1',
): { response: T; body: string } {
  try {
    return { response: deliveryResponse, body: JSON.stringify({ output: deliveryResponse }) };
  } catch (error: unknown) {
    const reason: SerializationFailureReason =
      error instanceof RangeError ? 'tooLarge' : 'unserializable';
    logger.error('[DeliveryController] Delivery response could not be serialized', {
      reason,
      version,
      error: error instanceof Error ? error.message : String(error),
    });
    stats.increment('proxy_response_serialization_failure', { version, reason });
    const fallback = buildFallback(reason);
    return { response: fallback, body: JSON.stringify({ output: fallback }) };
  }
}

// Koa's body setter tags a string body as `text/plain`; delivery responses must stay JSON.
function setSerializedBody(ctx: Context, body: string) {
  ctx.body = body;
  ctx.type = 'json';
}

export class DeliveryController {
  public static async deliverToDestination(ctx: Context) {
    let deliveryResponse: DeliveryV0Response;
    const requestMetadata = MiscService.getRequestMetadata(ctx);
    const deliveryRequest = ctx.request.body as ProxyV0Request;
    const { destination }: { destination: string } = ctx.params;
    const integrationService = ServiceSelector.getNativeDestinationService();
    const { metadata } = deliveryRequest;
    const metaTO = integrationService.getTags(
      destination,
      metadata?.destinationId || NON_DETERMINABLE,
      metadata?.workspaceId || NON_DETERMINABLE,
      tags.FEATURES.DATA_DELIVERY,
    );
    metaTO.metadata = metadata;
    try {
      deliveryResponse = (await integrationService.deliver(
        deliveryRequest,
        destination,
        requestMetadata,
        'v0',
      )) as DeliveryV0Response;
    } catch (error: any) {
      deliveryResponse = DestinationPostTransformationService.handleDeliveryFailureEvents(
        error,
        metaTO,
      );
    }
    const { response, body } = serializeDeliveryResponse(
      deliveryResponse,
      (reason) => DestinationPostTransformationService.buildSerializationFallbackV0(metaTO, reason),
      'v0',
    );
    setSerializedBody(ctx, body);
    ControllerUtility.deliveryPostProcess(ctx, response.status);

    return ctx;
  }

  public static async deliverToDestinationV1(ctx: Context) {
    let deliveryResponse: DeliveryV1Response;
    const requestMetadata = MiscService.getRequestMetadata(ctx);
    const deliveryRequest = ctx.request.body as ProxyV1Request;
    const { destination }: { destination: string } = ctx.params;
    const integrationService = ServiceSelector.getNativeDestinationService();
    const { metadata } = deliveryRequest;
    const metaTO = integrationService.getTags(
      destination,
      metadata?.[0]?.destinationId || NON_DETERMINABLE,
      metadata?.[0]?.workspaceId || NON_DETERMINABLE,
      tags.FEATURES.DATA_DELIVERY,
    );
    metaTO.metadatas = metadata;
    try {
      deliveryResponse = (await integrationService.deliver(
        deliveryRequest,
        destination,
        requestMetadata,
        'v1',
      )) as DeliveryV1Response;
    } catch (error: any) {
      deliveryResponse = DestinationPostTransformationService.handlevV1DeliveriesFailureEvents(
        error,
        metaTO,
      );
    }
    const { response, body } = serializeDeliveryResponse(
      deliveryResponse,
      (reason) =>
        DestinationPostTransformationService.buildSerializationFallbackV1(metadata, metaTO, reason),
      'v1',
    );
    setSerializedBody(ctx, body);
    if (isDefinedAndNotNullAndNotEmpty(response.authErrorCategory)) {
      ControllerUtility.deliveryPostProcess(ctx, response.status);
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
