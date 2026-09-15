---
description: Generic frontend coding standards for Vue 3 projects
globs:
  - "src/**/*.{ts,vue,json,css}"
  - "src/**/*.d.ts"
  - "package.json"
  - "vite.config.ts"
  - "tsconfig*.json"
alwaysApply: true
---

# Frontend Coding Standards for Vue 3

## 1. Purpose and Scope

This document defines generic frontend coding standards for projects built with Vue 3.

Scope:

- Applies to the frontend application of any Vue 3 project that adopts this baseline.
- Describes the target architecture and technology choices to follow for new and modified code.
- Prioritizes consistency, type safety, and incremental adoption over rewrites.

Out of scope:

- Mandatory rewrites of existing working features for style reasons alone.
- Backend, infrastructure, and deployment concerns.
- Performance budgeting, accessibility auditing, and security hardening (covered by dedicated documents if required).

## 2. Current Technology Baseline

This section is the default baseline. If a project deviates, it must document the deviation explicitly; until then, follow this baseline.

- Vue 3 with Single-File Components (SFC) and Vite as the build tool.
- TypeScript in strict mode for all application code.
- Vue Router 4 for client-side routing.
- Pinia for global application state.
- Axios for HTTP communication, wrapped in a single shared client. (Default choice, see Section 10.)
- TanStack Query for Vue (`@tanstack/vue-query`) for server state, caching, and request lifecycle. (Default choice, see Section 9.)
- Tailwind CSS as the utility-first styling layer.
- PrimeVue as the component library (headless-friendly components plus PrimeVue theming).
- VeeValidate with Zod for form state and schema validation. (Default choice, see Section 12.)
- ESLint with Prettier for linting and formatting.
- Vitest with Vue Test Utils for unit and component tests, and Playwright for end-to-end tests.

Do not introduce framework-level patterns that conflict with this baseline without team agreement recorded in the change.

## 3. Project Structure Conventions

Use a hybrid structure: type-based folders for global infrastructure and generic UI pieces, feature-based folders for business domains.

Top-level layout under `src`:

- `core/` — global infrastructure and cross-cutting concerns that are not UI:
  - `core/api/` — shared HTTP client, interceptors, and request helpers.
  - `core/config/` — environment and runtime configuration access.
  - `core/router/` — router instance, route definitions, and guards.
  - `core/stores/` — global stores not owned by a single domain (for example session or app shell state).
  - `core/utils/` — framework-agnostic helper functions.
  - `core/types/` — shared TypeScript types and contracts.
- `shared/` — reusable UI and UI-adjacent pieces with no business-domain knowledge:
  - `shared/components/` — generic presentational components.
  - `shared/composables/` — reusable composables with no domain ownership.
  - `shared/layouts/` — layout shells.
  - `shared/directives/` — shared custom directives.
- `features/` — business domains, each self-contained:
  - `features/<feature>/components/` — feature-scoped components.
  - `features/<feature>/composables/` — feature-scoped composables.
  - `features/<feature>/stores/` — Pinia stores owned by the feature.
  - `features/<feature>/api/` — feature-specific request functions.
  - `features/<feature>/schemas/` — validation schemas.
  - `features/<feature>/types/` — feature-specific types.
  - `features/<feature>/views/` — route-level components for the feature.
  - `features/<feature>/routes.ts` — route definitions exported by the feature.
  - `features/<feature>/index.ts` — public surface of the feature.

Rules:

- A feature must not import from another feature's internals. Cross-feature reuse is promoted to `core/` or `shared/` first.
- Import features only through their `index.ts` public surface.
- Place a new piece at the narrowest level that owns it: feature first, then `shared/`, then `core/`.
- Do not create parallel architectural styles for the same concern.
- Use the `@/` alias mapped to `src/`; avoid deep relative paths like `../../../`.

## 4. Naming and Language Rules

Naming:

- Components and their file names: PascalCase (for example `UserCard.vue`).
- Composables: camelCase prefixed with `use` (for example `useUserProfile.ts`).
- Variables, functions, and store ids: camelCase.
- Types, interfaces, and enums: PascalCase.
- Constants: UPPER_SNAKE_CASE.
- Booleans: prefix with `is`, `has`, `should`, or `can`.
- Directives: kebab-case in templates, camelCase when defined.

Language:

- Write code, comments, and identifiers in English.
- Do not mix languages within the same identifier or file.

## 5. Component Standards

All components use the Composition API with `<script setup lang="ts">`.

Rules:

