import { Context } from "koa";
import { prometheusRegistry } from "../middleware";

export default class MetricsController {
  public static async exportMetric(ctx: Context) {
    ctx.status = 200;
    ctx.type = prometheusRegistry.contentType;
    ctx.body = await prometheusRegistry.metrics();
    return ctx;
  }
}
