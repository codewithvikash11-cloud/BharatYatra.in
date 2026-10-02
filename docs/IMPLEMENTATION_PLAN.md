# BharatYatra Implementation Plan

## Phase 1: Audit & Discovery
- **Frameworks:** Next.js (Web: Port 3000, Admin: Port 3001), Express API (Port 4000), React Native mobile (Android).
- **Database/ORM:** Supabase PostgreSQL, Prisma ORM.
- **Current Data Models:** `articles`, `attractions`, `destinations`, `itineraries`, `itinerary_days`, `itinerary_stops`, `media_assets`, `admin_audit_logs`.
- **Observations:** Geography (States, UTs, Districts, Tehsils) is currently flattened into `destinations` as string fields (`state_name`, `district_name`). The public site lacks proper geographic routing (`/states`, `/districts`, etc.). The API has paginated endpoints for destinations, attractions, and articles. Admin app uses a custom bcrypt-based auth, no Supabase Auth.
- **Goal:** Upgrade into a polished, human-centered India-wide travel platform following the prompt's 12 points.

## Phase 2: Foundation & Branding (In Progress)
- [x] Create simple, scalable vector SVG logos (Compact & Horizontal) matching brand guidelines.
- [x] Integrate SVG logos into web header and footer.
- [ ] Implement responsive layout adjustments and ensure CSS uses brand tokens effectively.

## Phase 3: Public Website
- [ ] Upgrade homepage with updated hero, language controls, and geographic exploration structure.
- [ ] Implement Geography routes: Explore India, States, UTs, Districts, and Tehsils.
- [ ] Improve Destination detail pages with rich data, formatting, and layout.
- [ ] Polish Attraction, Article, and Itinerary pages.

## Phase 4: Admin CMS Upgrade
- [ ] Audit existing admin routes and forms.
- [ ] Add CRUD interfaces for the extended/new Geography models (States, Districts, etc.).
- [ ] Improve Admin UI layout and UX.

## Phase 5: Database, API & SEO
- [ ] Extend database schema via Prisma for States, Districts, Tehsils with referential integrity.
- [ ] Develop data seed workflow for India Geography.
- [ ] Ensure metadata, SEO tags, structured data, and readable slugs on frontend.
- [ ] Add server validation.

## Phase 6: Verification
- [ ] Lint, typecheck, run tests.
- [ ] Build apps to ensure no regressions.
