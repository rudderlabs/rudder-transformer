import { Context } from 'koa';
import { TrackingPlanservice } from '../services/trackingPlan';
import { ControllerUtility } from './util';

export class TrackingPlanController {
  public static async validateTrackingPlan(ctx: Context) {
    const events = ctx.request.body;
    const requestSize = Number(ctx.request.get('content-length'));
    const reqParams = ctx.request.query;
    const response = await TrackingPlanservice.validateTrackingPlan(events, requestSize, reqParams);
    ctx.body = response.body;
    ControllerUtility.postProcess(ctx, response.status);
    return ctx;
  }
}
