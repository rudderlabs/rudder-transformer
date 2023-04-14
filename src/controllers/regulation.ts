import { Context } from 'koa';
import logger from '../logger';
import { UserDeletionRequest, UserDeletionResponse } from '../types';
import ServiceSelector from '../helpers/serviceSelector';
import tags from '../v0/util/tags';
import PostTransformationDestinationService from '../services/destination/postTransformation';

// TODO: refactor this class to new format
export default class RegulationController {
  public static async deleteUsers(ctx: Context) {
    logger.debug(
      'Native(Process-Transform):: Requst to transformer::',
      JSON.stringify(ctx.request.body),
    );

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
      ctx.status = resplist[0].statusCode;
    } catch (error: any) {
      const metaTO = integrationService.getTags(
        userDeletionRequests[0].destType,
        'unknown',
        'unknown',
        tags.FEATURES.USER_DELETION,
      );
      const errResp = PostTransformationDestinationService.handleUserDeletionFailureEvents(
        error,
        metaTO,
      );
      ctx.body = [{ error, statusCode: 500 }] as UserDeletionResponse[];
      ctx.status = 500;
    }
    return ctx;
  }
}
