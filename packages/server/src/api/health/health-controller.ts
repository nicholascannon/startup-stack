import { exampleSchema } from '@startup-stack/shared';
import { type Request, type Response, Router } from 'express';
import type { Controller } from '../../lib/controller.js';
import type { HealthRepository } from './health-repository.js';

export class HealthController implements Controller {
  public readonly router: Router;

  constructor(private readonly healthCheckRepo: HealthRepository) {
    this.router = Router();
    this.router.get('/', this.health);
  }

  private health = async (req: Request, res: Response) => {
    const isHealthy = await this.healthCheckRepo.checkHealth();
    exampleSchema.parse({ id: '1', name: 'test' });

    return res.json({
      success: true,
      data: {
        service: 'up',
        db: isHealthy ? 'ok' : 'error',
      },
      meta: { requestId: req.requestId, timestamp: new Date().toISOString() },
    });
  };
}
