# CLAUDE.md

Source of truth for all code generation in this project.
**Priority: CLAUDE.md → project structure → framework defaults.**

---

## Before Generating Code

1. Does this conflict with CLAUDE.md?
2. Are all types explicit?
3. Is the solution simpler than what I first thought of?
4. Would a comment be needed to understand this — and if so, can I rename instead?

---

## TypeScript

- Always define return types on public functions and methods.
- Always define parameter types — never rely on inference for signatures.
- No `any`. Use `unknown` and narrow it when the type is genuinely unknown.
- Prefer `type` + unions over enums. Use `as const` for constants and lookup maps:

  ```ts
  export const statusOptions = ["active", "inactive"] as const;
  export type Status = (typeof statusOptions)[number];
  ```

- Annotate local variables when inference would be unclear to a reader.
- Use `import type` for type-only imports.

---

## Clean Code

- Clear names over comments. If code needs a comment to be understood, rename first.
- Only write a comment when the business reason genuinely cannot be expressed in code.
- One function = one responsibility.
- No over-engineering.
- No premature abstractions. A shared abstraction needs a real reason - if repeated multiple times or optional to be used again.
- Prefer simple, predictable code over clever code.

---

## Backend — NestJS

### Structure

Each feature is a self-contained folder:

```
src/
├── main.ts
├── app.module.ts
├── common/            ← shared interceptors, pipes, guards
├── prisma/            ← PrismaModule + PrismaService
└── <feature>/
    ├── <feature>.module.ts
    ├── <feature>.controller.ts
    ├── <feature>.service.ts
    ├── utils.ts       ← pure functions shared within the feature (only if needed)
    ├── dtos/
    │   ├── create-<resource>.dto.ts
    │   ├── <resource>-response.dto.ts   ← response shape returned by the controller
    │   └── <action>-<resource>.dto.ts
    └── __tests__/
        ├── consts.ts  ← feature-specific test constants (e.g. input DTOs)
        ├── <feature>.controller.spec.ts
        └── <feature>.service.spec.ts

src/test/
└── consts.ts          ← shared test mocks and constants (mock DB objects, IDs, shared values)
```

### Naming

- Files: `kebab-case` (`create-trip.dto.ts`)
- Classes: `PascalCase` (`TripsService`, `CreateTripDto`)
- Feature folders: lowercase plural (`trips/`, `users/`)

### Controllers

- Routing and delegation only — no logic.
- Every handler is `async` with an explicit return type.
- **Return types must always be DTO classes**, not Prisma models or raw TypeScript types. This ensures the OpenAPI spec is correct and `openapi-typescript-codegen` generates proper frontend types.
- Use a param DTO (e.g. `TripIdDto`) when the route param needs validation (`@IsUUID()`).
- Every endpoint gets `@ApiOperation`, and `@ApiParam` / `@ApiQuery` where applicable.

### Services

- All business logic must live in the service layer.
- If a function in a service becomes too large or contains clearly separable logic, extract it into a utility file under the same service parent folder (utils.ts) instead of bloating the service. Utilities should remain pure functions with no side effects and must stay within the same parent folder unless explicitly shared across multiple services in that case create a general utils.ts file under the joint parent of those two services.
- All public methods are `async` with explicit `Promise<T>` return types.
- **Return types should be DTO classes** so controllers can delegate and return them directly without casting.
- Validate existence by calling the feature's own `getById` method (which throws `NotFoundException`). Do not inline the null check.
- Throw `NotFoundException` when a resource is missing.
- Throw `BadRequestException` for business rule violations — include useful context in the message.
- Extract internal logic into `private async` helpers if can be shared between service functions - if logic is pure and non related to the service injections extract to the utils file.
- Cross-feature calls go through the other feature's **service**, not through Prisma directly.
- **Prefer DTO validation over service-level guards.** Only add an `if`-throw in the service when the check is inherently cross-field (e.g. `startedAt < endedAt`) or requires DB/runtime state that the DTO cannot know at parse time. If validation can be expressed as a class-validator decorator on the DTO, do it there instead.

### DTOs

