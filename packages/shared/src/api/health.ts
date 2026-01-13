import type { ApiResponse } from './api-response.js';

export type HealthReadinessResponse = ApiResponse<
  {
    version: string;
    db: string;
  },
  'HEALTH_READINESS_CHECK_FAILED',
  never
>;

export type HealthLivenessResponse = ApiResponse<{ version: string; message: 'ok' }, never>;
