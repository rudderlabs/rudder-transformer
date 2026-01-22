import { Context } from 'koa';
import { ControllerUtility } from '../controllers/util';
import logger from '../logger';
import { TestRunRequestBody, transformerService } from './userTransformerV1.service';

export class UserTransformerV1Controller {
  public static async testRun(ctx: Context) {
    const response = await transformerService.runTransformation(
      ctx.request.body as TestRunRequestBody,
      true,
    );

    ctx.body = response;
    ControllerUtility.postProcess(ctx, 200);
    logger.debug(
      '(User transform - router:/transformation/testRun ):: Response from transformer',
      ctx.response.body,
    );
    return ctx;
  }
}
