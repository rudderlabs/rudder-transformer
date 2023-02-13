import { Context, Next } from 'koa';
import dotenv from 'dotenv';
import { ProcessorTransformationRequest, RouterTransformationRequest } from '../types';

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
const destinationFilterList = process.env.DESTINATION_FILTER_LIST?.toLocaleLowerCase();
const sourceFilteList = process.env.SOURCE_FILTER_LIST?.toLocaleLowerCase();
const deliveryFilterList = process.env.DESTINATION_DELIVERY_FILTER_LIST?.toLocaleLowerCase();

export default class RouteActivationController {
  private static executeActivationRule(ctx: Context, next: Next, condition: boolean) {
    if (condition) {
      ctx.status = 404;
      ctx.body = 'RouteActivationController route is disabled';
      return ctx;
    } else {
      return next();
    }
  }
  public static isDestinationRouteActive(ctx: Context, next: Next) {
    return RouteActivationController.executeActivationRule(ctx, next, !startDestTransformer);
  }

  public static isSourceRouteActive(ctx: Context, next: Next) {
    return RouteActivationController.executeActivationRule(ctx, next, !startSourceTransformer);
  }

  public static isDeliveryRouteActive(ctx: Context, next: Next) {
    return RouteActivationController.executeActivationRule(ctx, next, !transformerDelivery);
  }

  public static isDeliveryTestRouteActive(ctx: Context, next: Next) {
    return RouteActivationController.executeActivationRule(ctx, next, !deliveryTestModeEnabled);
  }

  public static isUserTransformRouteActive(ctx: Context, next: Next) {
    return RouteActivationController.executeActivationRule(ctx, next, !areFunctionsEnabled);
  }

  public static isUserTransformTestRouteActive(ctx: Context, next: Next) {
    return RouteActivationController.executeActivationRule(ctx, next, !transformerTestModeEnabled);
  }

  public static destinationProcFilter(ctx: Context, next: Next) {
    const { destination }: { destination: string } = ctx.params;
    return RouteActivationController.executeActivationRule(
      ctx,
      next,
      Array.isArray(destinationFilterList) &&
        !destinationFilterList.split(',').includes(destination.toLowerCase()),
    );
  }

  public static destinationRtFilter(ctx: Context, next: Next) {
    const routerRequest = ctx.request.body as RouterTransformationRequest;
    const destination = routerRequest.destType;
    return RouteActivationController.executeActivationRule(
      ctx,
      next,
      Array.isArray(destinationFilterList) &&
        !destinationFilterList.split(',').includes(destination.toLowerCase()),
    );
  }

  public static destinationBatchFilter(ctx: Context, next: Next) {
    const routerRequest = ctx.request.body as RouterTransformationRequest;
    const destination = routerRequest.destType;
    return RouteActivationController.executeActivationRule(
      ctx,
      next,
      Array.isArray(destinationFilterList) &&
        !destinationFilterList.split(',').includes(destination.toLowerCase()),
    );
  }

  public static sourceFilter(ctx: Context, next: Next) {
    const { source }: { source: string } = ctx.params;
    return RouteActivationController.executeActivationRule(
      ctx,
      next,
      Array.isArray(sourceFilteList) && !sourceFilteList.split(',').includes(source.toLowerCase()),
    );
  }

  public static destinationDeliveryFilter(ctx: Context, next: Next) {
    const { destination }: { destination: string } = ctx.params;
    return RouteActivationController.executeActivationRule(
      ctx,
      next,
      Array.isArray(deliveryFilterList) &&
        !deliveryFilterList.split(',').includes(destination.toLowerCase()),
    );
  }
}
