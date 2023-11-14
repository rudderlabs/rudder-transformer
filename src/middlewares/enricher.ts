import { Context, Next } from 'koa';
import {
  ProcessorTransformationRequest,
  RouterTransformationRequest,
  DTRequest,
  RouterTransformationRequestData,
} from '../types';
import GeoLocationHelper from '../helpers/geoLocation';

export default class GeoEnricher {
  private static enrichWithGeoInfo(
    data: RouterTransformationRequestData[],
  ): RouterTransformationRequestData[] {
    return data.map((inputEvent) => {
      const geoEnrichedMessage = GeoLocationHelper.enrichMessageAddressWithGeoData(
        inputEvent.message,
      );
      return {
        ...inputEvent,
        message: {
          ...inputEvent.message,
          ...geoEnrichedMessage,
        },
      };
    });
  }

  public static async enrich(ctx: Context, next: Next) {
    const transformationRequest = ctx.request.body;
    let transformationReq: DTRequest;
    let reqBody: unknown;
    const isRouterTransform = Array.isArray(
      (transformationRequest as RouterTransformationRequest)?.input,
    );
    if (isRouterTransform) {
      // Router or batch transformation request
      transformationReq = transformationRequest as RouterTransformationRequest;
      const enrichedEvents: RouterTransformationRequestData[] = GeoEnricher.enrichWithGeoInfo(
        transformationReq.input,
      );
      reqBody = {
        input: enrichedEvents,
        destType: transformationReq.destType,
      };
    } else {
      // Processor transformation
      transformationReq = transformationRequest as ProcessorTransformationRequest[];
      reqBody = GeoEnricher.enrichWithGeoInfo(transformationReq);
    }
    ctx.request.body = reqBody;
    await next();
  }
}
