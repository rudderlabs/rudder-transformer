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
  private static async executeActivationRule(ctx: Context, next: Next, condition: boolean) {
    if (condition) {
      ctx.status = 404;
      ctx.body = 'This route is disabled';
      return ctx;
    } else {
      return await next();
    }
  }
  public static async isDestinationRouteActive(ctx: Context, next: Next) {
    return await this.executeActivationRule(ctx, next, !startDestTransformer);
  }

  public static async isSourceRouteActive(ctx: Context, next: Next) {
    return await this.executeActivationRule(ctx, next, !startSourceTransformer);
  }

  public static async isDeliveryRouteActive(ctx: Context, next: Next) {
    return await this.executeActivationRule(ctx, next, !transformerDelivery);
  }

  public static async isDeliveryTestRouteActive(ctx: Context, next: Next) {
    return await this.executeActivationRule(ctx, next, !deliveryTestModeEnabled);
  }

  public static async isUserTransformRouteActive(ctx: Context, next: Next) {
    return await this.executeActivationRule(ctx, next, !areFunctionsEnabled);
  }

  public static async isUserTransformTestRouteActive(ctx: Context, next: Next) {
    return await this.executeActivationRule(ctx, next, !transformerTestModeEnabled);
  }

  public static async destinationProcFilter(ctx: Context, next: Next) {
    const { destination }: { destination: string } = ctx.params;
    return await this.executeActivationRule(
      ctx,
      next,
      Array.isArray(destinationFilterList) &&
        !destinationFilterList.split(',').includes(destination.toLowerCase()),
    );
  }

  public static async destinationRtFilter(ctx: Context, next: Next) {
    const routerRequest = ctx.request.body as RouterTransformationRequest;
    const destination = routerRequest.destType;
    return await this.executeActivationRule(
      ctx,
      next,
      Array.isArray(destinationFilterList) &&
        !destinationFilterList.split(',').includes(destination.toLowerCase()),
    );
  }

  public static async destinationBatchFilter(ctx: Context, next: Next) {
    const routerRequest = ctx.request.body as RouterTransformationRequest;
    const destination = routerRequest.destType;
    return await this.executeActivationRule(
      ctx,
      next,
      Array.isArray(destinationFilterList) &&
        !destinationFilterList.split(',').includes(destination.toLowerCase()),
    );
  }

  public static async sourceFilter(ctx: Context, next: Next) {
    const { source }: { source: string } = ctx.params;
    return await this.executeActivationRule(
      ctx,
      next,
      Array.isArray(sourceFilteList) && !sourceFilteList.split(',').includes(source.toLowerCase()),
    );
  }

  public static async destinationDeliveryFilter(ctx: Context, next: Next) {
    const { destination }: { destination: string } = ctx.params;
    return await this.executeActivationRule(
      ctx,
      next,
      Array.isArray(deliveryFilterList) &&
        !deliveryFilterList.split(',').includes(destination.toLowerCase()),
    );
  }
}
