---
description: Frontend coding standards for konector-springreactfront based on the current implementation
globs:
	- "konector-springreactfront/SpringReactFront/Konector/frontend/src/**/*.{js,jsx,json,css}"
	- "konector-springreactfront/SpringReactFront/Konector/frontend/package.json"
alwaysApply: true
---

# Frontend Coding Standards for Konector SpringReactFront

## 1. Purpose and Scope

This document defines the frontend coding standards for the Konector SpringReactFront module.

Scope:

- Applies only to the frontend application located at `konector-springreactfront/SpringReactFront/Konector/frontend`.
- Reflects the current production architecture and technology choices.
- Prioritizes compatibility and incremental consistency over broad modernization.

Out of scope:

- Mandatory migration to TypeScript.
- Mandatory migration to React Router v6 or Material UI v5.
- Mandatory Cypress adoption.

## 2. Current Technology Baseline

Frontend changes must remain compatible with the current baseline:

- React 16.13.1 with Create React App 3.4.1.
- React Router DOM 5.1.2.
- Redux 4, redux-thunk, redux-persist, redux-form.
- Material-UI v4 (`@material-ui/core`, `@material-ui/lab`, `@material-ui/pickers`, `@material-ui/styles`).
- Bootstrap 4.4.1 and React Bootstrap 1.0.0.
- Axios for HTTP communication.
- i18next and react-i18next for localization.
- MSAL (`@azure/msal-browser`, `@azure/msal-react`) for Azure authentication.

Do not introduce framework-level patterns that conflict with this baseline.

## 3. Project Structure Conventions

Use and preserve the current folder boundaries under `frontend/src`:

- `Actions`: Redux action types and thunk-based action creators.
- `Api`: shared API helper functions and axios instances.
- `Components`: UI screens and reusable UI building blocks.
- `Container`: Redux-connected container components used by legacy flows.
- `Reducers`: root reducer and domain reducers.
- `HOCS`: cross-cutting wrappers such as inactivity logout and language synchronization.
- `Language`: localization files and endpoint catalog.
- `Style`: global app styles and theme.
- `Utils`: utility helpers.

When adding new code, place it in the closest existing domain folder. Avoid creating parallel architectural styles for the same concern.

## 4. Naming and Language Rules

Naming in this codebase is mixed by design and must remain consistent with the domain:

- Keep business-domain terms in Spanish when they map to existing backend contracts or route semantics.
- Keep framework and general programming identifiers clear and consistent.
- Reuse existing naming style in the target module instead of renaming across files without explicit scope.

General naming conventions:

- Components: PascalCase.
- Variables and functions: camelCase.
- Constants and action types: UPPER_SNAKE_CASE.
- CSS classes: kebab-case.

## 5. Component Standards

The current application uses both functional and class-based components.

Rules:

- Functional components are valid and common for screens and table-based flows.
- Class components are allowed where already used for compatibility, especially modal wrappers and some container patterns.
- Do not refactor class components to hooks as part of unrelated feature work.
- Keep component responsibilities focused: view rendering, user interaction, and orchestration only.
- Extract shared pure logic to `Utils` or `Api` helpers instead of duplicating it in large screen files.

## 6. Routing and Navigation Standards

Routing is centralized in `App.js` using React Router v5.

Rules:

- Declare new routes in the main route switch, following current path conventions.
- Use the existing `ProtectedRoute` permission pattern for protected modules.
- Keep permission checks aligned with `sesion.datosSesion.permiso` from local storage.
- Use the shared `history` instance from `history.js` for programmatic navigation from actions or helpers.
- Keep `login` and default containers separated as currently implemented.

## 7. Session and Authentication Standards

Authentication flow is based on MSAL + app session state.

Rules:

- Keep provider setup in the app entry point (`index.js`) with `MsalProvider` wrapping the Redux provider tree.
- Keep MSAL configuration centralized in `authConfig.js`.
- Do not scatter Azure configuration constants in feature components.
- Preserve inactivity logout behavior implemented through the existing HOC.
- Session-dependent logic must handle absent or malformed session data defensively.

## 8. State Management Standards

State is managed through Redux with thunks and persisted root state.

Rules:

