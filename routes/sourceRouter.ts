import Router from "koa-router";
import { DeliveryController } from "../controllers/delivery.controller";

const router = new Router();

router.post(
  "/:version/sources/:source`",
);

export const proxyRoutes = router.routes();
