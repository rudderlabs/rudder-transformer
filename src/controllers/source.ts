import { structuredLogger as logger } from '@rudderstack/integrations-lib';
import { Context } from 'koa';
import { ServiceSelector } from '../helpers/serviceSelector';
import { MiscService } from '../services/misc';
import { SourcePostTransformationService } from '../services/source/postTransformation';
import { ControllerUtility } from './util';

export class SourceController {
  public static async sourceTransform(ctx: Context) {
    logger.debug('Native(Source-Transform):: Request to transformer::', ctx.request.body);
    const requestMetadata = MiscService.getRequestMetadata(ctx);
    const events = ctx.request.body as object[];
    const { version, source }: { version: string; source: string } = ctx.params;
    const integrationService = ServiceSelector.getNativeSourceService();
    const loggerWithCtx = logger.child({ version, source });
    try {
      const { implementationVersion, input } = ControllerUtility.adaptInputToVersion(
        source,
        version,
        events,
      );
      const resplist = await integrationService.sourceTransformRoutine(
        input,
        source,
        implementationVersion,
        requestMetadata,
        loggerWithCtx,
      );
      ctx.body = resplist;
    } catch (err: any) {
      const metaTO = integrationService.getTags();
      const resp = SourcePostTransformationService.handleFailureEventsSource(err, metaTO);
      ctx.body = [resp];
    }
    ControllerUtility.postProcess(ctx);
    loggerWithCtx.debug('Native(Source-Transform):: Response from transformer::', ctx.body);
    return ctx;
  }
}
