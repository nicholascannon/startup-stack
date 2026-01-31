import * as z from 'zod';

export const CONFIG = z
  .object({
    env: z.enum(['development', 'production', 'test']),
    release: z.string(),
    port: z.string().transform(Number),
    cors: z.object({
      hosts: z
        .string()
        .optional()
        .transform((val) => val?.split(',').map((s) => s.trim()) ?? [])
        .pipe(z.array(z.string())),
    }),
    rateLimit: z.object({
      // Default to 100 requests per minute per IP
      windowMs: z.number().optional().transform(Number).default(60_000),
      max: z.number().optional().transform(Number).default(100),
    }),
    requestTimeout: z.number().optional().transform(Number).default(30_000),
    sentry: z.object({
      dsn: z.string().optional(),
      environment: z.enum(['local', 'staging', 'production']).optional().default('local'),
      sampleRate: z
        .string()
        .optional()
        .default('1.0')
        .transform((val) => (val ? Number.parseFloat(val) : undefined)),
    }),
    db: z.object({
      url: z.string(),
      certificate: z
        .string()
        .optional()
        .transform((val) => (val ? Buffer.from(val, 'base64').toString('utf-8') : undefined)),
      poolMax: z
        .string()
        .optional()
        .transform((v) => (v ? Number(v) : undefined))
        .pipe(z.number().int().min(1).max(50).optional())
        .default(10),
      poolMin: z
        .string()
        .optional()
        .transform((v) => (v ? Number(v) : undefined))
        .pipe(z.number().int().min(0).max(10).optional())
        .default(2),
    }),
  })
  .parse({
    env: process.env.NODE_ENV,
    release: process.env.RELEASE,
    port: process.env.PORT,
    cors: {
      hosts: process.env.CORS_HOSTS,
    },
    rateLimit: {
      windowMs: process.env.RATE_LIMIT_WINDOW_MS,
      max: process.env.RATE_LIMIT_MAX,
    },
    requestTimeout: process.env.REQUEST_TIMEOUT,
    sentry: {
      dsn: process.env.SENTRY_DSN,
      environment: process.env.SENTRY_ENVIRONMENT,
      sampleRate: process.env.SENTRY_SAMPLE_RATE,
    },
    db: {
      url: process.env.DATABASE_URL,
      certificate: process.env.DATABASE_CERTIFICATE,
      poolMax: process.env.DATABASE_POOL_MAX,
      poolMin: process.env.DATABASE_POOL_MIN,
    },
  });

export type Config = typeof CONFIG;
