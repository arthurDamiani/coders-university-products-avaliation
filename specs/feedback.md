# Feedback

## Scope
Front-End, Back-End, Database

## Context
We need to implement the flow allowing authenticated users to add new reviews to products.

## Functional requirements
1. If the user is not authenticated we need to show a block requiring authentication, redirecting to the sign-in page
2. If the user is authenticated we can show the form and allow new reviews
    1. Each review must contain a score from 1–5 and a comment
3. New table in the database `products_feedbacks`
    1. `id`: nanoid (generated with `nanoid` in the API layer)
    2. `score`: int
    3. `comment`: text
    4. `created_at`: timestamp
    5. `updated_at`: timestamp
    6. `product_id`
4. The request must be a `POST` to `/api/v1/product-feedback/{product_id}` and receive data as JSON in the `body`
5. If everything is OK return `201` or errors according to validation:
    1. `400`: Malformed data

## Non-functional requirements
- UI/UX: Great user experience through a beautiful, elegant, modern interface
- Performance: The feedback creation process must be fast

## You must
- Create only the new page with the form and the desired feature, nothing more

## You must not
- Implement any functionality not related to sign-up (account creation)
- We will not send any emails at the moment, just process the request, save to the database and return success

## Technologies (Stack)
React.js, Next.js, React-Hook-Form, Shadcn, Tailwind, Supabase, TRPC, Bunjs

## Acceptance criteria
- We have a page to add new feedback at `/products/feedback/{product-id}`
- The page contains a form with validation
- The platform can communicate with the API to send data and receive a response
- We are reporting possible errors
    - Show a red alert in the form
- We are reporting feedback success:
    - Navigate to `/products/feedback/{product-id}/success`

## Outcome
Authenticated users can add feedback to products on the platform
