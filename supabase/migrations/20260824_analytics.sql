-- ==============================================================================
-- CATUTO ANALYTICS: MIGRATION PARA RASTREAMENTO LEVE E PRIVACIDADE DE ACESSOS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.site_pageviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  monitor_id UUID REFERENCES public.client_monitors(id) ON DELETE CASCADE,
  domain TEXT NOT NULL,
  path TEXT NOT NULL DEFAULT '/',
  referrer TEXT DEFAULT 'direct',
  device_type TEXT DEFAULT 'desktop',
  browser TEXT DEFAULT 'other',
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Índices de alta performance para agregações rápidas
CREATE INDEX IF NOT EXISTS idx_pageviews_monitor_id ON public.site_pageviews(monitor_id);
CREATE INDEX IF NOT EXISTS idx_pageviews_created_at ON public.site_pageviews(created_at);
CREATE INDEX IF NOT EXISTS idx_pageviews_domain ON public.site_pageviews(domain);
CREATE INDEX IF NOT EXISTS idx_pageviews_session_id ON public.site_pageviews(session_id);

-- Políticas de Row Level Security (RLS)
ALTER TABLE public.site_pageviews ENABLE ROW LEVEL SECURITY;

-- Permite inserção anônima e rápida via API pública de tracking
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'site_pageviews' AND policyname = 'Allow public insert on pageviews'
  ) THEN
    CREATE POLICY "Allow public insert on pageviews" ON public.site_pageviews FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- Permite leitura para usuários autenticados (Dashboard do Admin)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'site_pageviews' AND policyname = 'Allow authenticated read on pageviews'
  ) THEN
    CREATE POLICY "Allow authenticated read on pageviews" ON public.site_pageviews FOR SELECT USING (true);
  END IF;
END $$;
