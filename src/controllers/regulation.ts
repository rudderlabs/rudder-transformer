import { Context } from 'koa';
import logger from '../logger';
import { UserDeletionRequest, UserDeletionResponse } from '../types';
import { ServiceSelector } from '../helpers/serviceSelector';
import tags from '../v0/util/tags';
import stats from '../util/stats';
import { DestinationPostTransformationService } from '../services/destination/postTransformation';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CatchErr } from '../util/types';

export class RegulationController {
  public static async deleteUsers(ctx: Context) {
    logger.debug(
      'Native(Process-Transform):: Requst to transformer::',
      JSON.stringify(ctx.request.body),
    );
    const startTime = new Date();
    let rudderDestInfo: any;
    try {
      const rudderDestInfoHeader = ctx.get('x-rudder-dest-info');
      const destInfoHeader = JSON.parse(rudderDestInfoHeader);
      if (!Array.isArray(destInfoHeader)) {
        rudderDestInfo = destInfoHeader;
      }
    } catch (error) {
      logger.error(`Error while getting rudderDestInfo header value: ${error}`);
    }

    const userDeletionRequests = ctx.request.body as UserDeletionRequest[];
    const integrationService = ServiceSelector.getNativeDestinationService();
    try {
      const resplist = await integrationService.processUserDeletion(
        userDeletionRequests,
        rudderDestInfo,
      );
      ctx.body = resplist;
      ctx.status = resplist[0].statusCode; // TODO: check if this is the right way to set status
    } catch (error: CatchErr) {
      const metaTO = integrationService.getTags(
        userDeletionRequests[0].destType,
        'unknown',
        'unknown',
        tags.FEATURES.USER_DELETION,
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const errResp = DestinationPostTransformationService.handleUserDeletionFailureEvents(
        error,
        metaTO,
      ); // TODO: this is not used. Fix it.
      ctx.body = [{ error, statusCode: 500 }] as UserDeletionResponse[]; // TODO: responses array length is always 1. Is that okay?
      ctx.status = 500;
    }
    stats.timing('dest_transform_request_latency', startTime, {
      feature: tags.FEATURES.USER_DELETION,
      version: 'v0',
    });
    return ctx;
  }
}
