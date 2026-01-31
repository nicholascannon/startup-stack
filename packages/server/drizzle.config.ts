/** biome-ignore-all lint/style/noNonNullAssertion: database URL is required */
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  migrations: {
    schema: 'migrations',
  },
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  strict: true,
});
