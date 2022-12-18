import Router from "koa-router";
import TrackingPlanController from "../controllers/trackingPlan.controller";

const router = new Router();

router.post("/v0/validate", TrackingPlanController.validateTrackingPlan);

export const trackingPlanRouter = router.routes();
