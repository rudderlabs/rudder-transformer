import Router from "koa-router";
import { DeliveryController } from "../controllers/delivery.controller";

const router = new Router();

router.post(
  "/:version/destinations/:destination/proxy",
  DeliveryController.deliverToDestination
);

export const proxyRoutes = router.routes();