- Every field has a `class-validator` decorator and an `@ApiProperty()` decorator.
- Use `@IsUUID()` for ID params.
- Use `@IsIn(options)` with a typed `as const` array for constrained value sets — not a raw enum.
- Use `@Min(0)` when zero is valid; `@IsPositive()` when it is not.
- DTO names: `<Action><Resource>Dto` for input (`CreateTripDto`), `<Resource>ResponseDto` for output (`TripResponseDto`, `VehicleSummaryDto`).

### Prisma

- Use atomic operations for any business logic that involves multiple related database writes or reads that must remain consistent.
- Use `this.prismaService.$transaction(async (tx) => { ... })` for multi-step operations.
- Inside a transaction, use the `tx` parameter — not `this.prismaService`.
- For monetary / decimal fields: use `.lessThan()`, `.toNumber()`, `.toString()` — never coerce directly.
- Null-safe aggregation results: `_sum.value?.toNumber() ?? 0`.

### Error Handling

| Situation                                  | Exception             |
| ------------------------------------------ | --------------------- |
| Resource not found                         | `NotFoundException`   |
| Business rule violated                     | `BadRequestException` |
| Invalid input that bypasses DTO validation | `BadRequestException` |

Error messages include context — what was expected, what was found.
If need to use `BadRequestException` make sure there is no gap in the dto definition.

### Global Setup

```ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);
```

Apply the same `ValidationPipe` configuration in controller integration tests.

## Frontend — React + TypeScript

- TypeScript only — no `.js` or `.jsx` files to create.
- Explicit types on all props, hook return values, state, and API responses. No `any`.
- Separate data fetching from rendering — use hooks for data logic.
- Avoid global state unless local state + context genuinely cannot solve the problem.
- Use `openapi-typescript-codegen` to generate a typed API client from the backend OpenAPI spec. Never re-declare types that already exist in the generated client.

### Feature Folder Structure

Each feature lives under `client/src/features/<featureName>/` and follows this layout:

```
<featureName>/
├── <FeatureName>Page.tsx        ← thin orchestration only (state + layout, no logic)
├── <Feature>Header.tsx          ← page header + primary action button
├── types.ts                     ← feature-local TypeScript types
├── consts.ts                    ← feature-local constants
├── utils.ts                     ← pure functions used at the page level (only if needed)
├── styles.module.css            ← page-level layout styles
├── hooks/
│   ├── use<Feature>.ts          ← data-fetching hook
│   └── use<Action><Feature>.ts  ← action hooks (create, update, etc.)
├── <subFeature>/                ← one folder per logical UI section
│   ├── <SubFeature>.tsx
│   ├── utils.ts                 ← pure helpers for this sub-feature (only if needed)
│   └── styles.module.css        ← scoped styles for this sub-feature
└── create<Feature>Modal/
    └── Create<Feature>Modal.tsx
```

### Component Responsibilities

- **Page component** (`<Feature>Page.tsx`): owns all page-level state (open/close modals, filter values, pagination), calls hooks, wires handlers, renders layout. No business logic or API calls.
- **Header component** (`<Feature>Header.tsx`): renders `PageHeader` with title and the primary action button. Receives a callback prop — no state.
- **Sub-feature components**: own their own rendering logic and any sub-scoped state. Receive data and callbacks via props.
- **No API calls inside components** — all `Service.*` calls belong in hooks.

### Hook Responsibilities

- **Data-fetching hooks** (`useTrips`, `useVehicles`): manage loading / error / data state, expose a `reload` function. Call one service method.
- **Action hooks** (`useCreateTripModal`, `useCreateVehicleModal`): receive a form instance and callbacks, handle submit + close logic, manage `submitting` state.
- All hooks return explicit typed objects — no implicit `any`.

### When to Split Components

**Do split** when:
- A logical section of a page (table, drawer, grid) is large enough to have its own styling or sub-components.
- A section has its own internal state or derived data (e.g. `useMemo` for columns).

**Do not split** when:
- It would only move JSX from one file to another with no reuse, no hook, and no isolated state.
- The component is already small and reads clearly as-is.

### Pure Utilities

- `utils.ts` files contain **pure functions with no JSX only** — formatting helpers, derived values, query builders.
- Page-level pure functions (e.g. building a query object from filter state) go in the feature root `utils.ts`.
- Sub-feature pure functions (e.g. `formatDuration`) go in the sub-feature folder's own `utils.ts`.
- Functions that return JSX (e.g. column render functions) are **not** utilities — they live inside the component file that uses them.
- Never import a sub-feature's `utils.ts` from the page level — keep the dependency direction downward.

