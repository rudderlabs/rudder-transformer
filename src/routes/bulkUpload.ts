import Router from '@koa/router';
import {
  fileUpload,
  pollStatus,
  getFailedJobStatus,
  getWarnJobStatus,
} from '../controllers/bulkUpload';

const router = new Router();

router.post('/fileUpload', fileUpload);
router.post('/pollStatus', pollStatus);
router.post('/getFailedJobs', getFailedJobStatus);
router.post('/getWarningJobs', getWarnJobStatus);
const bulkUploadRoutes = router.routes();

export default bulkUploadRoutes;
