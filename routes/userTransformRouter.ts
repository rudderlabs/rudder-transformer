import Router from "koa-router";
import UserTransformController from "../controllers/userTransform.controller";

const router = new Router();

router.post("/customTransform", UserTransformController.userTransform);

export const userTransformRoutes = router.routes();
