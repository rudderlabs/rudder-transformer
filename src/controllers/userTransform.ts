import { Context } from 'koa';
import MiscService from '../services/misc';
import { ProcessorTransformationRequest, UserTransformationServiceResponse } from '../types/index';
import { compileUserLibrary } from '../util/ivmFactory';
import UserTransformService from '../services/userTransform';
import logger from '../logger';
import { setupUserTransformHandler, extractLibraries, validateCode } from '../util/customTransformer';
import ControllerUtility from './util';

export default class UserTransformController {
  public static async transform(ctx: Context) {
    logger.debug(
      '(User transform - router:/customTransform ):: Request to transformer',
      JSON.stringify(ctx.request.body),
    );
    let requestMetadata = MiscService.getRequestMetadata(ctx);
    const events = ctx.request.body as ProcessorTransformationRequest[];
    const processedRespone: UserTransformationServiceResponse =
      await UserTransformService.transformRoutine(events);
    ctx.body = processedRespone.transformedEvents;
    ControllerUtility.postProcess(ctx, processedRespone.retryStatus);
    logger.debug(
      '(User transform - router:/customTransform ):: Response from transformer',
      JSON.stringify(ctx.response.body),
    );
    return ctx;
  }

  public static async testTransform(ctx: Context) {
    logger.debug(
      '(User transform - router:/transformation/test ):: Request to transformer',
      JSON.stringify(ctx.request.body),
    );
    const { events, trRevCode, libraryVersionIDs = [] } = ctx.request.body as any;
    const response = await UserTransformService.testTransformRoutine(
      events,
      trRevCode,
      libraryVersionIDs,
    );
    ctx.body = response.body;
    ControllerUtility.postProcess(ctx, response.status);
    logger.debug(
      '(User transform - router:/transformation/test ):: Response from transformer',
      JSON.stringify(ctx.response.body),
    );
    return ctx;
  }

  public static async testTransformLibrary(ctx: Context) {
    logger.debug(
      '(User transform - router:/transformationLibrary/test ):: Request to transformer',
      JSON.stringify(ctx.request.body),
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
      JSON.stringify(ctx.response.body),
    );
    return ctx;
  }

  public static async testTransformSethandle(ctx: Context) {
    logger.debug(
      '(User transform - router:/transformation/sethandle ):: Request to transformer',
      JSON.stringify(ctx.request.body),
    );
    try {
      const { trRevCode, libraryVersionIDs = [] } = ctx.request.body as any;
      const { code, language, testName, testWithPublish = false } = trRevCode || {};
      if (!code || !language || !testName) {
        throw new Error('Invalid Request. Missing parameters in transformation code block');
      }

      logger.debug(`[CT] Setting up a transformation ${testName} with publish: ${testWithPublish}`);
      if (!trRevCode.versionId) {
        trRevCode.versionId = 'testVersionId';
      }
      const res = await setupUserTransformHandler(trRevCode, libraryVersionIDs, testWithPublish);
      logger.debug(`[CT] Finished setting up transformation: ${testName}`);
      ctx.body = res;
    } catch (error: any) {
      ctx.status = 400;
      ctx.body = { error: error.message };
    }
    logger.debug(
      '(User transform - router:/transformation/sethandle ):: Response from transformer',
      JSON.stringify(ctx.request.body),
    );
    return ctx;
  }

  public static async extractLibhandle(ctx: Context) {
    logger.debug(
      '(User transform - router:/extractLibs ):: Request to transformer',
      JSON.stringify(ctx.request.body),
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
      JSON.stringify(ctx.request.body),
    );
    return ctx;
  }
}
