import 'dotenv/config';
import { Context, Next } from 'koa';

const ACTIVE_SOURCE_ROUTE_VERSIONS = ['v2'];
const transformerMode = process.env.TRANSFORMER_MODE;
const startDestTransformer = transformerMode === 'destination' || !transformerMode;
const startSourceTransformer = transformerMode === 'source' || !transformerMode;
const transformerDelivery = process.env.TRANSFORMER_DELIVERY || true;
const deliveryTestModeEnabled =
  process.env.TRANSFORMER_DELIVERY_TEST_ENABLED?.toLowerCase() === 'true' || false;
const transformerTestModeEnabled = process.env.TRANSFORMER_TEST_MODE
  ? process.env.TRANSFORMER_TEST_MODE.toLowerCase() === 'true'
  : false;
const areFunctionsEnabled = process.env.ENABLE_FUNCTIONS !== 'false';

export class RouteActivationMiddleware {
  private static executeActivationRule(ctx: Context, next: Next, shouldActivate: boolean) {
    if (shouldActivate) {
      return next();
    }
    ctx.status = 404;
    ctx.body = 'RouteActivationMiddleware route is disabled';
    return ctx;
  }

  public static isDestinationRouteActive(ctx: Context, next: Next) {
    return RouteActivationMiddleware.executeActivationRule(ctx, next, startDestTransformer);
  }

  public static isSourceRouteActive(ctx: Context, next: Next) {
    return RouteActivationMiddleware.executeActivationRule(ctx, next, startSourceTransformer);
  }

  public static isSourceRouteVersionActive(ctx: Context, next: Next) {
    const { version }: { version: string } = ctx.params;
    return RouteActivationMiddleware.executeActivationRule(
      ctx,
      next,
      ACTIVE_SOURCE_ROUTE_VERSIONS.includes(version),
    );
  }

  public static isDeliveryRouteActive(ctx: Context, next: Next) {
    return RouteActivationMiddleware.executeActivationRule(ctx, next, !!transformerDelivery);
  }

  public static isDeliveryTestRouteActive(ctx: Context, next: Next) {
    return RouteActivationMiddleware.executeActivationRule(ctx, next, deliveryTestModeEnabled);
  }

  public static isUserTransformRouteActive(ctx: Context, next: Next) {
    return RouteActivationMiddleware.executeActivationRule(ctx, next, areFunctionsEnabled);
  }

  public static isUserTransformTestRouteActive(ctx: Context, next: Next) {
    return RouteActivationMiddleware.executeActivationRule(ctx, next, transformerTestModeEnabled);
  }
}
