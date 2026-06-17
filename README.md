# Voyage Fleet

A full-stack fleet management application for recording and analysing vehicle trips.

**Stack:** NestJS · PostgreSQL · Prisma · React · Ant Design · TypeScript · Vite

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [Backend](#backend)
- [Frontend](#frontend)
- [API Documentation](#api-documentation)
- [Tests](#tests)
- [Useful Commands](#useful-commands)

---

## Prerequisites

Make sure the following are installed before you begin:

| Tool | Minimum Version | Notes |
|------|----------------|-------|
| Node.js | 20+ | [nodejs.org](https://nodejs.org) |
| npm | 10+ | Comes with Node.js |
| Docker | 24+ | [docker.com](https://www.docker.com) |
| Docker Compose | v2 | Bundled with Docker Desktop |

Verify your setup:

```bash
node --version
npm --version
docker --version
docker compose version
```

---

## Project Structure

```
voyage/
├── server/                   # NestJS REST API
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   ├── seed.ts           # Sample data seed script
│   │   └── migrations/       # Prisma migration history
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   ├── common/           # Shared interceptors and pipes
│   │   ├── prisma/           # PrismaModule + PrismaService
│   │   ├── vehicles/         # Vehicles feature (controller, service, DTOs, tests)
│   │   ├── trips/            # Trips feature (controller, service, DTOs, tests)
│   │   └── tests/            # Shared test constants and mocks
│   ├── docker-compose.yml    # PostgreSQL container
│   ├── .env.example          # Environment variable template
│   └── package.json
└── client/                   # React + Vite SPA
    ├── src/
    │   ├── main.tsx
    │   ├── App.tsx
    │   ├── api/
    │   │   ├── openapi.json  # Committed OpenAPI spec (source of truth)
    │   │   └── generated/    # Auto-generated typed API client — never edit by hand
    │   └── features/
    │       ├── trips/        # Trips page, table, filters, create modal
    │       └── vehiclePage/  # Vehicles page, grid, drawer, create modal
    ├── vite.config.ts
    └── package.json
```

---

## Quick Start

Follow these steps in order to get the full application running from scratch.

### 1. Clone and install dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Set up environment variables

```bash
cd server
cp .env.example .env
```

The defaults in `.env.example` work out of the box with the provided `docker-compose.yml`. See [Environment Variables](#environment-variables) for details on each key.

### 3. Start the database

```bash
cd server
docker compose up -d
```

Wait for the health check to pass (a few seconds), then verify the container is healthy:

```bash
docker compose ps
```

You should see `voyage-postgres` with status `healthy`.

### 4. Run database migrations

```bash
cd server
npm run db:migrate
```

This applies all Prisma migrations and creates the database schema.

### 5. Seed sample data (optional but recommended)

```bash
cd server
npm run db:seed
```

This creates 5 vehicles and 14 trips so you have data to explore immediately.

### 6. Start the backend server

```bash
cd server
npm run start:dev
```

The API is now available at `http://localhost:3000`.
Swagger UI is at `http://localhost:3000/api`.

### 7. Start the frontend

Open a new terminal:

```bash
cd client
npm run dev
```

The app is now available at `http://localhost:5173`.

---

## Environment Variables

All backend environment variables live in `server/.env`. Copy from the template:

```bash
cp server/.env.example server/.env
```

| Variable | Default | Description |
|----------|---------|-------------|
| `POSTGRES_USER` | `voyage` | PostgreSQL username |
| `POSTGRES_PASSWORD` | `voyage_password` | PostgreSQL password |
| `POSTGRES_DB` | `voyage_db` | PostgreSQL database name |
| `POSTGRES_PORT` | `5432` | Host port Docker maps to the container's 5432 |
| `DATABASE_URL` | *(derived)* | Full Prisma connection string — built from the variables above |
| `PORT` | `3000` | Port the NestJS server listens on |

> **Note:** `DATABASE_URL` is constructed from the other variables using shell interpolation in `.env.example`. If your shell doesn't expand variables in `.env` files, set the full string directly:
> ```
> DATABASE_URL="postgresql://voyage:voyage_password@localhost:5432/voyage_db"
> ```

The frontend has no `.env` file — the Vite dev server proxies all `/api` requests to `http://localhost:3000` automatically.

---

## Database

The database is PostgreSQL 16, managed via Docker Compose and Prisma.

### Start the database

```bash
cd server
docker compose up -d
```

### Stop the database (data is preserved)

```bash
cd server
docker compose stop
```

### Reset the database (destroys all data and re-runs migrations)

```bash
cd server
npm run db:reset
```

When prompted, type `y` to confirm. This drops the database, re-applies all migrations from scratch, and runs the seed script if configured.

### Run migrations

Apply pending migrations (development):

```bash
cd server
npm run db:migrate
```

Apply migrations in production (no interactive prompts, no schema drift check):

```bash
cd server
npm run db:migrate:deploy
```

### Seed sample data

```bash
cd server
npm run db:seed
```

Creates:
- **5 vehicles:** Berlin Express, Hamburg Van, Munich Sedan, Cologne Bus, Stuttgart Cargo
- **14 trips:** Spanning March–June 2024 with realistic distance and fuel data

### Open Prisma Studio (visual database browser)

```bash
cd server
npm run db:studio
```

Opens a browser tab at `http://localhost:5555` where you can browse and edit records.

---

## Backend

### Development server (with hot reload)

```bash
cd server
npm run start:dev
```

### Production build and start

```bash
cd server
npm run build
npm run start:prod
```

### API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/vehicles` | List all vehicles |
| `POST` | `/vehicles` | Create a vehicle |
| `GET` | `/vehicles/:licensePlate` | Get a vehicle by license plate |
| `GET` | `/vehicles/:licensePlate/summary` | Aggregated trip stats for a vehicle |
| `POST` | `/vehicles/:licensePlate/trip` | Record a new trip for a vehicle |
| `GET` | `/trips` | List trips (filterable by license plate and date range, paginated) |

---

## Frontend

### Development server

```bash
cd client
npm run dev
```

Runs at `http://localhost:5173`. All requests to `/api/*` are proxied to `http://localhost:3000` (the backend must be running).

### Production build

```bash
cd client
npm run build
```

Output goes to `client/dist/`.

### Regenerate the API client

Whenever the backend API changes, regenerate the typed client from the live OpenAPI spec:

```bash
# Make sure the backend server is running first
cd server && npm run start:dev

# In a separate terminal
cd client
npm run api:generate
```

This fetches the spec from `http://localhost:3000/api-json`, overwrites `src/api/openapi.json`, and regenerates `src/api/generated/`. Commit both files together.

---

## API Documentation

Swagger UI is served by the backend at:

```
http://localhost:3000/api
```

The raw OpenAPI JSON spec is available at:

```
http://localhost:3000/api-json
```

---

## Tests

All tests live in the `server/` package. There are no frontend tests at this time.

### Run all tests

```bash
cd server
npm test
```

### Run tests in watch mode

```bash
cd server
npm run test:watch
```

### Run tests with coverage report

```bash
cd server
npm run test:cov
```

Coverage output is written to `server/coverage/`.

### Test structure

```
server/src/
├── vehicles/__tests__/
│   ├── consts.ts                    # Feature-specific test constants
│   ├── vehicles.controller.spec.ts  # Controller integration tests
│   └── vehicles.service.spec.ts     # Service unit tests
├── trips/__tests__/
│   ├── consts.ts
│   ├── trips.controller.spec.ts
│   └── trips.service.spec.ts
└── tests/
    └── consts.ts                    # Shared mocks and constants
```

---

## Useful Commands

### Backend

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Start API with hot reload |
| `npm run build` | Compile TypeScript |
| `npm run start:prod` | Start compiled production build |
| `npm run db:migrate` | Apply pending migrations |
| `npm run db:migrate:deploy` | Apply migrations (production, non-interactive) |
| `npm run db:reset` | Drop DB, re-migrate, re-seed |
| `npm run db:seed` | Insert sample data |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:generate` | Regenerate Prisma client after schema changes |
| `npm test` | Run all tests |
| `npm run test:cov` | Run tests with coverage |
| `npm run lint` | Lint and auto-fix |
| `npm run format` | Format with Prettier |

### Frontend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run api:generate` | Regenerate typed API client from live spec |
| `npm run lint` | Lint source files |

### Docker

| Command | Description |
|---------|-------------|
| `docker compose up -d` | Start PostgreSQL in the background |
| `docker compose stop` | Stop the container (data preserved) |
| `docker compose down` | Stop and remove the container (data preserved in volume) |
| `docker compose down -v` | Stop and remove the container **and** delete all data |
| `docker compose ps` | Check container status and health |
| `docker compose logs postgres` | View PostgreSQL logs |
