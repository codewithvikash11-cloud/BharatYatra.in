-- Add an append-only administrative audit trail. This migration is local only;
-- review it before applying it to the Supabase project.
CREATE TABLE public.admin_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id uuid NOT NULL,
  action text NOT NULL CHECK (action IN ('content_created', 'content_updated', 'status_changed', 'media_uploaded')),
  entity_type text NOT NULL CHECK (entity_type IN ('destinations', 'attractions', 'articles', 'media_assets')),
  entity_id uuid NOT NULL,
  previous_status text,
  next_status text,
  changed_fields jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(changed_fields) = 'array'),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX admin_audit_logs_created_idx
  ON public.admin_audit_logs (created_at DESC);

CREATE INDEX admin_audit_logs_entity_idx
  ON public.admin_audit_logs (entity_type, entity_id, created_at DESC);

ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Audit records are accessible only through API routes that verify an admin role.
-- Do not expose them through Supabase's browser-facing Data API roles.
REVOKE ALL ON TABLE public.admin_audit_logs FROM PUBLIC, anon, authenticated;
