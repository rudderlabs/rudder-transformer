import { Context } from 'koa';
import { API_VERSION } from '../../routes/utils/constants';
import { isHttpStatusSuccess } from '../../v0/util';

export default class ControllerUtility {
  public static postProcess(ctx: Context, status: number = 200) {
    ctx.set('apiVersion', API_VERSION);
    ctx.status = status;
  }

  public static deliveryPostProcess(ctx: Context, status: number = 200) {
    ctx.set('apiVersion', API_VERSION);
    ctx.status = isHttpStatusSuccess(status) ? 200 : status;
  }
}
