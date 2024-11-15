import { Context, Next } from 'koa';

export class StatsMiddleware {
  private static instanceID: string = process.env.INSTANCE_ID || 'unknown';

  private static workerID: string = process.env.WORKER_ID || 'unknown';

  public static async executionStats(ctx: Context, next: Next) {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
    ctx.set('X-Instance-ID', `${StatsMiddleware.instanceID}/${StatsMiddleware.workerID}`);
  }
}
