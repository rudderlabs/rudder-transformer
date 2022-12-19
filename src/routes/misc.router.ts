import Router from "koa-router";
import MetricsController from "../controllers/metrics.controller";
import ProfileController from "../controllers/profile.controller";
import MiscController from "../controllers/misc.controller";

const router = new Router();

router.post("/heapdump", ProfileController.profile);
router.get("/metrics", MetricsController.exportMetric);
router.get("/health", MiscController.healthStats);
router.get("/transformerBuildVersion", MiscController.buildVersion); // depriciating
router.get("/buildVersion", MiscController.buildVersion);
router.get("/version", MiscController.version);
router.get("/features", MiscController.features);

export const miscRoutes = router.routes();
