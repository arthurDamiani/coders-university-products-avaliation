# Sign-In (Authentication)

## Scope
Front-End, Back-End, Database

## Context
We need to implement the authentication flow on the platform.

## Functional requirements
1. We need to add validation on the form at the client layer
    1. If the form is valid we can send the request to the API
2. The user must correctly provide email and password
3. We need to validate the user's data and create an authenticated session for them
4. The request must be a `POST` to `/api/v1/sign-in` and receive data as JSON in the `body`
5. If everything is OK return `201` or errors according to validation:
    1. `400`: Malformed data
6. If the person is not logged in, the login button should appear in the header redirecting to the login page
7. If the person is authenticated we can show the first name, last name and email
    1. You can use Dicebear and use mockups for avatars

## Non-functional requirements
- Security: We need to transmit the password securely
    - We need to receive client data securely using HTTPS (to prevent network sniffing)
- UI/UX: Great user experience through a beautiful, elegant, modern interface
- Performance: The authentication process must be fast

## You must
- Create the login page and the base flow for authenticated vs unauthenticated session

## You must not
- Implement any functionality not related to sign-in (authentication)
- We will not send any emails at the moment, just process the request, save to the database and return success

## Technologies (Stack)
React.js, Next.js, React-Hook-Form, Shadcn, Tailwind, Supabase, TRPC, Bunjs

## Acceptance criteria
- We have a page to sign in at `/auth/sign-in`
- The page contains a form with validation
- The platform can communicate with the API to send data and receive a response
- We are reporting possible errors
    - Show a red alert in the form
- After logging in redirect to the product listing with an authenticated session:
    - Navigate to `/products`

## Outcome
People can authenticate on the platform with email and password
