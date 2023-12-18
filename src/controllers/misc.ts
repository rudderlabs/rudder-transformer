import { Context } from 'koa';
import { MiscService } from '../services/misc';

export class MiscController {
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

  public static async getCPUProfile(ctx: Context) {
    const { seconds } = ctx.query;
    let secondsData = 10;
    // if seconds is not null and is not array then parseInt
    if (seconds && !Array.isArray(seconds)) {
      secondsData = parseInt(seconds, 10);
    }
    ctx.body = await MiscService.getCPUProfile(secondsData);
    ctx.status = 200;
    return ctx;
  }

  public static async getHeapProfile(ctx: Context) {
    ctx.body = await MiscService.getHeapProfile();
    ctx.status = 200;
    return ctx;
  }
}
