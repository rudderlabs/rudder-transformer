import { Context } from 'koa';
import { castArray } from 'lodash';
import { UserTransformService } from '../services/userTransform';
import { ProcessorTransformationRequest, UserTransformationServiceResponse } from '../types/index';
import {
  extractLibraries,
  setupUserTransformHandler,
  validateCode,
} from '../util/customTransformer';

import { reconcileFunction } from '../util/openfaas/index';
import { ControllerUtility } from './util';
import logger from '../logger';

interface Dependencies {
  libraries: {
    versionId: string;
  }[];
  credentials: {
    key: string;
    value: string;
    isSecret: boolean;
  }[];
}

interface TestRunRequestBody {
  input: { message: Record<string, unknown>; metadata?: Record<string, unknown> }[];
  code: string;
  language: string;
  codeVersion?: string;
  dependencies?: Dependencies;
}

export class UserTransformController {
  /**
  reconcileFunction is a controller function to reconcile the openfaas
  fns with the latest configuration in the service.
  */
  public static async reconcileFunction(ctx: Context) {
    const { wId } = ctx.params;
    const { name = [], migrateAll = 'false' } = ctx.request.query;

    logger.info(`Received a request to reconcile fns in workspace: ${wId}`);

    const fns = castArray(name);
    await reconcileFunction(wId, fns, migrateAll === 'true');

    ctx.body = { message: 'Reconciled' };
    return ctx;
  }

  public static async transform(ctx: Context) {
    const requestSize = Number(ctx.request.get('content-length'));
    const events = ctx.request.body as ProcessorTransformationRequest[];
    const processedRespone: UserTransformationServiceResponse =
      await UserTransformService.transformRoutine(events, ctx.state.features, requestSize);
    ctx.body = processedRespone.transformedEvents;
    ControllerUtility.postProcess(ctx, processedRespone.retryStatus);
    return ctx;
  }

  public static async testTransform(ctx: Context) {
    const { events, trRevCode, libraryVersionIDs = [], credentials = [] } = ctx.request.body as any;
    const response = await UserTransformService.testTransformRoutine(
      events,
      trRevCode,
      libraryVersionIDs,
      credentials,
    );
    ctx.body = response.body;
    ControllerUtility.postProcess(ctx, response.status);
    return ctx;
  }

  /**
   * testRun is a controller function that executes a test run of user-provided transformation code
   * using the given input data and optional dependencies. This is typically used to validate
   * transformation logic by running it as a test before deployment.
   *
   * Expects the following body structure (TestRunRequestBody):
   *  - input: array of objects representing input records
   *  - code: string containing the transformation code to test
   *  - language: programming language used for the transformation (e.g., 'javascript')
   *  - codeVersion (optional): string representing code version, defaults to '1' if not provided
   *  - dependencies (optional):
   *      - libraries: array of library objects with `versionId` for each library to load in the test environment
   *      - credentials: array of credential objects to provide for the test
   *
   * Responds with the result of the test execution.
   *
   * @param ctx - The Koa request/response context object.
   */
  public static async testRun(ctx: Context) {
    const {
      input,
      code,
      dependencies,
      language,
      codeVersion = '1',
    } = ctx.request.body as TestRunRequestBody;

    const response = await UserTransformService.testTransformRoutine(
      input,
      {
        code,
        language,
        codeVersion,
      },
      (dependencies?.libraries ?? []).map((library) => library.versionId),
      dependencies?.credentials ?? [],
      true,
    );

    ctx.body = response.body;
    ControllerUtility.postProcess(ctx, response.status);
    return ctx;
  }

  public static async testTransformLibrary(ctx: Context) {
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
    return ctx;
  }

  public static async testTransformSethandle(ctx: Context) {
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
    return ctx;
  }

  public static async extractLibhandle(ctx: Context) {
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
    return ctx;
  }
}