- One component per file; file name matches the component name.
- Component order inside a SFC: `<script setup>`, then `<template>`, then `<style>`.
- Declare props and emits with the type-based macros and provide defaults explicitly:
  - `const props = withDefaults(defineProps<Props>(), { ... })`
  - `const emit = defineEmits<{ change: [value: string] }>()`
- Prefer typed props over runtime `PropType` casts.
- Keep component responsibilities focused: rendering, user interaction, and orchestration only.
- Extract shared logic into composables (`use*`) or `core/utils`, not duplicated inside large components.
- Split a component once it mixes data fetching, complex formatting, and multiple independent UI regions.
- Do not use the Options API for new components.
- Do not mutate props; emit events or use `v-model` contracts instead.
- Prefer `defineModel` for `v-model` bindings on reusable components.

## 6. Composables Standards

Composables are the primary unit for reusable reactive logic.

Rules:

- Name files and functions with the `use` prefix.
- A composable that touches global state (router, stores, query client) must be called inside `<script setup>` or another composable, never at module top level.
- Return a plain object with explicitly typed values; avoid returning raw `ref` internals that leak ownership.
- Use `toRefs` or `storeToRefs` when returning reactive state so consumers keep reactivity.
- Keep side effects (subscriptions, watchers, listeners) paired with cleanup in `onScopeDispose` or `onUnmounted`.
- One composable, one concern. Do not create catch-all `useUtils` style helpers.

## 7. Routing and Navigation Standards

Routing uses Vue Router 4 with `createWebHistory`.

Rules:

- The router instance lives in `core/router/index.ts`.
- Define routes in the router, composed from each feature's `routes.ts` export.
- Use lazy-loaded route components via dynamic `import()` for route-level views.
- Use route-level meta for shared concerns, for example `meta: { requiresAuth: true }`.
- Enforce cross-cutting rules with router guards (`beforeEach`) registered in `core/router`, not inside components.
- Use named routes and `router.push({ name: '...', params: { ... } })` instead of hardcoded path strings.
- Keep route names unique and namespaced by feature when appropriate.
- Access route state through `useRoute()` and navigation through `useRouter()`; do not import the router singleton into components.

## 8. State Management Standards

Global state uses Pinia.

Rules:

- Prefer setup stores written in the Composition API style.
- One store per domain concern; name stores by domain (for example `useAuthStore`).
- Declare state as `ref`/`reactive`, derived values as `computed`, and actions as functions.
- Keep stores free of component and DOM concerns; no direct UI manipulation.
- Do not store server data that TanStack Query already owns (see Section 9).
- Access store state in components with `storeToRefs` to preserve reactivity; use `storeToRefs` for state and getters, and the store instance for actions.
- Define an explicit return type or let the setup store infer it consistently across the codebase.
- Reset a store via a dedicated `$reset`-equivalent action if the store must be resettable.
- Do not mutate state from outside an action when the mutation represents a domain operation.

## 9. Server State Standards

Server state is managed by TanStack Query for Vue. (Default choice; adjust at project level if a different data layer is adopted, but keep one owner for server state.)

Rules:

- Register the `QueryClient` once at the app entry and provide it through `VueQueryPlugin`.
- Wrap all read operations in `useQuery` and all write operations in `useMutation`.
- Define stable, hierarchical query keys in a per-feature keys factory.
- Invalidate or update affected queries in mutation `onSuccess` handlers.
- Keep cache lifetimes (`staleTime`, `gcTime`) explicit on queries where defaults are not appropriate.
- Do not cache server data in Pinia as a shadow copy; Pinia owns client/domain state, TanStack Query owns server state.
- Surface loading and error states through `isPending`, `isError`, and `error` rather than ad-hoc flags.

## 10. API and HTTP Standards

HTTP integration uses a single shared Axios instance. (Default choice.)

Rules:

- Create the client in `core/api/client.ts` with base URL from `core/config`.
- Set default headers and `withCredentials` centrally, not per call.
- Use request/response interceptors for cross-cutting concerns such as auth headers and error normalization.
- Never hardcode backend URLs or endpoint fragments in components.
- Centralize endpoint paths in a shared module or per-feature API modules.
- Keep feature-specific request functions in `features/<feature>/api/`.
- Type request and response contracts with shared types from `core/types` or the feature's `types`.
- Normalize error responses to a consistent shape before they reach UI or query layer.
- Do not log credentials, tokens, or sensitive payloads.

## 11. UI and Styling Standards

