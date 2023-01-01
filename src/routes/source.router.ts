import Router from "koa-router";
import SourceController from "../controllers/source";

const router = new Router();

router.post("/:version/sources/:source", SourceController.sourceTransform);

export const sourceRoutes = router.routes();
