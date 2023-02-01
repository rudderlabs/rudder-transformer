import { Context } from 'koa';
import dotenv from 'dotenv';

dotenv.config();

const transformerMode = process.env.TRANSFORMER_MODE;
const startDestTransformer = transformerMode === 'destination' || !transformerMode;
const startSourceTransformer = transformerMode === 'source' || !transformerMode;
const transformerDelivery = process.env.TRANSFORMER_DELIVERY || true;
const deliveryTestModeEnabled =
  process.env.TRANSFORMER_DELIVERY_TEST_ENABLED?.toLowerCase() === 'true' || false;
const transformerTestModeEnabled = process.env.TRANSFORMER_TEST_MODE
  ? process.env.TRANSFORMER_TEST_MODE.toLowerCase() === 'true'
  : false;
const areFunctionsEnabled = process.env.ENABLE_FUNCTIONS === 'false' ? false : true;

export default class RouteActivationController {
  public static isDestinationRouteActive(ctx: Context, next: any) {
    if (!startDestTransformer) {
      ctx.status = 404;
      ctx.body = 'This route is disabled';
      return ctx;
    } else {
      return next();
    }
  }

  public static isSourceRouteActive(ctx: Context, next: any) {
    if (!startSourceTransformer) {
      ctx.status = 404;
      ctx.body = 'This route is disabled';
      return ctx;
    } else {
      return next();
    }
  }

  public static isDeliveryRouteActive(ctx: Context, next: any) {
    if (!transformerDelivery) {
      ctx.status = 404;
      ctx.body = 'This route is disabled';
      return ctx;
    } else {
      return next();
    }
  }

  public static isDeliveryTestRouteActive(ctx: Context, next: any) {
    if (!deliveryTestModeEnabled) {
      ctx.status = 404;
      ctx.body = 'This route is disabled';
      return ctx;
    } else {
      return next();
    }
  }

  public static isUserTransformRouteActive(ctx: Context, next: any) {
    if (!areFunctionsEnabled) {
      ctx.status = 404;
      ctx.body = 'This route is disabled';
      return ctx;
    } else {
      return next();
    }
  }

  public static isUserTransformTestRouteActive(ctx: Context, next: any) {
    if (!transformerTestModeEnabled) {
      ctx.status = 404;
      ctx.body = 'This route is disabled';
      return ctx;
    } else {
      return next();
    }
  }
}
