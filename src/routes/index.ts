import Koa from 'koa';
import Router from '@koa/router';
import { existsSync, readFileSync } from 'fs';
import dotenv from 'dotenv';
import { koaSwagger } from 'koa2-swagger-ui';
import path from 'path';
import { bulkUploadRoutes } from './bulkUpload';
import { proxyRoutes } from './delivery';
import { destinationRoutes } from './destination';
import { miscRoutes } from './misc';
import { sourceRoutes } from './source';
import { testEventRoutes } from './testEvents';
import { trackingPlanRoutes } from './trackingPlan';
import { userTransformRoutes } from './userTransform';
import logger from '../logger';
import { isNotEmpty } from '../v0/util';

dotenv.config();

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

export function addSwaggerRoutes(app: Koa<any, {}>) {
  // Ading swagger routes, check swagger docs in http://localhost:9090/docs

  try {
    const router = new Router();
    const swaggerConfigPath = path.resolve(__dirname, '../../swagger.json');
    if (existsSync(swaggerConfigPath)) {
      const rawContent = readFileSync(swaggerConfigPath, {
        encoding: 'utf8',
      });
      if (isNotEmpty(rawContent)) {
        const spec = JSON.parse(rawContent);
        logger.info('Transformer: Swagger route loading');
        router.get(
          '/docs',
          koaSwagger({ routePrefix: false, swaggerOptions: { spec, deepLinking: true } }),
        );
        logger.info('Transformer: Swagger route loaded');
        app.use(router.routes());
      }
    } else {
      logger.error('Swagger file does not exist!');
    }
  } catch (err) {
    logger.error('Error while loading swagger file', err);
  }
}
