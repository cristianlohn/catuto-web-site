import { Metadata } from 'next'
import { getSiteSettings } from '@/lib/site-settings'
import { formatWhatsAppUrl } from '@/lib/masks'
import { FlowHero } from '@/components/public/flow/FlowHero'
import { FlowShowcase } from '@/components/public/flow/FlowShowcase'
import { FlowBentoDiferenciais } from '@/components/public/flow/FlowBentoDiferenciais'
import { FlowPricing } from '@/components/public/flow/FlowPricing'
import { FlowCta } from '@/components/public/flow/FlowCta'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()

  const title = `Catuto Flow | Gestão Ágil, Sprints e Engenharia de Software sob Medida`
  const description =
    'Conheça o Catuto Flow: plataforma e esteira de engenharia da Catuto com transparência radical, sprints previsíveis e acompanhamento do seu software em tempo real.'

  return {
    title,
    description,
    keywords: [
      'desenvolvimento de software ágil',
      'gestão de projetos kanban',
      'catuto flow',
      'sistemas web sob medida',
      'software joinville',
      'sprints ágeis',
      'engenharia de software',
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'pt_BR',
      url: 'https://catuto.com.br/flow',
      siteName: settings.company_name || 'Catuto Digital Solutions',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function FlowPage() {
  const settings = await getSiteSettings()
  const whatsappLink = formatWhatsAppUrl(
    settings.whatsapp,
    settings.whatsapp_message || 'Olá! Gostaria de conversar sobre desenvolvimento de software com o Catuto Flow.'
  )

  return (
    <div className="flex flex-col w-full bg-[#050811]">
      {/* 1. Hero com Proposta de Valor e Acesso Direto */}
      <FlowHero whatsappUrl={whatsappLink} />

      {/* 2. Mockup de Alta Fidelidade do Kanban com Trava de Retrabalho */}
      <FlowShowcase />

      {/* 3. Bento Grid dos 3 Diferenciais de Engenharia */}
      <FlowBentoDiferenciais />

      {/* 4. Planos & Preços */}
      <FlowPricing />

      {/* 5. Banner de Adoção da Ferramenta Catuto Flow */}
      <FlowCta whatsappUrl={whatsappLink} />
    </div>
  )
}
