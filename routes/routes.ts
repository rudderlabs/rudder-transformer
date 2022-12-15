import Koa from "koa";
import { proxyRoutes } from "./deliveryRouter";
import { destinationRoutes } from "./destinationRouter";
import { sourceRoutes } from "./sourceRouter";
import { userTransformRoutes } from "./userTransformRouter";

export function addRoutes(app: Koa<any, {}>) {
  app.use(destinationRoutes);
  app.use(proxyRoutes)
  app.use(sourceRoutes)
  app.use(userTransformRoutes)
}
