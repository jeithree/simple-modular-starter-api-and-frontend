# Simple API Starter Template

A minimalist Express + Prisma API starter with essential features only.

## Features

- ✅ Express.js with TypeScript
- ✅ Prisma ORM
- ✅ Redis session store
- ✅ Basic authentication (register, login, logout)
- ✅ Session management with express-session
- ✅ Password hashing with bcrypt
- ✅ Input validation with Zod
- ✅ Basic security (Helmet, CORS)
- ✅ Rate limiting on auth endpoints
- ✅ Error handling middleware
- ✅ Structured logging with Pino
- ✅ OpenAPI/Swagger documentation (dev & test only)
- ✅ Admin module (user search, update, deactivate/reactivate)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env.local` and configure:

```bash
cp .env.example .env.local
```

Configure the following environment variables:

- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string (default: redis://localhost:6379)
- `SESSION_SECRET` - Secret for session encryption
- `API_URL` - Frontend URL for CORS

3. Start Redis (required for sessions):

```bash
# Using Docker
docker run -d -p 6379:6379 redis:alpine

# Or install locally
```

4. Run Prisma migrations:

```bash
npx prisma migrate dev
```

5. Start the development server:

```bash
npm run dev
```

6. Api documentation (Swagger UI) only in test and development mode, is available at:

```bash
http://localhost:5000/docs/
```

## API Endpoints

### Auth

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/logout` - Logout
- `GET /api/v1/auth/session` - Get current session

### Users

- `GET /api/v1/users/me` - Get current user profile
- `PATCH /api/v1/users/` - Update current user profile
- `GET /api/v1/users/sessions` - List all active sessions
- `DELETE /api/v1/users/sessions` - Terminate all other sessions

### Admin

- `GET /api/v1/admin/users` - Search users
- `PATCH /api/v1/admin/users/:id` - Update a user
- `PATCH /api/v1/admin/users/:id/deactivate` - Deactivate a user
- `PATCH /api/v1/admin/users/:id/reactivate` - Reactivate a user

## Project Structure

```
src/
├── app/
│   ├── app.ts          # Express app setup
│   ├── init.ts         # App initialization
│   ├── routes.ts       # Top-level route registration
│   └── server.ts       # Server entry point
├── configs/            # Environment config (basics, cookies)
├── constants/          # Shared constants
├── helpers/            # Logger, password utilities
├── lib/                # AppError, apiResponse, memoryCache
├── middlewares/        # Auth, errorHandler, rateLimit, validation
├── modules/
│   ├── auth/           # Register, login, logout, session
│   ├── user/           # Profile, sessions
│   └── admin/          # User management
├── openapi/            # OpenAPI schema registry and document builder
├── types/              # TypeScript types
├── prisma.ts           # Prisma client
└── redisClient.ts      # Redis client
```
