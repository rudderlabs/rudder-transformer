import { Context } from 'koa';
import { ServiceSelector } from '../helpers/serviceSelector';
import { MiscService } from '../services/misc';
import { SourcePostTransformationService } from '../services/source/postTransformation';
import { ControllerUtility } from './util';
import logger from '../logger';
import { SourceInputV2 } from '../types';

export class SourceController {
  public static async sourceTransform(ctx: Context) {
    logger.debug('Native(Source-Transform):: Request to transformer::', ctx.request.body);
    const requestMetadata = MiscService.getRequestMetadata(ctx);
    const input = ctx.request.body as SourceInputV2[];
    const { source }: { source: string } = ctx.params;
    const enrichedMetadata = {
      ...requestMetadata,
      source,
    };
    const integrationService = ServiceSelector.getNativeSourceService();

    try {
      const resplist = await integrationService.sourceTransformRoutine(
        input,
        source,
        requestMetadata,
      );
      ctx.body = resplist;
    } catch (err: any) {
      logger.error(err?.message || 'error in source transformation', enrichedMetadata);
      const metaTO = integrationService.getTags();
      const resp = SourcePostTransformationService.handleFailureEventsSource(err, metaTO);
      ctx.body = [resp];
    }
    ControllerUtility.postProcess(ctx);
    logger.debug('Native(Source-Transform):: Response from transformer::', {
      srcResponse: ctx.body,
      source,
    });
    return ctx;
  }
}
