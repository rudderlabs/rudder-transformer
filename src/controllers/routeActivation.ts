import { Context } from 'koa';
import dotenv from 'dotenv';
import { ProcessorTransformRequest, RouterTransformRequest } from '../types';

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

  public static destinationProcFilter(ctx: Context, next: any) {
    const { destination }: { destination: string } = ctx.params;
    if (
      Array.isArray(destinationFilterList) &&
      !destinationFilterList.split(',').includes(destination.toLowerCase())
    ) {
      ctx.status = 401;
      ctx.body = `This route is disabled for destination: ${destination}`;
      return ctx;
    }
    return next();
  }

  public static destinationRtFilter(ctx: Context, next: any) {
    const routerRequest = ctx.request.body as RouterTransformRequest;
    const destination = routerRequest.destType;
    if (
      Array.isArray(destinationFilterList) &&
      !destinationFilterList.split(',').includes(destination.toLowerCase())
    ) {
      ctx.status = 401;
      ctx.body = `This route is disabled for destination: ${destination}`;
      return ctx;
    }
    return next();
  }

  public static destinationBatchFilter(ctx: Context, next: any) {
    const routerRequest = ctx.request.body as RouterTransformRequest;
    const destination = routerRequest.destType;
    if (
      Array.isArray(destinationFilterList) &&
      !destinationFilterList.split(',').includes(destination.toLowerCase())
    ) {
      ctx.status = 401;
      ctx.body = `This route is disabled for destination: ${destination}`;
      return ctx;
    }
    return next();
  }

  public static sourceFilter(ctx: Context, next: any) {
    const { source }: { source: string } = ctx.params;
    if (
      Array.isArray(sourceFilteList) &&
      !sourceFilteList.split(',').includes(source.toLowerCase())
    ) {
      ctx.status = 401;
      ctx.body = `This route is disabled for source: ${source}`;
      return ctx;
    }
    return next();
  }

  public static destinationDeliveryFilter(ctx: Context, next: any) {
    const { destination }: { destination: string } = ctx.params;
    if (
      Array.isArray(deliveryFilterList) &&
      !deliveryFilterList.split(',').includes(destination.toLowerCase())
    ) {
      ctx.status = 401;
      ctx.body = `This route is disabled for source: ${destination}`;
      return ctx;
    }
    return next();
  }
}