### OpenAPI Client Generation

The `client/src/api/` folder has two parts:

```
client/src/api/
├── openapi.json       ← committed spec (source of truth)
└── generated/         ← never edit by hand
    ├── core/
    ├── models/
    ├── services/
    └── index.ts
```

**Workflow when the API changes:**

1. Start the server (`npm run start:dev` in `server/`).
2. In `client/`, run `npm run api:generate` — fetches the live spec from `http://localhost:3000/api-json`, overwrites `src/api/openapi.json`, then regenerates `src/api/generated/`.
3. Commit both `openapi.json` and the regenerated `src/api/generated/` files together.

**Base URL** — configured once in `client/src/main.tsx`:
```ts
import { OpenAPI } from './api/generated';
OpenAPI.BASE = '/api';
```

The Vite proxy strips the `/api` prefix before forwarding to the NestJS server.

**Importing from the generated client** — always import through the generated index barrel:
```ts
import type { TripResponseDto } from '../../api/generated';
import { TripsService } from '../../api/generated';
```

### API Design — Vehicle Lookup by License Plate

Users never see or type vehicle UUIDs. The public API contract exposes license plates wherever a user selects or filters a vehicle:

- `POST /vehicles/:licensePlate/trip` — create a trip; backend resolves the plate to `vehicleId` internally.
- `GET /trips?licensePlate=` — filter trips by plate; backend resolves internally.
- Internal DB queries, relationships, and joins all continue to use `vehicleId`.
- Frontend state and filter props use `licensePlate` (not `vehicleId`) for user-facing vehicle selection.

## Testing

### What to test

- Every public service method: happy path + all failure paths.
- Every controller endpoint: valid input (200/201), invalid input (400), not found (404).
- If you find a new edge case to test.

### Naming

```
describe('ServiceName') → describe('methodName') → it('when X should Y')
```

Use `it.each` / `test.each` for parameterised cases.

### No magic numbers or strings

- **Never use literal values inline in tests.** Every ID, date, numeric value, and string that represents a domain concept must be a named constant.
- Derive related values from the base constant rather than inventing a separate literal:
  ```ts
  // ✅ correct
  export const MOCK_TRIP_START = new Date('2024-06-01T08:00:00Z');
  export const MOCK_TRIP_DURATION_MINUTES = 90;
  export const MOCK_TRIP_END = new Date(MOCK_TRIP_START.getTime() + MOCK_TRIP_DURATION_MINUTES * 60_000);

  // ❌ wrong — independent literals that can drift
  startedAt: '2024-06-01T08:00:00Z',
  endedAt:   '2024-06-01T09:30:00Z',
  ```
- When testing a value that is offset from another (e.g. "one minute after end"), express it as `new Date(MOCK_TRIP_END.getTime() + 60_000)`, not as a hard-coded timestamp.

### Mocks

- **Shared** mock objects and base constants (IDs, mock DB rows, mock response DTOs, `prismaMock`) belong in `src/test/consts.ts`.
- **Feature-specific** input DTOs and test-only constants that are only used within one feature's tests belong in `src/<feature>/__tests__/consts.ts`.
- Import from the nearest scope: prefer `__tests__/consts.ts` over `src/test/consts.ts` when the constant is not shared.

---

## Formatting

- Single quotes.
- Trailing commas everywhere.
- Print width: 120.
- Prettier enforced as an ESLint error.
- Make sure to follow the eslint file rules.

---

## Prompt Logging

Log meaningful prompts in `/prompts/backend.md`, `/prompts/frontend.md`, or `/prompts/infrastructure.md`.

Log when a prompt: generates real code that is meaningful, changes architecture, introduces endpoints/components/services, or modifies schema/infrastructure.

Do not log: clarifications, small fixes, debugging back-and-forth.

Use the format: `YYYY-MM-DD HH:mm` - Description for every logged prompt entry. A prompt headline will start with the date the time a dash and title of the prompt (e.g: `## 2026-06-15 14:46 - Example prompt`).
