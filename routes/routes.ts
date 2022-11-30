import Koa from "koa";
import { destinationRoutes } from "./destinationRouter";

export function addRoutes(app: Koa<any, {}>) {
  app.use(destinationRoutes);
}
