import { Context } from "koa";
import MiscService from "../services/misc.service";
import { ProcessorTransformRequest, UserTransfromServiceResponse } from "../types/index";
import { compileUserLibrary } from "../util/ivmFactory";
import UserTransformService from "../services/userTransform/userTransform.service";
import logger from "../logger";
import { setupUserTransformHandler } from "../util/customTransformer";
import ControllerUtility from "./util";

export default class UserTransformController {
  public static async transform(ctx: Context) {
    logger.debug(
      "(User transform - router:/customTransform ):: Request to transformer",
      JSON.stringify(ctx.request.body)
    );
    let requestMetadata = MiscService.getRequestMetadata(ctx);
    const events = ctx.request.body as ProcessorTransformRequest[];
    const processedRespone: UserTransfromServiceResponse = await UserTransformService.transformRoutine(
      events
    );
    ctx.body = processedRespone.transformedEvents;
    ControllerUtility.postProcess(ctx, processedRespone.retryStatus);
    logger.debug(
      "(User transform - router:/customTransform ):: Response from transformer",
      JSON.stringify(ctx.response.body)
    );
    return ctx;
  }

  public static async testTransform(ctx: Context) {
    logger.debug(
      "(User transform - router:/transformation/test ):: Request to transformer",
      JSON.stringify(ctx.request.body)
    );
    const { events, trRevCode, libraryVersionIDs = [] } = ctx.request
      .body as any;
    const response = await UserTransformService.testTransformRoutine(
      events,
      trRevCode,
      libraryVersionIDs
    );
    ctx.body = response.Body;
    ControllerUtility.postProcess(ctx, response.status);
    logger.debug(
      "(User transform - router:/transformation/test ):: Response from transformer",
      JSON.stringify(ctx.response.body)
    );
    return ctx;
  }

  public static async testTransformLibrary(ctx: Context) {
    logger.debug(
      "(User transform - router:/transformationLibrary/test ):: Request to transformer",
      JSON.stringify(ctx.request.body)
    );
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
    logger.debug(
      "(User transform - router:/transformationLibrary/test ):: Response from transformer",
      JSON.stringify(ctx.response.body)
    );
    return ctx;
  }

  public static async testTransformSethandle(ctx: Context) {
    logger.debug(
      "(User transform - router:/transformation/sethandle ):: Request to transformer",
      JSON.stringify(ctx.request.body)
    );
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
    logger.debug(
      "(User transform - router:/transformation/sethandle ):: Response from transformer",
      JSON.stringify(ctx.request.body)
    );
    return ctx;
  }
}
