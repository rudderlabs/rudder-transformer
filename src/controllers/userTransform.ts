import { Context } from 'koa';
import { UserTransformService } from '../services/userTransform';
import { ProcessorTransformationRequest, UserTransformationServiceResponse } from '../types/index';
import {
  extractLibraries,
  setupUserTransformHandler,
  validateCode,
} from '../util/customTransformer';
import { ControllerUtility } from './util';
import logger from '../logger';

export class UserTransformController {
  public static async transform(ctx: Context) {
    logger.debug(
      '(User transform - router:/customTransform ):: Request to transformer',
      ctx.request.body,
    );
    const requestSize = Number(ctx.request.get('content-length'));
    const events = ctx.request.body as ProcessorTransformationRequest[];
    const processedRespone: UserTransformationServiceResponse =
      await UserTransformService.transformRoutine(events, ctx.state.features, requestSize);
    ctx.body = processedRespone.transformedEvents;
    ControllerUtility.postProcess(ctx, processedRespone.retryStatus);
    logger.debug(
      '(User transform - router:/customTransform ):: Response from transformer',
      ctx.response.body,
    );
    return ctx;
  }

  public static async testTransform(ctx: Context) {
    logger.debug(
      '(User transform - router:/transformation/test ):: Request to transformer',
      ctx.request.body,
    );
    const { events, trRevCode, libraryVersionIDs = [], credentials = [] } = ctx.request.body as any;
    const response = await UserTransformService.testTransformRoutine(
      events,
      trRevCode,
      libraryVersionIDs,
      credentials,
    );
    ctx.body = response.body;
    ControllerUtility.postProcess(ctx, response.status);
    logger.debug(
      '(User transform - router:/transformation/test ):: Response from transformer',
      ctx.response.body,
    );
    return ctx;
  }

  public static async testTransformLibrary(ctx: Context) {
    logger.debug(
      '(User transform - router:/transformationLibrary/test ):: Request to transformer',
      ctx.request.body,
    );
    try {
      const { code, language = 'javascript' } = ctx.request.body as any;
      if (!code) {
        throw new Error('Invalid request. Missing code');
      }
      const res = await validateCode(code, language);
      ctx.body = res;
    } catch (error: any) {
      ctx.body = { error: error.message };
      ctx.status = 400;
    }
    logger.debug(
      '(User transform - router:/transformationLibrary/test ):: Response from transformer',
      ctx.response.body,
    );
    return ctx;
  }

  public static async testTransformSethandle(ctx: Context) {
    logger.debug(
      '(User transform - router:/transformation/sethandle ):: Request to transformer',
      ctx.request.body,
    );
    try {
      const { trRevCode, libraryVersionIDs = [] } = ctx.request.body as any;
      const { code, language, testName } = trRevCode || {};
      if (!code || !language || !testName) {
        throw new Error('Invalid Request. Missing parameters in transformation code block');
      }

      logger.debug(`[CT] Setting up a transformation ${testName}`);
      if (!trRevCode.versionId) {
        trRevCode.versionId = 'testVersionId';
      }
      const res = await setupUserTransformHandler(libraryVersionIDs, trRevCode);
      logger.debug(`[CT] Finished setting up transformation: ${testName}`);
      ctx.body = res;
    } catch (error: any) {
      ctx.status = 400;
      ctx.body = { error: error.message };
    }
    logger.debug(
      '(User transform - router:/transformation/sethandle ):: Response from transformer',
      ctx.request.body,
    );
    return ctx;
  }

  public static async extractLibhandle(ctx: Context) {
    logger.debug(
      '(User transform - router:/extractLibs ):: Request to transformer',
      ctx.request.body,
    );
    try {
      const {
        code,
        versionId,
        validateImports = false,
        additionalLibraries = [],
        language = 'javascript',
        testMode = false,
      } = ctx.request.body as any;
      if (!code) {
        throw new Error('Invalid request. Code is missing');
      }

      const obj = await extractLibraries(
        code,
        versionId,
        validateImports,
        additionalLibraries,
        language,
        testMode || versionId === 'testVersionId',
      );
      ctx.body = obj;
    } catch (err: any) {
      ctx.status = 400;
      ctx.body = { error: err.error || err.message };
    }
    logger.debug(
      '(User transform - router:/extractLibs ):: Response from transformer',
      ctx.request.body,
    );
    return ctx;
  }
}
