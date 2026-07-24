import Router from '@koa/router';
import { RouteActivationMiddleware } from '../middlewares/routeActivation';
import { SourceController } from '../controllers/source';
import { responseSchemaValidationMiddleware } from '../middlewares/responseSchemaValidation';
import { SourceTransformationResponseListSchema } from '../types/zodTypes';

const router = new Router();

const validateSourceTransformResponse = responseSchemaValidationMiddleware({
  endpoint: 'source transform',
  schema: SourceTransformationResponseListSchema,
});

router.post(
  '/:version/sources/:source',
  RouteActivationMiddleware.isSourceRouteVersionActive,
  RouteActivationMiddleware.isSourceRouteActive,
  validateSourceTransformResponse,
  SourceController.sourceTransform,
);

router.post(
  '/:version/sources/:source/hydrate',
  RouteActivationMiddleware.isSourceRouteVersionActive,
  RouteActivationMiddleware.isSourceRouteActive,
  SourceController.sourceHydrate,
);

const sourceRoutes = router.routes();
export default sourceRoutes;
