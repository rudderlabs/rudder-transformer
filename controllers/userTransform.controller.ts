import { Context } from "koa";
import { MiscService } from "../services/misc.service";
import { ProcessorRequest, UserTransfromServiceResponse } from "../types/types";
import UserTransformService from "../services/userTransform/userTransform.service";

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
}
