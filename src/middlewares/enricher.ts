import { Context, Next } from 'koa';
import {
  ProcessorTransformationRequest,
  RouterTransformationRequest,
  RouterTransformationRequestData,
} from '../types';
import GeoLocationHelper from '../helpers/geoLocation';

export type DTRequest = RouterTransformationRequest | ProcessorTransformationRequest[];

export default class Enricher {
  private static enrichWithGeoInfo(
    data: RouterTransformationRequestData[],
  ): RouterTransformationRequestData[] {
    return data.map((inpEv) => {
      const geoEnrichedMessage = GeoLocationHelper.getMessageWithGeoLocationData(inpEv.message);
      return {
        ...inpEv,
        message: {
          ...inpEv.message,
          ...geoEnrichedMessage,
        },
      };
    });
  }

  public static async enrichGeoLocation(ctx: Context, next: Next) {
    const transformationRequest = ctx.request.body;
    let transformationReq: DTRequest;
    let reqBody: unknown;
    const isRouterTransform = Array.isArray(
      (transformationRequest as RouterTransformationRequest)?.input,
    );
    if (isRouterTransform) {
      // Router or batch transformation request
      transformationReq = transformationRequest as RouterTransformationRequest;
      const enrichedEvents: RouterTransformationRequestData[] = Enricher.enrichWithGeoInfo(
        transformationReq.input,
      );
      reqBody = {
        input: enrichedEvents,
        destType: transformationReq.destType,
      };
    } else {
      // Processor transformation
      transformationReq = transformationRequest as ProcessorTransformationRequest[];
      reqBody = Enricher.enrichWithGeoInfo(transformationReq);
    }
    ctx.request.body = reqBody;
    await next();
  }
}
