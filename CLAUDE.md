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
  export const statusOptions = ['active', 'inactive'] as const;
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
    ├── consts.ts       ← feature constants
    ├── types.ts       ← feature type maps
    ├── dtos/
    │   └── <action>-<resource>.dto.ts
    └── __tests__/
        ├── <feature>.controller.spec.ts
        └── <feature>.service.spec.ts

src/test/
└── consts.ts          ← shared test mocks and constants
```

### Naming

- Files: `kebab-case` (`create-trip.dto.ts`)
- Classes: `PascalCase` (`TripsService`, `CreateTripDto`)
- Feature folders: lowercase plural (`trips/`, `users/`)

### Controllers

- Routing and delegation only — no logic.
- Every handler is `async` with an explicit return type.
- Use a param DTO (e.g. `TripIdDto`) when the route param needs validation (`@IsUUID()`).
- Every endpoint gets `@ApiOperation`, and `@ApiParam` / `@ApiQuery` where applicable.

### Services

- All business logic must live in the service layer.
- If a function in a service becomes too large or contains clearly separable logic, extract it into a utility file under the same service parent folder (utils.ts) instead of bloating the service. Utilities should remain pure functions with no side effects and must stay within the same parent folder unless explicitly shared across multiple services in that case craete a general utils.ts file under the joint parent of those two services.
- All public methods are `async` with explicit `Promise<T>` return types.
- Validate existence by calling the feature's own `getById` method (which throws `NotFoundException`). Do not inline the null check.
- Throw `NotFoundException` when a resource is missing.
- Throw `BadRequestException` for business rule violations — include useful context in the message.
- Extract internal logic into `private async` helpers if can be shhared between service functions - if logic is pure and non related to the service injections extract to the utils file.
- Cross-feature calls go through the other feature's **service**, not through Prisma directly.

### DTOs

- Every field has a `class-validator` decorator and an `@ApiProperty()` decorator.
- Use `@IsUUID()` for ID params.
- Use `@IsIn(options)` with a typed `as const` array for constrained value sets — not a raw enum.
- Use `@Min(0)` when zero is valid; `@IsPositive()` when it is not.
- DTO names: `<Action><Resource>Dto` (`CreateTripDto`, `UpdateStatusDto`).

### Prisma

- Use atomic operations for any business logic that involves multiple related database writes or reads that must remain consistent.
- Use `this.prismaService.$transaction(async (tx) => { ... })` for multi-step operations.
- Inside a transaction, use the `tx` parameter — not `this.prismaService`.
- For monetary / decimal fields: use `.lessThan()`, `.toNumber()`, `.toString()` — never coerce directly.
- Null-safe aggregation results: `_sum.value?.toNumber() ?? 0`.

### Error Handling

| Situation | Exception |
|---|---|
| Resource not found | `NotFoundException` |
| Business rule violated | `BadRequestException` |
| Invalid input that bypasses DTO validation | `BadRequestException` |

Error messages include context — what was expected, what was found.
If need to use `BadRequestException` make sure there is no gap in the dto defenition.

### Global Setup

```ts
app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
```

Apply the same `ValidationPipe` configuration in controller integration tests.

## Frontend — React + TypeScript

- TypeScript only — no `.js` or `.jsx` files to create.
- Explicit types on all props, hook return values, state, and API responses. No `any`.
- Keep components small and focused. If a component is too long and can be split to seperated logic, split it.
- Separate data fetching from rendering — use hooks for data logic.
- Avoid global state unless local state + context genuinely cannot solve the problem.
- Use `openapi-typescript-codegen` to generate a typed API client from the backend OpenAPI spec. Never re-declare types that already exist in the generated client.

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

### Mocks

- Define mock objects at `consts.ts` file in the same folder as the test file or in `src/test/consts.ts` (if shared with other tests).

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
