import { Metadata } from 'next'
import { getClientMonitorsAction } from '@/app/actions/monitors'
import { MonitorsDashboard } from '@/components/admin/MonitorsDashboard'

export const metadata: Metadata = {
  title: 'Monitoramento de Uptime dos Clientes | Catuto Admin',
  description: 'Acompanhe a disponibilidade, status HTTP e alertas de indisponibilidade dos websites clientes.',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function ClientesStatusPage() {
  const { data: monitors } = await getClientMonitorsAction()

  return <MonitorsDashboard initialMonitors={monitors || []} />
}
