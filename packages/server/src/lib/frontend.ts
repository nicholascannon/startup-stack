import { join } from 'node:path';
import express, { type Application } from 'express';
import { LOGGER } from './logger.js';

/**
 * Serves the frontend application.
 */
export function serveFrontend(app: Application, bundlePath: string) {
  LOGGER.info('Serving frontend bundle', { bundlePath });

  app.use(express.static(bundlePath));

  app.get('*', (req, res, next) => {
    // Return 404 for any file request (static middleware will handle it)
    if (req.path.includes('.')) {
      return res.status(404).json({
        message: 'Resource not found',
        path: req.originalUrl,
        method: req.method,
      });
    }

    return res.sendFile(join(bundlePath, 'index.html'), (error) => {
      if (error) {
        LOGGER.error('Error sending frontend index.html', { error });
        if (!res.headersSent) {
          next(error);
        }
      }
    });
  });
}
