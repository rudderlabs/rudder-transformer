import Router from "koa-router";
import DestinationController from "../controllers/destination";
import RegulationController from "../controllers/regulation";

const router = new Router();

router.post(
  "/:version/destinations/:destination",
  DestinationController.destinationTransformAtProcessor
);
router.post(
  "/routerTransform",
  DestinationController.destinationTransformAtRouter
);
router.post("/batch", DestinationController.batchProcess);

router.post("/deleteUsers", RegulationController.handleUserDeletion);

export const destinationRoutes = router.routes();
