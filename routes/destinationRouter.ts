import Router from "koa-router";
import { DestinationController } from "../controllers/destination.controller";

const router = new Router();

router.post(
  "/:version/destinations/:destination",
  DestinationController.destinationVanillaTransformAtProcessor
);

export const destinationRoutes = router.routes();