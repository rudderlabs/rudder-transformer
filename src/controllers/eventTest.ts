import { Context } from 'koa';
import EventTesterService from '../services/eventTest/eventTester';

export default class EventTestController {
  private static API_VERSION = '1';

  public static async testEvent(ctx: Context) {
    const { version, destination }: { version: string; destination: string } = ctx.params as any;
    const { events }: { events: any } = ctx.request.body as any;
    try {
      const respList = await EventTesterService.testEvent(events, version, destination);
      ctx.body = respList;
    } catch (err: any) {
      // fail-safety error response
      ctx.body = {
        error: err.message || JSON.stringify(err),
      };
      ctx.status = 400;
    }
    ctx.set('apiVersion', this.API_VERSION);
  }

  public static status(ctx: Context) {
    ctx.status = 200;
    ctx.body = 'OK';
  }
}
