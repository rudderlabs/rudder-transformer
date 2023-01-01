import { Context } from "koa";
import  MiscService  from "../services/misc";
import profile from "../services/profile";
import ControllerUtility from "./util";
export default class ProfileController {
  public static async profile(ctx: Context) {
    let requestMetadata = MiscService.getRequestMetadata(ctx);
    const format = ctx.request.query.format as string;
    const { credBucketDetails } = ctx.request.body as any;
    const response = await profile(credBucketDetails, format);
    ctx.body = response.body;
    ControllerUtility.postProcess(ctx, response.status);
    return ctx;
  }
}
