import { Context } from 'koa';
import MiscService from '../services/misc';
import ServiceSelector from '../helpers/serviceSelector';
import ControllerUtility from './util';
import logger from '../logger';
import PostTransformationServiceSource from '../services/source/postTransformation';

export default class SourceController {
  public static async sourceTransform(ctx: Context) {
    logger.debug(
      'Native(Source-Transform):: Request to transformer::',
      JSON.stringify(ctx.request.body),
    );
    const requestMetadata = MiscService.getRequestMetadata(ctx);
    const events = ctx.request.body as Object[];
    const { version, source }: { version: string; source: string } = ctx.params;
    const integrationService = ServiceSelector.getNativeSourceService();
    try {
      const resplist = await integrationService.sourceTransformRoutine(
        events,
        source,
        version,
        requestMetadata,
      );
      ctx.body = resplist;
    } catch (err: any) {
      const metaTO = integrationService.getTags();
      const resp = PostTransformationServiceSource.handleFailureEventsSource(err, metaTO);
      ctx.body = [resp];
    }
    ControllerUtility.postProcess(ctx);
    logger.debug(
      'Native(Source-Transform):: Response from transformer::',
      JSON.stringify(ctx.body),
    );
    return ctx;
  }
}
