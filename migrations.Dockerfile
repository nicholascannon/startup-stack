FROM node:24.11.0-alpine AS base

WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/server/package.json ./packages/server/
COPY packages/server/drizzle.config.ts ./packages/server/
COPY packages/server/drizzle ./packages/server/drizzle

COPY packages/shared/package.json ./packages/shared/

RUN npm ci --workspace=@startup-stack/server --include-workspace-root

WORKDIR /app/packages/server

CMD ["npm", "run", "db:migrate"]
