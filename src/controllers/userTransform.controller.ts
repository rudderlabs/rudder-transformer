import { Context } from "koa";
import { MiscService } from "../services/misc.service";
import { ProcessorRequest, UserTransfromServiceResponse } from "../types/index";
import { compileUserLibrary } from "../util/ivmFactory";
import UserTransformService from "../services/userTransform/userTransform.service";
import logger from "../logger";
import { setupUserTransformHandler } from "../util/customTransformer";

export default class UserTransformController {
  public static async userTransform(ctx: Context) {
    let requestMetadata = MiscService.getRequestMetadata(ctx);
    const events = ctx.request.body as ProcessorRequest[];
    const processedRespone: UserTransfromServiceResponse = await UserTransformService.userTransformRoutine(
      events
    );
    ctx.body = processedRespone.transformedEvents;
    MiscService.transformerPostProcessor(ctx, processedRespone.retryStatus);
    return ctx;
  }

  public static async testUserTransform(ctx: Context) {
    const { events, trRevCode, libraryVersionIDs = [] } = ctx.request.body as any;
    const response = await UserTransformService.testUserTransform(
      events,
      trRevCode,
      libraryVersionIDs
    );
    ctx.body = response.Body;
    MiscService.transformerPostProcessor(ctx, response.status);
    return ctx;
  }

  public static async testUserTransformLibrary(ctx: Context) {
    try {
      const { code } = ctx.request.body as any;
      if (!code) {
        throw new Error("Invalid request. Missing code");
      }
      const res = await compileUserLibrary(code);
      ctx.body = res;
    } catch (error) {
      ctx.body = { error: error.message };
      ctx.status = 400;
    }
    return ctx;
  }

  public static async testUsertransformSethandle(ctx: Context) {
    try {
      const { trRevCode, libraryVersionIDs = [] } = ctx.request.body as any;
      const { code, language, testName, testWithPublish = false } =
        trRevCode || {};
      if (!code || !language || !testName) {
        throw new Error(
          "Invalid Request. Missing parameters in transformation code block"
        );
      }

      logger.debug(
        `[CT] Setting up a transformation ${testName} with publish: ${testWithPublish}`
      );
      if (!trRevCode.versionId) {
        trRevCode.versionId = "testVersionId";
      }
      const res = await setupUserTransformHandler(
        trRevCode,
        libraryVersionIDs,
        testWithPublish
      );
      logger.debug(`[CT] Finished setting up transformation: ${testName}`);
      ctx.body = res;
    } catch (error) {
      ctx.status = 400;
      ctx.body = { error: error.message };
    }
    return ctx;
  }
}
