import { Context, Next } from 'koa';

export class StatsMiddleware {
  private static instanceID: string = process.env.INSTANCE_ID || 'default';

  private static workerID: string = process.env.WORKER_ID || 'master';

  public static async executionStats(ctx: Context, next: Next) {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
    ctx.set('X-Instance-ID', `${StatsMiddleware.instanceID}/${StatsMiddleware.workerID}`);
  }
}
