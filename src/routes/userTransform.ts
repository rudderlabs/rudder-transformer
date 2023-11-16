import Router from '@koa/router';
import { RouteActivationMiddleware } from '../middlewares/routeActivation';
import { FeatureFlagMiddleware } from '../middlewares/featureFlag';
import { UserTransformController } from '../controllers/userTransform';

const router = new Router();

router.post(
  '/customTransform',
  RouteActivationMiddleware.isUserTransformRouteActive,
  FeatureFlagMiddleware.handle,
  UserTransformController.transform,
);
router.post(
  '/transformation/test',
  RouteActivationMiddleware.isUserTransformTestRouteActive,
  UserTransformController.testTransform,
);
router.post(
  '/transformationLibrary/test',
  RouteActivationMiddleware.isUserTransformTestRouteActive,
  UserTransformController.testTransformLibrary,
);
router.post(
  '/transformation/sethandle',
  RouteActivationMiddleware.isUserTransformTestRouteActive,
  UserTransformController.testTransformSethandle,
);
router.post(
  '/extractLibs',
  RouteActivationMiddleware.isUserTransformRouteActive,
  UserTransformController.extractLibhandle,
);

const userTransformRoutes = router.routes();
export default userTransformRoutes;
