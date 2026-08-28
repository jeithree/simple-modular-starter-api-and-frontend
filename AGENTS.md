# Project guidance

## Stack and layout

- `frontend/` is a Next.js App Router application using TypeScript, Tailwind CSS v4, shadcn/ui, React Hook Form, Zod, and SWR.
- `api/` is an Express and TypeScript API using Prisma, MySQL, Redis, Zod, and OpenAPI.
- Keep frontend API calls in `frontend/src/services/`, shared API/domain types in `frontend/src/types/`, and reusable UI in `frontend/src/components/`.
- Keep API features modular under `api/src/modules/<feature>/`; preserve the existing route, controller, service, types, and OpenAPI separation.

## Frontend UI

- Reuse the existing shadcn/ui primitives and semantic Tailwind tokens from `frontend/src/app/globals.css` before adding new components or arbitrary colors.
- When a suitable official shadcn/ui component exists but is not installed, prefer adding it through the shadcn CLI and adapting it to the project over implementing the same UI primitive from scratch. Create a custom component only when the available shadcn component does not fit the required behavior or design.
- Match the established visual language: neutral surfaces, restrained borders and `shadow-sm`, moderate rounded corners, clear type hierarchy, muted supporting text, and responsive layouts.
- Use `max-w-7xl` content containers for dashboard pages and preserve the responsive fixed dashboard navigation.
- Add polish through consistent spacing, loading/empty/error states, accessible focus states, and purposeful icons. Avoid decorative gradients, glassmorphism, excessive color, or animation unless requested.
- Keep forms accessible: visible labels, inline validation errors, disabled/submitting feedback, and clear success or failure notifications.

## Data, auth, and safety

- Preserve the current session/auth flow and role-based admin protections unless the task explicitly changes authorization.
- Validate user input with the existing Zod patterns. Do not expose secrets or add `.env.local` files to version control.
- Do not change Prisma migrations, database-reset scripts, or API contracts without an explicit request.

## Verification

- For frontend changes, run `npm run lint` and, when practical, `npm run build`.
- For cross-project TypeScript changes, run `npm run type-check`.
- API tests use a resettable test database; run `npm --prefix api test` only when its configured test database is safe to reset.
