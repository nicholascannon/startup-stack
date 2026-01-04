# Startup Stack

A full-stack TypeScript monorepo with React frontend and Express backend.

## Structure

```
startup-stack/
├── packages/
│   ├── frontend/     # React + Vite application
│   ├── server/       # Express API server
│   └── shared/       # Shared types and schemas (Zod)
├── docker-compose.yml
├── Dockerfile
├── run.sh            # Docker startup script
└── stop.sh           # Docker shutdown script
```

## Prerequisites

- Node.js >= 24.11.0
- npm
- Docker & Docker Compose (for containerized deployment)

## Development

Install dependencies:

```bash
npm install
```

Run both frontend and server in development mode:

```bash
npm run dev
```

This starts:
- **Server**: `http://localhost:8000` (Express API)
- **Frontend**: `http://localhost:5173` (Vite dev server)

### Other Commands

```bash
# Build all packages
npm run build

# Run tests
npm run test

# Type checking
npm run typecheck

# Linting
npm run lint
npm run lint:fix
```

## Docker

Build and run with Docker Compose:

```bash
./run.sh
# or
docker compose up --build
```

Stop containers:

```bash
./stop.sh
# or
docker compose down
```

The Docker build:
1. Installs dependencies
2. Builds all packages
3. Runs tests
4. Serves the production build on port 3000

## Server Configuration

The server can be configured via environment variables:

```bash
# Environment (development | production | test)
NODE_ENV=development

# Server port (default: 8000)
PORT=8000

# CORS allowed hosts (comma-separated)
CORS_HOSTS=http://localhost:5173,http://localhost:3000

# Rate limiting (optional)
RATE_LIMIT_WINDOW_MS=60000    # Time window in ms (default: 60000)
RATE_LIMIT_MAX=100            # Max requests per window (default: 100)

# Request timeout in ms (default: 30000)
REQUEST_TIMEOUT=30000
```

Create a `.env` file in the root directory or set these variables in your environment.

## Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Vitest
- **Backend**: Express, TypeScript, Winston (logging), Helmet, CORS
- **Shared**: Zod for schema validation
- **Tooling**: Biome (linting/formatting), npm workspaces