- Define action type constants in `Actions/ActionTypes.js`.
- Keep async orchestration in thunk action creators.
- Dispatch normalized payloads for success and error outcomes.
- Register reducers in `Reducers/index.js` only after domain ownership is clear.
- Avoid direct state mutation in reducers.
- Maintain compatibility with `redux-persist` configuration used at app bootstrap.

## 9. API and HTTP Standards

HTTP integration is based on axios and endpoint paths declared in `Language/rutas_PeticionesKonector.json`.

Rules:

- Never hardcode service paths in component code.
- Use endpoint keys from the shared route catalog.
- Reuse existing header conventions for internal services, including:
	- `usuarioRq`
	- `idioma`
	- `codAplicacion`
- Centralize repeated request logic in `Api` helpers when practical.
- Keep response fallback shape consistent for service failures:
	- `mensaje`
	- `codigoMensaje`

## 10. Localization Standards

Localization is implemented with i18next using language resources under `Language`.

Rules:

- Add new user-facing strings to language resource files, not inline in components.
- Preserve the language keys currently used by the app (`ESPAÑOL`, `INGLES`, `PORTUGUES`).
- Keep language initialization behavior aligned with local storage key `lenguaje`.
- Use translation helpers (`i18n.t` or hook/HOC equivalents) for UI text and service error messages.

## 11. UI and Styling Standards

The UI layer uses Material-UI v4 and Bootstrap 4 together.

Rules:

- Continue using the existing component libraries already present in each module.
- Keep theme-dependent behavior aligned with `Style/AppTheme.js`.
- Keep app-level CSS in `Style/App.css` and feature-specific style logic close to the component.
- Preserve existing interaction patterns for tables, modals, date pickers, and notifications.

## 12. Error Handling and User Feedback

Rules:

- Catch and handle HTTP errors explicitly in async flows.
- Use standardized error messaging and codes via existing constants.
- Avoid silent failures.
- Provide user-facing feedback through existing modal/alert patterns when an operation fails.
- Keep logs informative but do not log credentials or sensitive tokens.

## 13. Testing Standards

Current baseline:

- Jest and React Testing Library setup from Create React App.
- Minimal existing tests (`App.test.js` and `setupTests.js`).

Rules for new changes:

- Add or update tests for critical logic introduced by the change.
- Prioritize testing pure logic first (reducers, utilities, mapping helpers, payload builders).
- For UI tests, wrap components with required providers when they depend on router, redux, i18n, or MSAL context.
- Remove obsolete default CRA tests when they no longer represent application behavior.

## 14. Development Workflow and Quality Gates

Before submitting changes:

1. Install dependencies with `npm install` in the frontend module.
2. Run local app with `npm start` when behavior validation is needed.
3. Run tests with `npm test` for impacted areas.
4. Build with `npm run build` when the change can affect bundling or static assets.

Use small, focused commits and keep branch scope limited to one feature or fix.

## 15. Do and Do Not Summary

Do:

- Follow the existing architectural seams and naming patterns.
- Keep endpoints centralized in the route catalog JSON.
- Reuse shared helpers for repeated HTTP or formatting logic.
- Keep permission and session checks aligned with current behavior.

Do not:

- Introduce unrelated framework migrations in feature-level work.
- Hardcode backend URLs or route fragments in multiple files.
- Mix new architectural styles in the same domain without team agreement.
- Commit debug-only changes, dead code, or commented-out blocks.

## 16. Reference Artifacts

The standards in this document are grounded in these project artifacts:

- `konector-springreactfront/SpringReactFront/Konector/frontend/package.json`
- `konector-springreactfront/SpringReactFront/Konector/frontend/src/index.js`
- `konector-springreactfront/SpringReactFront/Konector/frontend/src/App.js`
- `konector-springreactfront/SpringReactFront/Konector/frontend/src/authConfig.js`
- `konector-springreactfront/SpringReactFront/Konector/frontend/src/Actions/index.js`
- `konector-springreactfront/SpringReactFront/Konector/frontend/src/Reducers/index.js`
- `konector-springreactfront/SpringReactFront/Konector/frontend/src/Api/clientUtil.js`
- `konector-springreactfront/SpringReactFront/Konector/frontend/src/Language/rutas_PeticionesKonector.json`
- `konector-springreactfront/SpringReactFront/Konector/frontend/src/i18n.js`
- `konector-springreactfront/SpringReactFront/Konector/frontend/src/HOCS/InactiveLogoutHoc.js`

