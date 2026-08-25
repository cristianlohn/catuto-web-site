import { getSiteSettings } from '@/lib/site-settings'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { SettingsForm } from '@/components/admin/SettingsForm'

export const dynamic = 'force-dynamic'

export default async function ConfiguracoesPage() {
  const settings = await getSiteSettings()

  return (
    <div className="flex flex-col min-h-full">
      <AdminHeader
        title="Configurações do CMS"
        subtitle="Gerencie textos, mídias, contatos e cards da Landing Page"
      />
      <div className="flex-1">
        <SettingsForm initialSettings={settings} />
      </div>
    </div>
  )
}
