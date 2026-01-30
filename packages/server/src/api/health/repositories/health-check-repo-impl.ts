import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { LOGGER } from '../../../lib/logger.js';
import type { HealthCheckResult, HealthRepository } from '../health-repository.js';

export class HealthCheckRepoImpl implements HealthRepository {
  constructor(private readonly db: NodePgDatabase) {}

  async checkHealth(): Promise<HealthCheckResult> {
    const dbResult = await this.checkDbHealth();

    return {
      isHealthy: dbResult === 'ok',
      db: dbResult,
    };
  }

  private async checkDbHealth(): Promise<'ok' | 'error'> {
    try {
      await this.db.execute('SELECT 1');
      return 'ok';
    } catch (error) {
      LOGGER.error('DB Health Check Failed', { error });
      return 'error';
    }
  }
}
