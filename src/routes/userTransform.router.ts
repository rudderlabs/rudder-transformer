import Router from "koa-router";
import UserTransformController from "../controllers/userTransform.controller";

const router = new Router();

router.post("/customTransform", UserTransformController.userTransform);
router.post("/transformation/test", UserTransformController.testUserTransform);
router.post(
  "/transformationLibrary/test",
  UserTransformController.testUserTransformLibrary
);
router.post(
  "/transformation/sethandle",
  UserTransformController.testUsertransformSethandle
);

export const userTransformRoutes = router.routes();
