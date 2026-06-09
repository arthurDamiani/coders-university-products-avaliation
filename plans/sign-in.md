# Plan: Sign-In (Authentication)

> Spec: `specs/sign-in.md`

## Summary of approach
Mirror the pattern already used in `sign-up` (terminal-style page + `route.ts` REST + zod + react-hook-form), adding the authenticated session mechanism via **JWT signed in httpOnly cookie** (stateless — no new database table) and the dynamic header (logged in vs logged out) that **the other two features will also consume**.

## Database
- **No new migration** for the session. Session is stateless (signed JWT), so there is no `sessions` table.
  - *Justification for the trade-off*: the spec asks to "create an authenticated session" without defining the structure. `jose` (JWT lib compatible with edge runtime) is already available as a transitive dependency of the project and is lightweight enough to become a direct dependency — we sign `{ account_id, exp }`, validate only with `jwtVerify`, without a database round-trip on every request. Trade-off accepted: there is no server-side revocation before `exp` (no logout/blocklist), but the spec does not ask for logout or any invalidation flow — we'll use short expiration (e.g.: a few days) to limit the risk.

## Lib / Validation
- `src/lib/validations/sign-in.ts`: zod schema `{ email, password }` (mirrors `sign-up.ts`)
- `src/lib/auth/session.ts` — **shared contract** (see "Shared interface" section below):
  - `SESSION_COOKIE_NAME`
  - `createSessionToken(account): Promise<string>` — signs JWT (`jose`) with `{ sub: account.id, ... }` and short expiration
  - `setSessionCookie(token)` — writes httpOnly/secure/sameSite=lax cookie, path=/
  - `getCurrentAccount(): Promise<Account | null>` — reads cookie (server-side via `next/headers`), validates/decodes the JWT (`jwtVerify`) and fetches the associated account by `sub` (or returns `null` if missing/invalid/expired)
- add `jose` as a direct dependency in `package.json` (already present transitively, just needs to be declared)

## API
- `src/app/api/v1/sign-in/route.ts` (`POST`):
  1. parse body -> `400` if invalid JSON or schema fails
  2. fetch `accounts` by email + `comparePassword` (reuses `src/lib/auth/password.ts`)
  3. invalid credentials -> `400` (the spec only defines `400`; keep consistency instead of introducing `401` out of scope)
  4. success -> `createSessionToken` + `setSessionCookie`, returns `201`

## Components / Pages
- `src/components/sign-in/sign-in-form.tsx` — mirrors `sign-up-form.tsx` (same terminal theme, `TerminalCursor`, red error alert)
- `src/app/auth/sign-in/page.tsx` — mirrors `auth/sign-up/page.tsx`
- `src/components/layout/header.tsx` (Server Component, new):
  - unauthenticated -> "Sign in" button -> `/auth/sign-in`
  - authenticated -> first name + last name + email + avatar (Dicebear: `https://api.dicebear.com/9.x/<style>/svg?seed=<email>`)
  - integrated in `src/app/layout.tsx`

## Flow
- `onSubmit` -> `POST /api/v1/sign-in` -> success: `router.push("/products")`
- error -> red alert in the form (same visual pattern as sign-up)

## Shared interface with other specs (IMPORTANT for parallel execution)
The **feedback** feature depends on checking if the user is authenticated. To allow parallel execution without conflict, we fix the contract **before** starting:
- File: `src/lib/auth/session.ts`
- Function: `getCurrentAccount(): Promise<{ id: string; first_name: string; last_name: string; email: string } | null>`
- Cookie: name exported as `SESSION_COOKIE_NAME`, httpOnly

The **sign-in** agent is the owner/creator of this file. The **feedback** agent will import and consume this function (without recreating it).

## Risks / decisions to confirm
- Avatar via Dicebear: use a simple `<img>` pointing to the public API (visual mock), as suggested in the spec ("can use Dicebear and mockups")
- Stateless JWT: no support for logout/revocation before `exp` — acceptable since it is not in the spec scope; short expiration mitigates the risk
- `jose` becomes a direct dependency (previously only transitive) — the only new lib added to the project for this feature
