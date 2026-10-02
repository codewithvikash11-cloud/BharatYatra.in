# Development setup

## Prerequisites

Install Node.js 22 LTS and Git for Windows. npm is included with Node.js. Android Studio and Java are not needed until the React Native CLI phase.

Check the tools in PowerShell:

```powershell
node --version
npm --version
git --version
```

## Install and run

From the repository root:

```powershell
npm install
npm run dev:web
npm run dev:admin
npm run dev:api
```

Run each `dev:*` command in its own terminal. App details and URLs are in the root README.

If the default website port `3000` is in use, first identify its owner. Do not stop an unrelated process; start the website on an available port, for example `npx next dev -p 3010` from `apps/web`, and set `NEXT_PUBLIC_SITE_URL` to that local origin when checking canonical metadata. The Admin app can use Next.js Webpack mode on Windows with `npx next dev --webpack -p 3001` from `apps/admin` if Turbopack fails. Check available memory before raising Node's heap limit; keep separate terminals and do not run overlapping Next dev/build processes for the same app.

The root `.env.example` provides `NEXT_PUBLIC_SITE_URL` as a local placeholder. Production must set it to the verified public website origin before sitemap/canonical metadata is published.

## Configuration hygiene

Create the root `.env` from `.env.example` only when `.env` does not already exist. Put local connection values there; never commit `.env`, database passwords, secret keys, signing secrets, or tokens. `NEXT_PUBLIC_` variables are exposed to browser code, so use them only for public values such as the Supabase URL and publishable key. Get Prisma connection URLs from Supabase **Connect → ORM → Prisma** and the publishable key from **Connect** or **Settings → API Keys → Publishable and secret API keys**.

## Workspace conventions

- JavaScript only; no TypeScript.
- Keep web, admin, and API runnable via their own workspace scripts.
- Keep secrets out of source control and logs.
- API and database changes belong in the later database/API phase.
- Android build tools belong in the later mobile phase.
