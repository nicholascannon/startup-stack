import { beforeEach, vi } from 'vitest';
import type { Config } from '../config/env.js';

beforeEach(() => {
  vi.mock('../lib/logger.js'); // silence logger during tests
});

const testConfig: Config = {
  port: 8000,
  env: 'test',
  cors: {
    hosts: [],
  },
  rateLimit: {
    windowMs: 60_000,
    max: 100,
  },
  requestTimeout: 30_000,
};

vi.mock('../config/env.js', () => ({
  CONFIG: testConfig,
}));
