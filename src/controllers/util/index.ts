import { Context } from 'koa';
import isEmpty from 'lodash/isEmpty';
import get from 'get-value';
import { API_VERSION, CHANNELS, RETL_TIMESTAMP } from '../../routes/utils/constants';
import { getCompatibleStatusCode } from '../../adapters/utils/networkUtils';
import {
  ProcessorTransformationRequest,
  RouterTransformationRequestData,
  RudderMessage,
} from '../../types';
import { getValueFromMessage } from '../../v0/util';
import genericFieldMap from '../../v0/util/data/GenericFieldMapping.json';
import { EventType, MappedToDestinationKey } from '../../constants';

export class ControllerUtility {
  public static timestampValsMap: Record<string, string[]> = {
    [EventType.IDENTIFY]: [
      `context.${RETL_TIMESTAMP}`,
      `context.traits.${RETL_TIMESTAMP}`,
      `traits.${RETL_TIMESTAMP}`,
      ...genericFieldMap.timestamp,
    ],
    [EventType.TRACK]: [`properties.${RETL_TIMESTAMP}`, ...genericFieldMap.timestamp],
  };

  private static getCompatibleStatusCode(status: number): number {
    return getCompatibleStatusCode(status);
  }

  /**
   * Serialises `payload` once and assigns it to `ctx.body` as a Buffer.
   *
   * Assigning a plain object to `ctx.body` makes koa serialise it twice: once in
   * `addRequestSizeMiddleware`, which reads `ctx.response.length` and therefore hits
   * koa's `get length` -> `Buffer.byteLength(JSON.stringify(body))`, and again in
   * koa's `respond()` when writing the response. Both passes are synchronous and
   * block the event loop, which matters for the delivery proxy where bodies can be
   * several MB.
   *
   * Setting the Content-Type *before* the body keeps koa from overriding it with
   * `application/octet-stream` (koa only infers the type when Content-Type is unset),
   * so the response is byte-for-byte what an object body would have produced. koa's
   * body setter also records Content-Length for a Buffer, so the later
   * `ctx.response.length` read is an O(1) header lookup instead of a re-serialisation.
   *
   * `X-Content-Type-Options: nosniff` is set because the payload echoes caller-supplied
   * data (destination responses, job metadata) and `JSON.stringify` does not escape
   * `<`, `>` or `/`. The declared Content-Type already makes a browser treat this as
   * JSON; nosniff removes the residual content-sniffing path by which a response could
   * be re-interpreted as HTML. It is a constant-cost header, so it does not reintroduce
   * the per-payload scan this method exists to avoid.
   */
  public static setJsonBody(ctx: Context, payload: unknown) {
    ctx.set('X-Content-Type-Options', 'nosniff');
    ctx.type = 'application/json';
    ctx.body = Buffer.from(JSON.stringify(payload));
  }

  public static postProcess(ctx: Context, status = 200) {
    ctx.set('apiVersion', API_VERSION);
    ctx.status = status;
  }

  public static deliveryPostProcess(ctx: Context, status = 200) {
    ctx.set('apiVersion', API_VERSION);
    ctx.status = this.getCompatibleStatusCode(status);
  }

  public static handleTimestampInEvents(
    events: Array<ProcessorTransformationRequest | RouterTransformationRequestData>,
  ): Array<ProcessorTransformationRequest | RouterTransformationRequestData> {
    return events.map((event) => {
      const newMsg = { ...event.message } as RudderMessage;
      // RETL event & not VDM
      if (newMsg.channel === CHANNELS.sources && !get(newMsg, MappedToDestinationKey)) {
        const timestampValsArr = ControllerUtility.timestampValsMap[newMsg.type];
        if (!Array.isArray(timestampValsArr) || isEmpty(timestampValsArr)) {
          return event;
        }
        newMsg.timestamp = getValueFromMessage(newMsg, timestampValsArr);
      }
      return { ...event, message: newMsg };
    });
  }
}
