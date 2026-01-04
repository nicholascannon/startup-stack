import type { HealthRepository } from '../health-repository.js';

export class HealthCheckMemoryRepo implements HealthRepository {
  private isHealthy = true;

  async checkHealth(): Promise<boolean> {
    return this.isHealthy;
  }

  setHealth(isHealthy: boolean): void {
    this.isHealthy = isHealthy;
  }
}
