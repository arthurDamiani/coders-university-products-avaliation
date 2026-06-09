# Plan: Feedback (Product reviews)

> Spec: `specs/feedback.md`

## Summary of approach
Page `/products/feedback/{product-id}` with an "authentication required" block for visitors and a review form (score 1–5 + comment) for logged-in users, following the visual/structural pattern of `sign-up`.

## Database
- New migration `supabase/migrations/0003_create_products_feedbacks.sql`: (renumbered — depends only on `products` existing as FK; see `plans/home.md` for the `products` table in `0002`)
  - `id`: text PK (nanoid, generated in the API)
  - `score`: int
  - `comment`: text
  - `product_id`: text, FK -> `products(id)`
  - `created_at` / `updated_at`: timestamptz

## API
- `src/app/api/v1/product-feedback/[product_id]/route.ts` (`POST`):
  1. checks session via `getCurrentAccount()` (from `@/lib/auth/session`, created by the **sign-in** feature — see "Critical dependency")
  2. parse + validate body (`score` 1–5, `comment`) -> `400` on validation/JSON error
  3. writes to `products_feedbacks` -> `201`
- `src/lib/validations/product-feedback.ts`: zod schema `{ score: 1..5, comment }`

## Components / Pages
- `src/components/feedback/feedback-form.tsx` — mirrors `sign-up-form.tsx` (terminal theme, red alert)
- `src/components/feedback/auth-required-block.tsx` — block displayed to unauthenticated visitors, with CTA to `/auth/sign-in`
- `src/app/products/feedback/[product_id]/page.tsx` (Server Component): calls `getCurrentAccount()`; if `null` renders the auth block, otherwise renders the form
- `src/app/products/feedback/[product_id]/success/page.tsx` — mirrors `auth/sign-up/success/page.tsx`

## Flow
- Unauthenticated visitor -> "log in to review" block -> link/redirect to `/auth/sign-in`
- Logged in -> form -> `POST /api/v1/product-feedback/{product_id}` -> success: `router.push("/products/feedback/{id}/success")`
- Error -> red alert in the form

## Critical dependency (parallel execution)
This feature **depends** on the session helper created by the **sign-in** feature:
- Import: `import { getCurrentAccount } from "@/lib/auth/session"`
- Combined signature: `getCurrentAccount(): Promise<{ id; first_name; last_name; email } | null>`
- The session is stateless (JWT signed in httpOnly cookie via `jose` — no `sessions` table in the database), so **there is no migration dependency** between the two features, only on the function above.

This contract was fixed in advance with the sign-in agent (see `plans/sign-in.md`, section "Shared interface"), so the feedback agent can program against this interface even if the file is created in parallel by another agent — **must not recreate or modify** `src/lib/auth/session.ts`.

## Risks / decisions to confirm
- Validation of `product_id`: assume it is a `nanoid` (text) coming from the dynamic route, without additional existence validation beyond the FK/database error
- This feature does not modify `Header`, `layout.tsx` or create the `products` table (owned by `home`/`sign-in` respectively) — it only references `products(id)` as FK
