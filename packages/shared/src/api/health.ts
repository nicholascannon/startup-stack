import type { ApiResponse } from '../api-response.js';

export type HealthReadinessResponse = ApiResponse<
  {
    db: string;
  },
  'HEALTH_READINESS_CHECK_FAILED',
  never
>;

export type HealthLivenessResponse = ApiResponse<{ message: 'ok' }, never>;
