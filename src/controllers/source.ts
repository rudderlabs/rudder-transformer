import { Context } from 'koa';
import { ServiceSelector } from '../helpers/serviceSelector';
import { MiscService } from '../services/misc';
import { SourcePostTransformationService } from '../services/source/postTransformation';
import { ControllerUtility } from './util';
import logger from '../logger';
import { SourceInputV2 } from '../types';
import { HTTP_STATUS_CODES } from '../v0/util/constant';

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

  public static async sourceHydrate(ctx: Context) {
    const requestBody = ctx.request.body as Record<string, unknown>;
    const { source }: { source: string } = ctx.params;
    const integrationService = ServiceSelector.getNativeSourceService();
    let response;
    try {
      response = await integrationService.sourceHydrateRoutine(requestBody, source);
    } catch (err: any) {
      logger.error('error in sourceHydrateRoutine', { source, error: err?.message });
      ctx.body = { error: 'Unexpected error during hydration' };
      ctx.status = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
      return;
    }

    if ('error' in response) {
      ctx.body = { error: response.error };
      ctx.status = response.statusCode;
    } else {
      // Compute overall status code from jobs
      let statusCode;
      const firstError = response.jobs.find((job) => job.statusCode !== HTTP_STATUS_CODES.OK);
      if (firstError) {
        statusCode = firstError.statusCode;
      } else {
        statusCode = HTTP_STATUS_CODES.OK;
      }

      ctx.body = { jobs: response.jobs };
      ctx.status = statusCode;
    }
  }
}
