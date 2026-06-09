# Sign-Up (Account creation)

## Scope
Front-End, Back-End, Database

## Context
We need to implement the flow for account creation. Users will need to provide:
- First name
- Last name
- Email
- Password
- Password confirmation

## Functional requirements
1. We need to add validation on the form at the client layer
    1. If the form is valid we can send the request to the API
2. The first name and last name fields must be separate
3. We need to create a new record in the database in the `accounts` table
    1. `id`: nanoid (generated with `nanoid` in the API layer)
    2. `first_name`: text
    3. `last_name`: text
    4. `created_at`: timestamp
    5. `updated_at`: timestamp
    6. `active`: boolean
    7. `email`: text
    8. `password`: text (hashed)
    9. `salt`: text (hashed)
4. The request must be a `POST` to `/api/v1/sign-up` and receive data as JSON in the `body`
5. If everything is OK return `201` or errors according to validation:
    1. `400`: Malformed data

## Non-functional requirements
- Security: We need to save passwords securely in the database
    - We need to receive client data securely using HTTPS (to prevent network sniffing)
- UI/UX: Great user experience through a beautiful, elegant, modern interface
- Performance: The account creation process must be fast

## You must
- Set up the project base with an initial endpoint for account creation
- Set up the project base with an initial page for the account creation interface
- Configure the base libraries

## You must not
- Implement any functionality not related to sign-up (account creation)
- We will not send any emails at the moment, just process the request, save to the database and return success

## Technologies (Stack)
React.js, Next.js, React-Hook-Form, Shadcn, Tailwind, Supabase, TRPC, Bunjs

## Acceptance criteria
- We have a page to create a new account at `/auth/sign-up`
- The page contains a form with validation
- The platform can communicate with the API to send data and receive a response
- We are reporting possible errors
    - Show a red alert in the form
- We are reporting account creation success:
    - Navigate to `/auth/sign-up/success`

## Outcome
People can create a new account on the platform
