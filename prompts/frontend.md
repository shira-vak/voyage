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
* Use Vite.
* Use Ant Design (antd).
* The UI should look professional and clean, with a natural green accent color.
* Design the frontend architecture yourself based on the assignment requirements and the backend API requirements described in the assignment.
* Create a frontend structure that is maintainable and scalable without being over-engineered for the assignment scope.
* Keep the frontend ready to integrate with the backend implementation.
* Prefer feature-oriented organization when it improves cohesion, but avoid excessive nesting and unnecessary complexity.
* Focus on a good user experience for the core flows rather than visual effects or advanced styling. but still make it pretty.

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
