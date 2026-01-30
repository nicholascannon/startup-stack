import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

const ca = process.env.DATABASE_CERTIFICATE
  ? Buffer.from(process.env.DATABASE_CERTIFICATE, 'base64').toString('utf-8')
  : undefined;

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  migrations: {
    schema: 'migrations',
  },
  dbCredentials: {
    // biome-ignore lint/style/noNonNullAssertion: database URL is required
    url: process.env.DATABASE_URL!,
    ssl: ca ? { rejectUnauthorized: true, ca } : undefined,
  },
});
