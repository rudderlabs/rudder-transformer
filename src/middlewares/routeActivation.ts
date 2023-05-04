import { Context, Next } from 'koa';
import dotenv from 'dotenv';
import { RouterTransformationRequest } from '../types';

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
const areFunctionsEnabled = process.env.ENABLE_FUNCTIONS !== 'false';
const destinationFilterList = process.env.DESTINATION_FILTER_LIST?.toLocaleLowerCase();
const sourceFilteList = process.env.SOURCE_FILTER_LIST?.toLocaleLowerCase();
const deliveryFilterList = process.env.DESTINATION_DELIVERY_FILTER_LIST?.toLocaleLowerCase();

export default class RouteActivationMiddleware {
  private static executeActivationRule(ctx: Context, next: Next, shouldActivate: boolean) {
    if (shouldActivate) {
      return next();
    } 
      ctx.status = 404;
      ctx.body = 'RouteActivationMiddleware route is disabled';
      return ctx;
    
  }

  private static shouldActivateRoute(integration: string, filterList: string | undefined) {
    if (!filterList) {
      return true;
    }
    return filterList ? !!filterList?.split(',').includes(integration.toLowerCase()) : true;
  }

  public static isDestinationRouteActive(ctx: Context, next: Next) {
    return RouteActivationMiddleware.executeActivationRule(ctx, next, startDestTransformer);
  }

  public static isSourceRouteActive(ctx: Context, next: Next) {
    return RouteActivationMiddleware.executeActivationRule(ctx, next, startSourceTransformer);
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

  public static destinationProcFilter(ctx: Context, next: Next) {
    const { destination }: { destination: string } = ctx.params;
    return RouteActivationMiddleware.executeActivationRule(
      ctx,
      next,
      RouteActivationMiddleware.shouldActivateRoute(destination, destinationFilterList),
    );
  }

  public static destinationRtFilter(ctx: Context, next: Next) {
    const routerRequest = ctx.request.body as RouterTransformationRequest;
    const destination = routerRequest.destType;
    return RouteActivationMiddleware.executeActivationRule(
      ctx,
      next,
      RouteActivationMiddleware.shouldActivateRoute(destination, destinationFilterList),
    );
  }

  public static destinationBatchFilter(ctx: Context, next: Next) {
    const routerRequest = ctx.request.body as RouterTransformationRequest;
    const destination = routerRequest.destType;
    return RouteActivationMiddleware.executeActivationRule(
      ctx,
      next,
      RouteActivationMiddleware.shouldActivateRoute(destination, destinationFilterList),
    );
  }

  public static sourceFilter(ctx: Context, next: Next) {
    const { source }: { source: string } = ctx.params;
    return RouteActivationMiddleware.executeActivationRule(
      ctx,
      next,
      RouteActivationMiddleware.shouldActivateRoute(source, sourceFilteList),
    );
  }

  public static destinationDeliveryFilter(ctx: Context, next: Next) {
    const { destination }: { destination: string } = ctx.params;
    return RouteActivationMiddleware.executeActivationRule(
      ctx,
      next,
      RouteActivationMiddleware.shouldActivateRoute(destination, deliveryFilterList),
    );
  }
}
