import Koa from "koa";
import { proxyRoutes } from "./deliveryRouter";
import { destinationRoutes } from "./destinationRouter";

export function addRoutes(app: Koa<any, {}>) {
  app.use(destinationRoutes);
  app.use(proxyRoutes)
}
