import Router from '@koa/router';
import RouteActivationController from '../middlewares/routeActivation';
import UserTransformController from '../controllers/userTransform';

const router = new Router();

router.post(
  '/customTransform',
  RouteActivationController.isUserTransformRouteActive,
  UserTransformController.transform,
);
router.post(
  '/transformation/test',
  RouteActivationController.isUserTransformTestRouteActive,
  UserTransformController.testTransform,
);
router.post(
  '/transformationLibrary/test',
  RouteActivationController.isUserTransformTestRouteActive,
  UserTransformController.testTransformLibrary,
);
router.post(
  '/transformation/sethandle',
  RouteActivationController.isUserTransformTestRouteActive,
  UserTransformController.testTransformSethandle,
);
router.post(
  '/extractLibs',
  RouteActivationController.isUserTransformRouteActive,
  UserTransformController.extractLibhandle,
);

const userTransformRoutes = router.routes();
export default userTransformRoutes;