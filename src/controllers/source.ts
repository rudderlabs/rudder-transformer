import { Context } from 'koa';
import { BaseError, formatZodError } from '@rudderstack/integrations-lib';
import { ServiceSelector } from '../helpers/serviceSelector';
import { MiscService } from '../services/misc';
import { SourcePostTransformationService } from '../services/source/postTransformation';
import { ControllerUtility } from './util';
import logger from '../logger';
import { SourceInputV2, SourceHydrationRequestSchema, SourceHydrationOutput } from '../types';
import { HTTP_STATUS_CODES } from '../v0/util/constant';

export class SourceController {
  public static async sourceTransform(ctx: Context) {
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
    return ctx;
  }

  public static async sourceHydrate(ctx: Context) {
    const { source: sourceType } = ctx.params as { source: string };

    // Validate and extract batch and source from request body at controller level
    const validationResult = SourceHydrationRequestSchema.safeParse(ctx.request.body);
    if (!validationResult.success) {
      ctx.body = { error: formatZodError(validationResult.error) };
      ctx.status = HTTP_STATUS_CODES.BAD_REQUEST;
      return;
    }

    const { batch, source } = validationResult.data;

    const integrationService = ServiceSelector.getNativeSourceService();
    let response: SourceHydrationOutput;
    try {
      response = await integrationService.sourceHydrateRoutine({ batch, source }, sourceType);
    } catch (err: any) {
      logger.error('error in sourceHydrateRoutine', { source: sourceType, error: err?.message });
      if (err instanceof BaseError) {
        ctx.body = { error: err.message };
        ctx.status = err.status;
      } else {
        // Unknown error - return 500
        ctx.body = { error: 'Unexpected error during hydration' };
        ctx.status = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
      }
      return;
    }

    // Compute overall status code from jobs
    const firstError = response.batch.find(
      (job) => job.statusCode >= HTTP_STATUS_CODES.BAD_REQUEST,
    );
    if (firstError) {
      // Since server doesn't handle partial success
      // no need to return events in case of any error
      ctx.body = {
        batch: response.batch.map((job) => ({
          ...job,
          event: undefined,
        })),
      };
      ctx.status = firstError.statusCode;
    } else {
      ctx.body = { batch: response.batch };
      ctx.status = HTTP_STATUS_CODES.OK;
    }
  }
}
