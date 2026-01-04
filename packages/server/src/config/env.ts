import * as z from 'zod';

export const CONFIG = z
  .object({
    env: z.enum(['development', 'production', 'test']),
    port: z.string().transform(Number),
    cors: z.object({
      hosts: z
        .string()
        .transform((val) => val.split(',').map((s) => s.trim()))
        .pipe(z.array(z.string())),
    }),
    rateLimit: z.object({
      // Default to 100 requests per minute per IP
      windowMs: z.number().optional().transform(Number).default(60_000),
      max: z.number().optional().transform(Number).default(100),
    }),
    requestTimeout: z.number().optional().transform(Number).default(30_000),
  })
  .parse({
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    cors: {
      hosts: process.env.CORS_HOSTS,
    },
    rateLimit: {
      windowMs: process.env.RATE_LIMIT_WINDOW_MS,
      max: process.env.RATE_LIMIT_MAX,
    },
    requestTimeout: process.env.REQUEST_TIMEOUT,
  });

export type Config = typeof CONFIG;
