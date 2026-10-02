# Local setup (current project)

## Requirements

- Node.js 22.12 or newer and npm 10.9 or newer
- Root `.env` configured with the variable names in `.env.example`
- Android Studio, Android SDK, an emulator/device, and a compatible JDK only when working on `apps/mobile`

## Windows PowerShell

Open three PowerShell terminals at the project root and run one service per terminal:

```powershell
npm run dev:api
```

```powershell
npm run dev:web
```

```powershell
npm run dev:admin
```

The expected local URLs are API `http://localhost:4000`, website `http://localhost:3000`, and Admin `http://localhost:3001`. Check port ownership before starting if a port is occupied. Do not stop an unrelated process. If port 3000 is occupied, use an available port such as 3010 from `apps/web` with `npx next dev -p 3010`, and set `NEXT_PUBLIC_SITE_URL` in the local environment to that origin when validating canonical metadata. Admin's workspace development script uses Next.js Webpack mode for the observed Windows Turbopack memory issue.

If `.env` is absent, create it without replacing an existing file:

```powershell
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
```

Set Supabase URL and publishable key variables locally, and obtain Prisma connection URLs from Supabase **Connect → ORM → Prisma**. Do not place secret keys or database connection strings in frontend source, chat, or documentation. Root `.env` is ignored by Git.

## What is implemented

- The API exposes read-only, paginated published content for destinations, attractions, and articles, plus database health.
- Public website routes consume those API endpoints and include loading/error/empty handling.
- Admin authentication uses server-only `ADMIN_EMAIL`, bcrypt `ADMIN_PASSWORD_HASH`, and `ADMIN_SESSION_SECRET` variables. Run `npm run admin:setup --workspace=@bharatyatra/admin` from an interactive terminal to set them without echoing or saving a plaintext password. Supabase PostgreSQL remains the app database; Supabase Auth is not used for admin login.
- Admin API mutations require the locally prepared additive audit migration to be reviewed and applied by the database owner. It has not been applied remotely.
- Media upload is unavailable until the owner provisions the intended private Storage bucket and policies. No bucket or policies were created.
- Android remains a React Native CLI foundation; app/API flows still require implementation and Android tooling.

## Validation commands

```powershell
npm run check
npm test --workspace @bharatyatra/api
npm test --workspace @bharatyatra/web
npm run prisma:validate --workspace @bharatyatra/api
npm run build
```

Database-backed health checks need a valid local `.env`. Do not run `db push`, `migrate reset`, or remote migrations as part of ordinary startup.
