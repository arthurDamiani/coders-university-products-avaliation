# Home

## Scope
Front-End, Back-End, Database

## Context
We need to implement the product listing flow.

## Functional requirements
1. The home page must list all products in a paginated way with infinite loading (scrolling)
    1 - each product must show the title, image and a short description
2. We need to create a new record in the database in the `products` table
    1. `id`: nanoid (generated with `nanoid` in the API layer)
    2. `score`: int
    4. `name`: text
    4. `description`: text (optional)
    4. `external_link`: text
    4. `created_at`: timestamp
    5. `updated_at`: timestamp
4. The request must be a `GET` to `/api/v1/products` and receive pagination as `query-params`
5. If everything is OK return `200` with the product listing or errors according to the request:
    1. `500`: Something went wrong on the server

## Non-functional requirements
- UI/UX: Great user experience through a beautiful, elegant, modern interface
- Performance: The product listing process must be fast

## You must
- Create only the new listing page

## You must not
- Implement any functionality not related to the product listing

## Technologies (Stack)
React.js, Next.js, React-Hook-Form, Shadcn, Tailwind, Supabase, TRPC, Bunjs

## Acceptance criteria
- We have a page to list products at `/products`
- The page contains a paginated product list with infinite scroll
- The platform can communicate with the API to list data in a paginated way
- We are reporting possible errors
    - Show a red alert on the page
- Clicking a product navigates to that product's feedback page:
    - Navigate to `/products/feedback/{product-id}`

## Outcome
People can view products publicly without being authenticated
