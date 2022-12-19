import Koa from "koa";
import { bulkUploadRoutes } from "./bulkUpload.router";
import { proxyRoutes } from "./delivery.router";
import { destinationRoutes } from "./destination.router";
import { miscRoutes } from "./misc.router";
import { sourceRoutes } from "./source.router";
import { testEventRoutes } from "./testEvents.router";
import { trackingPlanRoutes } from "./trackingPlan.router";
import { userTransformRoutes } from "./userTransform.router";


export function applicationRoutes(app: Koa<any, {}>) {
  app.use(bulkUploadRoutes);
  app.use(proxyRoutes)
  app.use(destinationRoutes)
  app.use(miscRoutes)
  app.use(sourceRoutes)
  app.use(testEventRoutes)
  app.use(trackingPlanRoutes)
  app.use(userTransformRoutes)
}