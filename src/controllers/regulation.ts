import { Context } from 'koa';
import { ServiceSelector } from '../helpers/serviceSelector';
import { DestinationPostTransformationService } from '../services/destination/postTransformation';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UserDeletionRequest, UserDeletionResponse, CatchErr } from '../types';
import tags from '../v0/util/tags';
import logger from '../logger';

export class RegulationController {
  public static async deleteUsers(ctx: Context) {
    logger.debug('Native(Process-Transform):: Requst to transformer::', ctx.request.body);
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
    return ctx;
  }
}
