import Router from "koa-router";
import SourceController from "../controllers/source.controller";

const router = new Router();

router.post("/:version/sources/:source`", SourceController.sourceTransform);

export const proxyRoutes = router.routes();
