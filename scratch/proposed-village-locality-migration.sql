-- ==============================================================================
-- PROPOSED ADDITIVE MIGRATION: Village / Locality Hierarchy & Article Relations
-- BHARATYATRA TRAVEL PLATFORM (POSTGRESQL / SUPABASE)
-- 
-- STATUS: PROPOSED ONLY — DO NOT APPLY TO PRODUCTION WITHOUT EXPLICIT APPROVAL
-- This migration adheres to the strict additive pattern:
-- 1. Creates 'villages_localities' under tehsils.
-- 2. Adds optional hierarchy FKs to 'articles' (district_id, tehsil_id, village_id).
-- 3. Sets up RLS, indexes, and status check constraints.
-- ==============================================================================

-- 1. Create villages_localities table
CREATE TABLE IF NOT EXISTS public.villages_localities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tehsil_id UUID NOT NULL REFERENCES public.tehsils(id) ON DELETE CASCADE,
    slug TEXT NOT NULL,
    name_en TEXT NOT NULL,
    name_hi TEXT,
    locality_type TEXT DEFAULT 'LOCALITY' CHECK (locality_type IN ('VILLAGE', 'TOWN', 'LOCALITY', 'WARD', 'REVENUE_VILLAGE')),
    postal_code TEXT,
    latitude DOUBLE PRECISION CHECK (latitude >= -90 AND latitude <= 90),
    longitude DOUBLE PRECISION CHECK (longitude >= -180 AND longitude <= 180),
    description_en TEXT,
    description_hi TEXT,
    status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT villages_localities_tehsil_slug_key UNIQUE (tehsil_id, slug)
);

-- 2. Add performance indexes
CREATE INDEX IF NOT EXISTS idx_villages_localities_tehsil ON public.villages_localities(tehsil_id);
CREATE INDEX IF NOT EXISTS idx_villages_localities_status ON public.villages_localities(status);
CREATE INDEX IF NOT EXISTS idx_villages_localities_slug ON public.villages_localities(slug);

-- 3. Additive columns for articles to support direct tehsil and village hierarchy
ALTER TABLE public.articles 
    ADD COLUMN IF NOT EXISTS district_id UUID REFERENCES public.districts(id) ON UPDATE NO ACTION,
    ADD COLUMN IF NOT EXISTS tehsil_id UUID REFERENCES public.tehsils(id) ON UPDATE NO ACTION,
    ADD COLUMN IF NOT EXISTS village_id UUID REFERENCES public.villages_localities(id) ON UPDATE NO ACTION;

CREATE INDEX IF NOT EXISTS idx_articles_district ON public.articles(district_id);
CREATE INDEX IF NOT EXISTS idx_articles_tehsil ON public.articles(tehsil_id);
CREATE INDEX IF NOT EXISTS idx_articles_village ON public.articles(village_id);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.villages_localities ENABLE ROW LEVEL SECURITY;

-- Public read access for published localities
CREATE POLICY "Public read published villages_localities" 
    ON public.villages_localities 
    FOR SELECT 
    USING (status = 'PUBLISHED');

-- Authenticated staff/admin full access
CREATE POLICY "Admin staff full management of villages_localities" 
    ON public.villages_localities 
    FOR ALL 
    TO authenticated 
    USING (true) 
    WITH CHECK (true);

-- 5. Audit log registration reminder:
-- Any insert, update, or status change on villages_localities should be recorded
-- in public.admin_audit_logs by the API server.
