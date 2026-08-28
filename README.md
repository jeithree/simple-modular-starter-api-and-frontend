# Simple Modular Starter: API + Frontend

A full-stack starter with a TypeScript Express API and a Next.js frontend. It includes session-based authentication, profile and session management, an admin user-management area, MySQL via Prisma, and Redis-backed sessions.

## Tech stack

- **API:** Express, TypeScript, Prisma, MySQL, Redis, Zod, Pino, and OpenAPI/Swagger
- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui, React Hook Form, Zod, and SWR

## Project layout

```text
.
├── api/        Express API, Prisma schema, migrations, and tests
├── frontend/   Next.js application
└── package.json  Root scripts for working with both applications
```

Each application also has its own README with more focused details: [API](api/README.md) and [frontend](frontend/README.md).

## Prerequisites

- Node.js 20 or newer
- A MySQL database
- A Redis instance (required for sessions)

## Getting started

1. Install the root dependencies:

   ```bash
   npm install
   ```

2. Install dependencies for each application:

   ```bash
   npm --prefix api install
   npm --prefix frontend install
   ```

3. Create local environment files from the examples:

   ```bash
   Copy-Item api/.env.example api/.env.local
   Copy-Item frontend/.env.example frontend/.env.local
   ```

   On macOS or Linux, use `cp` instead of `Copy-Item`.

4. Configure `api/.env.local` with your MySQL connection, Redis settings, session secret, site URL, and initial admin credentials. Keep `frontend/.env.local` pointed at the API:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

5. Apply the database migrations:

   ```bash
   npm --prefix api exec prisma migrate dev
   ```

6. Start both applications:

   ```bash
   npm run dev
   ```

   The frontend runs at `http://localhost:3000`; the API uses the `PORT` configured in `api/.env.local` (the example also uses `3000`). When running both locally, set one of those ports to a different value—for example, set the API to `5000` and update `NEXT_PUBLIC_API_URL` accordingly.

## Root commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start API and frontend together |
| `npm run dev:api` | Start only the API |
| `npm run dev:frontend` | Start only the frontend |
| `npm run type-check` | Type-check both applications |
| `npm run lint` | Lint the frontend |
| `npm run build` | Build the frontend |

## API documentation and tests

When the API runs in development or test mode, Swagger UI is available at `/docs` on the API URL (for example, `http://localhost:5000/docs`).

Run the API test suite with:

```bash
npm --prefix api test
```

This resets and migrates the test database configured by `api/.env.test`; make sure that file points to a database that is safe to reset.

## Included functionality

- Registration, login, logout, and session checking
- User profile updates and active-session management
- Admin user search, editing, activation, and deactivation
- Request validation, rate limiting, CORS/security middleware, and structured logging
