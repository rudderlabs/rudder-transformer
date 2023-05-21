import { Context } from 'koa';
import { API_VERSION } from '../../routes/utils/constants';
import { getCompatibleStatusCode } from '../../adapters/utils/networkUtils';

export default class ControllerUtility {
  private static getCompatibleStatusCode(status: number): number {
    return getCompatibleStatusCode(status)
  }

  public static postProcess(ctx: Context, status = 200) {
    ctx.set('apiVersion', API_VERSION);
    ctx.status = status;
  }

  public static deliveryPostProcess(ctx: Context, status = 200) {
    ctx.set('apiVersion', API_VERSION);
    ctx.status = this.getCompatibleStatusCode(status);
  }
}
