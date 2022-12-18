import Router from "koa-router";
import {
  fileUpload,
  pollStatus,
  getFailedJobStatus,
  getWarnJobStatus
} from "../controllers/bulkUpload.controller";

const router = new Router();

router.post("/fileUpload", fileUpload);
router.post("/pollStatus", pollStatus);
router.post("/getFailedJobs", getFailedJobStatus);
router.post("/getWarningJobs", getWarnJobStatus);
export const sourceRoutes = router.routes();
