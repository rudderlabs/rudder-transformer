import Router from "koa-router";
import UserTransformController from "../controllers/userTransform";

const router = new Router();

router.post("/customTransform", UserTransformController.transform);
router.post("/transformation/test", UserTransformController.testTransform);
router.post(
  "/transformationLibrary/test",
  UserTransformController.testTransformLibrary
);
router.post(
  "/transformation/sethandle",
  UserTransformController.testTransformSethandle
);

export const userTransformRoutes = router.routes();
