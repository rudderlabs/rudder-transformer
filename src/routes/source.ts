import Router from '@koa/router';
import { RouteActivationMiddleware } from '../middlewares/routeActivation';
import { SourceController } from '../controllers/source';

const router = new Router();

router.post(
  '/:version/sources/:source',
  RouteActivationMiddleware.isSourceRouteActive,
  RouteActivationMiddleware.sourceFilter,
  SourceController.sourceTransform,
);

const sourceRoutes = router.routes();
export default sourceRoutes;
