import Router from "koa-router";
import DeliveryController from "../controllers/delivery";

const router = new Router();

router.post(
  "/:version/destinations/:destination/proxy",
  DeliveryController.deliverToDestination
);

router.post(
  "/:version/destinations/:destination/proxyTest",
  DeliveryController.testDestinationDelivery
);

export const proxyRoutes = router.routes();
