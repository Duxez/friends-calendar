This is a [Next.js](https://nextjs.org) project with application-owned authentication using [Auth.js (NextAuth)](https://authjs.dev) and Prisma.

## Getting Started

## Authentication Setup

1. Add the required environment variables in `.env` or `.env.local`:

```env
DATABASE_URL=...
AUTH_SECRET=...
AUTH_URL=http://localhost:3000
```

Generate `AUTH_SECRET`:

```bash
openssl rand -hex 32
```

2. Optional social auth providers (add either or both):

```env
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...
AUTH_GITHUB_ID=...
AUTH_GITHUB_SECRET=...
```

3. Apply Prisma migrations:

```bash
npx prisma migrate dev
```

## Run Locally

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000). Use the login and register pages:

- `/auth/login`
- `/auth/register`

## Authentication Endpoints (Auth.js)

- `/api/auth/signin`
- `/api/auth/signout`
- `/api/auth/session`
- `/api/auth/callback/:provider`

Custom registration endpoint:

- `/api/auth/register`