The UI layer combines Tailwind CSS for layout and utilities with PrimeVue for components.

Rules:

- Use Tailwind utilities for layout, spacing, and small presentational adjustments.
- Use PrimeVue components for interactive widgets (inputs, tables, dialogs, date pickers) instead of rebuilding them.
- Apply PrimeVue theming centrally with a preset configured at app setup; do not override component internals per usage.
- Keep global CSS minimal and scoped to resets and design tokens.
- Order Tailwind class names consistently; prefer Prettier with the Tailwind plugin for sorting.
- Avoid arbitrary values in Tailwind when a design token exists.
- Keep styles in the component's `<style scoped>` only for what utilities or PrimeVue cannot express.
- Use PrimeVue's built-in pass-through/token APIs for customization instead of deep CSS selectors.

## 12. Forms and Validation Standards

Forms use VeeValidate with Zod schemas. (Default choice.)

Rules:

- Define validation schemas per feature in `features/<feature>/schemas/`.
- Derive TypeScript types from the Zod schema (`z.infer`) so validation and types stay aligned.
- Use `useForm` with `toTypedSchema` and `useField` or `Form`/`Field` components consistently.
- Keep field-level validation in the schema; keep cross-field and server-side checks in submit handlers.
- Do not duplicate validation rules between schema and component logic.
- Surface validation errors through PrimeVue components and consistent message placement.

## 13. Error Handling and User Feedback

Rules:

- Catch and handle errors explicitly in async flows and query/mutation callbacks.
- Normalize errors at the API layer so UI code handles one shape.
- Avoid silent failures; every failed operation must produce user-facing feedback.
- Provide feedback through a shared notification or toast service, not ad-hoc alerts per component.
- Use a global error handler (`app.config.errorHandler`) for unexpected errors, logging without leaking sensitive data.
- Distinguish recoverable (validation, not found) from unrecoverable (network, server) errors in the messaging.

## 14. Testing Standards

Baseline:

- Vitest with Vue Test Utils for unit and component tests.
- Playwright for end-to-end tests.
- `@vue/test-utils` mounting helpers centralized for reuse.

Rules for new changes:

- Add or update tests for critical logic introduced by the change.
- Prioritize pure logic first: composables, store actions, schema validation, and API mappers.
- For component tests, mount with required providers (router, Pinia, query client) using a shared test helper.
- Use `createTestingPinia` or an explicit test store setup to isolate store dependencies.
- Mock the API client at its boundary rather than mocking internal modules.
- Keep end-to-end tests focused on critical user journeys, not exhaustive permutations.
- Remove obsolete default scaffold tests when they no longer represent application behavior.

## 15. Development Workflow and Quality Gates

Before submitting changes:

1. Install dependencies with `npm install`.
2. Run the dev server with `npm run dev` when behavior validation is needed.
3. Run type checking with `vue-tsc --noEmit` (wired into the project scripts).
4. Run linting and formatting checks with the project scripts.
5. Run tests with the project test script for impacted areas.
6. Run the production build when the change can affect bundling or static assets.

Use small, focused commits and keep branch scope limited to one feature or fix.

## 16. Do and Do Not Summary

Do:

- Use `<script setup lang="ts">` with typed props, emits, and models.
- Keep business logic in composables and stores, not in templates.
- Follow the hybrid structure: `core/` and `shared/` by type, `features/` by domain.
- Access stores with `storeToRefs` for reactive state.
- Keep one owner for each kind of state: Pinia for client state, TanStack Query for server state.
- Centralize HTTP configuration and normalizing errors in the API layer.
- Use Tailwind for layout and PrimeVue for interactive components.

Do not:

- Use the Options API for new components.
- Import across feature internals; promote shared code to `core/` or `shared/`.
- Hardcode backend URLs or route paths across multiple files.
- Duplicate server data into Pinia as a cached copy.
- Override PrimeVue component internals with deep CSS selectors.
- Commit debug-only changes, dead code, or commented-out blocks.

## 17. Reference Artifacts

The standards in this document are grounded in these typical project artifacts. Adjust paths to match the concrete project:

- `package.json`
- `vite.config.ts`
- `tsconfig.json`
- `eslint.config.js` (or `.eslintrc`)
- `prettier.config.js`
- `tailwind.config.ts`
- `src/main.ts`
- `src/core/router/index.ts`
- `src/core/api/client.ts`
- `src/core/stores/`
- `src/shared/components/`
- `src/features/<feature>/routes.ts`
- `src/features/<feature>/stores/`
