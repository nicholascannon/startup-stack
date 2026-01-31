import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import type { Config } from '../config/env.js';
import { LOGGER } from '../lib/logger.js';

export function createDb(config: Config): {
  db: NodePgDatabase;
  pool: Pool;
} {
  const pool = new Pool({
    application_name: 'startup-stack',
    connectionString: config.db.url,
    max: config.db.poolMax,
    min: config.db.poolMin,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
    allowExitOnIdle: true,
    ssl: config.db.certificate
      ? {
          rejectUnauthorized: true,
          ca: config.db.certificate,
        }
      : undefined,
  });

  pool.on('connect', () => LOGGER.info('Postgres connected'));
  pool.on('error', (err) => LOGGER.error('Postgres pool error', err));

  return { db: drizzle({ client: pool }), pool };
}
