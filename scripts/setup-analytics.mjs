import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function setupAnalytics() {
  console.log('Verificando se a tabela site_pageviews já existe...')
  const { data, error } = await supabase.from('site_pageviews').select('*').limit(1)

  if (error) {
    console.log('Tabela site_pageviews não encontrada:', error.message)
    console.log('\nCriando tabela via SQL...')
    
    // Testa se existe extensão pg ou query
    const sql = `
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

      CREATE INDEX IF NOT EXISTS idx_pageviews_monitor_id ON public.site_pageviews(monitor_id);
      CREATE INDEX IF NOT EXISTS idx_pageviews_created_at ON public.site_pageviews(created_at);
      CREATE INDEX IF NOT EXISTS idx_pageviews_domain ON public.site_pageviews(domain);
    `
    console.log('Execute este script SQL no Supabase SQL Editor caso necessário:\n')
    console.log(sql)
  } else {
    console.log('✅ Tabela site_pageviews já existe e está pronta!')
  }
}

setupAnalytics()
