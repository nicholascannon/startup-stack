import { join } from 'node:path';
import type { Application } from 'express';
import express from 'express';
import helmet from 'helmet';
import { ApiController, type ApiDependencies } from './api/api-controller.js';
import { CONFIG } from './config/env.js';
import { serveFrontend } from './lib/frontend.js';
import { loggingMiddleware } from './lib/logger.js';
import { genericErrorHandler } from './middleware/generic-error-handler.js';
import { requestIdMiddleware } from './middleware/request-id.js';
import { requestTimeoutMiddleware } from './middleware/request-timeout.js';

export function createApp({
  enableLogging = true,
  apiDependencies,
}: {
  enableLogging?: boolean;
  apiDependencies: ApiDependencies;
}): Application {
  const app = express();

  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(requestIdMiddleware);
  if (CONFIG.requestTimeout > 0) {
    app.use(requestTimeoutMiddleware(CONFIG.requestTimeout));
  }
  if (enableLogging) {
    app.use(loggingMiddleware);
  }

  const api = new ApiController(apiDependencies, CONFIG);
  app.use('/api', api.router);

  if (CONFIG.env === 'production') {
    const frontendDist = join(import.meta.dirname, '../../frontend/dist');
    serveFrontend(app, frontendDist);
  }

  app.use(genericErrorHandler);

  return app;
}
