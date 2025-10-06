## Techpix Frontend App

This project was scaffolded with `create-techpix-app` using the Techpix base template. It ships with:

- Next.js App Router (15+) and TypeScript
- Tailwind CSS pre-configured
- Shadcn/UI primitives wired up (e.g. button, card, table, etc.)
- Docker-first setup for development and production

## Getting Started (Local)

Run the dev server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open http://localhost:3000 to view the app.

## Project Structure

Key folders:

- `src/app` – App Router pages and routes
- `src/components/ui` – Shadcn/UI components
- `src/lib` – shared utilities
- `docker/development` and `docker/production` – Dockerfiles and compose files

## Docker with Makefile

The included `Makefile` wraps Docker Compose for common tasks.

- Build images

```bash
# Development image
make build-development

# Production image
make build-production
```

- Start containers (detached)

```bash
# Development (uses docker/development/compose.yaml)
make start-development // open localhost:3001

# Production (uses docker/production/compose.yaml)
make start-production // open localhost:3002
```

- Stop containers

```bash
make stop-development
make stop-production
```

Notes:

- Ensure Docker Desktop (or Docker Engine) is running.
- Image/service names include your project name (e.g. `my-app-development`).
- Targets map to `docker compose -f docker/<env>/compose.yaml <command>` so you can customize per environment.
