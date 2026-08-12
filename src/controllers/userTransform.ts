import { Context } from 'koa';
import { UserTransformService } from '../services/userTransform';
import { ProcessorTransformationRequest, UserTransformationServiceResponse } from '../types/index';
import { extractLibraries, validateCode } from '../util/customTransformer';

import { ControllerUtility } from './util';

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
  codeRevision: {
    code: string;
    language: string;
    versionId: string;
    codeVersion?: string;
  };
  dependencies?: Dependencies;
}

export class UserTransformController {
  public static async transform(ctx: Context) {
    const requestSize = Number(ctx.request.get('content-length'));
    const events = ctx.request.body as ProcessorTransformationRequest[];
    const processedResponse: UserTransformationServiceResponse =
      await UserTransformService.transformRoutine(events, ctx.state.features, requestSize);
    ctx.body = processedResponse.transformedEvents;
    ControllerUtility.postProcess(ctx, processedResponse.retryStatus);
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
    const { input, codeRevision, dependencies } = ctx.request.body as TestRunRequestBody;

    const response = await UserTransformService.testTransformRoutine(
      input,
      { ...codeRevision, codeVersion: codeRevision.codeVersion || '1' },
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

  public static async extractLibhandle(ctx: Context) {
    try {
      const { code, language = 'javascript' } = ctx.request.body as any;
      if (!code) {
        throw new Error('Invalid request. Code is missing');
      }

      const obj = await extractLibraries(code, language);
      ctx.body = obj;
    } catch (err: any) {
      ctx.status = 400;
      ctx.body = { error: err.error || err.message };
    }
    return ctx;
  }
}
