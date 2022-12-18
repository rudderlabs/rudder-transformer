import Router from "koa-router";
import MetricsController from "../controllers/metrics.controller";
import ProfileController from "../controllers/profile.controller";
import UtilityController from "../controllers/utility.controller";

const router = new Router();

router.post("/heapdump", ProfileController.profile);
router.get("/metrics", MetricsController.exportMetric);
router.get("/health", UtilityController.healthStats);
router.get("/transformerBuildVersion", UtilityController.buildVersion);
router.get("/version", UtilityController.version);
router.get("/features", UtilityController.features);

export const utilityRoutes = router.routes();
