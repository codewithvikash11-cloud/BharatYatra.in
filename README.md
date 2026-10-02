# BharatYatra

Premium India travel discovery and trip planning. This JavaScript monorepo contains an English/Hindi public website, a Supabase-authenticated admin studio, a shared Express API, and a React Native CLI Android foundation. Public browsing needs no login; saved trips are device-local. AI features are out of scope.

## Prerequisites

- Node.js 22.12+ and npm 10.9+ (React Native template requires Node 22.11+)
- Git
- Android Studio, Android SDK/platform tools, and a JDK supported by the selected React Native release for Android development
- A Supabase PostgreSQL project is required when database-backed API work begins. No credentials are included.

## Install and run

From the repository root:

```sh
npm install
npm run dev:api
npm run dev:web
npm run dev:admin
```

Open the public website at `http://localhost:3000`, admin studio at `http://localhost:3001`, and API health at `http://localhost:4000/health`. Run Android from a terminal with an emulator/device connected using `npm run dev:mobile`.

On Windows PowerShell, create `.env` only if it is not already present, so existing local settings are preserved:

```powershell
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
```

The root `.env` is ignored by Git. Set the Supabase project URL in `SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_URL`, the public key in `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and the Prisma URLs in `DATABASE_URL` and `DIRECT_URL`. Get the database URLs from Supabase **Connect → ORM → Prisma**. Get the publishable key from **Connect** or **Settings → API Keys → Publishable and secret API keys**. Never put secret keys or database passwords in source files, logs, screenshots, or chat. Workspaces are JavaScript only.

## Prisma and Supabase (database phase)

The API uses Prisma 6 with `DATABASE_URL` for runtime access and `DIRECT_URL` for Prisma CLI operations. Configure both locally in `.env` from Supabase connection settings; never put credentials in source files or chat. Once the remote schema has been safely introspected and the original migration history is available locally, use `npm run prisma:generate --workspace @bharatyatra/api`, `npm run db:pull --workspace @bharatyatra/api`, and `npm run db:status --workspace @bharatyatra/api`. `db:pull` updates only the local Prisma schema; it does not change the remote database.

The read-only API probe is `GET http://localhost:4000/api/v1/health/database`. It executes `SELECT 1` and returns no connection details.

The public content API provides paginated reads (`page` defaults to 1; `limit` defaults to 20 and is capped at 100) with an optional `q` text search up to 100 characters across the actual English and Hindi content fields: `GET /api/v1/destinations?q=...`, `GET /api/v1/destinations/:slug`, `GET /api/v1/attractions?destination=:destinationSlug&q=...`, `GET /api/v1/attractions/:destinationSlug/:slug`, `GET /api/v1/articles?q=...`, and `GET /api/v1/articles/:slug`. It selects published records only; attractions also require a published destination. Destination and attraction details show an OpenStreetMap pin link only when valid database coordinates are present.

## Admin studio

The admin app at `http://localhost:3001` uses a server-configured email and bcrypt password hash, with signed HttpOnly, SameSite=Lax sessions that expire after eight hours and use secure-only transport in production. Configure `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, and `ADMIN_SESSION_SECRET` using `npm run admin:setup --workspace=@bharatyatra/admin`; the password is entered without terminal echo and only its hash is stored. The API verifies the same signed session. Supabase Auth is not used for admin login; Supabase PostgreSQL remains the application database.

Roles, available API operations, status transitions, and media setup are documented in [docs/admin-cms-setup.md](docs/admin-cms-setup.md). Admin write requests need the owner to review and apply the additive `admin_audit_logs` migration. It creates one audit table and indexes, enables RLS, and revokes browser-role access. It has not been applied to Supabase. Until then, writes roll back and return a service-unavailable response; no content is inserted. No remote schema or policy was changed.

## Workspace map

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md), [docs/admin-cms-setup.md](docs/admin-cms-setup.md), and [docs/brand-guidelines.md](docs/brand-guidelines.md). The site does not include fabricated destination claims or travel content. No licensed photography existed in the workspace when the branding was added.

## Checks and deployment

Run workspace syntax checks with `npm run check`, tests with `npm test --workspace @bharatyatra/api`, `npm test --workspace @bharatyatra/web`, and `npm test --workspace @bharatyatra/admin`, and production builds with `npm run build`. Database-backed checks require configured Supabase values in the ignored root `.env`. No deployment provider is configured; before deployment, configure the server-side environment variables in the chosen host, use HTTPS, set Supabase Auth session lifetime and email-confirmation rules, and verify RLS, backups, and rollback procedures. Review the admin audit migration before applying it.
