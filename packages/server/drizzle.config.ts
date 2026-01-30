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
    // Bug with drizzle kit ignoring the sslmode parameter.
    // https://github.com/drizzle-team/drizzle-orm/issues/4443
    // biome-ignore lint/style/noNonNullAssertion: database URL is required
    url: `${process.env.DATABASE_URL!}?sslmode=no-verify`,
  },
});
