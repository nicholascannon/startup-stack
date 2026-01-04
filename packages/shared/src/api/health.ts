import type { ApiResponse } from '../api-response.js';

export type HealthResponse = ApiResponse<
  {
    service: string;
    db: 'ok' | 'error';
  },
  never
>;
