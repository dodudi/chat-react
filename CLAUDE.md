# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

This is a fresh Vite + React + TypeScript scaffold (named `chat-react`). `src/App.tsx` is still the default template starter page — no application-specific architecture exists yet. When adding features, this section should be updated to describe the real structure once it emerges.

## Commands

- `npm run dev` — start the Vite dev server with HMR
- `npm run build` — type-check via `tsc -b` then build with Vite
- `npm run lint` — run Oxlint
- `npm run preview` — preview the production build locally
- `npm run test` — run Vitest (watch mode in a TTY; single run in CI). Use `npx vitest run` for a one-shot run, or `npx vitest run src/path/to/File.test.tsx` for a single file.

## Development rules

Detailed conventions live in `.claude/rules/` — read them before writing feature code:

| File | Covers |
|------|--------|
| `directory-conventions.md` | Feature(domain)-based `src/` layout, mirroring the backend's package structure |
| `naming-conventions.md` | File, component, hook, props, and boolean naming |
| `component-conventions.md` | Component declaration style, exports, size/splitting, conditional rendering |
| `state-conventions.md` | `useState`/`useReducer`/`useContext` usage — no external state library |
| `styling-conventions.md` | Tailwind CSS usage |
| `api-conventions.md` | axios REST client + `@stomp/stompjs` WebSocket client, matching the actual chat-spring API/STOMP contract |
| `comment-conventions.md` | WHY-only comments, same philosophy as the backend |
| `test-conventions.md` | Vitest + Testing Library |

### Chosen stack

Decided in-conversation and installed; no application code has been built against it yet:
- State: React built-in only (`useState`/`useReducer`/`useContext`), no Redux/Zustand/etc.
- Styling: **Tailwind CSS v4** via `@tailwindcss/vite` (imported with `@import 'tailwindcss';` at the top of `src/index.css`). The pre-existing plain CSS in `App.css`/`index.css` from the template has not been migrated/removed yet.
- HTTP: `axios` — set up a single instance + interceptors in `shared/api/client.ts` per `api-conventions.md` when the first real API call is added
- Realtime: `@stomp/stompjs` over the backend's STOMP endpoints (`/ws`, `/ws-plain`) — **not** a plain `WebSocket`, since chat-spring speaks STOMP framing, not raw WebSocket messages
- Class merging: `clsx` for conditional Tailwind classes
- Testing: Vitest (`vitest.config` lives inside `vite.config.ts`) + `@testing-library/react`/`jest-dom`/`user-event`, jsdom environment, globals enabled (`describe`/`test`/`expect`/`vi` available without imports — see `tsconfig.app.json` types and `src/test/setup.ts`)

## Backend

The backend for this app lives in a sibling repo: `C:\workspace\project\chat-spring` (Spring Boot 4.1, Java 21, package root `kr.it.rudy.chat`). It's a JWT-based OAuth2 resource server (not an authorization server) with domains for User, Server, Channel, Message, Friend, DM, and Notification, using WebSocket for realtime messaging, Kafka, Redis, and PostgreSQL/Flyway. See that repo's own `CLAUDE.md` for full conventions when building integration points (API shapes, auth flow, WebSocket contracts).

## Tooling notes

- Linting uses **Oxlint** (not ESLint), configured in `.oxlintrc.json` with `react`, `typescript`, and `oxc` plugins.
- Type-aware lint rules are not enabled. To add them, install `oxlint-tsgolint` and set `"options": { "typeAware": true }` in `.oxlintrc.json` (see README.md).
- `tsconfig.json` is a references-only root pointing to `tsconfig.app.json` (src, bundler moduleResolution, `noEmit`) and `tsconfig.node.json` (Vite config).
- The React Compiler is intentionally not enabled (impacts dev/build performance).
