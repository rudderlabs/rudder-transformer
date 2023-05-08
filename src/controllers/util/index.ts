import { Context } from 'koa';
import { API_VERSION } from '../../routes/utils/constants';
import { isHttpStatusSuccess } from '../../v0/util';
import { HttpStatus } from '../../v0/util/constant';

export default class ControllerUtility {
  private static handleForNotfoundStatus(status: number) {
    if (status === HttpStatus.NOT_FOUND) {
      return HttpStatus.BAD_REQUEST;
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
