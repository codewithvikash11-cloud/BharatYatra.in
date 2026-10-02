# BharatYatra architecture and current implementation

## Workspace map

- `apps/web`: public Next.js App Router website. Visitors can browse without an account. Destination, attraction, and article content is requested from the Express API; no travel sample data is bundled into the pages.
- `apps/admin`: Next.js admin studio. A server-only bcrypt credential verifier issues signed HttpOnly sessions. Protected pages use the server-side proxy and call the API through a same-origin route.
- `apps/api`: Express API backed by Prisma and Supabase PostgreSQL. Public routes are read-only and return published content. Admin routes verify the shared signed session on the server.
- `apps/mobile`: React Native CLI Android workspace foundation. It is not yet wired to all public API or saved-trip flows.
- `prisma/schema.prisma`: local model for the existing seven content tables plus a locally prepared audit model.
- `supabase/migrations`: contains the original content migration and a local additive admin audit migration. The latter has not been applied remotely.

## Data flow

Public browser requests go to the Next.js website, which reads public content through the Express API. The API uses Prisma to query Supabase PostgreSQL and returns published records only. No visitor login is needed. Guest saved trips are intended to remain device-local; a complete saved-trip experience is not currently implemented.

Admin sign-in verifies the configured `ADMIN_EMAIL` and bcrypt `ADMIN_PASSWORD_HASH` on the server. `ADMIN_SESSION_SECRET` signs an eight-hour HttpOnly, SameSite=Lax session cookie; the cookie is Secure in production. The admin server proxies authorized requests to the API, which verifies the same signed session. Login attempts are rate-limited. Supabase Auth is not part of this flow; PostgreSQL remains the app database. The configured credential receives the admin role; the API's existing editor workflow checks remain available to trusted API integrations.

## Existing content data

The remote project was previously confirmed to have `destinations`, `attractions`, `articles`, `itineraries`, `itinerary_days`, `itinerary_stops`, and `media_assets`, with RLS enabled and published-content read policies. The current public API includes paginated, English/Hindi text-search list and slug detail reads for destinations, attractions, and articles. Attraction reads are associated with a published destination. Destination and attraction detail pages link to an OpenStreetMap pin only when valid coordinates exist. Itinerary planning, lodging, transport, food, and budget content are not yet represented as complete public product flows.

No qualifying published/private content rows were present in the last read-only verification, so detail-page behavior against populated live records remains unverified. Do not add fabricated travel facts or seed data.

## Admin CMS and external prerequisites

Admin pages cover overview, content, media, and audit. The API implements role checks, validation, soft archival, and content status transitions using the existing `DRAFT`, `REVIEW`, `PUBLISHED`, and `ARCHIVED` values. Admin writes include audit records in a transaction. They remain unavailable until the project owner reviews and applies the local additive `admin_audit_logs` migration.

Configure `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, and `ADMIN_SESSION_SECRET` as server-only secrets. `npm run admin:setup --workspace=@bharatyatra/admin` prompts for a password without echoing it, hashes it, and writes the hash plus a random session secret to the ignored root `.env`. The last storage inspection found no bucket; media upload remains unavailable until an owner provisions a private bucket. The API validates admin sessions and file signatures before using the server-only Supabase storage key.

No remote migration, RLS change, account creation, bucket creation, or deployment has been performed as part of local implementation. The React Native app remains a foundation and FCM is deferred. AI features are excluded.

## Local run and checks

See [DEVELOPMENT.md](DEVELOPMENT.md) for Windows PowerShell commands, port handling, and memory guidance. The root `.env` is local-only and ignored by Git; `.env.example` contains placeholders. Never place database URLs, passwords, or secret keys in browser-exposed variables or source files.
