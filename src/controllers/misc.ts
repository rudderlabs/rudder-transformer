import { Context } from 'koa';
import { FeatureFlagUser } from '@rudderstack/integrations-lib';
import { MiscService } from '../services/misc';
import { getFeatureFlagService, TransformerFeatureFlagKeys } from '../featureFlags';

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
    ctx.body = MiscService.getFeatures();
    ctx.status = 200;
    return ctx;
  }

  public static async flagtest(ctx: Context) {
    const user: FeatureFlagUser = {
      workspaceId: "workspace-123"
    };
    const ffService = await getFeatureFlagService()
    const result = await ffService.getFeatureValue(user, TransformerFeatureFlagKeys.ENABLE_TEST_FLAG);
    ctx.body = result;
    ctx.status = 200;
    return ctx;
  }
}
