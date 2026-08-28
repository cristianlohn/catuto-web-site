import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const initialClients = [
  {
    name: 'TF Store Importados',
    website_url: 'https://tfstoreimportados.com.br',
    category: 'E-commerce & Catálogo B2B',
    description: 'Catálogo digital moderno com alta velocidade de carregamento, checkout simplificado e integração direta ao WhatsApp.',
    tags: ['E-commerce', 'Mobile First', 'WhatsApp Direto', 'Alta Performance'],
    logo_url: '',
    is_active: true,
    display_order: 1,
  },
  {
    name: "D'all Engenharia",
    website_url: 'https://dallengenharia.com.br',
    category: 'Engenharia & Construção Civil',
    description: 'Website institucional com design corporativo de alto padrão, apresentação de portfólio de obras e captação de orçamentos.',
    tags: ['Website Institucional', 'SEO Local', 'Galeria de Obras', 'Credibilidade'],
    logo_url: '',
    is_active: true,
    display_order: 2,
  },
]

async function setupClients() {
  console.log('Verificando status da tabela "clients" no Supabase...')
  const { data, error } = await supabase.from('clients').select('*').limit(1)

  if (error) {
    console.log('Tabela "clients" ainda não encontrada no schema cache:', error.message)
    console.log('\n-----------------------------------------------------------')
    console.log('Cole o conteúdo de "supabase/migrations/20260828_clients.sql" no SQL Editor do Supabase:')
    console.log('https://supabase.com/dashboard/project/rxomtmfxehxzphgemoim/sql/new')
    console.log('-----------------------------------------------------------\n')
  } else {
    console.log('✅ Tabela "clients" já existe e está acessível!')
    
    // Verifica se precisa de semeadura inicial
    const { count } = await supabase.from('clients').select('*', { count: 'exact', head: true })
    if (count === 0) {
      console.log('Semeando clientes iniciais (TF Store e D\'all Engenharia)...')
      const { error: insertError } = await supabase.from('clients').insert(initialClients)
      if (insertError) {
        console.error('Erro ao semear clientes:', insertError.message)
      } else {
        console.log('✅ Clientes iniciais semeados com sucesso!')
      }
    } else {
      console.log(`Tabela já contém ${count} cliente(s) cadastrado(s).`)
    }
  }
}

setupClients()
