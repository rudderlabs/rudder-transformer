import { Context } from 'koa';
import { API_VERSION } from '../../routes/utils/constants';
import { isHttpStatusSuccess } from '../../v0/util';

export default class ControllerUtility {
  private static handleForNotfoundStatus(status: number) {
    if (status === 404) {
      return 400;
    }
    return status;
  }

  public static postProcess(ctx: Context, status = 200) {
    ctx.set('apiVersion', API_VERSION);
    ctx.status = status;
  }

  public static deliveryPostProcess(ctx: Context, status = 200) {
    ctx.set('apiVersion', API_VERSION);
    ctx.status = isHttpStatusSuccess(status) ? 200 : this.handleForNotfoundStatus(status);
  }
}
