# Project Architecture

## Front-End
We will use the following main libraries:
- Typescript: Main development language with typing
- Next.js: Framework for creating and managing interfaces + APIs
- React.js: Library for creating and componentizing interfaces
- Biome: Code validation/formatting/linting
- TailwindCSS: Styling
- Date-FNS: Date/time manipulation
- Shadcn: Base componentization (design system)
- React Query: Creation and management of queries for reading data and mutations for modifying data

## Back-End
We will use the following main libraries:
- Typescript: Main development language with typing
- Next.js: Framework for creating and managing interfaces + APIs
- bcryptjs: Salt + password hash generation (instead of Node's native `crypto` module)
- Mastra.ai: Creation and customization of internal agents
- TRPC: Endpoint management

## Database
Supabase: PostgreSQL

## Infrastructure
Vercel: Host both server (API) and client (SPA)

## Automation
N8N: Creation of automated flows
