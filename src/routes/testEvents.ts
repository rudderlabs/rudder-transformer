import Router from '@koa/router';
import { EventTestController } from '../controllers/eventTest';
import { DestinationValidationMiddleware } from '../middlewares/destinationValidation';

const router = new Router({ prefix: '/test-router' });

router.post('/custom_audience/parse-template', EventTestController.parseCustomAudienceTemplate);
router.post(
  '/:version/:destination/batch',
  DestinationValidationMiddleware.pathParam,
  EventTestController.testEventV2,
);
router.post(
  '/:version/:destination',
  DestinationValidationMiddleware.pathParam,
  EventTestController.testEvent,
);
router.get('/:version/health', EventTestController.status);

const testEventRoutes = router.routes();
export default testEventRoutes;
