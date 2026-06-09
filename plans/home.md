# Plan: Home (Product listing)

> Spec: `specs/home.md`

## Summary of approach
Public page `/products` with paginated listing via infinite scroll, consuming a new REST endpoint `GET /api/v1/products`. Does not depend on authentication (list is public) — feature isolated from the others, except for the `Header` (shared, but owned by the sign-in feature).

## Database
- New migration `supabase/migrations/0002_create_products.sql`: (renumbered — `0002` was freed after the sign-in feature no longer needed a `sessions` table)
  - `id`: text PK (nanoid, generated in the API)
  - `score`: int
  - `name`: text
  - `description`: text (nullable)
  - `external_link`: text
  - `created_at` / `updated_at`: timestamptz

## API
- `src/app/api/v1/products/route.ts` (`GET`):
  - reads pagination via query-params (`cursor` + `limit`, or `page` + `limit` — use cursor-based as it is more natural for infinite scroll)
  - returns `200` with `{ items, nextCursor }` or `500` on server error
- `src/lib/validations/products.ts`: zod schema to validate/normalize query-params

## Components / Pages
- `src/components/products/product-card.tsx` — title, image, short description
- `src/components/products/products-list.tsx` (Client Component):
  - `useInfiniteQuery` (we already have `@tanstack/react-query`) + native `IntersectionObserver` as scroll trigger (no infinite-scroll lib installed)
- `src/app/products/page.tsx`

## Flow
- Load first page -> render grid/list of cards
- Sentinel at the end of the list triggers the next page fetch
- Click on a card -> `router.push("/products/feedback/{product-id}")`
- Error -> red alert on the page

## Risks / decisions to confirm
- **Product image**: the spec defines `external_link` but not a dedicated image URL. Options: (a) assume `external_link` points to the product page and use a mock/placeholder image (e.g.: Picsum/Dicebear) just to fill visually, or (b) ask for confirmation before choosing. Will assume mock placeholder and make it clear in the code/PR that it is an example value, given that the feedback spec also uses "mockups" as an acceptable reference.
- **Data seed**: without registered products the page will be empty. Will include an optional seed migration with some sample products (outside the strict spec scope, but necessary to validate the end-to-end flow) — flag this in the final result.
- This feature **does not** create or modify `src/lib/auth/session.ts` or the `Header` (owned by the sign-in feature) — avoids file conflict in parallel execution.
