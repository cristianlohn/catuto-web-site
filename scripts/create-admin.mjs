import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey || supabaseUrl.includes('xxxxxxxx')) {
  console.error('❌ Erro: Configure as chaves NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY válidas no arquivo .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

const email = process.argv[2] || 'admin@catuto.com.br'
const password = process.argv[3] || 'Catuto@2026!'

async function createAdmin() {
  console.log(`\n🔐 Criando usuário administrador: ${email}...`)

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (error) {
    if (error.message.includes('already been registered')) {
      console.log(`ℹ️  O usuário ${email} já existe no Supabase. Atualizando a senha...`)
      
      // Busca o ID do usuário para atualizar senha
      const { data: listData } = await supabase.auth.admin.listUsers()
      const user = listData?.users?.find(u => u.email === email)
      
      if (user) {
        const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
          password,
        })
        if (updateError) {
          console.error('❌ Erro ao atualizar senha:', updateError.message)
        } else {
          console.log(`✅ Senha do usuário ${email} atualizada com sucesso para: ${password}`)
        }
      }
    } else {
      console.error('❌ Erro ao criar usuário:', error.message)
    }
  } else {
    console.log(`✅ Administrador criado com sucesso!`)
    console.log(`📧 E-mail: ${email}`)
    console.log(`🔑 Senha: ${password}`)
  }

  console.log(`\n👉 Acesse http://localhost:3000/login para entrar no painel.\n`)
}

createAdmin()
