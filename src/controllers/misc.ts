import { Context } from 'koa';
import MiscService from '../services/misc';

export default class MiscController {
  public static healthStats(ctx: Context) {
    ctx.body = MiscService.getHealthInfo();
    ctx.status = 200;
    return ctx;
  }

  public static buildVersion(ctx: Context) {
    ctx.body = MiscService.getBuildVersion();
    ctx.status = 200;
    return ctx;
  }

  public static version(ctx: Context) {
    ctx.body = MiscService.getVersion();
    ctx.status = 200;
    return ctx;
  }

  public static features(ctx: Context) {
    ctx.body = MiscService.getFetaures();
    ctx.status = 200;
    return ctx;
  }
}
