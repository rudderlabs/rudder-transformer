import Koa from 'koa';
import { bulkUploadRoutes } from './bulkUpload';
import { proxyRoutes } from './delivery';
import { destinationRoutes } from './destination';
import { miscRoutes } from './misc';
import { sourceRoutes } from './source';
import { testEventRoutes } from './testEvents';
import { trackingPlanRoutes } from './trackingPlan';
import { userTransformRoutes } from './userTransform';

export function applicationRoutes(app: Koa<any, {}>) {
  app.use(bulkUploadRoutes);
  app.use(proxyRoutes);
  app.use(destinationRoutes);
  app.use(miscRoutes);
  app.use(sourceRoutes);
  app.use(testEventRoutes);
  app.use(trackingPlanRoutes);
  app.use(userTransformRoutes);
}
