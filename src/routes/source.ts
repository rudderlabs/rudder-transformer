import Router from '@koa/router';
import { RouteActivationMiddleware } from '../middlewares/routeActivation';
import { SourceController } from '../controllers/source';

const router = new Router();

router.post(
  '/:version/sources/:source',
  RouteActivationMiddleware.isSourceRouteVersionActive,
  RouteActivationMiddleware.isSourceRouteActive,
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
