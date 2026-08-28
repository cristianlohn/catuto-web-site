import { Metadata } from 'next'
import { getClientsAction } from '@/app/actions/clients'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { ClientsManager } from '@/components/admin/ClientsManager'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Gestão de Clientes & Portfólio | Catuto Admin',
  description: 'Gerencie os clientes e cases de sucesso exibidos na página principal.',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function ClientesAdminPage() {
  const { data: clients } = await getClientsAction(false)

  return (
    <div className="flex flex-col min-h-full">
      <AdminHeader
        title="Gestão de Clientes & Portfólio"
        subtitle="Adicione e gerencie os logos, links e descrições dos seus clientes reais"
      />
      <div className="flex-1">
        <ClientsManager initialClients={clients || []} />
      </div>
    </div>
  )
}
