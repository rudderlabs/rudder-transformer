import { Context, Next } from 'koa';

export class CircularStructureMiddleWare {
  public static async handle(ctx: Context, next: Next): Promise<void> {
    await next();
    try {
      JSON.stringify(ctx.body);
    } catch (err: any) {
      ctx.body = { error: err.message };
      ctx.status = err.message.includes('circular structure') ? 400 : 500;
    }
  }
}
