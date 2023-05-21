import Koa from 'koa';
import Router from '@koa/router';
import { existsSync, readFileSync } from 'fs';
import dotenv from 'dotenv';
import { koaSwagger } from 'koa2-swagger-ui';
import { bulkUploadRoutes } from './bulkUpload';
import { proxyRoutes } from './delivery';
import { destinationRoutes } from './destination';
import { miscRoutes } from './misc';
import { sourceRoutes } from './source';
import { testEventRoutes } from './testEvents';
import { trackingPlanRoutes } from './trackingPlan';
import { userTransformRoutes } from './userTransform';
import logger from '../logger';

dotenv.config();

const enableSwagger = process.env.ENABLE_SWAGGER === 'true';

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
  // Ading swagger routes, check swagger docs in http://localhost:5050/docs
  if (enableSwagger) {
    const router = new Router();
    if (existsSync('./dist/src/swagger.json')) {
      let rawContent: string | undefined;
      try {
        rawContent = readFileSync('./dist/src/swagger.json', { encoding: 'utf8' });
      } catch (err) {
        logger.error('Error reading swagger file', err);
      }

      if (rawContent) {
        const spec = JSON.parse(rawContent);
        logger.info('Transformer backend: Swagger route loading');
        router.get(
          '/docs',
          koaSwagger({ routePrefix: false, swaggerOptions: { spec, deepLinking: true } }),
        );
        logger.info('Transformer backend: Swagger route loaded');
        app.use(router.routes());
      }
    } else {
      logger.error('Swagger file does not exist!');
    }
  }
}
