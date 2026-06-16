# Backend Prompts

Log entries for prompts that generate or modify: controllers, services, DTOs, validation, Prisma schema, tests, or backend business logic.

---

## 2026-06-15 21:44 - Monorepo scaffold + full NestJS server

Tool: Claude Sonnet 4.6

Prompt:
This is my assignment. As a start I want to concentrate on creating the structure of the monorepo and the server code and tests. Creating a monorepo for my app - empty client folder for now, server folder and the rest of the needed files (I have readme and CLAUDE.md and need to add files like .gitignore and whatever else suited to be in the monorepo base folder). Make sure the postgres db is set up in the docker compose file in the server folder. Nest based server that uses Prisma to integrate with the db (just like I did in my other projects - simple docker file with simple Prisma schema of the vehicles and their trips). And the rest of the server side, including tests for all services and controllers. Make sure to stick to the general coding instructions in the CLAUDE.md file and write clean and typed code.

Result:
Generated full monorepo scaffold: .gitignore, server/docker-compose.yml, server/.env.example, all config files (package.json, tsconfig, nest-cli, prettier, eslint), Prisma schema (Vehicle + Trip models with indexes), seed script with 5 vehicles and 14 trips, NestJS app with VehiclesModule and TripsModule (services, controllers, DTOs, modules), shared types and interceptor, and full test suite (service unit tests + controller integration tests with supertest).

---
