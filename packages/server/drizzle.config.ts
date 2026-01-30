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
    // biome-ignore lint/style/noNonNullAssertion: database URL is required
    url: `${process.env.DATABASE_URL!}?sslmode=no-verify`,
  },
});
