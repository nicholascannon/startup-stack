import { Router } from 'express';
import expressRateLimit, { ipKeyGenerator } from 'express-rate-limit';
import type { Config } from '../config/env.js';
import type { Controller } from '../lib/controller.js';
import { zodErrorHandler } from '../middleware/zod-error-handler.js';
import { HealthController } from './health/health-controller.js';
import type { HealthRepository } from './health/health-repository.js';

export type ApiDependencies = {
  healthRepository: HealthRepository;
};

/**
 * API controller that handles the API routes for the application.
 */
export class ApiController implements Controller {
  public readonly router: Router;

  constructor({ healthRepository }: ApiDependencies, rateLimitConfig: Config['rateLimit']) {
    const healthController = new HealthController(healthRepository);

    this.router = Router();

    this.router.use(
      '/v1/health',
      this.rateLimiter({
        ...rateLimitConfig,
        max: rateLimitConfig.max * 3, // 3x the max for health check
      }),
      healthController.router
    );

    this.router.use(this.rateLimiter(rateLimitConfig));

    this.router.use((req, res) => {
      return res.status(404).json({
        message: 'Resource not found',
        path: req.originalUrl,
        method: req.method,
      });
    });

    this.router.use(zodErrorHandler);
  }

  private rateLimiter = ({ windowMs, max }: Config['rateLimit']) =>
    expressRateLimit({
      windowMs,
      max,
      standardHeaders: true,
      legacyHeaders: false,
      keyGenerator: (req) => {
        // Use Cloudflare's real IP if available, fallback to Express's trust proxy handling
        const ip = (req.headers['cf-connecting-ip'] as string) || req.ip || 'unknown';
        return ip === 'unknown' ? ip : ipKeyGenerator(ip);
      },
      message: {
        error: 'Too many requests from this IP, please try again later.',
      },
    });
}
