# Infrastructure Prompts

Log entries for prompts that generate or modify: Docker, CI/CD, GitHub Actions, deployment config, environment setup, build tooling, database migration scripts, or general project related entries.

---

## 2026-06-15 17:45 - Initial project conventions and CLAUDE.md

Tool: Claude Sonnet 4.6

Prompt:
I am starting a new full-stack TypeScript project. Your task is to create a simple, practical, and enforceable CLAUDE.md file and a minimal prompt tracking system. [... full prompt requesting simplified CLAUDE.md and prompts system, with instructions to infer rules from prior project conventions]

Result:
Created CLAUDE.md with full project conventions and initialized the /prompts directory with three log files.

---

## 2026-06-15 17:45 - Initial project conventions and CLAUDE.md

Tool: Claude Sonnet 4.6

Prompt:
Write a clean, detailed, production-ready README for my full-stack app. It should include exact step-by-step commands for everything needed to run the project from scratch: installing dependencies, setting up environment variables (.env with all required keys explained), starting the database using Docker Compose (include how to start/stop/reset it), running database migrations, running seed scripts, starting the backend API server, starting the frontend UI, and running tests (unit/integration/e2e if available). Read the voyage folder code base to understand the project. The README should be structured, easy to follow, and written for a new developer joining the project. Include prerequisites, project structure overview. Make sure all commands are explicit and copy-paste ready, and ensure nothing important for running the project is missing.

Result:
README.md is written. Here's what's covered:

Prerequisites — Node, npm, Docker with version table and verify commands
Project Structure — annotated directory tree for both server and client
Quick Start — 7 numbered steps from clone to running app, copy-paste ready
Environment Variables — table of every key with its default and what it does, plus the DATABASE_URL interpolation caveat
Database — start/stop/reset/migrate/seed/studio, each as its own subsection with the exact command
Backend — dev server, production build, full endpoint table
Frontend — dev server, production build, API client regeneration workflow
API Documentation — Swagger UI and raw JSON spec URLs
Tests — run/watch/coverage commands plus the test folder structure
Useful Commands — quick-reference tables for backend, frontend, and Docker
