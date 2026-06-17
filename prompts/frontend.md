# Frontend Prompts

Log entries for prompts that generate or modify: React components, pages, hooks, state management, API integration, or UI architecture.

---

## 2026-06-16 22:30 - Frontend architecture and full implementation

Tool: Claude Code (claude-sonnet-4-6)

Prompt:
You are implementing the frontend for the attached Trip Log assignment.
Read the assignment and CLAUDE.md before making any decisions- and go over the backend implementation. Follow all strictly. If there is a conflict, solve it logically.
Your task is to architect and implement the frontend application.
Additional requirements:

- Use Vite.
- Use Ant Design (antd).
- The UI should look professional and clean, with a natural green accent color.
- Design the frontend architecture yourself based on the assignment requirements and the backend API requirements described in the assignment.
- Create a frontend structure that is maintainable and scalable without being over-engineered for the assignment scope.
- Keep the frontend ready to integrate with the backend implementation.
- Prefer feature-oriented organization when it improves cohesion, but avoid excessive nesting and unnecessary complexity.
- Focus on a good user experience for the core flows rather than visual effects or advanced styling. but still make it pretty.

Architecture decisions made:

- `src/api/` — typed fetch client + per-domain modules (`vehicles.ts`, `trips.ts`) + shared `types.ts` mirroring backend DTOs
- `src/features/trips/` — TripsPage (table + filters + pagination), CreateTripModal, TripFilters, useTrips hook
- `src/features/vehicles/` — VehiclesPage (card grid), VehicleCard, CreateVehicleModal, VehicleSummaryDrawer, useVehicles hook
- `src/components/AppLayout.tsx` — sticky header with green brand + horizontal nav
- Vite dev proxy `/api` → `http://localhost:3000` for zero-config backend integration
- antd theme: `colorPrimary: '#389e0d'` (natural green), `<AntApp>` at root for message/notification APIs
- React Router v6, dayjs for date formatting, no external state library

Changes after generation:

- Fixed `App` import collision between antd and local `./App` — renamed antd import to `AntApp`
- Moved success message responsibility into modals (self-contained); TripsPage only calls `reload()`
- Removed accidental `<App>` wrapper inside TripsPage — wrapping happens once in `main.tsx`

---

## 2026-06-17 - OpenAPI generated client + license plate vehicle selection

Tool: Claude Sonnet 4.6

Prompt:
search for `Prompt 1 | Final 1st prompt: after my edits` in chat-prompts.md.

Changes:

1. Installed `openapi-typescript-codegen` as devDependency; added `npm run api:generate` script (reads `../openapi.json`, writes to `src/api/`).
2. Generated `src/api/core/`, `src/api/models/`, `src/api/services/`, `src/api/index.ts`. Deleted manual `client.ts`, `types.ts`, `trips.ts`, `vehicles.ts`.
3. Set `OpenAPI.BASE = '/api'` in `main.tsx` to align with the Vite proxy prefix.
4. Updated all imports in features to use generated models (`TripResponseDto`, `VehicleResponseDto`, `VehicleSummaryDto`) and services (`TripsService`, `VehiclesService`) via the `../../api` barrel.
5. Vehicle selector (create trip modal + trip filter) now stores `licensePlate` as the selected value instead of `vehicleId`; calls `TripsService.tripsControllerCreateTrip(licensePlate, body)` and filters via `?licensePlate=`.
6. `TripFilters` props renamed: `vehicleId` → `licensePlate`, `onVehicleChange` → `onLicensePlateChange`.
7. `TripsPage` state renamed: `vehicleId` → `licensePlate`; `buildQuery` propagates `licensePlate` to the hook.
8. TypeScript clean (zero errors on `tsc --noEmit`).

---

## 2026-06-17 20:20 - OpenAPI generated client + license plate vehicle selection

Tool: Claude Sonnet 4.6

Prompt:
search for `Prompt 3 | Final 2nd prompt: after my edits` in chat-prompts.md.

---

## 2026-06-17 23:00 - Trips feature architecture refactor

Refactored the trips feature to match the vehicles feature architecture. Extracted `useTrips` and `useCreateTripModal` hooks into `hooks/`, split `TripsPage` into `TripsHeader`, `TripsTable`, and `TripFilters` subcomponents with their own folders, moved pure functions (`buildQuery`, `buildColumns`, `formatDuration`) into scoped `utils.ts` files. Updated `CLAUDE.md` with formal frontend folder-structure and component/hook responsibility rules derived from the vehicles reference implementation.
