import { Metadata } from 'next'
import { getSiteSettings } from '@/lib/site-settings'
import { getClientsAction } from '@/app/actions/clients'
import { Hero } from '@/components/public/Hero'
import { Metrics } from '@/components/public/Metrics'
import { ClientsShowcase } from '@/components/public/ClientsShowcase'
import { BentoServices } from '@/components/public/BentoServices'
import { AboutSection } from '@/components/public/AboutSection'
import { ComparisonSection } from '@/components/public/ComparisonSection'
import { FAQSection } from '@/components/public/FAQSection'
import { ContactFormSection } from '@/components/public/ContactFormSection'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()

  const title = settings.meta_title || `${settings.company_name} Soluções Digitais | Websites Profissionais`
  const description =
    settings.meta_description ||
    settings.hero_subtitle ||
    'Criação de websites profissionais, landing pages de alta conversão e otimização de performance para pequenos empreendedores em Joinville e região.'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'pt_BR',
      url: 'https://catuto.com.br',
      siteName: settings.company_name,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function HomePage() {
  const [settings, clientsRes] = await Promise.all([
    getSiteSettings(),
    getClientsAction(true),
  ])

  const activeClients = clientsRes.data || []

  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Principal com Benefícios Claros */}
      <Hero settings={settings} />

      {/* 2. Métricas de Impacto no Negócio */}
      <Metrics />

      {/* 3. Prova Social: Empresas que Confiam na Nossa Estrutura */}
      <ClientsShowcase clients={activeClients} />

      {/* 4. O que Fazemos (Bento Grid de Serviços) */}
      <BentoServices />

      {/* 5. Quem Somos & Nossa Essência (Sobre Nós / Missão / Visão / Valores) */}
      <AboutSection />

      {/* 6. Comparativo: Site Comum vs Estrutura Catuto */}
      <ComparisonSection />

      {/* 7. Perguntas Frequentes (Tire Suas Dúvidas) */}
      <FAQSection />

      {/* 8. Formulário de Orçamento Rápido & Contato */}
      <ContactFormSection settings={settings} />
    </div>
  )
}
