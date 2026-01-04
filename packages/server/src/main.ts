import 'dotenv/config';
import { HealthCheckMemoryRepo } from './api/health/repositories/health-check-memory-repo.js';
import { createApp } from './app.js';
import { CONFIG } from './config/env.js';
import { lifecycle } from './lib/lifecycle.js';
import { LOGGER, setupProcessLogging } from './lib/logger.js';

setupProcessLogging();

LOGGER.info('CONFIG', {
  config: {
    env: CONFIG.env,
    port: CONFIG.port,
    cors: CONFIG.cors,
    requestTimeout: CONFIG.requestTimeout,
  },
});

const app = createApp({
  apiDependencies: {
    healthRepository: new HealthCheckMemoryRepo(), // TODO: Use a real repository when DB setup
  },
}).listen(CONFIG.port, () => {
  LOGGER.info('Server started', { port: CONFIG.port });

  lifecycle.on('close', () =>
    app.close(() => {
      LOGGER.info('Server closed');
    })
  );
});
