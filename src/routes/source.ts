import Router from '@koa/router';
import RouteActivationController from '../middlewares/routeActivation';
import SourceController from '../controllers/source';

const router = new Router();

router.post(
  '/:version/sources/:source',
  RouteActivationController.isSourceRouteActive,
  RouteActivationController.sourceFilter,
  SourceController.sourceTransform,
);

export const sourceRoutes = router.routes();
