import { Context } from "koa";
import { API_VERSION } from "../../routes/utils/constants";

export default class ControllerUtility {
  public static transformerPostProcessor(ctx: Context, status: number = 200) {
    ctx.set("apiVersion", API_VERSION);
    ctx.status = status;
  }
}
