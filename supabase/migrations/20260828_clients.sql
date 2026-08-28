-- ==============================================================================
-- CATUTO CLIENTS & PORTFOLIO SHOWCASE: MIGRATION
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  website_url TEXT NOT NULL,
  category TEXT DEFAULT 'Website Institucional',
  description TEXT,
  tags TEXT[] DEFAULT '{}'::text[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Índices de consulta rápida
CREATE INDEX IF NOT EXISTS idx_clients_is_active ON public.clients(is_active);
CREATE INDEX IF NOT EXISTS idx_clients_display_order ON public.clients(display_order);
CREATE INDEX IF NOT EXISTS idx_clients_created_at ON public.clients(created_at);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- 1. Permite leitura pública de clientes ativos para exibição no site
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'clients' AND policyname = 'Allow public select on active clients'
  ) THEN
    CREATE POLICY "Allow public select on active clients" ON public.clients 
      FOR SELECT USING (is_active = true);
  END IF;
END $$;

-- 2. Permite acesso total para administradores autenticados
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'clients' AND policyname = 'Allow full access for authenticated users on clients'
  ) THEN
    CREATE POLICY "Allow full access for authenticated users on clients" ON public.clients 
      FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;
